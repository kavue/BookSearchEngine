# Book Search Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<img src="./client/src/assets/BSE-image.png">

## Description
The Book Search Engine is a full-stack application where users can create an account, log in, and save books they find interesting. The app utilizes GraphQL for the backend API and MongoDB with Mongoose for data storage. The frontend communicates with the backend using Apollo Client.

## Features:
- User Authentication: Users can sign up and log in to the platform.
- Save Books: Users can save books they find by searching, which are stored in their profile.
- Delete Books: Users can remove books from their saved list.

## Technologies:
Backend: 
- Express.js
- Apollo Server (GraphQL)
- JWT Authentication
- MongoDB / Mongoose

## Frontend: 
- React.js
- Apollo Client

## Other Libraries:
- dotenv (for managing environment variables)
- bcryptjs (for password hashing)
- jsonwebtoken (for generating JWT tokens)
- GraphQL

## Requirements:
To run the project locally, make sure you have the following installed:
- Node.js
- MongoDB
- Apollo Client 
- Apollo Server 
- Express 

## Getting Started:
1. Clone the repository:
    ``` bash
    git clone <repository-url>
    cd <project-folder>
    ```
2. Install the dependencies for both the frontend and backend:
    ```bash
    npm install
    ```
3. Create a .env file in the root of the project and define the following environment variables:
    ```bash
    JWT_SECRET_KEY=your_jwt_secret_key_here
    MONGO_URI=your_mongo_database_uri_here
    ```
4. Start the development server:
    ```bash
    npm run develop
    ```
    This will start both the frontend and backend.

## GraphQL Schema:

### Query:
- me: Returns the current logged-in user’s details (username, email, saved books).

### Mutation:
- createUser: Accepts username, email, and password, and returns a token and user details.
- login: Accepts email or username and password, and returns a token and user details.
- saveBook: Accepts bookData (which includes bookId, title, authors, description, image, link), and saves the book to the logged-in user’s profile.
- deleteBook: Accepts bookId, and removes the corresponding book from the logged-in user’s profile.

### Types:
- User:
  - _id: ID of the user
  - username: User's name
  - email: User's email
  - savedBooks: List of books the user has saved

- Book:
  - bookId: Book’s ID from Google Books API
  - title: Title of the book
  - authors: Array of authors of the book
  - description: Book description
  - image: Image link for the book cover
  - link: Link to the book on Google Books

- Auth:
  - token: JWT token for authentication
  - user: User object

## Deployment
This application is deployed on Render. Visit the live application at:
https://booksearchengine-ft1b.onrender.com

## License

This project is licensed under the MIT License.
