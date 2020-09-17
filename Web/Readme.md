# Web 
## 1. Server

 - Framework : Django

## 2. Database
 - sqlite3

## 3. Frontend

####&#9312; d3.js</li><br>
- 지도 시각화<br>
- 각 수치별 지도에 표시<br><br>

####&#9313; chart.js</li><br>
- 부산지역 구단위 정보페이지에서 불투수면 비율 & 침수빈도 막대그래프 표현<br><br>


####&#9314; ETC : Bootstrap, CSS</li>


## 4. pandas ##

<li>
    pandas 이용하여 sqlite3의 데이터를 dataframe으로 사용<br>
    ex)pd.read_sql_query("SELECT * FROM 테이블명", db)

</li>

## 5. 주요 기능

####&#9312; 부산지역 구단위 정보
 - URL : ./busanmap/
 - busanmap/map.py > busan_gu_info :부산지역 구단위 정보 페이지 부산 각 구별 불투수면, 펌프, 침수빈도를 그래프와 지도에 표시
 - 부산 각 구별 통계 (불투수면 비율, 침수빈도) 막대그래프 - chart.js 사용
 - 구별 지도 & 불투수면 비율, 침수빈도별 지도 시각화 - d3.js 사용

####&#9313; Simulation 결과 보기
 - URL : ./busanmap/model/
 - busanmap/map.py > simulation_result : 부산지역에서 침수 사고가 있던 7월 23-24일 데이터를 이용하여 그 시간대의 침수위험도를 simulation
 - 2020년 7월 23 - 24일 데이터를 이용하여 예측모델 시뮬레이션

####&#9314; CCTV 영상 분석
 - URL : ./busanmap/cctv/
 - busanmap/views.py > cctv : cctv 표시
 - 침수되었던 CCTV를 통해 침수예측모델 확인

####&#9315; 실시간 침수 위험도 
 - URL : ./busanmap/apitest/
 - busanmap/map.py > apitest : 실시간 침수 위험도 보기 페이지 실시간으로 기상 데이터를 받아온 뒤 현재시간, +1, 2, 3시간 후의 각 동별 침수 예측
 - 기상청 api를 이용하여 실시간으로 현재 날씨를 가져온 뒤 현재, +1, +2, +3 침수예상 분포 표시

 
 
 
