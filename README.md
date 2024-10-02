# Bot Overflow

## Pre-requisites

- Python 3.6 or higher
- Node.js
- pip

## Frontend Initialization

1. Clone this repository

```bash
git clone git@github.com:bot-overflow/bot-overflow.git
```

2. Install the required packages

```bash
npm install
```

3. Add api key in .env file
```bash
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the server

```bash
cd bot-overflow/frontend &&
npm start
```

## Backend Initialization

1. Clone this repository

```bash
git clone git@github.com:bot-overflow/bot-overflow.git
```

2. Create a new conda environment (Optional)
```base 
conda create --name env_name_here  python=3.9  
conda activate env_name_here
```

3. Install the required packages

```bash
pip install -r bot-overflow/backend/requirements.txt 
```

4. To setup environment variables. Copy the `.env.example` file and create a `.env` file in the backend directory of the project and insert actual API keys there.

```bash
cp .env.example .env
#modify .env with actual values
```

5. Start the server

```bash
cd bot-overflow/backend &&
flask run
```
