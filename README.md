# EcoSG_FSDP

To begin running the website:
1. Open 2 terminals
2. cd 1 terminal to /server
3. cd the other terminal to /client
4. run 'npm install' in both terminals
5. create a file named '.env' into server folder
6. place this code into .env file:

APP_PORT = 3001
CLIENT_URL = "http://localhost:3000"
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "learning"
DB_PWD = "mysql"
DB_NAME = "learning"
APP_SECRET = "013720de-bd04-40b2-9a8c-ca625c831265"
TOKEN_EXPIRES_IN = "30d"

4. type 'npm start' on both terminals
5. go to http://localhost:3000

6. (Optional) If your current DB is not empty before loading the website, 
use mysql workbench and
- off safe update mode 
edit > preferences > SQL Editor > Safe Updates
- type this and execute:
USE learning;
DELETE FROM tutorials;