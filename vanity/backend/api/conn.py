import mysql.connector

from mysql.connector import Error

def create_db_connection():
    connection = None
    try:
        connection = mysql.connector.connect(
            host="35.193.75.235",
            user="root",
            password="vanity-sql-1",
            database="MojoDojoDB",
            #ssl_disabled=True  # Use only if necessary for testing
        )
        print("MySQL Database connection successful")
    except Error as e:
        print(f"The error '{e}' occurred")

    return connection

db = create_db_connection()

db_cursor = db.cursor()

def sql_cursor():
    return db_cursor