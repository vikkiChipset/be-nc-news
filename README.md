# Hello Everyone!


Welcome to my first backend project, and I'm excited to share it with you.

## Hosted Version

You can explore the API at:
https://be-nc-news-hh3y.onrender.com/api

## Project Summary

The ****VikkiChipset’s Backend Project**** is a RESTful API built using Node.js, Express, and PostgreSQL. It simulates the backend of a news web application, where users can interact with articles, comments, topics, and users. This project was developed as part of a software development bootcamp to demonstrate skills in backend development, database management, and API design.

## Key Features
* Retrieve articles, comments, topics, and users.
* Post new comments on articles.
* Patch articles to update votes.
* Delete comments.
* Sort and filter articles by various criteria.

## Getting Started
1. Cloning the Repository
To clone the repository to your local machine, use the following command:
```
git clone https://github.com/vikkiChipset/be-nc-news.git
```
Navigate into the project folder:
```
cd be-nc-news
```
2. Install Dependencies
Install the required dependencies with:
```
npm install
```
This will install all necessary packages from the package.json file.

3. Environment Variables Setup
To set up the development environment, create two .env files in the root directory:
* .env.development
* .env.test

**.env.development**

Add the following line for your development database:
PGDATABASE=your_development_db_name

**.env.test**

Add the following line for your test database:
PGDATABASE=your_test_db_name

***Note: Replace your_development_db_name and your_test_db_name with the actual names of your PostgreSQL databases.***

4. Database Setup

To set up the databases, use the SQL setup file located in the /db folder.

* Run the following script to set up the databases:
```
npm run setup-dbs
```
* Seed the development database with initial data:
```
npm run seed
```

5. Running Tests
To run the test suite using Jest and Supertest, run:
```
npm test
```
6. Running the Server Locally

To run the API server locally in development mode, use:
```
node listen.js
```

This will start the server on the default port (9090). You can now access the API at http://localhost:9090/api.

## Minimum Requirements

Ensure you have the following minimum versions installed:
* Node.js: v18.0.0 or higher
* PostgreSQL: v12.0.0 or higher

## Available Endpoints
**GET /api/topics**
* Retrieves a list of topics.

**GET /api**
* Retrieves with a list of available endpoints

**GET /api/articles/**
* Retrieves a single article by article_id.

**GET /api/articles/:article_id**
* Retrieves with a single article by article_id

**GET /api/articles**
* Retrieves with a list of articles
  
**GET /api/articles/:article_id/comments**
* Retrieves with a list of comments by article_id

**POST /api/articles/:article_id/comments**
* Adds a new comment to the specified article.

**PATCH /api/articles/:article_id**
* Updates an article by article_id

**DELETE /api/comments/:comment_id**
* Deletes a comment by comment_id.

**GET /api/users**
* Retrieves a list of users.


## Technologies Used
* Node.js: JavaScript runtime for server-side development.
* Express.js: Web framework for Node.js.
* PostgreSQL: Relational database for storing and querying data.
* Jest & Supertest: Testing frameworks for unit and integration tests.
* Node-postgres (pg): PostgreSQL client for interacting with the database.

