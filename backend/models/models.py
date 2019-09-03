from database.db import db
from datetime import datetime
from flask import jsonify



class UserModel(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    password = db.Column(db.String())
    email = db.Column(db.String(256))
    phonenumber = db.Column(db.String(30))

    def __init__(self, username, password, email, phonenumber):
        self.username = username
        self.password = password
        self.email = email
        self.phonenumber = phonenumber

    def json(self):
        return {
            "id": str(self.id),
            "username": self.username,
            "email": self.email,
            "phoneNumber": self.phonenumber
        }, 200

    # Method to save user to DB
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # Method to remove user from DB
    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()

    # Class method which finds user from DB by username
    @classmethod
    def find_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    # Class method which finds user from DB by id
    @classmethod
    def find_user_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

class EntryModel(db.Model):
    __tablename__ = "entries"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80))
    text = db.Column(db.String(256))
    date = db.Column(db.String(), nullable=False, default=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    author = db.Column(db.String(), db.ForeignKey('users.username'), nullable=False)
    author_id = db.Column(db.Integer, nullable=False)
    tags = db.Column(db.String())


    def __init__(self, title, text, author, author_id):
        self.title = title
        self.text = text
        self.author = author
        self.author_id = author_id


    def json(self):
        tags_json = []
        if self.tags:
            tags_json = self.tags.split(';')
        return {
            "id": str(self.id),
            "title": self.title,
            "text": self.text,
            "date": str(self.date),
            "author": self.author,
            "author_id": str(self.author_id),
            "tags": tags_json
        }

    # Method to save user to DB
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # Method to remove user from DB
    def remove_from_db(self):
        db.session.delete(self)
        db.session.commit()


    # Class method which finds entries from DB by id
    @classmethod
    def find_entry_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    # Class method which finds all entries
    @classmethod
    def find_all_entries(cls):
        result = cls.query.all()
        all_entries = list()
        for i in result:
            all_entries.append(i.json())
        return all_entries

    # Class method which finds all entries from user
    @classmethod
    def find_all_entries_from_user(cls, _userid):
        result = cls.query.filter_by(author_id=_userid)
        all_entries_by_id = list()
        for i in result:
            all_entries_by_id.append(i.json())
        return all_entries_by_id

        