# Team097-MojoDojoDB
CS 411 team project — a full-stack web application built with React, Python/Flask, and MySQL. Data source: https://www.kaggle.com/datasets/nadyinky/sephora-products-and-skincare-reviews

Vanity is an informative, data-driven social media service for beauty and skincare product users. 

As a product discovery tool, Vanity enables users to search for and explore new products, view information about those products, and read product reviews written by real customers. Users can add their favorite products to their bag, and based on the product the user is browsing, Vanity also generates helpful product recommendations for the user.

As a social media service, Vanity also allows users to search for friends on the app, view their friends’ makeup bags, and learn about the products their friends are using.


How to run our app:
1. Start the GCP instance
2. In a terminal, `cd vanity/frontend` and then run the command `npm start`. The webpage should open in a browser tab
3. In a new terminal, `cd vanity/backend/api`, then run the command `export FLASK_APP=app.py`, then run the command `python3 -m flask run --port=8000`

