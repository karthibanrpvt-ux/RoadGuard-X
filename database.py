import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List


DB_PATH = Path(__file__).resolve().parent / "roadguard.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS detections (
                id INTEGER PRIMARY KEY,
                timestamp TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                damage_class TEXT NOT NULL,
                severity TEXT NOT NULL,
                confidence REAL NOT NULL
            )
            """
        )
        conn.commit()


def insert_detection(
    lat: float,
    lon: float,
    damage_class: str,
    severity: str,
    conf: float,
) -> int:
    timestamp = datetime.now(timezone.utc).isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO detections (timestamp, latitude, longitude, damage_class, severity, confidence)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (timestamp, float(lat), float(lon), damage_class, severity, float(conf)),
        )
        conn.commit()
        return int(cursor.lastrowid)


def get_all_detections() -> List[Dict]:
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT id, timestamp, latitude, longitude, damage_class, severity, confidence
            FROM detections
            ORDER BY id DESC
            """
        ).fetchall()

    return [
        {
            "id": int(row["id"]),
            "timestamp": row["timestamp"],
            "latitude": float(row["latitude"]),
            "longitude": float(row["longitude"]),
            "damage_class": row["damage_class"],
            "severity": row["severity"],
            "confidence": float(row["confidence"]),
        }
        for row in rows
    ]


# Ensure local DB and schema are created immediately on import.
init_db()
