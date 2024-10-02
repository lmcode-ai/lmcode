import os
import yaml
import warnings
from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_openai import ChatOpenAI
from langchain_community.chat_models import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate

class Config:
    def __init__(self, config_file='app_config.yaml'):
        # Load the YAML file
        with open(config_file, 'r') as file:
            config_data = yaml.safe_load(file)

        load_dotenv()

        # Database settings
        self.SQLALCHEMY_DATABASE_URI = config_data.get('database', {}).get('uri', os.getenv('DATABASE_URL', 'sqlite:///app.db'))
        self.SQLALCHEMY_TRACK_MODIFICATIONS = config_data.get('database', {}).get('track_modifications', False)

        # API Keys
        self.OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
        self.ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
        self.HF_API_KEY = os.getenv('HF_API_KEY')
        self.GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

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
            "OPENAI": config_data.get('llm', {}).get('openai', []),
            "ANTHROPIC": config_data.get('llm', {}).get('anthropic', []),
            "HF": config_data.get('llm', {}).get('hf', []),
            "GEMINI": config_data.get('llm', {}).get('gemini', [])
        }
        
        self.LLM_TIMEOUT = config_data.get('llm', {}).get('timeout', 60)
        self.LLM_RETRIES = config_data.get('llm', {}).get('retries', 3)


        # These should be consistent with frontend passing in
        system_prompt = ("system", "You are a programming assistant skilled in different tasks like code completion, translation, and explanation.")
        self.TASK_PROMPTS = {
            "Code Completion": ChatPromptTemplate([system_prompt, ("human", "Complete the code snippet written in {language}:\n{content}")]),
            "Code Translation": ChatPromptTemplate([system_prompt, ("human", "Translate the code snippet from {source_language} to {target_language}:\n{content}")]),
            "Code Repair": ChatPromptTemplate([system_prompt, ("human", "Fix the code snippet written in {language}:\n{content}")]),
            "Text-to-Code Generation": ChatPromptTemplate([system_prompt, ("human", "Follow the instruction to write a code snippet in {language}:\n{content}")]),
            "Code Summarization": ChatPromptTemplate([system_prompt, ("human", "Explain the code snippet written in {language}:\n{content}")]),
        }

        # setup all client chains
        self.LLM_CHAINS = {} # dict of model name to llm

        for source, models in self.LLM_DICT.items():
            for model in models:
                try:
                    # Initialize the LLM client
                    if source == "OPENAI":
                        llm_client = ChatOpenAI(openai_api_key=self.OPENAI_API_KEY, model=model)
                    elif source == "ANTHROPIC":
                        llm_client = ChatAnthropic(anthropic_api_key=self.ANTHROPIC_API_KEY, model=model)
                    elif source == "HF":
                        llm = HuggingFaceEndpoint(
                            repo_id=model,
                            task="text-generation",
                            huggingfacehub_api_token=self.HF_API_KEY
                        )
                        llm_client = ChatHuggingFace(llm=llm)
                    elif source == "GEMINI":
                        llm_client = ChatGoogleGenerativeAI(google_api_key=self.GEMINI_API_KEY, model=model)
                    llm_client.invoke("Sanity test")
                    self.LLM_CHAINS[model] = llm_client
                    print(f"Successfully added {source} model {model}")
                except Exception as e:
                    print(f"Error with {source} model {model}: {e}")   
        

config = Config()
