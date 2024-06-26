Instructions

## DATABASE INSTRUCTIONS:
### Connecting to the Database
1. Run Docker container that contains your server, then the PgAdmin Docker container.

2. Go to localhost:5050 and login with your PgAdmin credentials.

### Make sure the following packages are installed (see package.jspon):
`1. Backend`  
cors, express, pg

`2. Frontend`  
vuelidate/core, vuelidate/validators, vue, vuetify

### Running the Frontend
`cd frontend`  
`npm run dev`

If this doesn't work:

If the error mentions "x.pkg" can’t be opened because Apple cannot check it for malicious software, then go to Security & Privacy in System Preferences and manually approve each package. 

If it mentions that it can't find "unplugin-vue-components", then in the frontend folder, run the following command:  

`npm i unplugin-vue-components -D`

### Running the Backend
`cd backend`  
`node app.js`

