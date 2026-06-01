import sqlite3

conn = sqlite3.connect(r"d:\SNT\server\database.sqlite")
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print("Tables:", tables)

# Search every text column in every table for "logistic"
for table in tables:
    cursor.execute(f"PRAGMA table_info({table})")
    columns = cursor.fetchall()
    text_cols = [col[1] for col in columns if col[2].upper() in ('TEXT', 'VARCHAR', 'BLOB', '')]
    
    for col in text_cols:
        try:
            cursor.execute(f"SELECT rowid, [{col}] FROM [{table}] WHERE [{col}] LIKE '%logistic%' COLLATE NOCASE")
            rows = cursor.fetchall()
            for row in rows:
                print(f"\n=== FOUND in {table}.{col} (rowid={row[0]}) ===")
                print(repr(row[1][:500] if row[1] else row[1]))
        except Exception as e:
            pass

conn.close()
