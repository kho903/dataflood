from django.http import HttpResponse
from django.template import loader
import pandas as pd
from django.shortcuts import render
import sqlite3

from urllib.request import urlopen
from urllib.parse import urlencode, unquote, quote_plus
import urllib
import requests
import json
from datetime import datetime
import sklearn
import pickle
import joblib
from sklearn.preprocessing import MinMaxScaler

con = sqlite3.connect('db.sqlite3', check_same_thread=False)


def show_busan_map(request):
    def get():
        template = loader.get_template('busanmap/main.html')
        return HttpResponse(template.render())

    if request.method == 'GET':
        return get()
    else:
        return HttpResponse(status=405)


def indexPage(request):
    df = pd.read_sql_query("SELECT * FROM PIH_Merge", con)


    df_v = df[['ZONE', 'F_WEIGHT']].sort_values(by='ZONE', ascending=True)
    df_i = df[['ZONE', 'Impervious_Surface_Weight']].sort_values(by='ZONE', ascending=True)
    df_p = df[['ZONE', 'PUMP_RATIO']].sort_values(by='ZONE', ascending=True)
    zone = df_i['ZONE'].values.tolist()
    imp = df_i['Impervious_Surface_Weight'].values.tolist()
    pump = df_p['PUMP_RATIO'].values.tolist()
    grade = df_v['F_WEIGHT'].values.tolist()

    context = {
        'zone': zone,
        'imp': imp,
        'pump': pump,
        'grade': grade
    }
    return render(request, 'busanmap/main.html', context=context)


def indexP(request):
    df = pd.read_sql_query('SELECT * FROM F_Final_PIH_V1', con)
    df2 = df[['Dong', 'HIGH', 'PUMP_RATIO', 'IMP_SUR_RATIO', 'MANHOLES_RATIO']].groupby('Dong').mean().reset_index()
    dong = df2['Dong'].values.tolist()
    high = df2['HIGH'].values.tolist()
    pump = df2['PUMP_RATIO'].values.tolist()
    imp = df2['IMP_SUR_RATIO'].values.tolist()
    manhole = df2['MANHOLES_RATIO'].values.tolist()

    df = pd.read_sql_query('SELECT * FROM Realfinal', con)
    Rdong = df['Dong'].values.tolist()
    predict_results = []
    for i in range(0, 28):
        predict_results.append(df[str(i)].values.tolist())

    context = {
        'dong': dong,
        'Rdong': Rdong,
        'high': high,
        'pump': pump,
        'imp': imp,
        'manhole': manhole,
        'predict': predict_results,
    }
    return render(request, 'test/main.html', context=context)


def apitest(request):
    now = datetime.now()
    year = now.year
    month = now.month
    day = now.day
    hour = now.hour
    minute = now.minute

    if minute < 45:
        hour = hour - 1
    dates = '%d%02d%02d' % (year, month, day)
    times = '%2d' % (hour) + '30'
    minute = '30'

    xycode = pd.read_sql_query('SELECT * FROM xycode', con)
    busan_dong_base = pd.read_sql_query('SELECT * FROM base_data', con)
    busan_dong_base = pd.merge(busan_dong_base, xycode, on='ZONE')
    code = list()
    for i in range(0, xycode.shape[0]):
        code.append(xycode.iloc[i][['X', 'Y']].values.tolist())
    code_list = []
    for v in code:
        if v not in code_list:
            code_list.append(v)
    url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getUltraSrtFcst'
    finaldf = pd.DataFrame()
    for item in code_list:
        params = '?' + urlencode({quote_plus(
            'ServiceKey'): 'z6wOy%2Bx%2BzNx%2F7dhcKcU6E02LweiSbcLwhYO0SJEyAtiBTOROAvH2czsCuJgui8o7hOORZ4O13Mw43aKzPml3Kg%3D%3D' \
                                     , quote_plus('pageNo'): '1', quote_plus('numOfRows'): '160',
                                  quote_plus('dataType'): 'JSON', quote_plus('base_date'): dates,
                                  quote_plus('base_time'): times, quote_plus('nx'): str(item[0]),
                                  quote_plus('ny'): str(item[1])})
        # URL parsing
        req = urllib.request.Request(url + unquote(params))
        # Get Data from API
        response_body = urlopen(req).read()  # get bytes data
        data = json.loads(response_body)
        res = pd.DataFrame(data['response']['body']['items']['item'])
        res = res[res['category'] == 'RN1']
        res['fcstValue'] = res['fcstValue'].astype(float)
        test = res.pivot_table(index=['nx', 'ny'], columns='fcstTime', values='fcstValue')
        test = test.reset_index()
        finaldf = pd.concat([finaldf, test], ignore_index=True)

    finalcol = finaldf.columns
    finalcol = finalcol[6:]
    finaldf = finaldf.drop(columns=finalcol)
    a = finaldf.columns
    finaldf = finaldf.rename(columns={a[0]: 'X', a[1]: 'Y', a[2]: '+0', a[3]: '+1', a[4]: '+2', a[5]: '+3'})


    test = pd.merge(busan_dong_base, finaldf, left_on=['X', 'Y'], right_on=['X', 'Y'], how='left')
    print(test)
    # test = test.drop(columns='Unnamed: 0')
    model = joblib.load('ensemble.pkl')
    column = test.columns
    for i in range(0, 4):
        Testmodel = test[['SLOPE_AVG', 'HIGH', 'PUMP_RATIO', 'IMP_SUR_RATIO', 'MANHOLES_RATIO', column[10 + i]]]
        scaler = MinMaxScaler()
        scaler.fit(Testmodel)
        Testmodel = scaler.transform(Testmodel)
        y_pred = model.predict_proba(Testmodel)
        item = list()
        for k in y_pred:
            item.append(k[1])
        k = pd.Series(item)
        a = pd.concat([test, k], axis=1)
        test['result' + str(i)] = k

    result0 = test['result0'].values.tolist()
    result1 = test['result1'].values.tolist()
    result2 = test['result2'].values.tolist()
    result3 = test['result3'].values.tolist()
    dong = test['Dong'].values.tolist()

    context = {
        'year': year,
        'month': month,
        'day': day,
        'hour': hour,
        'minute': minute,
        'dong': dong,
        'result0': result0,
        'result1': result1,
        'result2': result2,
        'result3': result3,
    }
    return render(request, 'apitest/main.html', context=context)
