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

function Map({ name, pinLocation, onClick }) {
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

  const [ marker, setMarkers ] = useState([]);

  const width = 0.02;

  const src = '/maps/' + name + '.png';

  return (
    <div className={styles.mapdiv}>
      <img src={src} className={styles.map} onClick={handle_click}/>
      <div style={{
          position: 'absolute',
          color: '#e63036d0',
          bottom: `calc(100% * (1 - ${pinLocation.y}))`,
          left: `calc(100% * (${pinLocation.x} - ${width}/2))`,
          width: `calc(100% * ${width})` }}
      >
        <FontAwesomeIcon icon={faLocationPin}/>
      </div>
    </div>
  );
}

function DeathForm({}) {
  const [ desc, setDesc ] = useState('');
  const [ curTime, setCurTime ] = useState(Date.now());
  const [ pickedTime, setPickedTime ] = useState(null);
  const [ pin, setPin ] = useState({ x: 0, y: 0 });

  const maps = [ 'guide', 'limgrave', 'bestial_sanctum', 'caelid', 'caelid-2', 'weeping-peninsula', 'full-1', 'liurnia-1', 'ainsel-river-blind', 'ainsel-river', 'liurnia-2', 'liurnia-3', 'liurnia-4', 'liurnia-5', 'carian', 'siofra', 'dragonbarrow', 'altus-plateau', 'deeproot-depths', 'mt-gelmir', 'leyndell' ];
  const [ map, setMap ] = useState(maps[0]);

  var timeRef = useRef();

  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "hh:mm:ss A";
  const formatTime = (t) => moment(t).format(dateFormat + " " + timeFormat);

  function updateTime(t) {
    console.log('Updating time', t);
    setPickedTime(t);
  }

  timeRef.current = pickedTime;

  function handle_submit(e) {
    e.preventDefault();

    const curTime = formatTime(curTime);
    const pickedTime = timeRef.current ? formatTime(timeRef.current) : null;
    const time = pickedTime || curTime;
    const values = {
      desc, curTime, pickedTime, pin, time, map
    };

    console.log('Submitting form', values);

    axios.post('/api/death', values).then((response) => {
      console.log('Successfully submitted form', response);
    }).catch((error) => {
      console.error('Failed to submit form', error);
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className={styles.deathform}>
        <Form onSubmit={handle_submit}>
          <Form.Group className="mb-3" controlId="desc">
            <Form.Control type="text" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="time">
            <Datetime
              value={pickedTime ? moment(pickedTime).toDate() : null}
              inputProps={{ placeholder: formatTime(curTime) }}
              timeFormat={timeFormat}
              dateFormat={dateFormat}
              onChange={updateTime} />
          </Form.Group>
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
              maps.map((option) => (
                <Form.Check key={option} type='radio' name='map-selector' value={option} label={option} onClick={() => setMap(option)}/>
              ))
            }
          </div>
          <div className="row">
            <div className="col-sm">
              <Button variant="primary" type="submit">Death</Button>
            </div>
          </div>
        </Form>
      </div>
      <Map pinLocation={pin} onClick={setPin} name={map} />
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Death Tracker</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DeathForm/>
    </div>
  )
}
