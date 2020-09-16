import pandas as pd
import sqlite3

db = sqlite3.connect('../db.sqlite3')
df = pd.read_excel('PIH_Merge.xlsx', sheet_name=None)
for table, dfa in df.items():
    dfa.to_sql("PIH_Merge", db)

df2 = pd.read_excel('F_BIN_WEIGHT_INFO.xlsx', sheet_name=None)
for table, dfa in df2.items():
    dfa.to_sql("F_BIN_WEIGHT_INFO", db)

df3 = pd.read_excel('../F_Final_PIH_V1.xlsx', sheet_name=None)
for table, dfa in df3.items():
    dfa.to_sql("F_Final_PIH_V1", db)

df4 = pd.read_csv('../xycode.csv', index_col=0)
df4.to_sql("xycode", db)

df5 = pd.read_csv('../base_data.csv')
df5.to_sql("base_data", db, index=0)

df6 = pd.read_csv('../Realfinal.csv')
df6.to_sql("Realfinal", db)

db.close()


# db 테이블 총 6개

# PIH_Merge
# F_BIN_WEIGHT_INFO
# F_Final_PIH_V1
# xycode
# base_data
# Realfinal
