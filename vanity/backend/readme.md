# [WIP - In Development] How to run this

Start the MySQL instance on GCP console

Go to the database instance and add your computer's public IP address to the "Authorized networks" (see vanity-sql-1 configuration). You can figure out your public IP address from https://whatismyipaddress.com/. Then add the /32 subnet mask so it looks like `11.11.222.11/32`. This will allow any programs running on your computer (like a flask server) to access the instance, while keeping the instance secure.

This is just for development - when we set up our server instance on GCP we can do the above step with the server instance's IP address

How to run our app:
1. Start the GCP instance
2. In a terminal, `cd vanity/frontend` and then run the command `npm start`. The webpage should open in a browser tab
3. In a new terminal, `cd vanity/backend/api`, then run the command `export FLASK_APP=app.py`, then run the command `python3 -m flask run --port=8000`
