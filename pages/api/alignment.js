// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs';
const fsp = fs.promises;

export default async function handler(req, res) {
  const filename = process.env.ALIGNMENTS;

  console.log('Received request', req.body);

  if (filename) {
    console.log('Writing to', filename);
    await fsp.appendFile(filename, JSON.stringify(req.body) + '\n'); 
  }

  res.status(200).send('');
}
