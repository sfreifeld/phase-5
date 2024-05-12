from flask import Flask
import os
import json
from supabase import create_client, Client


app = Flask(__name__)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.route("/")
def hello():
    return "Hello, World!"

@app.route("/users")
def get_users():
    response = supabase.table('users').select("*").execute()
    return json.dumps(response.data)



if __name__ == "__main__":
    app.run(debug=True)