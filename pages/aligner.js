import { useEffect, useRef, useState } from 'react'
import moment from 'moment';

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import Datetime from 'react-datetime'

import ImageMarker from 'react-image-marker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationPin } from '@fortawesome/free-solid-svg-icons'

import axios from 'axios';

function MapPin({}) {
  return (
    <FontAwesomeIcon icon={faLocationPin}/>
  );
}

function NestedMaps({ overworld, name, topLeft, size, opacity, onClick }) {
  function handle_click(e) {
    e.preventDefault();
    const bounds = e.target.getBoundingClientRect();
    const offsetX = e.clientX - bounds.x;
    const offsetY = e.clientY - bounds.y;
    const x = offsetX / bounds.width;
    const y = offsetY / bounds.height;
    const val = { x, y };
    console.log('Map click', offsetX, offsetY, val, e);

    if (onClick) {
      onClick(val);
    }
  }

  function handle_drag(e) {
    e.preventDefault();
    if (e.clientX == 0 && e.clientY == 0) {
      return;
    }
    const bounds = e.target.getBoundingClientRect();
    const offsetX = e.clientX - bounds.x;
    const offsetY = e.clientY - bounds.y;
    const x = offsetX / bounds.width;
    const y = offsetY / bounds.height;
    const val = { x, y };
    console.log('Map drag', offsetX, offsetY, val);

    if (onClick) {
      onClick(val);
    }
  }

  const [ marker, setMarkers ] = useState([]);

  const width = 0.02;

  const src = n => '/maps/' + n + '.png';

  return (
    <div className={styles.mapdiv}>
      <img src={src(overworld)} className={styles.map} onClick={handle_click} onDrag={handle_drag}/>
      <img src={src(name)} style={{
        position: 'absolute',
        'pointer-events': 'none',
        opacity: `calc(100% * (${opacity}))`,
        top: `calc(100% * (${topLeft.y}))`,
        left: `calc(100% * (${topLeft.x}))`,
        width: `calc(100% * (${size}))`,
      }}/>
    </div>

  );
}

function Aligner({}) {
  const [ curTime, setCurTime ] = useState(Date.now());
  const [ pin, setPin ] = useState({ x: 0, y: 0 });
  const [ size, setSize ] = useState(50);
  const [ opacity, setOpacity ] = useState(50);

  const overworlds = [ 'overworld', 'underworld' ];

  const [ overworld, setOverworld ] = useState(overworlds[0]);

  const maps = [ 'guide', 'limgrave', 'bestial_sanctum', 'caelid', 'caelid-2', 'weeping-peninsula', 'full-1', 'liurnia-1', 'ainsel-river-blind', 'ainsel-river', 'liurnia-2', 'liurnia-3', 'liurnia-4', 'liurnia-5', 'carian', 'siofra', 'dragonbarrow', 'altus-plateau', 'deeproot-depths', 'mt-gelmir', 'leyndell', 'giants-mountain-1', 'giants-mountain-2', 'flame-peak', 'consecrated-snowfield', 'haligtree', 'lake-of-rot', 'astel', 'farum-azula', 'siofra-full' ];
  const [ map, setMap ] = useState(maps[0]);

  function handle_submit(e) {
    e.preventDefault();

    const values = {
      topLeft: pin, size: size/100, overworld, map 
    };

    console.log('Submitting alignment form', values);
    axios.post('/api/alignment', values).then((response) => {
      console.log('Successfully submitted form', response);
    }).catch((error) => {
      console.error('Failed to submit form', error);
    });
  }

  const updateSize = (e) => {
    setSize(e.target.value);
  }

  return (
    <div>
      <div className={styles.deathform}>
        <Form onSubmit={handle_submit}>
          <div className="row">
            <div className="col">
              <Form.Group className="mb-3 row" controlId="x">
                <Form.Label className="col-1" style={{ margin: 'auto' }}>x</Form.Label>
                <Form.Control className="col" type="text" readOnly disabled value={pin.x}/>
              </Form.Group> 
            </div>
            <div className="col">
              <Form.Group className="mb-3 row" controlId="y">
                <Form.Label className="col-1" style={{ margin: 'auto' }}>y</Form.Label>
                <Form.Control className="col" type="text" readOnly disabled value={pin.y}/>
              </Form.Group> 
            </div>
          </div>
          <div className="form-check mb-3 row">
            {
              overworlds.map((option) => (
                <Form.Check key={option} type='radio' name='overworld-selector' value={option} label={option} onClick={() => setOverworld(option)}/>
              ))
            }
          </div>
          <div className="form-check mb-3 row">
            {
              maps.map((option) => (
                <Form.Check key={option} type='radio' name='map-selector' value={option} label={option} onClick={() => setMap(option)}/>
              ))
            }
          </div>
          <div className="row">
            <div className="col">
              <Form.Group className="mb-3 row" controlId="x">
                <Form.Label className="col-1" style={{ margin: 'auto' }}>Width</Form.Label>
                <Form.Control className="col" type="text" readOnly disabled value={size}/>
              </Form.Group> 
              <Form.Range id='size' value={size} onChange={updateSize} step={0.1}/>
            </div>
          </div>
          <div className="row">
              <Form.Range id='opacity' value={opacity} onChange={(e) => setOpacity(e.target.value)}  />
          </div>
          <div className="row">
            <div className="col-sm">
              <Button variant="primary" type="submit">Mark Alignment</Button>
            </div>
          </div>
        </Form>
      </div>
      <NestedMaps overworld={overworld} name={map} topLeft={pin} size={size/100} opacity={opacity/100} onClick={setPin}/>
          <div className="row">
            <div className="col">
              <Form.Group className="mb-3 row" controlId="x">
                <Form.Label className="col-1" style={{ margin: 'auto' }}>Width</Form.Label>
                <Form.Control className="col" type="text" readOnly disabled value={size}/>
              </Form.Group> 
              <Form.Range id='size' value={size} onChange={updateSize} step={0.1}/>
            </div>
          </div>
          <div className="row">
              <Form.Range id='opacity' value={opacity} onChange={(e) => setOpacity(e.target.value)}  />
          </div>
      <div style={{
        height: '800px',
      }}>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Map aligner</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Aligner/>
    </div>
  )
}
