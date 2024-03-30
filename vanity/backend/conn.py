import mysql.connector

db = mysql.connector.connect(
    host="35.193.75.235",
    user="root",
    password="replace-with-pass",
    database = "MojoDojoDB",
)

sql_cursor = db.cursor()

sql_cursor.execute("SELECT * FROM Products WHERE ProductName = 'La Habana Eau de Parfum'")

# Fetch results
results = sql_cursor.fetchall()

# Process results
for row in results:
    print(row)  # Or do something else with the results

sql_cursor.close()


# if __name__ == '__main__':
#     app.run(debug=True)