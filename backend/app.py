from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Language, Question, Answer, Feedback
import os
import function

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)

    # Configuration for SQLite database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///code_arena.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        db_path = os.path.join(app.instance_path, 'code_arena.db')
        if not os.path.exists(db_path):
            print("Creating database and tables...")
            db.create_all()
            print("Database and tables created.")
        else:
            print("Database already exists.")

    return app

app = create_app()

@app.route('/api/add_language', methods=['POST'])
def add_language():
    data = request.get_json()
    language_name = data.get('language')

    if not language_name:
        return jsonify({'error': 'Language name is required'}), 400

    language = Language.query.filter_by(name=language_name).first()

    if language:
        language.count += 1
    else:
        language = Language(name=language_name)
        db.session.add(language)

    db.session.commit()

    return jsonify({'message': 'Language added/updated successfully'})


@app.route('/api/questions/handle', methods=['POST'])
def handle_questions():
    """
    add the question in the database,
    invoke apis to get the answers,
    add these answers in the database,
    return the related information of each answer {model, answer, answer_id}
    invoke this when the page is directed to the result page.
    """
    try:
        ip_address = request.remote_addr
        data = request.get_json()
        question_title = data.get('title')
        question_content = data.get('content')
        language = data.get('language')
        source_language = data.get('sourceLanguage')
        target_language = data.get('targetLanguage')
        task = data.get('task')
        question_id = function.insert_question(question_title, question_content, language, source_language, target_language, task, ip_address)
        response = function.get_answers_from_models(question_content, language, source_language, target_language, task, question_id)
        # MOCK RESPONSE
        # response = [
        #     {
        #         'model': 'model 1',
        #         'answer': 'answer 1',
        #         'answer_id': 1
        #     },
        #     {
        #         'model': 'model 2',
        #         'answer': 'answer 2',
        #         'answer_id': 2
        #     },
        #     {
        #         'model': 'model 3',
        #         'answer': 'answer 3',
        #         'answer_id': 3
        #     },
        #     {
        #         'model': 'model 4',
        #         'answer': 'answer 4',
        #         'answer_id': 4
        #     }
        # ]
        return jsonify(response)
    except Exception as e:
        return jsonify({'Error in handle_questions': str(e)}), 500


@app.route("/api/answers/update", methods=['POST'])
def update_answer():
    """
    update the answer in the database
    """
    data = request.get_json()
    answer_id = data.get('answer_id')
    upvotes_increment = data.get('upvotes_increment')
    downvotes_increment = data.get('downvotes_increment')
    function.update_answer(answer_id, upvotes_increment, downvotes_increment)


@app.route("/api/answers/accept", methods=['POST'])
def accept_answer():
    """
    accept the answer in the database
    """
    try:
        data = request.get_json()
        answer_id = data.get('answer_id')
        answer = Answer.query.get(answer_id)
        if not answer:
            return jsonify({'Error in <accept_answer>': 'Answer not found'}), 404
        question = Question.query.get(answer.question_id)
        if not question:
            return jsonify({'Error in <accept_answer>': 'Question not found'}), 404
        question.accepted_answer_id = answer_id
        db.session.commit()
        return jsonify({'message': 'Answer accepted successfully'})
    except Exception as e:
        return jsonify({'Error in <accept_answer>': str(e)}), 500


@app.route("/api/answers/feedback", methods=['POST'])
def upsert_feedback():
    """
    add feedback for the answer in the database
    """
    data = request.get_json()
    answer_id = data.get('answer_id')
    feedback_kind = data.get('feedback')
    feedback = Feedback(
        feedback=feedback_kind,
        answer_id=answer_id
    )
    db.session.add(feedback)
    db.session.commit()
    return jsonify({'message': 'Feedback added successfully'})


# @app.route("/api/questions/search", methods=['GET'])
# def search_questions():
#     pass


@app.route("/api/get_answers", methods=['GET'])
def get_answer():
    pass


from flask import request, jsonify
from sqlalchemy import or_
from models import Question  # assuming your Question model is in models.py
from sqlalchemy.sql import func

@app.route('/api/search_questions', methods=['GET'])
def search_questions():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'questions': []})

    # Fuzzy search on title and content
    search = "%{}%".format(query)
    results = Question.query.filter(or_(
        Question.title.ilike(search),
        Question.content.ilike(search)
    )).all()

    # Convert results to a list of dictionaries
    questions = [{'id': q.id, 'title': q.title, 'task': q.task} for q in results]
    return jsonify({'questions': questions})

@app.route('/api/random_questions', methods=['GET'])
def random_questions():
    # Get random 5 questions
    questions = Question.query.order_by(func.random()).limit(5).all()
    questions_list = [{'id': q.id, 'title': q.title, 'task': q.task} for q in questions]
    return jsonify({'questions': questions_list})

@app.route('/api/question/<int:question_id>', methods=['GET'])
def get_question(question_id):
    question = Question.query.get_or_404(question_id)
    return jsonify({
        'id': question.id,
        'title': question.title,
        'content': question.content,
        'language': question.language,
        'source_language': question.source_language,
        'target_language': question.target_language,
        'task': question.task
    })


if __name__ == '__main__':
    app.run(debug=True)
