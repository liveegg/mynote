# -*- coding: utf-8 -*- 
""" 
    simulation.model.link
    ~~~~~~~~~~~~~~~~~~~ 
""" 

from sqlalchemy import Column, Integer, String, DateTime 
from sqlalchemy.orm import relationship 

from simulation.model import Base 

class Link(Base): 
    __tablename__ = 'TCMPNY_CATE' 

    CMPNY_C = Column(String(12), primary_key=True)
    CMPNY_CATE_C = Column(Integer, unique=False)
    CMPNY_CATE_N = Column(String(255), unique=False)
    UPDATE_D = Column(DateTime, unique=False)
    UPDATE_YN = Column(String(1), unique=False)

    def __init__(self, CMPNY_C, CMPNY_CATE_C, CMPNY_CATE_N, UPDATE_D, UPDATE_YN):
        self.CMPNY_C = CMPNY_C
        self.CMPNY_CATE_C = CMPNY_CATE_C
        self.CMPNY_CATE_N = CMPNY_CATE_N
        self.UPDATE_D = UPDATE_D
        self.UPDATE_YN = UPDATE_YN