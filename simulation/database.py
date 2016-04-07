# -*- coding: utf-8 -*- 
"""
    simulation.database
    ~~~~~~~~~~~~~~~~~

    DB 연결 및 쿼리 사용을 위한 공통 모듈.

"""

from sqlalchemy import create_engine 
from sqlalchemy.orm import scoped_session, sessionmaker 

class DBManager:
    """데이터베이스 처리를 담당하는 공통 클래스"""
    
    __db1_engine = None 
    __db1_session = None 

    @staticmethod 
    def init(db_bind, db_log_flag=True): 

        DBManager.__db1_engine = create_engine(db_bind.get('local_db'), echo=db_log_flag)  
        DBManager.__db1_session = scoped_session(sessionmaker(autocommit=False,  
                                        autoflush=False,  
                                        bind=DBManager.__db1_engine)) 
        
        global category_dao
        
        category_dao = DBManager.__db1_session
        

    @staticmethod 
    def init_db(): 
        from simulation.model import member, diary, file
        from simulation.model import Base 
        
category_dao = None
