Clone the repository using:-

git clone https://<>@bitbucket.org/m4vr1ck/spm.git

Go to the directory where the repository where the code is cloned.

Set process environment variable before proceeding:- WINDOWS:- 

set JWT_KEY=omegathanos

set EMAIL_ID="<>"

set EMAIL_PASSWORD = "<>"

set EMAIL_PROVIDER = "<>"

set SPM_PORT=12002

set SPM_MONGODB_URL=mongodb://localhost:27017/bpm

set PROXY_URL=http://localhost:12000

set UAM_URL=http://localhost:12001

Once the variable is set, the server can be then started using either node app.js or nodemon app.js
