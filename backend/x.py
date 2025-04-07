from dotenv import load_dotenv
import os 

load_dotenv()

my_id = os.getenv('PASSWORD')
print(my_id)

PASSWORD = str(my_id)
uri = f"mongodb+srv://karolina40gorska17:{PASSWORD}@pizza.casjkdr.mongodb.net/Pizza?retryWrites=true&w=majority"
