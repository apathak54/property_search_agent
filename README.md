# Property Search Application

A modern web application for searching properties based on budget and payment preferences. The application allows users to search for properties either by one-time investment or monthly payment options.

## Features

- Search properties by budget
- Choose between one-time investment or monthly payment options
- View detailed property information including:
  - Property name and location
  - Total area and price per sq.ft
  - Total price
  - EMI options for different tenures (3, 5, and 7 years)
- Responsive design that works on all devices
- Modern UI with Material-UI components

## Tech Stack

### Backend
- Python
- Flask
- MongoDB
- LangChain
- OpenAI

### Frontend
- React
- TypeScript
- Material-UI
- Vite

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- MongoDB Atlas account (or local MongoDB instance)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd property-search-agent
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
OPENAI_API_KEY=your_openai_api_key
```

## Configuration

Update the MongoDB connection details in `config.py`:
```python
MONGO_DB_URI = "your_mongodb_connection_string"
DB_NAME = "your_database_name"
COLLECTION_NAME = "your_collection_name"
```

## Running the Application

1. Start the backend server:
```bash
python app.py
```
The backend will run on http://localhost:5000

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```
The frontend will run on http://localhost:5173

3. (Optional) Insert sample data:
```bash
python insert_sample_data.py
```

## Usage

1. Open your browser and navigate to http://localhost:5173
2. Select your search type:
   - One-time Investment: Search by total property price
   - Monthly Payment: Search by monthly EMI budget
3. Enter your budget amount
4. Click "Search Properties" to view matching properties
5. View property details including:
   - Basic information (name, location)
   - Area and pricing details
   - EMI options (for monthly payment search)

## API Endpoints

### Search Properties
- **URL**: `/search`
- **Method**: `POST`
- **Request Body**:
```json
{
    "type": "one-time" | "monthly",
    "budget": number
}
```

### Add Property
- **URL**: `/add-property`
- **Method**: `POST`
- **Request Body**:
```json
{
    "name": "string",
    "location": "string",
    "totalSqftAvailable": number,
    "pricePerSqft": number,
    "totalPrice": number
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 