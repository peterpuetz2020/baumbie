from pathlib import Path
from dotenv import load_dotenv

def load_env():
    """Lädt .env.local (falls vorhanden), sonst .env – immer relativ zum Projekt-Root"""
    project_root = Path(__file__).resolve().parents[2]
    env_path_local = project_root / ".env.local"
    env_path_default = project_root / ".env"

    if env_path_local.exists():
        load_dotenv(dotenv_path=env_path_local, override=True)
    elif env_path_default.exists():
        load_dotenv(dotenv_path=env_path_default, override=True)
    else:
        print("❌ Keine .env-Datei gefunden")