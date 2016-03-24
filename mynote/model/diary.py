# -*- coding: utf-8 -*-
"""
    simulation.model.diary
    ~~~~~~~~~~~~~~~~~~~

    mynote 어플리케이션을 사용할 사용자 정보에 대한 model 모듈.

"""

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
#from sqlalchemy.orm import relationship

from simulation.model import Base 
from simulation.model.member import Member


class Diary(Base):
    __tablename__ = 'tDiary'
#     __table_args__ = {"useexisting": True} 

    nNum = Column(Integer, primary_key=True)
    sTitle = Column(String(100), unique=False)
    sContent = Column(String(1000), unique=False)
    dtWriteDate = Column(DateTime, unique=False)
    sId = Column(String(30), ForeignKey(Member.sId))

    
    
    def __init__(self, sTitle, sContent, dtWriteDate, sId):
        """Diary 모델 클래스를 초기화 한다."""
        
        self.sTitle = sTitle
        self.sContent = sContent
        self.dtWriteDate = dtWriteDate
        self.sId = sId
    
    
