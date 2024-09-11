from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Language, Question, Answer
from openai import OpenAI
import os


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

    models = ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o']
    client = OpenAI()

    responses = []

    prompt_user = {
        "Code Completion": "Complete the code snippet written in {language}",
        "Code Translation": "Translate the code snippet from {source_language} to {target_language}",
        "Code Explanation": "Explain the code snippet written in {language}",
        "Code Repair": "Fix the code snippet written in {language}"
    }

    try:
        # Create messages to send to the API
        messages = [
            {"role": "system",
             "content": f"You are a programming assistant skilled in different tasks like"
                        f"code completion, translation, and explanation."},
            {"role": "user",
             "content": prompt_user[task].format(language=language, source_language=source_language, target_language=target_language) + f": {content}"}
        ]

        # Iterate through the list of models and get responses
        for model in models:
            completion = client.chat.completions.create(
                model=model,
                messages=messages
            )
            answer = completion.choices[0].message.content
            response = {}
            answer_id = insert_answer(answer, model, question_id)
            response['model'] = model
            response['answer'] = answer
            response['answer_id'] = answer_id
            responses.append(response)

        print("Response type:", type(responses))
        print("Response content:", responses)

        return responses

    except Exception as e:
        raise Exception("Error in get_answers_from_models:", str(e))


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

