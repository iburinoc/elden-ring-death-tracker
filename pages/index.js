import { useEffect, useState } from 'react'
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

function MapPin({}) {
  return (
    <FontAwesomeIcon icon={faLocationPin}/>
  );
}

function Map({ pinLocation, onClick }) {
  function handle_click(e) {
    e.preventDefault();
    const offsetX = e.clientX - e.target.x;
    const offsetY = e.clientY - e.target.y;
    const x = offsetX / e.target.width;
    const y = offsetY / e.target.height;
    const val = { x, y };
    console.log('Map click', offsetX, offsetY, val, e);

    if (onClick) {
      onClick(val);
    }
  }

  const [ marker, setMarkers ] = useState([]);

  const width = 0.02;

  return (
    <div className={styles.mapdiv}>
      <img src='/map.png' className={styles.map} onClick={handle_click}/>
      <div style={{
          position: 'absolute',
          color: '#e63036d0',
          bottom: `calc(100% * (1 - ${pinLocation.y}))`,
          left: `calc(100% * (${pinLocation.x} - ${width}))`,
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

  function handle_submit(e) {
    e.preventDefault();

    const values = {
      desc
    };

    console.log('Submitting form', values);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "hh:mm:ss A";
  const timePlaceholder = moment(curTime).format(dateFormat + " " + timeFormat);

  return (
    <div>
      <div className={styles.deathform}>
        <Form onSubmit={handle_submit}>
          <Form.Group className="mb-3" controlId="desc">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter description" value={desc} onChange={(e) => setDesc(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="time">
            <Form.Label>Time</Form.Label>
            <Datetime
              value={pickedTime}
              inputProps={{ placeholder: timePlaceholder }}
              timeFormat={timeFormat}
              dateFormat={dateFormat}
              onChange={setPickedTime} />
          </Form.Group>
          <Button variant="primary" type="submit">Death</Button>
        </Form>
      </div>
      <Map pinLocation={pin} onClick={setPin} />
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
