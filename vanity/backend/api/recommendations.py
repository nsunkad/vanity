from flask import request, Blueprint
from conn import sql_cursor
from flask import jsonify
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans


recommendations_bp = Blueprint('recommendations', __name__)

# DO NOT request this endpoint! It's a one time job - which will be scripted away in future
@recommendations_bp.route('/kmeans', methods=['GET'])
def kmeans():
    """
    Represent products with tag vectors, and make a matrix m where rows are ProductIds and columns are TagIds. 
    The cell m[1][1] corresponds to ProductId 1 and TagId1, and its value is the weight of TagId 1, or 0 if ProductId 1 isn't 
    tagged with TagId1
    """
    query = "SELECT TagId, ProductId, Standing from ProductTags NATURAL JOIN Tags"
    cursor = sql_cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    
    rownames = []
    mat = [[0]* 8495 for i in range(8495)]
    maxidx = 0
    
    # Generate vectors and store in matrix
    for row in results:
        tagId = row[0],
        productId = str(row[1]),
        standing = row[2]
        if productId[0] in rownames:
            idx = rownames.index(productId[0])
        else:
            idx = maxidx
            maxidx += 1
            rownames.append(productId[0])
        
        mat[idx][tagId[0]] = standing # Assign recommendation weight
    
    df = pd.DataFrame(mat) 
    df.index = rownames

    # Z-scores (x - µ) / s
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df)
    
    # Generate 50 similarity clusters using standardized data
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