class ConfigData:
    MONGO_DB_URI = "mongodb+srv://rahulkhg980:mP7aEVvx7e0okwP8@clusterstate.dcgssj6.mongodb.net/?retryWrites=true&w=majority&appName=ClusterState"
    DB_NAME = "test"
    COLLECTION_NAME = "entities"
    TABLE_SCHEMA = '''
                    "_id": "string",
                    "name": "string",
                    "location": "string",
                    "totalSqftAvailable": "integer",
                    "pricePerSqft": "integer",
                    "threeYear": "integer",
                    "fiveYear": "integer",
                    "sevenYear": "integer",
                    '''
    
    SCHEMA_DESCRIPTION = '''

                    Here is the description to determine what each key represents:
                    1. _id:
                        - Description: Unique identifier for the document.
                    2. name:
                        - Description: Name of the property.
                    3. location:
                        - Description: location of the property.
                    4. totalSqftAvailable:
                        - Description: Total square footage available in the property.
                    5. pricePerSqft:
                        - Description: Price per square foot of the property.
                    6. totalPrice:
                        - Description: Total price of the property.
                    7. threeYear:
                        - Description: EMI per month for 3 years for the property.
                    8. fiveYear:
                        - Description: EMI per month for 5 years for the property.
                    9. sevenYear:
                        - Description: EMI per month for 7 years for the property.

                    '''
    FEW_SHOT_EXAMPLE_1 = [
        {
            "$match": {
                "totalPrice": {
                    "$lte": 100000000
                }
            }
        },
        {
            "$project": {
                "_id": 1,
                "name": "Sunshine",
                "location": "Bangalore",
                "totalSqftAvailable": 12000,
                "pricePerSqft": 2100,
                "totalPrice": 2530500
            }
        }
    ]
    FEW_SHOT_EXAMPLE_2 = [
        {
            "$match": {
                "location": "Bangalore",
                "$or": [
                    {"threeYear": {"$lte": 1433333.3333333333}},
                    {"fiveYear": {"$lte": 860000}},
                    {"sevenYear": {"$lte": 614285.7142857143}}
                ]
            }
        },
        {
            "$project": {
                "_id": 1,
                "name": "Sunshine",
                "location": "Bangalore",
                "totalSqftAvailable": 12000,
                "pricePerSqft": 2100,
                "totalPrice": 2530500,
                "threeYear": 1433333.3333333333,
                "fiveYear": 860000,
                "sevenYear": 614285.7142857143
            }
        }
    ]

