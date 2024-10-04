import axios from 'axios';

export const fetchAnswers = async (task, code, language, sourceLanguage, targetLanguage) => {
  try {
    const response = await axios.post('/api/get_openai_response', {
      task,
      code,
      language,
      sourceLanguage,
      targetLanguage
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return { error: `Error loading answer: ${error.response?.data?.error || error.message}` };
  }
};
