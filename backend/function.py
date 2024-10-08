from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Language, Question, Answer, LLMError
from config import config
from langchain_core.runnables import RunnableParallel
import random


def insert_question(title, content, language, source_language, target_language, task, ip_address) -> int:
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
        task=task,
        ip_address=ip_address
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
    
    responses = []
    task_template = config.TASK_PROMPTS[task]

    # Gather input data to chain
    input_data = {}
    if task == "Code Translation":
        input_data["source_language"] = source_language
        input_data["target_language"] = target_language
        input_data["content"] = content
    else:
        input_data["language"] = language
        input_data["content"] = content

    # Run all chain in parallel
    parallel_runnable = task_template | config.LLM_CHAINS
    llm_responses = parallel_runnable.invoke(input_data)

    for model_id, _ in config.LLM_ID_NAME.items():
        if model_id not in llm_responses:
            # LLM Error has occured
            llmError = LLMError(
                question_id=question_id,
                model_id=model_id,
                prompt=task_template.format(**input_data),
                llmError="Something went wrong during parallel call",
            )
            db.session.add(llmError)
            db.session.commit()
        else:
            answer = llm_responses[model_id].content

            response = {}
            answer_id = insert_answer(answer, model_id, question_id)
            response['model'] = config.LLM_ID_NAME[model_id]
            response['answer'] = answer
            response['answer_id'] = answer_id
            responses.append(response)

    random.shuffle(responses)
    for idx, response in enumerate(responses, start=65): # Assuming less than 26 models so starting at A
        response['model'] = f"model {chr(idx)}"
        
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

