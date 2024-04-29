from flask import request, Blueprint
from conn import sql_cursor
from flask import jsonify

products_bp = Blueprint('products', __name__)


"""
Get Product Info endpoint

Request format (with JSON body):
GET /product-info HTTP/1.1
Content-Type: application/json
{
    "productId": "P164932"
}
Returns: JSON object (examples below)
"""

@products_bp.route('/product-info', methods=['GET'])
def get_product_info():
    
    body = request.json
    if not body:
        return jsonify({"error": "No data provided"}), 400
    try:
        productId: str = body['productId']
        print(productId)
    except Exception as e:
       return jsonify({"error": f"Error parsing request: {str(e)}"}), 400 
   
    # Get all the stats for a ProductId
    cursor = sql_cursor()
    
    query = """SELECT Pro.ProductId, Pro.ProductName, Pro.Size, Pro.Price, Pro.LikeCount, B.BrandName, Res.AvgRating, Res.TotalNumReviews
               FROM Products Pro LEFT OUTER JOIN 
                    Brands B ON B.BrandId = Pro.BrandId
                    LEFT OUTER JOIN
                    (
                        SELECT ProductId, AVG(Rating) as AvgRating, COUNT(*) as TotalNumReviews
                        FROM Reviews
                        WHERE ProductId = %s
                    ) AS Res
               ON Res.ProductId = Pro.ProductId
               WHERE Pro.ProductId = %s
            """
    cursor.execute(query, (productId, productId))
    results = cursor.fetchone()
    
    productId = results[0]
    productName = results[1]
    productURL = f"sephora.com/{productId}"
    size = results[2]
    price = results[3]
    likeCount = results[4]
    brandName = results[5]
    isPopular = False
    avgRating = float(results[6])
    totalNumReviews = results[7]
    reviewStringToDisplay = f"{avgRating}/5 avg rating (from {totalNumReviews} reviews)"
    
    
    popular_products_adv_query = """
                                    (SELECT Pro.ProductName, B.BrandName, Subquery.TimesBagged  
                                    FROM (SELECT Bag.ProductId, COUNT(Bag.ProductId) as TimesBagged FROM BagItems Bag GROUP BY Bag.ProductId) Subquery 
                                    LEFT OUTER JOIN Products Pro ON Pro.ProductId = Subquery.ProductId 
                                    LEFT OUTER JOIN Brands B ON B.BrandId = Pro.BrandId
                                    WHERE (Subquery.TimesBagged >= 0.8 * (SELECT MAX(Subquery2.TimesBagged) 
                                    FROM (SELECT Bag.ProductId, COUNT(Bag.ProductId) as TimesBagged 
                                    FROM BagItems Bag 
                                    GROUP BY Bag.ProductId) Subquery2)))"""
                                    
    cursor.execute(popular_products_adv_query)
    results = cursor.fetchall()
    
    for row in results:
        if row[0] == productName:
            isPopular = True

    
    return jsonify({"productId": productId, 
                    "productName": productName,
                    "productURL": productURL,
                    "size": size,
                    "price": price, 
                    "likeCount": likeCount, 
                    "brandName": brandName, 
                    "isPopular": isPopular,
                    "avgRating": avgRating, 
                    "totalNumReviews": totalNumReviews,
                    "reviewStringToDisplay": reviewStringToDisplay}), 200

"""
Returned JSON Example 1
{
    "productId": "P164932",
    "productName": "Minted Rose Lip Balm",
    "productURL": "sephora.com/P164932",
    "size": "0.8 oz",
    "price": 8,
    "likeCount": 34913,
    "brandName": "Rosebud Perfume Co.",
    "isPopular": false,
    "avgRating": 3.9,
    "totalNumReviews": 10,
    "reviewStringToDisplay": "3.9/5 avg rating (from 10 reviews)"
}

Returned JSON Example 2
{
    "productId": "P392235",
    "productName": "The Camellia Oil 2-in-1 Makeup Remover & Cleanser",
    "productURL": "sephora.com/P392235",
    "size": "5 oz/ 150 mL",
    "price": 50,
    "likeCount": 142010,
    "brandName": "Tatcha",
    "isPopular": true,
    "avgRating": 3.9,
    "totalNumReviews": 10,
    "reviewStringToDisplay": "3.9/5 avg rating (from 10 reviews)"
}

"""

@products_bp.route('/lookup-products', methods=['GET'])
def lookup_products():
    search_string = request.args.get('search')

    if not search_string:
        return jsonify({"error": "Search string required"}), 400
    
    try:
        cursor = sql_cursor()
        query = """SELECT ProductName, BrandName
                    FROM Products natural join Brands
                    WHERE MATCH (ProductName) AGAINST (%s WITH QUERY EXPANSION) limit 15;"""
        cursor.execute(query, (search_string,))
        rows = cursor.fetchall()
        results = [{"Name": row[0], "Brand": row[1]} for row in rows]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Error querying database: {str(e)}"}), 500
