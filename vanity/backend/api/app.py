from flask import Flask
from flask_cors import CORS
from userAuth import userAuth_bp
from friends import friends_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(userAuth_bp)
app.register_blueprint(friends_bp)

if __name__ == '__main__':
    app.run(port=8000,debug=True)