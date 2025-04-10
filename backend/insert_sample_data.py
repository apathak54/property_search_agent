import pymongo
from backend.config import ConfigData
import requests
import json

def insert_sample_data():
    # Connect to MongoDB
    client = pymongo.MongoClient(ConfigData.MONGO_DB_URI)
    db = client[ConfigData.DB_NAME]
    collection = db[ConfigData.COLLECTION_NAME]
    
    # Sample properties data
    sample_properties = [
        {
            "name": "Sunshine Apartments",
            "location": "Bangalore",
            "totalSqftAvailable": 1200,
            "pricePerSqft": 7500,
            "totalPrice": 9000000,  # 90 lakhs
        },
        {
            "name": "Green Valley Villas",
            "location": "Mumbai",
            "totalSqftAvailable": 2000,
            "pricePerSqft": 12000,
            "totalPrice": 24000000,  # 2.4 crores
        },
        {
            "name": "Riverside Residency",
            "location": "Delhi",
            "totalSqftAvailable": 1500,
            "pricePerSqft": 9000,
            "totalPrice": 13500000,  # 1.35 crores
        },
        {
            "name": "Mountain View Heights",
            "location": "Pune",
            "totalSqftAvailable": 1800,
            "pricePerSqft": 6500,
            "totalPrice": 11700000,  # 1.17 crores
        }
    ]
    
    # Insert properties using the API endpoint to ensure EMI calculations
    for property_data in sample_properties:
        try:
            response = requests.post('http://localhost:5000/add-property', 
                                  json=property_data)
            if response.status_code == 200:
                print(f"Successfully added property: {property_data['name']}")
            else:
                print(f"Failed to add property: {property_data['name']}")
        except Exception as e:
            print(f"Error adding property {property_data['name']}: {str(e)}")

if __name__ == "__main__":
    insert_sample_data() 