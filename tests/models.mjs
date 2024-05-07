import axios from 'axios';

const API_KEY = '';

async function fetchModels() {
  try {
    const response = await axios.get('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    const models = response.data.data;
    const sortedModels = models.sort((a, b) => a.id.localeCompare(b.id));

    sortedModels.forEach(model => {
      console.log(model.id);
    });
  } catch (error) {
    console.error('Error fetching models:', error.message);
  }
}

fetchModels();
