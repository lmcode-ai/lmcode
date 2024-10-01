import os
import yaml
from langchain import OpenAI, Anthropic, HuggingFaceHub
from langchain_google_genai import ChatGoogleGenerativeAI
import warnings

class Config:
    def __init__(self, config_file='app_config.yaml'):
        # Load the YAML file
        with open(config_file, 'r') as file:
            config_data = yaml.safe_load(file)

        # Database settings
        self.SQLALCHEMY_DATABASE_URI = config_data.get('database', {}).get('uri', os.getenv('DATABASE_URL', 'sqlite:///app.db'))
        self.SQLALCHEMY_TRACK_MODIFICATIONS = config_data.get('database', {}).get('track_modifications', False)

        # API Keys
        self.OPENAI_API_KEY = config_data.get('api_keys', {}).get('openai_api_key', os.getenv('OPENAI_API_KEY'))
        self.ANTHROPIC_API_KEY = config_data.get('api_keys', {}).get('anthropic_api_key', os.getenv('ANTHROPIC_API_KEY'))
        self.HF_API_KEY = config_data.get('api_keys', {}).get('hf_api_key', os.getenv('HF_API_KEY'))
        self.GEMINI_API_KEY = config_data.get('api_keys', {}).get('gemini_api_key', os.getenv('GEMINI_API_KEY'))

        # Check if any API key is missing and issue a warning
        if not self.OPENAI_API_KEY:
            warnings.warn("OpenAI API key is missing! Some features may not work.")
        if not self.GEMINI_API_KEY:
            warnings.warn("Gemini API key is missing! Some features may not work.")
        if not self.ANTHROPIC_API_KEY:
            warnings.warn("Anthropic API key is missing! Some features may not work.")
        if not self.HF_API_KEY:
            warnings.warn("Hugging Face API key is missing! Some features may not work.")

        # LLM settings
        self.LLM_DICT = {
            "OPENAI": config_data.get('llm', {}).get('openai', ['gpt-4']),
            "ANTHROPIC": config_data.get('llm', {}).get('anthropic', ['claude-2']),
            "HF": config_data.get('llm', {}).get('hf', ['gpt2']),
            "GEMINI": config_data.get('llm', {}).get('gemini', ['gemini-1.5-pro'])
        }
        
        self.LLM_TIMEOUT = config_data.get('llm', {}).get('timeout', 60)
        self.LLM_RETRIES = config_data.get('llm', {}).get('retries', 3)

        self.LLM_CLIENT = {
            "OPENAI": OpenAI,
            "ANTHROPIC": Anthropic,
            "HF": HuggingFaceHub,
            "GEMINI": ChatGoogleGenerativeAI,
        }

config = Config()
