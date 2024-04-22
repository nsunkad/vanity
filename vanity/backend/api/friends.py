from flask import request, Blueprint
from conn import sql_cursor
from flask import jsonify

friends_bp = Blueprint('friends', __name__)

@friends_bp.route('/lookup-friends', methods=['GET'])
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
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Error querying database: {str(e)}"}), 500
