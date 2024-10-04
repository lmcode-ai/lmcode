import os
import yaml
import warnings
from dotenv import load_dotenv
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain_google_vertexai import ChatVertexAI
from vertexai.preview import reasoning_engines
import vertexai


class Config:
    def __init__(self, config_file="app_config.yaml"):
        # Load the YAML file
        with open(config_file, "r") as file:
            config_data = yaml.safe_load(file)

        load_dotenv()

        # Database settings
        self.SQLALCHEMY_DATABASE_URI = config_data.get("database", {}).get(
            "uri", os.getenv("DATABASE_URL", "sqlite:///app.db")
        )
        self.SQLALCHEMY_TRACK_MODIFICATIONS = config_data.get("database", {}).get(
            "track_modifications", False
        )
        self.SQLALCHEMY_FILENAME = config_data.get("database", {}).get(
            "file_name", "app.db"
        )

        # API Keys
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        self.ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
        self.HF_API_KEY = os.getenv("HF_API_KEY")
        self.GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

        # Check if any API key is missing and issue a warning
        if not self.OPENAI_API_KEY:
            warnings.warn("OpenAI API key is missing! Some features may not work.")
        if not self.GEMINI_API_KEY:
            warnings.warn("Gemini API key is missing! Some features may not work.")
        if not self.ANTHROPIC_API_KEY:
            warnings.warn("Anthropic API key is missing! Some features may not work.")
        if not self.HF_API_KEY:
            warnings.warn(
                "Hugging Face API key is missing! Some features may not work."
            )

        # LLM settings

        self.LLM_DICT = {
            "OPENAI": [
                {
                    "id": model.get('id'),
                    "name": model.get('name'),
                    "max_tokens": model.get('max_tokens', 1000) 
                } for model in config_data.get("llm", {}).get("openai", [])
            ],
            "ANTHROPIC": [
                {
                    "id": model.get('id'),
                    "name": model.get('name'),
                    "max_tokens": model.get('max_tokens', 1000) 
                } for model in config_data.get("llm", {}).get("anthropic", [])
            ],
            "HF": [
                {
                    "id": model.get('id'),
                    "name": model.get('name'),
                    "max_tokens": model.get('max_tokens', 1000)  
                } for model in config_data.get("llm", {}).get("hf", [])
            ],
            "GEMINI": [
                {
                    "id": model.get('id'),
                    "name": model.get('name'),
                    "max_tokens": model.get('max_tokens', 1000) 
                } for model in config_data.get("llm", {}).get("gemini", [])
            ]
        }

        self.LLM_ID_NAME = {}
        for _, models in self.LLM_DICT.items():
            for model in models:
                self.LLM_ID_NAME[model.get('id')] = model.get('name')

        google_ai_platform_config = config_data.get("google-ai-platform", {})
        self.IS_GOOGLE_AI_PLATFORM = google_ai_platform_config.get("active", False)
        self.GOOGLE_AI_PLATFORM_PROJECT_NAME = google_ai_platform_config.get(
            "project", ""
        )
        self.GOOGLE_AI_PLATFORM_LOCATION = google_ai_platform_config.get("location", "")
        if self.IS_GOOGLE_AI_PLATFORM:
            vertexai.init(
                project=self.GOOGLE_AI_PLATFORM_PROJECT_NAME,
                location=self.GOOGLE_AI_PLATFORM_LOCATION,
            )
            print("Using Google AI Platform")
        else:
            print("Using Gemini through developer platform")

        self.LLM_TIMEOUT = config_data.get("llm", {}).get("timeout", 60)
        self.LLM_RETRIES = config_data.get("llm", {}).get("retries", 3)

        # These should be consistent with frontend passing in
        system_prompt = (
            "system",
            "You are a programming assistant skilled in different tasks like code completion, translation, and explanation.",
        )
        self.TASK_PROMPTS = {
            "Code Completion": ChatPromptTemplate(
                [
                    system_prompt,
                    (
                        "human",
                        "Complete the code snippet written in {language}:\n{content}",
                    ),
                ]
            ),
            "Code Translation": ChatPromptTemplate(
                [
                    system_prompt,
                    (
                        "human",
                        "Translate the code snippet from {source_language} to {target_language}:\n{content}",
                    ),
                ]
            ),
            "Code Repair": ChatPromptTemplate(
                [
                    system_prompt,
                    ("human", "Fix the code snippet written in {language}:\n{content}"),
                ]
            ),
            "Text-to-Code Generation": ChatPromptTemplate(
                [
                    system_prompt,
                    (
                        "human",
                        "Follow the instruction to write a code snippet in {language}:\n{content}",
                    ),
                ]
            ),
            "Code Summarization": ChatPromptTemplate(
                [
                    system_prompt,
                    (
                        "human",
                        "Explain the code snippet written in {language}:\n{content}",
                    ),
                ]
            ),
        }

        # setup all client chains
        self.LLM_CHAINS = {}  # dict of model name to llm

        for source, models in self.LLM_DICT.items():
            for model in models:
                try:
                    # Initialize the LLM client
                    if source == "OPENAI":
                        llm_client = ChatOpenAI(
                            openai_api_key=self.OPENAI_API_KEY, model=model.get('id'), max_tokens=model.get('max_tokens') 
                        )
                    elif source == "ANTHROPIC":
                        llm_client = ChatAnthropic(
                            anthropic_api_key=self.ANTHROPIC_API_KEY, model=model.get('id'), max_tokens_to_sample=model.get('max_tokens') 
                        )
                    elif source == "HF":
                        llm = HuggingFaceEndpoint(
                            repo_id=model.get('id'),
                            task="text-generation",
                            huggingfacehub_api_token=self.HF_API_KEY,
                            max_new_tokens=model.get('max_tokens') ,
                        )
                        llm_client = ChatHuggingFace(llm=llm)
                    elif source == "GEMINI":
                        if self.IS_GOOGLE_AI_PLATFORM:
                            llm_client = ChatVertexAI(model=model.get('id'), max_tokens=model.get('max_tokens') )
                        else:
                            llm_client = ChatGoogleGenerativeAI(
                                google_api_key=self.GEMINI_API_KEY, model=model.get('id'), max_output_tokens=model.get('max_tokens') 
                            )
                    llm_client.invoke("Sanity test")
                    self.LLM_CHAINS[model.get('id')] = llm_client
                    print(f"Successfully added {source} model {model.get('id')}")
                except Exception as e:
                    print(f"Error with {source} model {model.get('id')}: {e}")


config = Config()
