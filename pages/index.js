import { useEffect, useState } from 'react';

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function Map({}) {
  function handle_click(e) {
    e.preventDefault();
    console.log('Click occurred ', e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
  }
  return <img className={styles.map} src='/map.png' onClick={handle_click}/>;
}

function DeathForm({ description }) {
  const [ desc, setDesc ] = useState('');
  const [ time, setTime ] = useState(Date.now());

  function handle_submit(e) {
    e.preventDefault();

    const values = {
      desc
    };

    console.log('Submitting form', values);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.deathform}>
      <Form onSubmit={handle_submit}>
        <Form.Group className="mb-3" controlId="time">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Enter description" value={desc} onChange={(e) => setDesc(e.target.value)}/>
        </Form.Group>
        <Button variant="primary" type="submit">Death</Button>
      </Form>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.container}>
      <DeathForm/>
      <Map/>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
