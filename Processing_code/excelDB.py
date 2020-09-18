import pandas as pd
import sqlite3

db = sqlite3.connect('../Web/db.sqlite3')

# real_final_df = pd.read_csv('../Data/final_data/DB/Realfinal.csv')
# real_final_df.to_sql("Realfinal", db)
###################################################################

# df = pd.read_excel('../Data/final_data/DB/F_Final_PIH_V1.xlsx', sheet_name=None)
# for table, df in df.items():
#     df.to_sql("F_Final_PIH_V1", db)
#
# sig_info_weight = pd.read_csv('../Data/processing_data/2nd/sig_info_weight.csv')
# sig_info_weight.to_sql("sig_info_weight", db)
#
# busan_base_data = pd.read_csv('../Data/final_data/DB/busan_base_data.csv')
# busan_base_data.to_sql('busan_base_data', db)
#
# xy_df = pd.read_csv('../Data/final_data/DB/xycode.csv')
# xy_df.to_sql('xycode', db)
#
# Simultaion_Result = pd.read_csv('../Data/final_data/DB/Simulation_Result.csv')
# Simultaion_Result.to_sql("Simulation_Result", db)

db.close()

# db 테이블 총 5개

# F_Final_PIH_V1
# sig_info_weight
# busan_base_data
# xycode
# Simulation_Result 또는 Realfinal

