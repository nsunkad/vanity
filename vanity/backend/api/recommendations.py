from flask import request, Blueprint
from conn import sql_cursor
from flask import jsonify
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans


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


# DO NOT request this endpoint! It's a one time job - which will be scripted away in future
@recommendations_bp.route('/kmeans', methods=['GET'])
def kmeans():
    # Get every single ProductId in
    query = "SELECT TagId, ProductId, Standing from ProductTags NATURAL JOIN Tags"
    cursor = sql_cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    
    rownames = []
    mat = [[0]* 8495 for i in range(8495)]
    maxidx = 0
    
    for row in results:
        tagId = row[0],
        productId = str(row[1]),
        standing = row[2]
        if productId[0] in rownames:
            # print("entered here", "tagId: ", tagId, "productId: ", productId[0], "index: ", rownames.index(productId[0]), "maxIdx: ", maxidx)
            idx = rownames.index(productId[0])
        else:
            idx = maxidx
            maxidx += 1
            rownames.append(productId[0])
        
        mat[idx][tagId[0]] = standing
    
    df = pd.DataFrame(mat) 
    df.index = rownames

    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df)
    
    num_clusters = 50
    

    kmeans = KMeans(n_clusters=num_clusters, random_state=42)
    kmeans.fit(df_scaled)
    
    df['ProductId'] = rownames
    df['Cluster'] = kmeans.labels_
    res = df.iloc[:, [-2, -1]].rename_axis('ProductID')


    res.columns = ['ProductId', 'Cluster']

    """ One-time database insert
    
    for index, row in res.iterrows():
        productId = row['ProductId']
        clusterId = row['Cluster']
        print(productId, clusterId)
        
        cursor = sql_cursor()
        query = "INSERT INTO ProductClusters (ProductId, ClusterId) VALUES (%s, %s);"
                    
        data = (productId, clusterId)
        cursor.execute(query, data)
        db.commit()
    """
    
    return [len(mat[0])]