from flask import request, Blueprint
from conn import sql_cursor
from flask import jsonify

friends_bp = Blueprint('friends', __name__)

@friends_bp.route('/lookup-friends', methods=['GET'])
def lookup_friends():
    search_string = request.args.get('search')
    self_username = request.args.get('self')

    if not search_string or not self_username:
        return jsonify({"error": "Self username and search string required"}), 400
    
    try:
        cursor = sql_cursor()
        cursor.callproc('LookupFriendsSP', [self_username, search_string])
        for result in cursor.stored_results():
            rows = result.fetchall()
            results = [{"UserName": row[0], "NumProductsInBag": row[1], "Similarity Rating": row[2]} for row in rows]
            return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Error retrieving friends: {str(e)}"}), 500
