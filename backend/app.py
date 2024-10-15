from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Language, Question, Answer, Feedback
import os
import function
from config import config
import logging
from sqlalchemy.exc import SQLAlchemyError


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(
        app,
        supports_credentials=True,
        origins=[r"^https?://(localhost|10\.1\.\d+\.\d+|35\.199\.152\.39|lmcode\.ai)/?(:\d+)?$"],
    )

    # Configuration for SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS

    db.init_app(app)

    with app.app_context():
        db_path = os.path.join(app.instance_path, config.SQLALCHEMY_FILENAME)
        if not os.path.exists(db_path):
            logging.info("Creating database and tables...")
            db.create_all()
            logging.info("Database and tables created.")
        else:
            logging.info("Database already exists.")

    return app

app = create_app()

@app.route('/api/add_language', methods=['POST'])
def add_language():
    data = request.get_json()
    language_name = data.get('language')
    logging.info(f"<add_language> request: {request.get_json()}")

    if not language_name:
        err_msg = 'Language name is required'
        logging.error(f"<add_language> error: {err_msg}")
        return jsonify({'error': err_msg}), 400

    try:
        language = Language.query.filter_by(name=language_name).first()

        if language:
            language.count += 1
            logging.info(f"<add_language> {language_name} exists. Incremented count to {language.count}.")
        else:
            language = Language(name=language_name)
            db.session.add(language)
            logging.info(f"<add_language> added new language: {language_name}")

        db.session.commit()
        logging.info(f"<add_language> database commit successful for language: {language_name}")

        return jsonify({'message': 'Language added/updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"<add_language> Error in add language: {err_msg}")
        return jsonify({"error": str(e)}), 500

    finally:
        db.session.close()


@app.route('/api/questions/handle', methods=['POST'])
def handle_questions():
    """
    add the question in the database,
    invoke apis to get the answers,
    add these answers in the database,
    return the related information of each answer {model, answer, answer_id}
    invoke this when the page is directed to the result page.
    """
    logging.info(f"<handle_questions> request: {request.get_json()}")
    try:
        ip_address = request.remote_addr
        data = request.get_json()
        question_title = data.get('title')
        if question_title is None:
            return jsonify({"error": "question_title is missing"}), 400

        question_content = data.get('content')
        if question_content is None:
            return jsonify({"error": "question_content is missing"}), 400

        task = data.get('task')
        if task is None:
            return jsonify({"error": "task is missing"}), 400

        language = data.get('language')
        source_language = data.get('sourceLanguage')
        target_language = data.get('targetLanguage')
        
        if task == "Code Translation":
            if source_language is None or target_language is None:
                return jsonify({"error": "both 'sourceLanguage' and 'targetLanguage' must be provided for translation."}), 400
            
            # ignore language if passed in for tranlation
            language = ""
        else:
            if language is None:
                return jsonify({"error": "'language' must be set for non-translation."}), 400
            
            # ignore source and target language if not for tranlation
            source_language = ""
            target_language = ""
        
        question_id = function.insert_question(question_title, question_content, language, source_language, target_language, task, ip_address)
        response = function.get_answers_from_models(question_content, language, source_language, target_language, task, question_id)

        logging.info(f"<handle_questions> llm response: {response}")

        # RESPONSE FORMAT
        # response = [
        #     {
        #         'model': '',
        #         'model_name': '',
        #         'model_id': 0,
        #         'answer': '',
        #         'answer_id': 0,
        #     },
        # ]

        return jsonify(response), 200
    except Exception as e:
        err_msg = str(e)
        logging.error(f"<handle_questions> Error in handle_questions: {err_msg}")
        return jsonify({'error': err_msg}), 500
    finally:
        db.session.close()


@app.route("/api/answers/accept", methods=['POST'])
def accept_answer():
    """
    accept the answer in the database.
    marks any feedback related to be INACTIVE.

    accept is tranlated to number of upvotes.
    reject is tranlated to number of downvotes.
    """
    data = request.get_json()
    answer_id = data.get('answer_id')

    if answer_id is None:
        return jsonify({"error": "answer_id is missing"}), 400
    try:
        answer_id = int(answer_id)
    except ValueError:
        return jsonify({"error": "answer_id must be an integer"}), 400

    try:
        function.update_answer(answer_id, 1, 0)
        # Mark all feedback as inactive when the answer is accepted
        Feedback.query.filter_by(answer_id=answer_id).update({'active': False})
        # Commit the changes to the database
        db.session.commit()
        return jsonify({"message": "Accept successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"<accept_answer> Error in accept for {answer_id}: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        db.session.close()


@app.route("/api/answers/unaccept", methods=['POST'])
def unaccept_answer():
    """
    unaccept the answer in the database.

    accept is tranlated to number of upvotes.
    reject is tranlated to number of downvotes.
    """
    data = request.get_json()
    answer_id = data.get('answer_id')

    if answer_id is None:
        return jsonify({"error": "answer_id is missing"}), 400
    try:
        answer_id = int(answer_id)
    except ValueError:
        return jsonify({"error": "answer_id must be an integer"}), 400

    try:
        function.update_answer(answer_id, -1, 0)
        return jsonify({"message": "Unaccept successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"<unaccept_answer> Error in unaccept for {answer_id}: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        db.session.close()

@app.route("/api/answers/reject", methods=['POST'])
def reject_answer():
    """
    reject the answer in the database.
    mark all feedback related to ACTIVE

    accept is tranlated to number of upvotes.
    reject is tranlated to number of downvotes.
    """
    data = request.get_json()
    answer_id = data.get('answer_id')

    if answer_id is None:
        return jsonify({"error": "answer_id is missing"}), 400
    try:
        answer_id = int(answer_id)
    except ValueError:
        return jsonify({"error": "answer_id must be an integer"}), 400

    try:
        function.update_answer(answer_id, 0, 1)

        # Mark all feedback as active when the answer is rejected
        Feedback.query.filter_by(answer_id=answer_id).update({'active': True})
        # Commit the changes to the database
        db.session.commit()

        return jsonify({"message": "Reject successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"<reject_answer> Error in reject for {answer_id}: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        db.session.close()

@app.route("/api/answers/unreject", methods=['POST'])
def unreject_answer():
    """
    unreject the answer in the database.

    accept is tranlated to number of upvotes.
    reject is tranlated to number of downvotes.
    """
    data = request.get_json()
    answer_id = data.get('answer_id')

    if answer_id is None:
        return jsonify({"error": "answer_id is missing"}), 400
    try:
        answer_id = int(answer_id)
    except ValueError:
        return jsonify({"error": "answer_id must be an integer"}), 400

    try:
        function.update_answer(answer_id, 0, -1)
        return jsonify({"message": "Unreject successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"<unreject_answer> Error in unreject for {answer_id}: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        db.session.close()


@app.route("/api/answers/feedback", methods=['POST'])
def upsert_feedback():
    """
    add feedback for the answer in the database or update it if exists
    """
    data = request.get_json()
    answer_id = data.get('answer_id')

    if answer_id is None:
        return jsonify({"error": "answer_id is missing"}), 400
    try:
        answer_id = int(answer_id)
    except ValueError:
        return jsonify({"error": "answer_id must be an integer"}), 400

    predefined_feedbacks = data.get('predefined_feedbacks', [])

    text_feedback = data.get('text_feedback')

    try:
        feedback = Feedback.query.filter_by(answer_id=answer_id).first()

        if feedback:
            # If feedback exists, update the existing record
            feedback.predefined_feedbacks = predefined_feedbacks
            feedback.text_feedback = text_feedback
        else:
            # If no feedback exists, create a new feedback record
            feedback = Feedback(
                predefined_feedbacks=predefined_feedbacks,
                text_feedback=text_feedback,
                answer_id=answer_id,
                active=True,
            )
            db.session.add(feedback)

        db.session.commit()

        return jsonify({'message': 'Feedback upserted successfully'}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        logging.error(f"<handle_questions> Error in upseting feedback for {answer_id}: {e}")
        return jsonify({'error': 'Database operation failed'}), 500

    finally:
        db.session.close()

@app.route("/health", methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

# @app.route("/api/questions/search", methods=['GET'])
# def search_questions():
#     pass


# @app.route("/api/get_answers", methods=['GET'])
# def get_answer():
#     pass


# from flask import request, jsonify
# from sqlalchemy import or_
# from models import Question  # assuming your Question model is in models.py
# from sqlalchemy.sql import func

# @app.route('/api/search_questions', methods=['GET'])
# def search_questions():
#     query = request.args.get('query', '')
#     if not query:
#         return jsonify({'questions': []})

#     # Fuzzy search on title and content
#     search = "%{}%".format(query)
#     results = Question.query.filter(or_(
#         Question.title.ilike(search),
#         Question.content.ilike(search)
#     )).all()

#     # Convert results to a list of dictionaries
#     questions = [{'id': q.id, 'title': q.title, 'task': q.task} for q in results]
#     return jsonify({'questions': questions})

# @app.route('/api/random_questions', methods=['GET'])
# def random_questions():
#     # Get random 5 questions
#     questions = Question.query.order_by(func.random()).limit(5).all()
#     questions_list = [{'id': q.id, 'title': q.title, 'task': q.task} for q in questions]
#     return jsonify({'questions': questions_list})

# @app.route('/api/question/<int:question_id>', methods=['GET'])
# def get_question(question_id):
#     question = Question.query.get_or_404(question_id)
#     return jsonify({
#         'id': question.id,
#         'title': question.title,
#         'content': question.content,
#         'language': question.language,
#         'source_language': question.source_language,
#         'target_language': question.target_language,
#         'task': question.task
#     })


if __name__ == '__main__':
    app.run(debug=True, port=5050)
