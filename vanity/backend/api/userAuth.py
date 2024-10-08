from flask import Blueprint, request
from conn import db, sql_cursor
from flask import jsonify
import bcrypt

userAuth_bp = Blueprint('userAuth', __name__)
    
"""
Login endpoint

Request format (with JSON body):
GET /login HTTP/1.1
Content-Type: application/json
{
    "username": "nsunkad",
    "password": "my_password"
}
The backend will generate a unique UserId for each user upon registration
"""
@userAuth_bp.route('/login', methods=['POST'])
def login():
    body = request.json
    if not body:
        return jsonify({"error": "No data provided"}), 400
    try:
        username: str = body['username']
        password: str = body['password']
    except Exception as e:
       return jsonify({"error": f"Error parsing request: {str(e)}"}), 400 
    
    # Check if username is in the database
    cursor = sql_cursor()
    username_query = "SELECT * FROM Users WHERE UserName = %s"
    cursor.execute(username_query, (username,))
    results = cursor.fetchall()

    if not results:
        return jsonify({"error": f"Username does not exist"}), 404
    userId, userName, result_password, firstName, lastName, email = results[0]
    if bcrypt.checkpw(password.encode('utf-8'), result_password.encode('utf-8')):
        user_info = {
            "userId": userId,
            "userName": userName,
            "firstName": firstName,
            "lastName": lastName,
            "email": email
        }
        return jsonify(user_info), 200
    else:
        return jsonify({"error": f"Incorrect password"}), 401

"""
Register endpoint

Request format (with JSON body):
POST /register HTTP/1.1
Content-Type: application/json
{
    "username": "nsunkad",
    "password": "my_password",
    "firstname": "Nitya",
    "lastname": "Sunkad",
    "email" : "nsunkad@email.com"
}
The backend will generate a unique UserId for each user upon registration
"""

@userAuth_bp.route('/register', methods=['POST'])
def register():
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
    
    
    # Hash the password
    hashed_password = hash_password(password)
    
     # Check to see if username already taken
    try:
        cursor = sql_cursor()
        username_query = "SELECT * FROM Users WHERE UserName = %s"
        cursor.execute(username_query, (username,))
        results = cursor.fetchall()
        if results:
            return jsonify({"error": "This username is taken. Please choose another username"}), 400
    except Exception as e:
        return jsonify({"error": f"Error processing request: {str(e)}"}), 400
    
    
    # Check to see if account with email already exists
    try:
        cursor = sql_cursor()
        email_query = "SELECT * FROM Users WHERE Email = %s"
        cursor.execute(email_query, (email,))
        results = cursor.fetchall()
        if results:
            return jsonify({"error": "An account with this email already exists"}), 400
    except Exception as e:
        return jsonify({"error": f"Error processing request: {str(e)}"}), 400
        
    # Insert record into Users table
    try:
        cursor = sql_cursor()
        query = """INSERT INTO 
                    Users (UserId, Username, Password, FirstName, LastName, Email) 
                    VALUES (%s, %s, %s, %s, %s, %s);"""
        data = (userId, username, hashed_password, firstname, lastname, email)
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
            ret = [{"userId": row[0], "userName": row[1], "firstName": row[3], "lastName": row[4], "email": row[5]} for row in results]
            return jsonify(ret[0]), 200
        else:
            return jsonify({"error": "User not found after insert"}), 404
    except Exception as e:
        return jsonify({"error": f"Error retrieving user after insert: {str(e)}"}), 500
    
"""
Delete user endpoint

Request format (with JSON body):
DELETE /delete-account HTTP/1.1
Content-Type: application/json
{
    "userId": "nsunkad"
}
"""
@userAuth_bp.route('/delete-account', methods=['DELETE'])
def delete():
    body = request.json
    if not body:
        return jsonify({"error": "No data provided"}), 400
    try:
        userId: int = body['userId']
    except Exception as e:
       return jsonify({"error": f"Error parsing request: {str(e)}"}), 400
    
    # Delete record from table
    try:
        cursor = sql_cursor()
        delete_query = "DELETE FROM Users WHERE UserId = %s;"
        cursor.execute(delete_query, (userId,))
        db.commit()
        return jsonify({"success": f"Successfully deleted account"}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to delete account: {str(e)}"}), 404

"""
Update user info endpoint

Request format (with JSON body):
PUT /update-account HTTP/1.1
Content-Type: application/json
{
    "userId": 21,
    "username": "nsunkad",
    "password": "newpass",
    "firstname": "Nitya",
    "lastname": "Sunkad",
    "email" : "newemail@email.com"
}
"""
@userAuth_bp.route('/update-account', methods=['PUT'])
def update():
    body = request.json
    if not body:
        return jsonify({"error": "No data provided"}), 400
    try:
        userId: int = body['userid']
        username: str = body['username']
        firstname: str =  body['firstname']
        lastname: str =  body['lastname']
        email: str = body['email']
    except Exception as e:
       return jsonify({"error": f"Error parsing request: {str(e)}"}), 400
    
    # If the user wants to update the username, check if the new username is taken
    try:
        cursor = sql_cursor()
        username_query = "SELECT UserId FROM Users WHERE UserName = %s"
        cursor.execute(username_query, (username,))
        results = cursor.fetchall()
        
        # if the userId in the database for the given username is not the current user's userId, then it is already taken
        if results:
            if results[0][0] != userId:
                return jsonify({"error": "This username is taken. Please choose another username"}), 400
        
        update_query = """UPDATE Users
                          SET UserName = %s,
                              FirstName = %s,
                              LastName = %s,
                              Email = %s
                          WHERE UserId = %s"""
        cursor.execute(update_query, (username, firstname, lastname, email, userId))
        db.commit()
    except:
        return jsonify({"error": f"Failed to delete account"}), 404
# Check to ensure the record was updated correctly
    try:
        verification_query = "SELECT * FROM Users WHERE UserId = %s"
        cursor.execute(verification_query, (userId,))
        results = cursor.fetchall()
        if results:
            ret = [{"userId": row[0], "userName": row[1], "firstName": row[3], "lastName": row[4], "email": row[5]} for row in results]
            return jsonify(ret[0]), 200
        else:
            return jsonify({"error": "User not found after update"}), 404
    except Exception as e:
        return jsonify({"error": f"Error retrieving user after insert: {str(e)}"}), 500


def generate_unique_user_id():
    cursor = sql_cursor()
    query = "SELECT UserId FROM Users"
    cursor.execute(query)
    userId = cursor.fetchone()
    
    # Generate a UserId one greater than the max
    maxUserId = 0
    while userId is not None:
        maxUserId = max(maxUserId, userId[0])
        userId = cursor.fetchone()

    return maxUserId + 1

def hash_password(password):
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password_bytes, salt) 
    return hashed_password