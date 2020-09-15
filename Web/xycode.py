import pandas as pd
import sqlite3

db = sqlite3.connect('db.sqlite3')
df = pd.read_csv('xycode.csv', index_col=0)
df.to_sql("xycode", db)
db.close()

