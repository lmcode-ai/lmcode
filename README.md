# LMCode website

## Pre-requisites

- Python 3.11 or higher
- Node.js
- pip

## Frontend Initialization

1. Clone this repository

```bash
git clone git@github.com:lmcode-ai/lmcode.git
```

2. Install the required packages for the frontend

```bash
cd frontend
npm install
```

3. Start the server

```bash
cd lmcode/frontend &&
npm start
```

## Backend Initialization

1. Clone this repository

```bash
git clone git@github.com:lmcode-ai/lmcode.git
```

2. Create a new conda environment (Optional)
```base 
conda create --name env_name_here  python=3.11  
conda activate env_name_here
```

3. Install the required packages

```bash
pip install -r lmcode/backend/requirements.txt 
```

4. To setup environment variables. Copy the `.env.example` file and create a `.env` file in the backend directory of the project and insert actual API keys there.

```bash
cp .env.example .env
#modify .env with actual values
```

5. Start the server

```bash
cd lmcode/backend &&
flask run
```
