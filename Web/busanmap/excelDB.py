import pandas as pd
import sqlite3

db = sqlite3.connect('../db.sqlite3')
df = pd.read_excel('PIH_Merge.xlsx', sheet_name=None)
for table, dfa in df.items():
    dfa.to_sql("PIH_Merge", db)

df2 = pd.read_excel('F_BIN_WEIGHT_INFO.xlsx', sheet_name=None)
for table, dfa in df2.items():
    dfa.to_sql("F_BIN_WEIGHT_INFO", db)
db.close()

