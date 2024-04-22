from flask import request, Blueprint
from conn import db, sql_cursor
from flask import jsonify
from datetime import datetime

bagItems_bp = Blueprint('bagItems', __name__)

@bagItems_bp.route('/create-bag-item', methods=['POST'])
def create_bag_item():
    body = request.json

    if not body:
        return jsonify({"error": "No data provided"}), 400
    
    try:
        userId: str = body['userId']
        productId: str = body['productId']
    except KeyError as e:
        return jsonify({"error": f"Missing key in JSON request: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Error parsing request: {str(e)}"}), 400
    
    try:
        cursor = sql_cursor()
        query = """INSERT INTO BagItems (UserId, ProductId, DateAdded)
                    VALUES (%s, %s, %s);"""
        current_date_time = datetime.now()
        formatted_date = current_date_time.strftime('%Y-%m-%d')
        data = (userId, productId, formatted_date)
        cursor.execute(query, data)
        db.commit()
    except Exception as e:
        return jsonify({"error": f"Error inserting record into database: {str(e)}"}), 500
    
    try:
        query = """SELECT * FROM BagItems WHERE UserId = %s AND ProductId = %s;"""
        cursor.execute(query, (userId, productId))
        results = cursor.fetchall()
        if not results:
            return jsonify({"error": f"Error retrieving data after insert: {str(e)}"}), 500
        else:
            return jsonify(results[0]), 200
    except Exception as e:
        return jsonify({"error": f"Error retrieving data after insert: {str(e)}"}), 500

@bagItems_bp.route('/delete-bag-item', methods=['DELETE'])
def delete_bag_item():
    userId = request.args.get('userId')
    productId = request.args.get('productId')

    if not userId or not productId:
        return jsonify({"error": "User ID and Product ID are required parameters"}), 400
    
    try:
        cursor = sql_cursor()
        query = """DELETE FROM BagItems WHERE UserId = %s AND ProductId = %s;"""
        cursor.execute(query, (userId, productId))
        db.commit()

        if cursor.rowcount > 0:
            return jsonify({"message": "Bag item deleted successfully"}), 200
        else:
            return jsonify({"error": "No matching bag item found for deletion"}), 404
    except Exception as e:
        return jsonify({"error": f"Error deleting row from database: {str(e)}"}), 500

