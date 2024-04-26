from flask import Flask
from flask_cors import CORS
from userAuth import userAuth_bp
from friends import friends_bp
from bagItems import bagItems_bp
from reviews import reviews_bp
from recommendations import recommendations_bp
import os

app = Flask(__name__)

CORS(app)
os.environ['PYTHONUNBUFFERED'] = '1'
app.register_blueprint(userAuth_bp)
app.register_blueprint(friends_bp)
app.register_blueprint(bagItems_bp)
app.register_blueprint(reviews_bp)
app.register_blueprint(recommendations_bp)

if __name__ == '__main__':
    app.run(port=8000,debug=True)