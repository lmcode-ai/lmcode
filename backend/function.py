from typing import Optional
from models import db, Question, Answer, LLMError
from config import config
from langchain.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

def insert_question(
    *,
    title: str,
    content: str,
    language: Optional[str],
    source_language: Optional[str],
    target_language: Optional[str],
    task: str,
    ip_address: str
) -> int:
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


def insert_answer(content, model, question_id, order=-1) -> int:
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
        question_id=question_id,
        frontend_order=order,
    )

    db.session.add(answer)
    db.session.commit()

    return answer.id

async def get_answer_from_model(
    *,
    model_id: str,
    content: str,
    language: str,
    source_language: str,
    target_language: str,
    task: str,
    question_id: int,
) -> dict[str, str]:
    """
    Get answer from a specific model
    :param model_id: the id of the model
    :param content: the question content
    :param language: the language of the question (if any)
    :param source_language: the source language of the question (if any)
    :param target_language: the target language of the question (if any)
    :param task: the chosen task category of the question
    :param question_id: the id of the question
    :return:
    """
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

    # llm chains is mapping from model id to client
    llm_client = config.LLM_CHAINS[model_id]
    prompt = task_template.format(**input_data)
    try:
        content = await async_llm_call(prompt, llm_client)
    except Exception as e:
        llm_error = LLMError(
            question_id=question_id,
            model_id=model_id,
            prompt=prompt,
            error=str(e),
        )
        db.session.add(llm_error)
        db.session.commit()
        raise

    response: dict[str, str] = {}
    response["model_name"] = config.LLM_ID_NAME[model_id]
    response["model_id"] = model_id
    response["content"] = content
    return response

def update_answer(answer_id: int, upvote_change: int, downvote_change: int) -> None:
    """
    Update the upvotes and downvotes of an answer
    :param answer_id: the id of the answer
    :param upvote_change: the number of upvotes changed
    :param downvote_change: the number of downvotes changed
    :return: None
    """

    answer = Answer.query.get(answer_id)
    if not answer:
        raise Exception("update_answer: Answer not found")
    answer.upvotes += upvote_change
    answer.downvotes += downvote_change

    db.session.commit()

async def async_llm_call(prompt_text: int, llm_client) -> str:
    # Create the prompt
    system_message = SystemMessagePromptTemplate.from_template(
        "You are a helpful programming assistant."
    )
    human_message = HumanMessagePromptTemplate.from_template("{input_text}")
    chat_prompt = ChatPromptTemplate.from_messages([system_message, human_message])

    # Format the prompt
    messages = chat_prompt.format_prompt(input_text=prompt_text).to_messages()

    # Invoke the LLM asynchronously
    response = await llm_client.agenerate([messages])

    # Extract and return the assistant"s reply along with the model name
    return response.generations[0][0].text.strip()