from flask import Flask, jsonify, request
from flask_cors import CORS
from bson import ObjectId
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import ReturnDocument
from dotenv import load_dotenv
import string
import random
from datetime import datetime

app = Flask(__name__)
CORS(app)  

load_dotenv()

PASSWORD = os.getenv("PASSWORD")
USER = os.getenv("USER")
DATABASE_NAME = os.getenv("DATABASE_NAME")
COLLECTION_NAME = os.getenv("COLLECTION_NAME")

uri = f"mongodb+srv://{USER}:{PASSWORD}@pizza.casjkdr.mongodb.net/Pizza?retryWrites=true&w=majority"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client[str(DATABASE_NAME)]  
pizza_collection = db[str(COLLECTION_NAME)]  
orders_collection = db['Orders']  

# Pizza functions
def serialize_pizza(pizza):
    pizza["_id"] = str(pizza["_id"])
    return pizza

@app.route("/pizzas", methods=["GET"])
def get_pizzas_old():
    pizzas = list(pizza_collection.find({}))
    return jsonify([serialize_pizza(pizza) for pizza in pizzas])

@app.route("/pizza/<pizza_id>", methods=["GET"])
def get_pizza(pizza_id):
    try:
        pizza = pizza_collection.find_one({"_id": ObjectId(pizza_id)})
        if pizza:
            return jsonify(serialize_pizza(pizza))
        return jsonify({"error": "Pizza not found"}), 404
    except:
        return jsonify({"error": "Invalid ID format"}), 400

@app.route("/pizza", methods=["POST"])
def add_pizza():
    data = request.json
    if not data or not all(key in data for key in ["nazwa", "kategoria", "dodatki", "cena", "zdjecie"]):
        return jsonify({"error": "Missing data"}), 400

    new_pizza = {
        "nazwa": data["nazwa"],
        "kategoria": data["kategoria"],
        "dodatki": data["dodatki"],
        "cena": data["cena"],
        "zdjecie": data["zdjecie"]
    }
    result = pizza_collection.insert_one(new_pizza)
    return jsonify({"id": str(result.inserted_id)})

@app.route("/pizza/<pizza_id>", methods=["PUT"])
def update_pizza(pizza_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated_pizza = {key: data[key] for key in ["nazwa", "kategoria", "dodatki", "cena", "zdjecie"] if key in data}
    result = pizza_collection.update_one({"_id": ObjectId(pizza_id)}, {"$set": updated_pizza})

    if result.modified_count == 1:
        return jsonify({"msg": "Pizza updated"})
    return jsonify({"error": "Pizza not found"}), 404

@app.route("/pizza/<pizza_id>", methods=["DELETE"])
def delete_pizza(pizza_id):
    try:
        result = pizza_collection.delete_one({"_id": ObjectId(pizza_id)})
        if result.deleted_count == 1:
            return jsonify({"msg": "Pizza deleted"})
        return jsonify({"error": "Pizza not found"}), 404
    except:
        return jsonify({"error": "Invalid ID format"}), 400

# Order functions
def generate_order_id():
    letters = string.ascii_uppercase
    return f"PIZ-{datetime.now().year}-{''.join(random.choice(letters) for _ in range(4))}{random.randint(100, 999)}"

@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        order_data = request.json
        
        # Walidacja danych
        if not all(key in order_data for key in ['imie_klienta', 'nazwisko_klienta', 'adres_klienta', 'telefon_klienta', 'pizze']):
            return jsonify({"error": "Brak wymaganych pól"}), 400
        
        # Obliczanie sumy zamówienia
        subtotal = sum(pizza['cena'] * pizza.get('ilosc', 1) for pizza in order_data['pizze'])
        
        # Przygotowanie pełnego obiektu zamówienia
        full_order = {
            "id_zamowienia": generate_order_id(),
            "imie_klienta": order_data['imie_klienta'],
            "nazwisko_klienta": order_data['nazwisko_klienta'],
            "adres_klienta": order_data['adres_klienta'],
            "telefon_klienta": order_data['telefon_klienta'],
            "pizze": order_data['pizze'],
            "subtotal": subtotal,
            "status": "nowe",
            "data_zamowienia": datetime.utcnow(),
            "data_aktualizacji": datetime.utcnow()
        }
        
        # Dodanie 
        result = orders_collection.insert_one(full_order)
        
        return jsonify({
            "message": "Zamówienie zostało przyjęte",
            "order_id": full_order['id_zamowienia'],
            "_id": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
     
        status = request.args.get('status')
        query = {"status": status} if status else {}
        
        orders = list(orders_collection.find(query).sort("data_zamowienia", -1).limit(100))
        
       
        for order in orders:
            order['_id'] = str(order['_id'])
        
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = orders_collection.find_one({"id_zamowienia": order_id})
        
        if not order:
            return jsonify({"error": "Zamówienie nie znalezione"}), 404
            
        order['_id'] = str(order['_id'])
        return jsonify(order), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<order_id>', methods=['PUT'])
def update_order_status(order_id):
    try:
        new_status = request.json.get('status')
        
        if not new_status:
            return jsonify({"error": "Brak nowego statusu"}), 400
            
        updated_order = orders_collection.find_one_and_update(
            {"id_zamowienia": order_id},
            {"$set": {
                "status": new_status,
                "data_aktualizacji": datetime.utcnow()
            }},
            return_document=ReturnDocument.AFTER
        )
        
        if not updated_order:
            return jsonify({"error": "Zamówienie nie znalezione"}), 404
            
        updated_order['_id'] = str(updated_order['_id'])
        return jsonify(updated_order), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    try:
        result = orders_collection.delete_one({"id_zamowienia": order_id})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Zamówienie nie znalezione"}), 404
            
        return jsonify({"message": "Zamówienie zostało usunięte"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/pizzas', methods=['GET'])
def get_pizzas_api():
    try:
        pizzas = list(pizza_collection.find({}))
        
        for pizza in pizzas:
            pizza['_id'] = str(pizza['_id'])
        
        return jsonify(pizzas), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500    

if __name__ == "__main__":
    app.run(debug=True)