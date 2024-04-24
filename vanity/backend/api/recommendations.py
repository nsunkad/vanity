from flask import request, Blueprint
from conn import sql_cursor
from flask import jsonify

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/generate-product-recommendations', methods=['GET'])
def generate_product_recommendations():
    productId = request.args.get('q')

    if not productId:
        return jsonify({"error": "No product ID provided"}), 400
    
    try:
        cursor = sql_cursor()
        query = """SELECT DISTINCT pt1.ProductId, count(pt1.TagId) AS countMatchingTags
                    FROM ProductTags pt1 JOIN ProductTags pt2 ON pt1.TagId = pt2.TagId
                    WHERE pt2.ProductId = %s AND pt1.ProductId <> %s
                    GROUP BY pt1.ProductId ORDER BY countMatchingTags DESC LIMIT 10;"""
        cursor.execute(query, (productId, productId))
        rows = cursor.fetchall()
        results = [row[0] for row in rows]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Error generating product recommendations: {str(e)}"}), 500