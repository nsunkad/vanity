from flask import Flask, request
from conn import sql_cursor
from flask_cors import CORS
from flask import jsonify

app = Flask(__name__)
CORS(app)

@app.route('/lookup-friends', methods=['GET'])
def lookup_friends():
    search_string = request.args.get('q')

    if not search_string:
        return jsonify({"error": "No search string provided"}), 400
    
    try:
        cursor = sql_cursor()
        query = """SELECT UserName, COUNT(ProductId) AS NumProductsInBag
                    FROM Users LEFT OUTER JOIN BagItems ON Users.UserId = BagItems.UserId
                    GROUP BY (Users.UserId)
                    ORDER BY LEAST(LEVENSHTEIN(UserName, %s), LEVENSHTEIN(FirstName, %s), LEVENSHTEIN(LastName, %s))
                    LIMIT 15;"""
        cursor.execute(query, (search_string, search_string, search_string))
        rows = cursor.fetchall()
        results = [[row[0], row[1]] for row in rows]
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": f"Error querying database: {str(e)}"}), 500