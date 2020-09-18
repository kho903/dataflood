# Readme.md

# Data Flood

---

데ㅇ랑러ㅏㅇ

# 목차

---

1. 개요 및 디렉토리 설명
2. 데이터 수집
3. 전처리 과정 및 데이터 flow
4. Machine Learning
5. 영상 Machine Learning
6. Django
7. 실행 방법

# 1. 개요 및 디렉토리 설명

---

# 2. 데이터 수집

---

모델 학습에 필요한 데이터 수집은 아래의 주소에서 다운 받아 편의상 이름을 변경하여 사용하였다.
해당 데이터들은 Data/raw_data 에 저장한다.

1. 부산 코드
[https://www.code.go.kr/stdcode/regCodeL.do](https://www.code.go.kr/stdcode/regCodeL.do) 접속 > 부산 조회 후 다운로드 
법정동코드 조회자료.zip → busan_code_data.xls

![Readme%20md%2099629370fe664b84b98f21911af9cff2/Untitled.png](Readme%20md%2099629370fe664b84b98f21911af9cff2/Untitled.png)

2. 침수흔적정보 : 태풍,호우,해일 등으로 인한 침수발생일시, 면적 등 침수지역에 대한 정보
[https://www.data.go.kr/data/15048634/fileData.do](https://www.data.go.kr/data/15048634/fileData.do)
FL_DATAUPMNG.csv

3. 침수흔적정보_기상별 강우량
FL_DATAUPMNG에 침수된 위치에 따른 침수 기간 동안의 기상별 강우량(시간별)
[https://www.data.go.kr/data/15048637/fileData.do](https://www.data.go.kr/data/15048637/fileData.do)
FL_TIMERAIN.csv

4. 불투수면 비율(환경부))
[http://egis.me.go.kr/atlas/view.do?id=64&section=02&pageNo=13&keyword=](http://egis.me.go.kr/atlas/view.do?id=64&section=02&pageNo=13&keyword=)
불투수면 비율.xlsx(전국 데이터) → imper_ratio_data.xlsx

![Readme%20md%2099629370fe664b84b98f21911af9cff2/Untitled%201.png](Readme%20md%2099629370fe664b84b98f21911af9cff2/Untitled%201.png)

5. API_xycode.csv
[https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15057682](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15057682)
초단기예보조회를 사용
기상청18_동네예보 조회서비스_오픈API활용가이드_격자_위경도(20200706) → API_xycode.xlsx

6. simulation_rain.csv
모델 학습 이후 초량 제1지하차도 침수사건 당일의 침수를 예측하기 위해 해당 날짜의 강수량 데이터를 수집
기상청 데이터를 통해 수작업

# 3. 전처리 과정 및 데이터 flow

---

전처리 과정 및 데이터 flow의 개요는 다음과 같다
위의 Raw, Processing Data( 1st, 2nd ) , Final Data( DB, training, model ) 각각 파일명이며 자세한 내용은 1을 참조한다.

![Readme%20md%2099629370fe664b84b98f21911af9cff2/file.png](Readme%20md%2099629370fe664b84b98f21911af9cff2/file.png)

전처리 : Processing_code 내부 1, 2, 3, 4 참조
학습코드 : ML_model_code > GeoModel > Geo_ML 참조
Django DB용 코드 : Processing_code 내부 for_Django_DB 참조

### 전처리 과정

---

- ① 부산데이터 추출 : 전국 정보를 가지고 있는 FL_DATAUPMNG(침수흔적이력) 에서 부산과 관련된 침수이력을 추출.
                                  또한 이와 같이 제공되고 있는 FL_TIMERAIN(침수 당일 시간당 강수량)에서 부산과 관련된 침수이력을 추출
                                  이 때는 과거 부산 침수이력 데이터에 존재하는 사건번호(SEQ)와 연계하여 추출
                                  이 후 busan_code를 사용하기 좋도록 제작.
- ②침수데이터with 강수 및 지형 : 뽑아낸 부산 과거 침수 이력 데이터로 부터 QGIS를 이용하여 해당 지역의 지역정보(고도 및 경사도)를 생성. 
                                                     또한 그 주변의 비침수 지역 데이터도 같이 이용 
                                                      두 지역정보와 강수량 데이터를 지역 이름으로 묶어 merge 한 후 각각의 지역정보(고도 및 경사도)에 대해  가중치 부여
- ③지역정보(구) : 부산 행정구역을 '구' 단위로 나누어 각각의 구에 해당하는 지역정보를 생성하고 가중치를 부여
                           이 때 사용되는 데이터는 불투수면 비율, 구의 과거 침수 빈도 비율, pump 비율을 이용하여 가중치를 부여한다.
- ④학습용데이터만들기 : 학습에 사용하기 좋도록 데이터를 가공하여 학습용 데이터를 생성한다. (labeling 작업)
                                        우선 busan_flood_data와 busan_Uflood_data와 sig_info_weight지역정보를 활용하여 데이터를 합친다.
                                        busan_flood_data로 부터 침수심 결측치를 선형적으로 보완하고 busan_Uflood_data의 침수심을 0으로 설정한다 . 이후 침수심 0.2m 이상이 침수이므로
                                        침수심에 따라 각각의 데이터에 FLOOD 열을 추가하여 1, 0으로 라벨링한다. 
                                        이후 학습을 위한 데이터는 비율 등을 고려하여 침수 시점을 기준 busan_flood_data로 부터 데이터를 선정하고,
                                        이후 같은 시간대에서 busan_Ulood_data로 부터 데이터를 선정하여 training_data를 생성한다.

### data flow

---

각각 주피터파일을 통해 전처리과정 순서대로 진행되어 파일이 생성되며, (단, QGIS로 생성된 busan_flood_geo 와 busan_Uflood_geo, busan_rain_data_mod는 제외) 마지막에 도착한
Final data 폴더에 사용 용도에 따라 저장된다. 
 training_data : 모델 학습을 위해 사용
 DB : 이후 Web 파트에서 데이터베이스를 위해 사용
 model : Web또는 추후 사용을 위해 모델을 따로 저장

# 4. Machine Learning

---

### 4.1 Geo_ML

1. 먼저 필요한 라이브러리를 모두 import 해줌
2. 분류모델이기에 독립변수로 사용할 데이터와 종속변수를 구분해서
나눠줌.
3. minmaxscaler 를 이용해 data를 0~1의 값으로 전환
-> 데이터 특성상 이상치를 제거해서 사용해서는 안됨
4. 주성분 분석(PCA)를 통해 중요 주성분(4개)를 선택
학습에 사용하기위해 4개의 차원으로 줄인 데이터로 변형
5. 데이터를 train 과 test 로 구분 8 : 2 비율로 나눠줌
6. bayesianoptimization 을 이용해 사용할 모델들의 최적값을 탐색함
-> 사용된 모델 KNN, SVM, DT, LR
각 모델들에 사용되는 옵션의 최적 조합을 탐색
7. 찾아낸 최적의 조합으로 모델을 만들고 voting 앙상블을 통해
그 모델들을 묶어서 사용함
-> voting 앙상블의 경우 soft 옵션을 사용함
각 모델들에서 나오는 1일 확률과 0일 확률을 종합해서 결과를 냄
-> 한 모델의 정확도가 떨어져도 다른 모델들과의 확률 계산을 통해 결과를 도출함
8. 데이터를 학습하고 교차검증을 다시 한번 실시하여
각 모델들의 성능을 평가함 -> f1_score 를 확인
9. 교차검증을 통해 나온 결과를 보기 쉽게 하기위해 boxplot 으로 시각화함
10. 위에서 구분한 test 데이터에 대한 예측 정확도를 확인함
-> 0.7정도로 train 데이터와 유사하게 나옴
11. 실제 사고사례를 예측할 수 있는지 확인하기 위해 초량동 데이터를 사용함
-> 전처리 과정에서 사용한 가중치를 초량동 데이터에도 적용

이후 불필요한 변수들 제거 후 pca로 학습데이터와 같은 형태로 변형
-> 예측 실시 결과 -> 10시를 침수로 예측함

# 5. 영상 Machine Learning

# 6. Web(Django) 
## 1. Server

 - Framework : Django

## 2. Database
 - sqlite3

## 3. Frontend

#### &#9312; d3.js</li><br>
- 지도 시각화<br>
- 각 수치별 지도에 표시<br><br>

#### &#9313; chart.js</li><br>
- 부산지역 구단위 정보페이지에서 불투수면 비율 & 침수빈도 막대그래프 표현<br><br>


#### &#9314; ETC : Bootstrap, CSS</li>


## 4. pandas ##

<li>
    pandas 이용하여 sqlite3의 데이터를 dataframe으로 사용<br>
    ex)pd.read_sql_query("SELECT * FROM 테이블명", db)

</li>

## 5. 주요 기능

#### &#9312; 부산지역 구단위 정보
 - URL : ./busanmap/
 - busanmap/map.py > busan_gu_info :부산지역 구단위 정보 페이지 부산 각 구별 불투수면, 펌프, 침수빈도를 그래프와 지도에 표시
 - 부산 각 구별 통계 (불투수면 비율, 침수빈도) 막대그래프 - chart.js 사용
 - 구별 지도 & 불투수면 비율, 침수빈도별 지도 시각화 - d3.js 사용

#### &#9313; Simulation 결과 보기
 - URL : ./busanmap/model/
 - busanmap/map.py > simulation_result : 부산지역에서 침수 사고가 있던 7월 23-24일 데이터를 이용하여 그 시간대의 침수위험도를 simulation
 - 2020년 7월 23 - 24일 데이터를 이용하여 예측모델 시뮬레이션

#### &#9314; CCTV 영상 분석
 - URL : ./busanmap/cctv/
 - busanmap/views.py > cctv : cctv 표시
 - 침수되었던 CCTV를 통해 침수예측모델 확인

#### &#9315; 실시간 침수 위험도 
 - URL : ./busanmap/apitest/
 - busanmap/map.py > apitest : 실시간 침수 위험도 보기 페이지 실시간으로 기상 데이터를 받아온 뒤 현재시간, +1, 2, 3시간 후의 각 동별 침수 예측
 - 기상청 api를 이용하여 실시간으로 현재 날씨를 가져온 뒤 현재, +1, +2, +3 침수예상 분포 표시

 
 
 
# 7. 실행방법