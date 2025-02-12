# HealthNet Major Project

## Overview
HealthNet 

## Table of Contents
- [Frontend](#frontend)
  - [Technologies](#technologies)
  - [Setup](#setup)
  - [Available Scripts](#available-scripts)
- [Backend](#backend)
  - [Technologies](#technologies-1)
  - [Setup](#setup-1)
  - [Environment Variables](#environment-variables)
    - [Available Scripts](#available-scripts-1)

  ## Frontend

  ### Technologies
  - React
  - Redux
  - Firebase
  - CSS

  ### Setup
  1. Navigate to the frontend directory:
     ```sh
     cd frontend
     ```

  2. Install dependencies:
     ```sh
     npm install
     ```

  3. Start the development server:
     ```sh
     npm start
     ```

  ## Backend

  ### Technologies
  - Node.js
  - Express
  - MongoDB
  - JWT

  ### Setup
  1. Navigate to the backend directory:
     ```sh
     cd backend
     ```

  2. Install dependencies:
     ```sh
     npm install
     ```

  3. Start the development server:
     ```sh
     npm start
     ```

  ## Environment Variables
  Create a `.env` file in the backend directory and add the following variables:

  ```env
  ACCESS_SECRET=your_access_secret
  REFRESH_SECRET=your_refresh_secret
  MONGO_URI=your_mongo_uri

  USER_NAME=your_username
  PASSWORD=your_password

  # Firebase Credentials
  FIREBASE_API_KEY=your_firebase_api_key
  FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
  FIREBASE_PROJECT_ID=your_firebase_project_id
  FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
  FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
  FIREBASE_APP_ID=your_firebase_app_id
  ```
## Frontend Environment Variables
Create a `.env` file in the frontend directory and add the following variable for Google Maps API:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
  ## Available Scripts
  ### Frontend
  - `npm start`: Starts the development server.
  - `npm test`: Runs the test suite.

  ### Backend
  - `npm start`: Starts the development server.
  - `npm test`: Runs the test suite.

  ## License
  This project is licensed under the MIT License.
