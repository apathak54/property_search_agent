from flask import Flask, request, jsonify
from flask_cors import CORS
import pymongo
from config import ConfigData
from bson import ObjectId
import json

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = pymongo.MongoClient(ConfigData.MONGO_DB_URI)
db = client[ConfigData.DB_NAME]
collection = db[ConfigData.COLLECTION_NAME]

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)
    
@app.route('/')
def home():
    return 'Hello from Flask!'

@app.route('/search', methods=['POST'])
def search_properties():
    try:
        data = request.json
        search_type = data.get('type')
        budget = float(data.get('budget', 0))

        if search_type == 'one-time':
            # Query for one-time investment properties
            query = {
                'totalPrice': {'$lte': budget}
            }
        else:
            # Query for monthly payment properties
            # Check if any EMI option is within budget
            query = {
                '$or': [
                    {'threeYear': {'$lte': budget}},
                    {'fiveYear': {'$lte': budget}},
                    {'sevenYear': {'$lte': budget}}
                ]
            }

        # Find properties matching the criteria
        properties = list(collection.find(query))
        
        # Convert ObjectId to string for JSON serialization
        return JSONEncoder().encode(properties)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/add-property', methods=['POST'])
def add_property():
    try:
        property_data = request.json
        
        # Calculate EMIs if total price is provided
        if 'totalPrice' in property_data:
            total_price = float(property_data['totalPrice'])
            
            # Calculate EMIs for different tenures
            # Using simple interest formula: EMI = P * (1 + r*t) / (t*12)
            # where r is annual interest rate (assuming 10%), t is tenure in years
            interest_rate = 0.10  # 10% annual interest
            
            # 3 year EMI
            property_data['threeYear'] = round((total_price * (1 + interest_rate * 3)) / (3 * 12), 2)
            
            # 5 year EMI
            property_data['fiveYear'] = round((total_price * (1 + interest_rate * 5)) / (5 * 12), 2)
            
            # 7 year EMI
            property_data['sevenYear'] = round((total_price * (1 + interest_rate * 7)) / (7 * 12), 2)

        result = collection.insert_one(property_data)
        return jsonify({'message': 'Property added successfully', 'id': str(result.inserted_id)})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 