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
cd lmcode/frontend
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

## Production Deployment

1. We are currently running Nginx as reverse proxy and its listening to port 80 for HTTP and 443 for HTTPS.
Configuration is located in file `/etc/nginx/sites-available/default`. We can restart or reload the proxy via

```bash
sudo systemctl restart nginx
sudo systemctl reload nginx
```

2. To make frontend changes available, we only need to update the build folder Nginx is serving frontend from,
in our case `/home/lmcode-user/lmcode/frontend/build`. We can make the new build from updated code by running

```bash
cd lmcode/frontend
npm run build
```

3. For backend, we are running the Flask application on port 5000 which is where Nginx is directing requests to.
To make changes effective, run

```bash
tmux attach -t backend # process running in tmux session 'backend'
cd lmcode/backend
flask run --host=127.0.0.1 --port=5000
```