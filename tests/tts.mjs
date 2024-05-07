import axios from 'axios';
import { writeFile } from 'fs/promises';

const API_KEY = '';

const input = `es realmente una lástima que tenga un acento americano`;

const config = {
  method: 'post',
  url: 'https://api.openai.com/v1/audio/speech',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  data: {
    model: 'tts-1',
    input,
    voice: 'alloy',
  },
  responseType: 'arraybuffer', // binary data
};

axios(config)
  .then(async response => {
    try {
      await writeFile('speech.mp3', response.data);
      console.log('speech.mp3 has been generated');
    } catch (error) {
      console.error('Error:', error);
    }
  })
  .catch(error => {
    console.log(error);
  });
