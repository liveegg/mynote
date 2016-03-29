# -*- coding: utf-8 -*-
"""
    simulation.model.member
    ~~~~~~~~~~~~~~~~~~~

    mynote 어플리케이션을 사용할 사용자 정보에 대한 model 모듈.

"""

from sqlalchemy import Column, String
# from sqlalchemy.orm import relationship

from simulation.model import Base 


class Member(Base):
    __tablename__ = 'tMember'
#     __table_args__ = {"useexisting": True} 

    sId = Column(String(30), primary_key=True)
    sPassword = Column(String(66), unique=False)

#     diary = relationship('Diary',
#                           backref='member', 
#                           cascade='all, delete, delete-orphan')
    
    
    def __init__(self, sId, sPassword):
        self.sId = sId
        self.sPassword = sPassword
    
    
