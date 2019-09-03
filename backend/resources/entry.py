from flask_restful import Resource, reqparse
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_refresh_token_required, get_jwt_identity, fresh_jwt_required
import sqlite3
from models.models import EntryModel, UserModel
from datetime import datetime
import json



_entry_parser = reqparse.RequestParser()

_entry_parser.add_argument(
    "id",
    type=str,
    required=False
)

_entry_parser.add_argument(
    "title",
    type=str,
    required=True,
    help="This field cannot be blank"
)
_entry_parser.add_argument(
    "text",
    type=str,
    required=True,
    help="This field cannot be blank"
)
_entry_parser.add_argument(
    "tags",
    action='append',
    required=False,
)


"""
Class Entry not in use
"""
class Entry(Resource):
    @fresh_jwt_required
    def get(self):
        entry = EntryModel.find_entry_by_id(get_jwt_identity())
        if entry:
            return entry.json()

        return {
                   "message": "Entry not found!"
               }, 404

    @fresh_jwt_required
    def delete(self):
        entry = EntryModel.find_entry_by_id(get_jwt_identity())
        if entry:
            entry.remove_from_db()
            return {
                       "message": "Entry deleted!"
                   }, 200

        return {
                   "message": "Entry not found!"
               }, 404


class CreateEntry(Resource):
    @fresh_jwt_required
    
    def post(self):
        """
        Create a new entry
        ---
        tags:
            - Entry API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
            - name: title
              in: body
              type: string
              required: true
              description: the title of the entry
            - name: text
              in: body
              type: string
              required: true
              description: the text of the entry
            - name: tags
              in: body
              type: array
              required: true
              description: the tags for a entry
        responses:
            200:
                description: returns the new entry
                schema:
                    id: user_respone
                    properties:
                        id:
                            type: string
                            description: The id of an entry
                        title:
                            type: string
                            description: The title of the entry
                        text:
                            type: string
                            description: the text for an entry
                        author:
                            type: string
                            description: The username of the author
                        author_id:
                            type: string
                            description: The id of the author
                        date:
                            type: string
                            description: the creation date for an entry
                        tags:
                            type: array
                            description: the tags for an entry
        """
        conn = sqlite3.connect('data.db')
        c = conn.cursor()

        data = _entry_parser.parse_args()

        entry = EntryModel(data["title"], data["text"], UserModel.find_user_by_id(get_jwt_identity()).json()[0]['username'], get_jwt_identity())
        entry.save_to_db()
        tags_to_db = ""

        counter = 0
        for i in data['tags']:
            counter += 1
            tags_to_db += str(i) 
            if counter == len(data['tags']):
                pass
            else:
                tags_to_db += ";"
        c.execute("UPDATE entries SET tags = '" + tags_to_db +"' WHERE ID=" + str(entry.json()['id']))
        conn.commit()
        conn.close()
        ret_json = EntryModel.find_entry_by_id(entry.json()['id']).json()
        ret_json["tags"] = data['tags']
        return ret_json
        

class DeleteEntry(Resource):
    @fresh_jwt_required

    def delete(self, id):
        """
        Delete an entry
        ---
        tags:
            - Entry API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
            - name: id
              in: url
              type: string
              required: true
              description: the id of the entry that you want to delete
        responses:
            200:
                description: Entry deleted!
            404:
                description: Entry not found!
        """
        entry = EntryModel.find_entry_by_id(id)

        if entry:
            entry.remove_from_db()
            return {
                       "message": "Entry deleted!"
                   }, 200

        return {
                   "message": "Entry not found!"
               }, 404

class GetAllEntries(Resource):
    @fresh_jwt_required
    def get(self):
        """
        Get all entries 
        ---
        tags:
            - Entry API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
        responses:
            200:
                description: Returns all entries as array
                schema:
                type: array
                items:
                schema:
                  id: id
                  type: string
                  title: title of the entry
                  type: string
                  text: text
                  type: string
                  date: date
                  type: string
                  author: author
                  type: string
                  author_id: author_id
                  type: string
                  tags: tags_json
                  type: string
        """
        entry = EntryModel.find_all_entries()
        if entry:
            return entry

        return []
    

class GetAllEntriesFromUser(Resource):
    @fresh_jwt_required
    def get(self, id):
        """
        Get all entries by the given id to a user
        ---
        tags:
            - Entry API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
            - name: User id
              in: url
              type: string
              required: true
              description: The id of the user 
        responses:
            200:
                description: Returns all entries for a specific user as array
                schema:
                type: array
                items:
                schema:
                  id: id
                  type: string
                  title: title of the entry
                  type: string
                  text: text
                  type: string
                  date: date
                  type: string
                  author: author
                  type: string
                  author_id: author_id
                  type: string
                  tags: tags_json
                  type: string
            404:
                description: No entries for user found!
        """
        conn = sqlite3.connect('data.db')
        conn.row_factory = sqlite3.Row
        c = conn.cursor()
        entry = EntryModel.find_all_entries_from_user(get_jwt_identity())
        c.execute("select * from entries where id="+ id)
        rows = c.fetchall(); 
        conn.commit()
        conn.close()
        rowarray_list = []
        for row in rows:
            print(row)
            d = dict(zip(row.keys(), row))   # a dict with column names as keys
            rowarray_list.append(d)

        if rows:
            return rowarray_list

        return {
                   "message": "No entries for user found!"
               }, 404

class ChangeEntry(Resource):
    @fresh_jwt_required
    def put(self):
        """
        Change an entry
        ---
        tags:
            - Entry API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
            - name: id
              in: body
              type: string
              required: true
              description: the id of the entry that you want to change
            - name: title
              in: body
              type: string
              required: true
              description: the title of the entry
            - name: text
              in: body
              type: string
              required: true
              description: the text of the entry
            - name: tags
              in: body
              type: array
              required: true
              description: the tags for a entry
        responses:
            200:
                description: Entry changed!
            404:
                description: Entry not found!
            403:
                description: You are not allowed to change the entry! Only the Author can change it
        """
        data = _entry_parser.parse_args()

        entry = EntryModel.find_entry_by_id(data["id"])

        if entry:
            if UserModel.find_user_by_id(get_jwt_identity()) is not UserModel.find_user_by_username(entry.json()["author"]):
                return {
                        "message": "You are not allowed to change the entry!"
                    }, 403
            else:
                tags_to_db = ""
                counter = 0
                for i in data['tags']:
                    counter += 1
                    tags_to_db += str(i) 
                    if counter == len(data['tags']):
                        pass
                    else:
                        tags_to_db += ";"
                data["tags"] = tags_to_db
                entry.title = data["title"]
                entry.text = data["text"]
                entry.date = str(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
                entry.tags = tags_to_db
                entry.save_to_db()
                
                return {
                        "message": "Entry changed!"
                    }, 200
        return {
                   "message": "Entry not found!"
               }, 404
