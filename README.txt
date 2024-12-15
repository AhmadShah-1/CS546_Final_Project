# Fitness Web Application

## Overview
This project is a fitness tracking tool that currently includes user authentication (sign up and login). Users can register with their username, email, and password. Their data is securely stored in MongoDB with encrypted passwords. Fitness goals will be added in future iterations.

##Procedure for running program for windows
1. Navigate to file in cmd or powershell
2. Enter "npm install"
   - This should download all required dependencies
3. Enter "npm start"
   - web program will automatically open up in browser

## Code Flow
1. **User Authentication:**
   - The app routes `/signup` and `/login` allow users to create accounts and log in.
   - User data is stored in MongoDB, and passwords are hashed using bcrypt.
   - Upon successful login, session data is created for the user.

2. **MongoDB Usage:**
   - The `ObjectId` is used to uniquely identify each user in the database.

3. **Future Directions:**
   - Add features to let users set fitness goals and track their progress.
   - Implement additional pages for tracking and displaying fitness goals.

## Directory Structure
The app follows a modular structure with `routes`, `views`, and `data` directories.

