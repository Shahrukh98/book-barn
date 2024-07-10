# BookBarn

A Nest.js Project made for creating a book repository.

## Features
  You can act as two types of users:
  - Admin
  - User

  Admin can do following things:
  - Create Books
  - Update Books
  - Get List of Books
  - Get a Book by its Id
  - Delete Books
  - Approve Borrow Request
  - Reject Borrow Request

  User can do following:
  - Get List of Books
  - Get a Book by its Id
  - Make a borrow request for a book
  - Return a book that they have borrowed


## Getting Started
Prerequisites:

- Node.js (https://nodejs.org/en)
- npm (https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager) (or yarn)
- Postgres Database (https://www.postgresql.org/)

Note: Create the .env for your project using the .env.example.

## Installation:

```bash
git clone https://github.com/Shahrukh98/book-barn.git
cd book-barn
npm install  # or yarn
```

## Running the app
Clone the repository, install the required packages and run the command below:

### Locally on your machine
Use the development mode for running the code locally and use the provided postman collection for guidance. 

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
Make sure you have .env with all the given variables in the .env.example.

### Containerized App
To run this app in the container, make sure you have docker-compose installed on your machine

To build the containers for the app, run the following command:

```
docker-compose build
```
To run the container, use the following command (-d flag runs the containers in background. You can see log from docker desktop):

```
docker-compose up -d
```

On running succesfully, this will create two containers, one being the Postgres Database container while the other being the Nestjs app. The Nestjs app is exposed to the host port 3000.

Make sure you have .env with all the given variables in the .env.example. Since, the database is a fellow container, the <code>DATABSE_HOST</code> and <code>DATABSE_PORT</code> are fed into the <code>docker-compose.yml</code>, so those variables in .env will be ignored in case of containerized running.

## Auth
To use the app, you need to be user of the app. So using the Auth Endpoints, become a user or admin.

## API Endpoints

This application exposes several RESTful API endpoints for interacting with its functionalities. You can explore the [postman collection](https://app.getpostman.com/join-team?invite_code=70a520ffa4092476a5d5dbb0481e5882&target_code=9a0a9293a7bfd95e9babd577f2afc9da) here and use it 
Here's a summary of the key endpoints:

### Auth Endpoints

| Endpoint        | Method | Description      |
| --------------- | ------ | ---------------- |
| /auth/register  |  POST  | Registers a user |
| /auth/login     |  POST  | Logins a user    |

The rest of the routes are protected and can only be accessed when a bearer token is added to the Authorization Header of the request.

### Protected Endpoints

All of the endpoints for the book resource are protected. Some are reserved for only users, while some are reserved for admin. Listing the books, together or individually is allowed for both user and admin.

| Endpoint                   | Method | Description                     | Allowed To  |
| -------------------------- | ------ | ------------------------------- | ----------- |
| /books                     |  GET   | Gets all the books              | User, Admin |
| /books/:id                 |  GET   | Gets a book of given id         | User, Admin |
| /books                     |  POST  | Creates a new book              | Admin       |
| /books/:id                 |  PUT   | Updates the book of given id    | Admin       |
| /books/:id                 | DELETE | Deletes the book of given id    | Admin       |
| /books/borrow/:id          |  POST  | Creates borrow request for book | User        |
| /books/return/:id          |  POST  | Returns the book                | User        |
| /books/approve/:requestId  |  POST  | Creates borrow request for book | Admin       |
| /books/reject/:requestId   |  POST  | Returns the book                | Admin       |


