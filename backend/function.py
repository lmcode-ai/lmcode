from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Language, Question, Answer
from config import config


def insert_question(title, content, language, source_language, target_language, task) -> int:
    """
    Add a question to the database
    :param title: the title of the question
    :param content: the content of the question
    :param language: the language of the question (if any)
    :param source_language: the source language of the question (if any)
    :param target_language: the target language of the question (if any)
    :param task: the chosen task category of the question
    :return: the id of the question (primary key)
    """

    question = Question(
        title=title,
        content=content,
        language=language,
        source_language=source_language,
        target_language=target_language,
        task=task
    )

    db.session.add(question)
    db.session.commit()

    return question.id


def insert_answer(content, model, question_id) -> int:
    """
    Add an answer to the database
    :param content: the answer content
    :param model: the model used to generate the answer
    :param question_id: the id of the question
    :return: the id of the answer (primary key)
    """

    answer = Answer(
        content=content,
        model=model,
        question_id=question_id
    )

    db.session.add(answer)
    db.session.commit()

    return answer.id


def get_answers_from_models(content, language, source_language, target_language, task, question_id) -> list:
    """
    Get answers from different models
    :param content: the question content
    :param language: the language of the question (if any)
    :param source_language: the source language of the question (if any)
    :param target_language: the target language of the question (if any)
    :param task: the chosen task category of the question
    :param question_id: the id of the question
    :return:
    """
    prompt_user = {
        "Code Completion": "Complete the code snippet written in {language}",
        "Code Translation": "Translate the code snippet from {source_language} to {target_language}",
        "Code Explanation": "Explain the code snippet written in {language}",
        "Code Repair": "Fix the code snippet written in {language}"
    }

    responses = []
    
    for source, models in config.LLM_DICT.items():
        messages = [
            {
                "role": "system",
                "content": "You are a programming assistant skilled in different tasks like code completion, translation, and explanation."
            },
            {
                "role": "user",
                "content": f"{prompt_user[task].format(language=language, source_language=source_language, target_language=target_language)}: {content}"
            }
        ]
        # Check if the source is valid
        if source in config.LLM_CLIENT:
            for model in models:
                try:
                    print("here6")
                    # Initialize the LLM client
                    if source == "OPENAI":
                        api_key = config.OPENAI_API_KEY  
                        llm_client = config.LLM_CLIENT[source](api_key=api_key, model=model, max_retries=config.LLM_RETRIES, timeout=config.LLM_TIMEOUT)
                    elif source == "ANTHROPIC":
                        api_key = config.ANTHROPIC_API_KEY
                        llm_client = config.LLM_CLIENT[source](api_key=api_key, model=model, max_retries=config.LLM_RETRIES, timeout=config.LLM_TIMEOUT)
                    elif source == "HF":
                        api_key = config.HF_API_KEY
                        llm_client = config.LLM_CLIENT[source](repo_id=model, api_key=api_key, max_retries=config.LLM_RETRIES, timeout=config.LLM_TIMEOUT)
                    elif source == "GEMINI":
                        api_key = config.GEMINI_API_KEY
                        llm_client = config.LLM_CLIENT[source](model=model, google_api_key=api_key, max_retries=config.LLM_RETRIES, timeout=config.LLM_TIMEOUT)

                    # Make the LLM call
                    llm_response = llm_client.invoke(messages)

                    answer = llm_response.content
                    response = {}

                    answer_id = insert_answer(answer, model, question_id)
                    response['model'] = model
                    response['answer'] = answer
                    response['answer_id'] = answer_id
                    responses.append(response)


                except Exception as e:
                    print(f"Error with {source} model {model}: {e}")    

    print("Response type:", type(responses))
    print("Response content:", responses)
        
    return responses


def update_answer(answer_id: int, upvote_i, downvote_i) -> None:
    """
    Update the upvotes and downvotes of an answer
    :param answer_id: the id of the answer
    :param upvote_i: the number of upvotes to add
    :param downvote_i: the number of downvotes to add
    :return: None
    """

    answer = Answer.query.get(answer_id)
    if not answer:
        raise Exception("update_answer: Answer not found")
    answer.upvotes += upvote_i
    answer.downvotes += downvote_i

    db.session.commit()

