from flask import request, Blueprint
from conn import sql_cursor
from flask import jsonify

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/get-product-reviews', methods=['GET'])
def get_product_reviews():
    product_id = request.args.get('q')

    if not product_id:
        return jsonify({"error": "No search product ID provided"}), 400
    
    try:
        cursor = sql_cursor()
        query = """SELECT * FROM Reviews WHERE ProductId = %s;"""
        cursor.execute(query, (product_id,))
        rows = cursor.fetchall()
        results = [{"Title": row[4], "Text": row[3], "Rating": row[1], "Date": row[2]} for row in rows]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Error querying database: {str(e)}"}), 500
