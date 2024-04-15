import mysql.connector

db = mysql.connector.connect(
    host="35.193.75.235",
    user="root",
    password="vanity-sql-1",
    database = "MojoDojoDB",
)

db_cursor = db.cursor()

def sql_cursor():
    return db_cursor

# import pymysql
# db = pymysql.connect(host='35.193.75.235',
#                     user='root',
#                     password='vanity-sql-1',
#                     db='MojoDojoDB',
#                     cursorclass=pymysql.cursors.DictCursor)

# db_cursor = db.cursor()

# def sql_cursor():
#     return db_cursor