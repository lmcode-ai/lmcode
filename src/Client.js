import axios from 'axios';

const openAiModels = ['gpt-3.5-turbo-0125', 'gpt-4-turbo', 'gpt-4'];

const fetchOpenAiAnswer = async (model, openAiApiKey, task, code, sourceLanguage, targetLanguage) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          {
            role: 'user',
            content: task === 'Code Translation'
              ? `Please translate the following code from ${sourceLanguage} to ${targetLanguage}: ${code}`
              : `Please provide an answer for the following task: ${task}. Here is the code: ${code}`
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiApiKey}`,
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    return `Error loading answer from ${model}: ${error.response?.data?.error?.message || error.message}`;
  }
};

const fetchGeminiAnswer = async (geminiApiKey, task, code, sourceLanguage, targetLanguage) => {
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
      {
        contents: [
          {
            parts: [
              {
                text: task === 'Code Translation'
                  ? `Please translate the following code from ${sourceLanguage} to ${targetLanguage}: ${code}`
                  : `Please provide an answer for the following task: ${task}. Here is the code: ${code}`
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${geminiApiKey}`,
        },
        params: { key: geminiApiKey },
      }
    );
    return response.data.contents[0].parts[0].text;
  } catch (error) {
    return `Error loading answer from Gemini: ${error.response?.data?.error?.message || error.message}`;
  }
};

export const fetchAnswers = async (openAiApiKey, geminiApiKey, task, code, sourceLanguage, targetLanguage) => {
  if (!openAiApiKey || !geminiApiKey) {
    return ['API key for OpenAI is not set.', 'API key for OpenAI is not set.', 'API key for OpenAI is not set.', 'API key for Gemini is not set.'];
  }

  const openAiAnswers = await Promise.all(openAiModels.map((model) => fetchOpenAiAnswer(model, openAiApiKey, task, code, sourceLanguage, targetLanguage)));
  const geminiAnswer = await fetchGeminiAnswer(geminiApiKey, task, code, sourceLanguage, targetLanguage);

  return [...openAiAnswers, geminiAnswer];
};
