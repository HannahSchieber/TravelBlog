from flask_restful import Resource, reqparse, request
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_refresh_token_required, get_jwt_identity, fresh_jwt_required
import sqlite3
from models.models import UserModel
import json


_user_parser = reqparse.RequestParser()
_user_parser.add_argument(
    "username",
    type=str,
    required=True,
    help="This field cannot be blank"
)
_user_parser.add_argument(
    "password",
    type=str,
    required=True,
    help="This field cannot be blank"
)
_user_parser.add_argument(
    "email",
    type=str,
    required=False,
    help="This field cannot be blank"
)
_user_parser.add_argument(
    "phonenumber",
    type=str,
    required=False,
    help="This field cannot be blank"
)


class User(Resource):
    @fresh_jwt_required
    def get(self):
        """
        Get user infos
        ---
        tags:
            - User API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
        responses:
            200:
                description: Returns all profile infos about the user
                schema:
                    id: user_respone
                    properties:
                        id:
                            type: string
                            description: The id of the user
                        username:
                            type: string
                            description: The username of the user
                        email:
                            type: string
                            description: The email of the user
                        phonenumber:
                            type: string
                            description: The given phonenumber
            404:
                description: Error user not found.
        """
        user = UserModel.find_user_by_id(get_jwt_identity())
        if user:
            return user.json()

        return {
                   "message": "User not found!"
               }, 404

    @fresh_jwt_required
    def delete(self):
        """
        Delete a user
        ---
        tags:
            - User API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
        responses:
            200:
                description: user sucessfully deleted
                schema:
                    id: user_delete_response
                    properties:
                        message:
                            type: string
                            description: User deleted!
            404:
                description: Error user not found.
        """
        user = UserModel.find_user_by_id(get_jwt_identity())
        if user:
            user.remove_from_db()
            return {
                       "message": "User deleted!"
                   }, 200

        return {
                   "message": "User not found!"
               }, 404

class ChangeUserPw(Resource):
    @fresh_jwt_required
    def post(self):
        """
        Change the user password
        ---
        tags:
            - User API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
            - name: newpw
              in: body
              type: string
              required: true
              description: the new password for the user
        responses:
            200:
                description: Password successfully changed.
            500:
                description: Error user not found.
        """
        user = UserModel.find_user_by_id(get_jwt_identity())
        data = request.get_json()
        print(data)
        if not data['newpw']:
            return {
                    "message": "No password provided"
                }, 500

        if user:
            user.password = data['newpw']
            user.save_to_db()
            return {
                    "message": "Password successfully changed"
                }, 200




class UserRegister(Resource):
    def post(self):
        """
        Register a new user
        ---
        tags:
            - User API
        parameters:
            - name: username
              in: body
              type: string
              required: true
              description: the username
            - name: password
              in: body
              type: string
              required: true
              description: the password
            - name: email
              in: body
              type: string
              required: true
              description: the email adress
            - name: phonenumber
              in: body
              type: string
              required: true
              description: the phonenumber of the new user 
        responses:
            200:
                description: user sucessfully registered
                schema:
                    id: RegisterResponse
                    properties:
                        message:
                            type: string
                            description: user successful created
            400:
                description: the user already exists or not all required data provided
                schema:
                    id: RegisterResponse
                    properties:
                        message:
                            type: string
                            description: user exists or not all data provided
        """
        data = _user_parser.parse_args()

        if UserModel.find_user_by_username(data["username"]):
            return {
                       "message": "User exists!"
                   }, 400
        if not data["username"] or not data["password"] or not data["email"] or not data["phonenumber"]:
                        return {
                       "message": "Not all required data provided!"
                   }, 400
        user = UserModel(data["username"], data["password"], data["email"], data["phonenumber"])
        user.save_to_db()
        return {
            "message": "User {} created!".format(data["username"])
        }


class UserLogin(Resource):
    def post(self):
        """
        Login as a user
        ---
        tags:
            - User API
        parameters:
            - name: username
              in: body
              type: string
              required: true
              description: the username
            - name: password
              in: body
              type: string
              required: true
              description: the password 
        responses:
            200:
                description: user sucessfully logged in
                schema:
                    id: TokenRefresh
                    properties:
                        accessToken:
                            type: string
                            description: new token for the current user
                        id:
                            type: string
                            description: id of the logged in user
            401:
                description: the credentials are invalid
                schema:
                    id: LoginResponse
                    properties:
                        message:
                            type: string
                            description: Invalid credentials
        """
        data = _user_parser.parse_args()

        user = UserModel.find_user_by_username(data["username"])

        if user and user.password == data["password"]:
            access_token = create_access_token(identity=user.id, fresh=True)  # Puts User ID as Identity in JWT

            return {
                       "accessToken": access_token,
                       "id": str(user.id)
                   }, 200

        return {
                   "message": "Invalid credentials!"
               }, 401


class TokenRefresh(Resource):
    @fresh_jwt_required
    def get(self):
        """
        Refresh the current JWT
        ---
        tags:
            - User API
        parameters:
            - name: JWT Token
              in: header
              type: string
              required: true
              description: The JWT Token with format "Authorization Bearer <JWT Token>"
        responses:
            200:
                description: user sucessfully deleted
                schema:
                    id: TokenRefresh
                    properties:
                        accessToken:
                            type: string
                            description: new token for the current user
        """
        current_user_id = get_jwt_identity()  # Gets Identity from JWT
        new_token = create_access_token(identity=current_user_id, fresh=True)
        return {
                   "accessToken": new_token
               }, 200