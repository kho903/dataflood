# import openpyxl
# # import os
#
# from busanmap.models import PihMerge
#
# # os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Web.settings")
#
# wb = openpyxl.load_workbook('PIH_merge.xlsx')
# sheet1 = wb['Sheet1']
# rows = sheet1['A2':'E17']
#
# for row in rows:
#
#     dict = {}
#     dict['ADM_CD'] = row[0].value
#     dict['ZONE'] = row[1].value
#     dict['PUMP_RATIO'] = row[2].value
#     dict['IMP_SUR_RATIO'] = row[3].value
#     dict['MANHOLES_RATIO'] = row[4].value
#
#     PihMerge(**dict).save()
