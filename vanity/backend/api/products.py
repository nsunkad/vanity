from flask import request, Blueprint
from conn import sql_cursor
from flask import jsonify

products_bp = Blueprint('products', __name__)


"""
Get Product Info endpoint

Request format (with JSON body):
POST /product-info HTTP/1.1
Content-Type: application/json
{
    "productId": "P392235"
}
Returns: JSON object (examples below)
"""

@products_bp.route('/product-info', methods=['GET'])
def get_product_info():
    productId = request.args.get('product_id')
    if not productId:
        return jsonify({"error": "No productId provided"}), 400
   
    try:
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
        usersAlsoBagged = {}
        
        
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
        
        users_also_bagged_adv_query = """
                                        SELECT BI.ProductId AS OtherPID, P.ProductName, AVG(R.Rating) AS AverageRating, COUNT(R.ReviewId) AS NumberOfReviews 
                                        FROM BagItems BI JOIN Products P ON BI.ProductId = P.ProductId 
                                        JOIN 
                                            (SELECT ProductId,MAX(ReviewId) AS LatestReviewId FROM Reviews GROUP BY ProductId) 
                                            AS LatestReview ON BI.ProductId = LatestReview.ProductId 
                                        JOIN Reviews R ON LatestReview.LatestReviewId = R.ReviewId WHERE BI.ProductId != %s AND BI.UserId IN (SELECT UserId 
                                        FROM BagItems WHERE ProductId = %s) GROUP BY BI.ProductId, P.ProductName  ORDER BY BI.ProductId;"""
        
        cursor.execute(users_also_bagged_adv_query, (productId, productId))
        results = cursor.fetchall()
        
        for row in results:
            otherPid = row[0]
            otherProductName = row[1]
            otherAvgRating = float(row[2])
            otherNumReviews = row[3]
            usersAlsoBagged[otherPid] = {"productName": otherProductName, "avgRating": otherAvgRating, "numReviews": otherNumReviews}

        
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
                        "usersAlsoBagged": usersAlsoBagged,
                        "reviewStringToDisplay": reviewStringToDisplay}), 200
    except Exception as e:
        return jsonify({"error": f"Error getting product info: {str(e)}"}), 500

"""
Returned JSON Example 1
{
    "avgRating": 3.9,
    "brandName": "Tatcha",
    "isPopular": true,
    "likeCount": 142010,
    "price": 50,
    "productId": "P392235",
    "productName": "The Camellia Oil 2-in-1 Makeup Remover & Cleanser",
    "productURL": "sephora.com/P392235",
    "reviewStringToDisplay": "3.9/5 avg rating (from 10 reviews)",
    "size": "5 oz/ 150 mL",
    "totalNumReviews": 10,
    "usersAlsoBagged": {
        "P438643": {
            "avgRating": 5.0,
            "numReviews": 1,
            "productName": "The Balance pH Balancing Gel Cleanser"
        },
        "P441644": {
            "avgRating": 2.0,
            "numReviews": 16,
            "productName": "Mini Superfood Antioxidant Cleanser"
        },
        "P465741": {
            "avgRating": 5.0,
            "numReviews": 1,
            "productName": "Wild Huckleberry 8-Acid Polishing Peel Mask"
        },
        "P480278": {
            "avgRating": 4.0,
            "numReviews": 1,
            "productName": "Rapid Radiance Set"
        },
        "P481084": {
            "avgRating": 5.0,
            "numReviews": 16,
            "productName": "Mini Revitalizing Supreme+ Youth Power Creme Moisturizer"
        },
        "P481817": {
            "avgRating": 4.0,
            "numReviews": 1,
            "productName": "Beauty Elixir Prep, Set, Glow Face Mist"
        },
        "P505020": {
            "avgRating": 5.0,
            "numReviews": 1,
            "productName": "The POREfessional Good Cleanup Foaming Cleanser"
        }
    }
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
