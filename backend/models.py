from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Language(db.Model):
    # language suggestions
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    count = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)


class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=True)
    content = db.Column(db.String, nullable=False)
    language = db.Column(db.String(50), nullable=True)
    source_language = db.Column(db.String(50), nullable=True)
    target_language = db.Column(db.String(50), nullable=True)
    task = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    accepted_answer_id = db.Column(db.Integer, db.ForeignKey('answer.id'), nullable=True)
    accepted_answer = db.relationship('Answer', foreign_keys=[accepted_answer_id], post_update=True)
    ip_address = db.Column(db.String(45), nullable=True)


class Answer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    model = db.Column(db.String, nullable=False)
    upvotes = db.Column(db.Integer, default=0)
    downvotes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    question = db.relationship('Question', backref=db.backref('answers', lazy=True), foreign_keys=[question_id])
    frontend_order = db.Column(db.Integer, default=-1)


class Feedback(db.Model):
    # feedback to LLM answer
    id = db.Column(db.Integer, primary_key=True)
    predefined_feedbacks = db.Column(db.JSON, nullable=False)  # Store array as JSON
    text_feedback = db.Column(db.String, nullable=True)  # Optional text feedback
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    answer_id = db.Column(db.Integer, db.ForeignKey('answer.id'), nullable=False)
    answer = db.relationship('Answer', backref=db.backref('feedbacks', lazy=True), foreign_keys=[answer_id])
    active = db.Column(db.Boolean, default=True, nullable=False)

class LLMError(db.Model):
    # log of LLM not generating an answer
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    model_id = db.Column(db.String, nullable=False)
    prompt = db.Column(db.String, nullable=False)
    error = db.Column(db.String, nullable=False)