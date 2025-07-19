import os
import sys
import yaml
import json
from supabase import create_client, Client
from utils.env import load_env

load_env()

url = os.environ.get("VITE_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    raise ValueError("VITE_SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein")

supabase: Client = create_client(url, key)

if len(sys.argv) != 2:
    raise ValueError("Usage: python import_species.py <path_to_file.yaml|json>")

path_to_file = sys.argv[1]

# 🌐 Datendatei laden
with open(path_to_file, encoding="utf-8") as f:
    if path_to_file.endswith((".yaml", ".yml")):
        if not yaml:
            raise ImportError("PyYAML is not installed. Run: pip install pyyaml")
        data = yaml.safe_load(f)
    elif path_to_file.endswith(".json"):
        data = json.load(f)
    else:
        raise ValueError("File must be .yaml, .yml or .json")

# 📥 Daten in Supabase schreiben
for item in data:
    supabase.table("tree_species").upsert(item, on_conflict="tree_type_botanic").execute()
