import pandas as pd
from sqlalchemy import create_engine
from main import StockDB, Base, DATABASE_URL  # reuse your main.py config

# ----------------
# 1) Connect to DB
# ----------------
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)  # make sure table exists

# ----------------
# 2) Read your file
# ----------------
df = pd.read_csv("stock_data.csv") 
# Ensure column names match your DB
df = df[["date", "trade_code", "high", "low", "open", "close", "volume"]]

# ----------------
# 3) Clean data
# ----------------
# Remove commas from volume and convert to int
df["volume"] = df["volume"].astype(str).str.replace(",", "").astype(int)

# Convert numeric columns just in case
for col in ["high", "low", "open", "close"]:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# ----------------
# 4) Insert into DB
# ----------------
df.to_sql("stocks", engine, if_exists="append", index=False)
print("Data uploaded successfully!")
