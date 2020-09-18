import pandas as pd
import sqlite3

db = sqlite3.connect('../Web/db.sqlite3')

# base_df = pd.read_csv('../Data/final_data/DB/base_data.csv')
# base_df.to_sql('base_data', db)
#
# xy_df = pd.read_csv('../Data/final_data/DB/xycode.csv')
# xy_df.to_sql('xycode', db)
#
# real_final_df = pd.read_csv('../Data/final_data/DB/Realfinal.csv')
# real_final_df.to_sql("Realfinal", db)
#
# PIH_df = pd.read_csv('../Data/final_data/DB/PIH_weight_merge.csv')
# PIH_df.to_sql("PIH_Merge", db)
#
# weigh_df = pd.read_excel('../Data/final_data/DB/F_BIN_WEIGHT_INFO.xlsx', sheet_name=None)
# for table, df in weigh_df.items():
#     df.to_sql("F_BIN_WEIGHT_INFO", db)
#
# df = pd.read_excel('../Data/final_data/DB/F_Final_PIH_V1.xlsx', sheet_name=None)
# for table, df in df.items():
#     df.to_sql("F_Final_PIH_V1", db)
#
##################################################

# sig_info_weight = pd.read_csv('../Data/processing_data/2nd/sig_info_weight.csv')
# sig_info_weight.to_sql("sig_info_weight", db)
#
# busan_base_data = pd.read_csv('../Data/final_data/DB/busan_base_data.csv')
# busan_base_data.to_sql('busan_base_data', db)

# xy_df = pd.read_csv('../Data/final_data/DB/xycode.csv')
# xy_df.to_sql('xycode', db)

db.close()


# db 테이블 총 5개

# sig_info_weight
# busan_base_data
# xycode