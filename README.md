# 17Sqn Lesson Plan Database

Project using `npm`, `Node.js`, `Vue.js` and `Vuetify`

## Synopsis

The purpose of this website is to assist with the allocation of lessons within 17 SQN.
Officers are able to add, edit and delete new IGs (known as "Lessons"), and they are able to allocate Lessons to
"Instructors" (NCOs and other officers) who have signed up. Instructors will be notified via slack when they are
allocated lessons. They will then be able to submit their lesson plan and any other resources for approval and officers
will be able to provide feedback.

## Contributors
- Swapnil Bhagat
- William Chen
- Raven Townsend


## Basic Project Structure

A frontend sub-project (web GUI):

- `frontend/src` Frontend source code (Vue.js)
- `frontend/public` publicly accessible web assets (e.g., icons, images, style sheets)

A backend sub-project (business logic and persistence server):

- `backend/app` Backend source code (Node.js)
- `backend/config` Backend configuration files (Node.js)
- `backend/slack` Backend setup for sending slack messages (Node.js)
- `backend/storage` Backend folder to save submitted files (.pdf, .doc, .docx, .ppt, .pptx)


## How to run

### Frontend / GUI

Setup .env with the following variables:

    VUE_APP_SERVER_ADD
    VUE_APP_SLACK_TOKEN
    VUE_APP_DGAA_EMAIL
    VUE_APP_LESSON_PLAN_DUE

Then type these commands:

    cd frontend
    npm install
    npm run serve

Running on: http://localhost:8080/ by default

### Backend / server

Setup .env with the following variables:

    MARIADB_HOST
    MARIADB_USER
    MARIADB_PASS
    MARIADB_DATABASE
    MARIADB_PORT
    DGAA_EMAIL
    DGAA_PASS
    LESSON_PLAN_DUE
    UPCOMING_LESSON_DAYS
    SLACK_TOKEN
    EMAILJS_SERVICE_ID
    EMAILJS_RESET_TEMPLATE
    EMAILJS_USER_ID
    EMAILJS_TOKEN
    FRONTEND_URL
    MORGAN_INTERVAL=1d
    MAX_LOG_COUNT=30
    LOGGER_INTERVAL_PATTERN=yyyy-MM-dd


Then type these commands:

    cd backend
    npm install
    npm run dev

Running on: http://localhost:4641/ by default
