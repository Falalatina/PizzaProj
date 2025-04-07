from flask import Flask, jsonify, request
from flask_cors import CORS
from bson import ObjectId
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)
CORS(app)  # Pozwala na dostęp z frontendu

from dotenv import load_dotenv
load_dotenv('.env')

PASSWORD = os.getenv("PASSWORD")
uri = f"mongodb+srv://karolina40gorska17:{PASSWORD}@pizza.casjkdr.mongodb.net/Pizza?retryWrites=true&w=majority"


# Połączenie z MongoDB

client = MongoClient(uri, server_api=ServerApi('1'))
db = client["Pizzeria"]  
collection = db["Pizzas"]   

# 🔹 Funkcja do konwersji ObjectId na string
def serialize_pizza(pizza):
    pizza["_id"] = str(pizza["_id"])
    return pizza

# ✅ Pobieranie wszystkich pizz (GET)
@app.route("/pizzas", methods=["GET"])
def get_pizzas():
    pizzas = list(collection.find({}))
    return jsonify([serialize_pizza(pizza) for pizza in pizzas])

# ✅ Pobieranie jednej pizzy po ID (GET)
@app.route("/pizza/<pizza_id>", methods=["GET"])
def get_pizza(pizza_id):
    try:
        pizza = collection.find_one({"_id": ObjectId(pizza_id)})
        if pizza:
            return jsonify(serialize_pizza(pizza))
        return jsonify({"error": "Pizza not found"}), 404
    except:
        return jsonify({"error": "Invalid ID format"}), 400

# ✅ Dodawanie nowej pizzy (POST)
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
    result = collection.insert_one(new_pizza)
    return jsonify({"id": str(result.inserted_id)})

# ✅ Aktualizacja pizzy (PUT)
@app.route("/pizza/<pizza_id>", methods=["PUT"])
def update_pizza(pizza_id):
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    updated_pizza = {key: data[key] for key in ["nazwa", "kategoria", "dodatki", "cena", "zdjecie"] if key in data}
    result = collection.update_one({"_id": ObjectId(pizza_id)}, {"$set": updated_pizza})

    if result.modified_count == 1:
        return jsonify({"msg": "Pizza updated"})
    return jsonify({"error": "Pizza not found"}), 404

# ✅ Usuwanie pizzy (DELETE)
@app.route("/pizza/<pizza_id>", methods=["DELETE"])
def delete_pizza(pizza_id):
    try:
        result = collection.delete_one({"_id": ObjectId(pizza_id)})
        if result.deleted_count == 1:
            return jsonify({"msg": "Pizza deleted"})
        return jsonify({"error": "Pizza not found"}), 404
    except:
        return jsonify({"error": "Invalid ID format"}), 400

# Uruchomienie serwera
if __name__ == "__main__":
    app.run(debug=True)
