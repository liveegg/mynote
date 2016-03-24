# -*- coding: utf-8 -*- 

"""
    simulation.simulation_config
    ~~~~~~~~

    mynote 디폴트 설정 모듈.
    mynote 어플리케이션에서 사용할 디폴트 설정값을 담고 있는 클래스를 정의함.

"""

class SimulationConfig(object): 

     #: 데이터베이스 연결 URL
    DB_BINDS = {
        'local_db': 'mysql+pymysql://mynote:dusxks()*@mynote-db-instance.c5vatzan5h5s.ap-northeast-2.rds.amazonaws.com:3306/dbMyNote?charset=utf8'
    }
    #: 세션 타임아웃은 초(second) 단위(60분)
    PERMANENT_SESSION_LIFETIME = 60 * 60 
	#: 쿠기에 저장되는 세션 쿠키
    SESSION_COOKIE_NAME = 'simulation_session' 
    #: 로그 레벨 설정
    LOG_LEVEL = 'debug' 
    #: 디폴트 로그 파일 경로
    LOG_FILE_PATH = 'resource/log/simulation.log' 
    #: 디폴트 SQLAlchemy trace log 설정
    DB_LOG_FLAG = 'True' 
    #: 사진 목록 페이징 설정
    PER_PAGE = 10