#!/usr/bin/env node

import * as https from 'https';

const response = new Promise((resolve, reject) => {
  let body = '';
  https.request('https://getbible.net/v2/translations.json', (res) => {
    res.on('data', (data) => { body += data; })
       .on('end', () => { resolve(body); });
  }).on('error', reject).end();
});

const translations = JSON.parse(await response);

const result = Object
  .entries(translations)
  .map(([key, value]) => `'${value.lang}.${value.abbreviation}': '${key}',`).sort();

console.log(result.join('\n'));
