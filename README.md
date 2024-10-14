# Northcoders News API

Project Setup
Local Development Setup
To run this project locally, you will need to set up two environment variable files: .env.development and .env.test. These files will help configure the databases used in the project.

Steps to Set Up Environment Variables:
1. Create .env.development file:

This file should be in the root directory of your project.
Add the following line with the appropriate database name for your development environment:
"PGDATABASE=database_name_here"

2. Create .env.test file:

Similarly, create this file in the root directory.
Add the following line with the correct database name for the testing environment:
"PGDATABASE=database_name_here_test"

3. Ensure .env files are git-ignored:

These .env files contain sensitive data and must not be committed to version control.
The .env.* files are already included in the .gitignore to prevent accidental pushes.

Running the Project Locally:
Once you've set up the environment variables:

Run npm install to install the necessary dependencies.
Set up the databases using the provided SQL file (/db/setup.sql) and seed them if needed.
You can now run your development environment or tests as specified in the package.json scripts.


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
