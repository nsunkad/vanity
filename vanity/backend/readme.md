# How to run this

Start the MySQL instance on GCP console

Go to the database instance and add your computer's public IP address to the "Authorized networks" (see vanity-sql-1 configuration). You can figure out your public IP address from https://whatismyipaddress.com/. Then add the /32 subnet mask so it looks like `11.11.222.11/32`. This will allow any programs running on your computer (like a flask server) to access the instance, while keeping the instance secure.

This is just for development - when we set up our server instance on GCP we can do the above step with the server instance's IP address

Dependencies to install:

pip3 install flask
pip3 install mysql
pip3 install mysql-connector

Replace `replace-with-pass` in conn.py with the real password

# Run

`python3 conn.py`