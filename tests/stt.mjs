import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_KEY = '';

const FILE_PATH = '/Users/mickaelfm/Downloads/ttsMP3.com_VoiceText_2023-11-6_20_40_33.mp3';

const form = new FormData();
form.append('file', fs.createReadStream(FILE_PATH));
form.append('model', 'whisper-1');

axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    ...form.getHeaders(), // Spreads the form headers to include the correct 'Content-Type' header with the boundary
  },
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
