from decimal import Decimal
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

        cursor.execute("""SET TRANSACTION ISOLATION LEVEL READ COMMITTED;""")
        cursor.execute("""START TRANSACTION;""")
        
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
        avgRating = float(results[6]) if isinstance(results[6], Decimal) else results[6]
        totalNumReviews = results[7]
        reviewStringToDisplay = f"{avgRating}/5 avg rating (from {totalNumReviews} reviews)"
        usersAlsoBagged = {}
        similarProductRecs = similar_product_recommendations(productId)
        
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
            otherAvgRating = float(row[2]) if isinstance(row[2], Decimal) else row[2]
            otherNumReviews = row[3]
            usersAlsoBagged[otherPid] = {"productName": otherProductName, "avgRating": otherAvgRating, "numReviews": otherNumReviews}

        get_vc_query = """select ViewCount from Products where ProductId = %s;"""
        cursor.execute(get_vc_query, (productId,))
        view_count = cursor.fetchone()[0]

        update_vc_query = """update Products set ViewCount = %s where ProductId = %s;"""
        cursor.execute(update_vc_query, (view_count + 1, productId))

        cursor.execute("""COMMIT;""")
        
        return jsonify({"productId": productId, 
                        "productName": productName,
                        "productURL": productURL,
                        "size": size,
                        "price": price, 
                        "likeCount": likeCount, 
                        "brandName": brandName, 
                        "isPopular": isPopular,
                        "avgRating": avgRating, 
                        "viewCount": view_count + 1,
                        "totalNumReviews": totalNumReviews,
                        "usersAlsoBagged": usersAlsoBagged,
                        "reviewStringToDisplay": reviewStringToDisplay,
                        "similarProductRecommendations": similarProductRecs}), 200
    except Exception as e:
        return jsonify({"error": f"Error getting product info: {str(e)}"}), 500

"""
Returned JSON Example 1
{
    "avgRating": "4.4000",
    "brandName": "Dr. Jart+",
    "isPopular": false,
    "likeCount": 37108,
    "price": 42,
    "productId": "P467615",
    "productName": "Cicapair Tiger Grass Sleepair Intensive Mask",
    "productURL": "sephora.com/P467615",
    "reviewStringToDisplay": "4.4000/5 avg rating (from 10 reviews)",
    "similarProductRecommendations": {
        "P411539": {
            "brandName": "Dr. Jart+",
            "productName": "Cicapair Tiger Grass Cream"
        },
        "P411540": {
            "brandName": "Dr. Jart+",
            "productName": "Cicapair Tiger Grass Color Correcting Treatment SPF 30"
        },
        "P423259": {
            "brandName": "Dr. Jart+",
            "productName": "Cicapair Tiger Grass Serum"
        },
        "P429250": {
            "brandName": "Dr. Jart+",
            "productName": "Cicapair  Tiger Grass Camo Drops Color Corrector SPF 35"
        },
        "P448184": {
            "brandName": "Dr. Jart+",
            "productName": "Cicapair Tiger Grass Calming Mist"
        },
        "P448185": {
            "brandName": "Dr. Jart+",
            "productName": "Cicapair Tiger Grass Calming Gel Cream"
        },
        "P467615": {
            "brandName": "Dr. Jart+",
            "productName": "Cicapair Tiger Grass Sleepair Intensive Mask"
        },
        "P471546": {
            "brandName": "Dr. Jart+",
            "productName": "Mini Cicapair Tiger Grass Color Correcting Treatment SPF 30"
        },
        "P481699": {
            "brandName": "Dr. Jart+",
            "productName": "Cicapair Tiger Grass Calming Serum Mask"
        },
        "P501421": {
            "brandName": "EADEM",
            "productName": "Dew Dream- Hydrating Makeup Removing Cleansing Balm with Tiger Grass"
        }
    },
    "size": "3.38 oz/ 100 mL",
    "totalNumReviews": 10,
    "usersAlsoBagged": {
        "P392235": {
            "avgRating": "5.0000",
            "numReviews": 9,
            "productName": "The Camellia Oil 2-in-1 Makeup Remover & Cleanser"
        },
        "P429659": {
            "avgRating": "5.0000",
            "numReviews": 1,
            "productName": "Squalane + Hyaluronic Toning Mist"
        },
        "P441644": {
            "avgRating": "2.0000",
            "numReviews": 10,
            "productName": "Mini Superfood Antioxidant Cleanser"
        },
        "P480278": {
            "avgRating": "4.0000",
            "numReviews": 1,
            "productName": "Rapid Radiance Set"
        },
        "P481084": {
            "avgRating": "5.0000",
            "numReviews": 10,
            "productName": "Mini Revitalizing Supreme+ Youth Power Creme Moisturizer"
        },
        "P481817": {
            "avgRating": "4.0000",
            "numReviews": 1,
            "productName": "Beauty Elixir Prep, Set, Glow Face Mist"
        },
        "P505020": {
            "avgRating": "5.0000",
            "numReviews": 1,
            "productName": "The POREfessional Good Cleanup Foaming Cleanser"
        }
    }
}
"""

def similar_product_recommendations(productId):
    cursor = sql_cursor()
    cluster_id_query = "SELECT ClusterId FROM ProductClusters WHERE ProductId = %s"
    cursor.execute(cluster_id_query, (productId,))
    results = cursor.fetchone()
    
    cluster = results[0]
    print(cluster)
    similar_products_query = "SELECT ProductId, ProductName, BrandName FROM ProductClusters NATURAL JOIN Products NATURAL JOIN Brands WHERE ClusterId = %s LIMIT 10"
    cursor.execute(similar_products_query, (cluster,))
    results = cursor.fetchall()
    
    res = {}
    for row in results:
        otherProductId = row[0]
        otherProductName = row[1]
        otherProductBrand = row[2]
        res[otherProductId] = {"productName": otherProductName, "brandName": otherProductBrand}
    return res


@products_bp.route('/lookup-products', methods=['GET'])
def lookup_products():
    search_string = request.args.get('search')

    if not search_string:
        return jsonify({"error": "Search string required"}), 400
    
    try:
        cursor = sql_cursor()
        query = """SELECT Pro.ProductId, Pro.ProductName, B.BrandName
                    FROM Products Pro NATURAL JOIN Brands B
                    WHERE MATCH (ProductName) AGAINST (%s WITH QUERY EXPANSION) LIMIT 15;"""
        cursor.execute(query, (search_string,))
        rows = cursor.fetchall()
        results = [{"ProductId": row[0], "ProductName": row[1], "BrandName": row[2]} for row in rows]
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Error querying database: {str(e)}"}), 500
