from django.urls import path
from busanmap.map import busan_gu_info, simulation_result, apitest
from busanmap.views import cctv

urlpatterns = [
    # path('url/', map.py에서의 함수이름, name='urlname' : base.html 에서 사용 )
    path('', busan_gu_info, name='BusanMap'),
    path('model/', simulation_result, name='modeltest'),
    path('cctv/', cctv.as_view(), name='cctv'),
    path('apitest/', apitest, name='apitest'),
    # cctv/ 만 views.py 에서 class 호출
]
