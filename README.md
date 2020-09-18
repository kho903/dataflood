# Data Flood
데이터청년 캠퍼스 부산대학교 프로젝트<br>
2020년 07월 발생한 초량 제1지하차도 침수사건으로 인명피해가 발생하였다<br>
이에 Data Flood 팀은 침수를 예측해보고자 하였다.<br>
예측 방법은 거시적으로 강수량, 지형 정보, 펌프 및 불투수면, 침수 이력을 통해<br>
캠퍼스 기간 동안 학습한 머신러닝을 통해 예측해보고자 하였고<br>
미시적으로 cctv 영상을 학습시켜 확실하게 실시간으로 예측하고자 하였다<br>
두 방법은 서로 상호보완적으로 침수 예방에 도움을 줄 수 있을 것이다.<br> 
<br>
데이터 수집 및 전처리 과정과 학습 방법 그리고 웹(django)에 대해 설명.<br>
실행방법은 [7.실행방법](#7-실행방법)참조 <br>

<br>
python 3.7.6 

# 목차

1. [디렉토리 설명](#1-디렉토리-설명)
2. [데이터 수집](#2-데이터-수집)
3. [전처리 과정 및 데이터 flow](#3-전처리-과정-및-데이터-flow)
4. [Machine Learning](#4-machine-learning)
5. [영상 Machine Learning](#5-영상-machine-learning)
6. [Django](#6-webdjango)
7. [실행 방법](#7-실행방법)

# 1. 디렉토리 설명

<strong>dataflood</strong><br>
---
├─Data : 프로젝트에 사용되는 데이터 모음<br>
│  ├─final_data : 최종적으로 사용 용도에 따라서 응용될 데이터<br>
│  │  ├─DB : for Django<br>
│  │  ├─model : 추후 모델이 필요할 시 사용<br>
│  │  │  ├─geo_model<br>
│  │  │  └─video_model<br>
│  │  └─training : 학습에 사용 될 데이터<br>
│  │      ├─cctv_data : 영상 학습 용 데이터 <br>
│  │      │  ├─flood<br>
│  │      │  ├─flood_clahe<br>
│  │      │  ├─no_flood_new<br>
│  │      │  ├─no_flood_new_clahe<br>
│  │      │  └─video<br>
│  │      └─geo_data : 머신 러닝 학습 용 데이터<br>
│  ├─processing_data : 전처리 되면서 만들어지는 데이터<br>
│  │  ├─1st : 1차 가공<br>
│  │  └─2nd : 2차 가공( 추후 활용되어 final_data 또는 training_data로 변경)<br>
│  └─rawdata<br>
│  <br>
├─ML_model_code : 모델 학습 코드<br>
|  | <br>
│  ├─Geo_Model<br>
│  │  <br>
│  └─Video_Model<br>
│      <br>
├─Processing_code : 전처리 및 django DB data 생성용 코드<br>
│  <br>
└─Web : Django 코드<br>


# 2. 데이터 수집


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


전처리 과정 및 데이터 flow의 개요는 다음과 같다
위의 Raw, Processing Data( 1st, 2nd ) , Final Data( DB, training, model ) 각각 파일명이며 자세한 내용은 1을 참조한다.

![Readme%20md%2099629370fe664b84b98f21911af9cff2/file.png](Readme%20md%2099629370fe664b84b98f21911af9cff2/file.png)

전처리 : Processing_code 내부 1, 2, 3, 4 참조<br>
학습코드 : ML_model_code > GeoModel > Geo_ML 참조<br>
Django DB용 코드 : Processing_code 내부 for_Django_DB 참조<br>

### 전처리 과정

---

- ① 부산데이터 추출 : 전국 정보를 가지고 있는 FL_DATAUPMNG(침수흔적이력) 에서 부산과 관련된 침수이력을 추출.<br>
                                  또한 이와 같이 제공되고 있는 FL_TIMERAIN(침수 당일 시간당 강수량)에서 부산과 관련된 침수이력을 추출<br>
                                  이 때는 과거 부산 침수이력 데이터에 존재하는 사건번호(SEQ)와 연계하여 추출<br>
                                  이 후 busan_code를 사용하기 좋도록 제작.<br>
- ②침수데이터with 강수 및 지형 : 뽑아낸 부산 과거 침수 이력 데이터로 부터 QGIS를 이용하여 해당 지역의 지역정보(고도 및 경사도)를 생성. <br>
                                                     또한 그 주변의 비침수 지역 데이터도 같이 이용 <br>
                                                      두 지역정보와 강수량 데이터를 지역 이름으로 묶어 merge 한 후 각각의 지역정보(고도 및 경사도)에 대해  가중치 부여<br>
- ③지역정보(구) : 부산 행정구역을 '구' 단위로 나누어 각각의 구에 해당하는 지역정보를 생성하고 가중치를 부여<br>
                           이 때 사용되는 데이터는 불투수면 비율, 구의 과거 침수 빈도 비율, pump 비율을 이용하여 가중치를 부여한다.<br>
- ④학습용데이터만들기 : 학습에 사용하기 좋도록 데이터를 가공하여 학습용 데이터를 생성한다. (labeling 작업)<br>
                                        우선 busan_flood_data와 busan_Uflood_data와 sig_info_weight지역정보를 활용하여 데이터를 합친다.<br>
                                        busan_flood_data로 부터 침수심 결측치를 선형적으로 보완하고 busan_Uflood_data의 침수심을 0으로 설정한다 . 이후 침수심 0.2m 이상이 침수이므로<br>
                                        침수심에 따라 각각의 데이터에 FLOOD 열을 추가하여 1, 0으로 라벨링한다. <br>
                                        이후 학습을 위한 데이터는 비율 등을 고려하여 침수 시점을 기준 busan_flood_data로 부터 데이터를 선정하고,<br>
                                        이후 같은 시간대에서 busan_Ulood_data로 부터 데이터를 선정하여 training_data를 생성한다.<br>

### data flow

---

각각 주피터파일을 통해 전처리과정 순서대로 진행되어 파일이 생성되며, (단, QGIS로 생성된 busan_flood_geo 와 busan_Uflood_geo, busan_rain_data_mod는 제외) 마지막에 도착한
Final data 폴더에 사용 용도에 따라 저장된다. <br>
 training_data : 모델 학습을 위해 사용<br>
 DB : 이후 Web 파트에서 데이터베이스를 위해 사용<br>
 model : Web또는 추후 사용을 위해 모델을 따로 저장<br>

# 4. Machine Learning


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

0. 영상 파일을 프레임 단위로 분할하여 영상 데이터로 변환
1. 필요 라이브러리 import
2. 영상 이미지를 읽어와서 침수 이미지, 비침수 이미지로 리스트 생성
3. 각각의 원본 이미지들을 CLAHE처리를 통해 화소 전처리된 이미지로 변환후 저장
4. CLAHE 이미지를 읽어옴
5. 영상 학습을 위해 ImageDataGenerator를 이용하여 학습,검증 데이터셋 생성
6. 전이학습을 위해 기존 MobileNetV2를 불러오고, 이진 분류를 위한 Dense층 노드 수 변환
7. 학습 모델을 생성하여 first_try.h5 파일로 저장
8. 확인하고 싶은 영상을 입력받고 opencv의 차량 분류 모델인 cars.xmml을 입력받음.
9. 입력받은 영상의 프레임을 학습 모델에 투입하여 결과치를 영상에 텍스트로 덮어씌움
10. 수정된 영상 프레임을 곧바로 보여주거나, 저장하여 결과를 확인할 수 있음

# 6. Web(Django) 
### 6.1 Server

 - Framework : Django

### 6.2 Database
 - sqlite3

### 6.3 Frontend

#### &#9312; d3.js</li><br>
- 지도 시각화<br>
- 각 수치별 지도에 표시<br>

#### &#9313; chart.js</li><br>
- 부산지역 구단위 정보페이지에서 불투수면 비율 & 침수빈도 막대그래프 표현<br>

#### &#9314; ETC : Bootstrap, CSS</li>


### 6.4 pandas ##

<li>
    pandas 이용하여 sqlite3의 데이터를 dataframe으로 사용<br>
    ex)pd.read_sql_query("SELECT * FROM 테이블명", db)

</li>

### 6.5 주요 기능

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