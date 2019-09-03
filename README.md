# TravelBlog

The following angular project is used to demonstrate how angular interacts with a REST API and how Auth Guards and HTTP Interecptors are used in Angular to use Bearer Token Authentication and safety restrictions on Angular modules. A SQL Injection Example is also included which can be tested with sth. like POSTMAN.

# Setup
install node and npm

## Start Backend
``cd backend``
``python3 app.py``

## Start Frontend on Dev otherwise use production build
Mac and Windows: (need to install ng and npm)
`` ng s -o ``
Ubuntu / Linux: 
``npm start `` go to route  `` localhost:4200 ``

## frameworks
### frontend
- angular
- bootstrap
- fontawesome for icons ``https://fontawesome.com``
### backend
- flask
- swagger:
- JWTManager

# SQL Injection

Login on
http://127.0.0.1:5000/login

with body:
`` {
"username": "test",
"password": "test"
}``

use access token from response
to authenticate then send
http://localhost:5000/getallentriesfromuser/1 UNION ALL SELECT *, NULL, NULL FROM users
