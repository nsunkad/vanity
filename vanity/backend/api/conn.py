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