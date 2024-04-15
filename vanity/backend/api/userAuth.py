from flask import Flask, request
from conn import db, sql_cursor
from flask_cors import CORS
from flask import jsonify

app = Flask(__name__)
CORS(app)

def generate_unique_user_id():
    cursor = sql_cursor()
    query = "SELECT UserId FROM Users"
    cursor.execute(query)
    userId = cursor.fetchone()
    
    # Generate a UserId one greater than the max
    maxUserId = 0
    while userId is not None:
        print(type(userId[0]), userId[0])
        maxUserId = max(maxUserId, userId[0])
        userId = cursor.fetchone()
    
    
    print("idk here oh")
    return maxUserId + 1
     

# @app.route('/login')
# def login():
    
"""
Register endpoint

Request format (with JSON body):
POST /api/register HTTP/1.1
Content-Type: application/json
{
    "username": "nsunkad",
    "password": "hashed_password_from_frontend",
    "firstname": "Nitya"
    "lastname": "Sunkad"
    "email" : "nsunkad@email.com"
}
The backend will generate a unique UserId for each user upon registration
"""

@app.route('/register', methods=['POST'])
def register():
    print("did we even get here")
    # Parse request body (type checking to ensure correct type before table insert)
    body = request.json
    if not body:
        return jsonify({"error": "No data provided"}), 400
    try:
        userId: int = generate_unique_user_id()
        username: str = body['username']
        password: str = body['password']
        firstname: str =  body['firstname']
        lastname: str =  body['lastname']
        email: str = body['email']
    except KeyError as e:
        return jsonify({"error": f"Missing key in JSON request: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Error parsing request: {str(e)}"}), 400 
    
    # Insert record into Users table
    try:
        cursor = sql_cursor()
        query = """INSERT INTO 
                    Users (UserId, Username, Password, FirstName, LastName, Email) 
                    VALUES (%s, %s, %s, %s, %s, %s);"""
        data = (userId, username, password, firstname, lastname, email)
        cursor.execute(query, data)
        db.commit()
    except Exception as e:
        return jsonify({"error": f"Error inserting record into database: {str(e)}"}), 500
    

    # Check to ensure the record was inserted correctly
    try:
        verification_query = "SELECT * FROM Users WHERE UserId = %s"
        cursor.execute(verification_query, (userId,))
        results = cursor.fetchall()
        if results:
            return jsonify(results[0]), 200
        else:
            return jsonify({"error": "User not found after insert"}), 404
    except Exception as e:
        return jsonify({"error": f"Error retrieving user after insert: {str(e)}"}), 500
    
    
# temporary dummy endpoint for testing SQL queries
@app.route('/dummy')
def dummy():
    cursor = sql_cursor()
    query = "SELECT * FROM Products WHERE ProductName = 'La Habana Eau de Parfum'"
    cursor.execute(query)
    # Fetch results
    results = cursor.fetchall()
    # Process results
    for row in results:
        return str(row)  # Or do something else with the results
    


if __name__ == '__main__':
    app.run(port=8000,debug=True)