# -*- coding: utf-8 -*-
"""
    simulation.model.file
    ~~~~~~~~~~~~~~~~~~~

    mynote 어플리케이션을 사용할 사용자 정보에 대한 model 모듈.

"""

from sqlalchemy import Column, String, Integer, ForeignKey
#from sqlalchemy.orm import relationship

from simulation.model import Base 
from simulation.model.member import Member


class File(Base):
    __tablename__ = 'tFile'
#     __table_args__ = {"useexisting": True} 

    nNum = Column(Integer, primary_key=True)
    sId = Column(String(30), ForeignKey(Member.sId))

    
    
    def __init__(self, sId):
        self.sId = sId
    
    
