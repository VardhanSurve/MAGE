from pymongo import MongoClient

MONGODB_CONNECTION_STR = "mongodb+srv://VardhanSurve:Harshu007@datathon-test.56aqp.mongodb.net/test?retryWrites=true&w=majority"

try:
    client = MongoClient(MONGODB_CONNECTION_STR)
    db = client.test
    print("Connected to MongoDB!")
    print(db.list_collection_names())  # Check if you can fetch collections
except Exception as e:
    print("Error:", e)
