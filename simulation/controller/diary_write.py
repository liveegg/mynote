# -*- coding: utf-8 -*-
'''
Created on 2016. 3. 18.

@author: re0127
'''

from datetime import datetime
from functools import wraps
from simulation.model.member import Member

from sqlalchemy.sql.functions import current_user, current_timestamp
from wtforms import Form, TextField, TextAreaField, HiddenField, validators
from flask import request, redirect, url_for, current_app, render_template, session, jsonify
from simulation.database import category_dao
from simulation.model.diary import Diary
from simulation.controller.login import login_required
from simulation.simulation_logger import Log
from simulation.simulation_blueprint import simulationlog



@simulationlog.route('/diary/write')
def diary_write_form():
    """ 다이어리 작성하기 위해 작성 화면으로 전환시켜주는 함수 """
    
    return render_template('/diary/write.html')


@simulationlog.route('/diary/write2', methods=['POST'])
@login_required
def write_check():
    """ Form으로 변수들을 DB에 저장하는 함수. """
  
    form = WriteForm(request.form)

#     HTTP POST로 요청이 오면 사용자 정보를 등록
#     if form.validate():  
    #: Session에 저장된 사용자 정보를 셋팅
    sId = session['user_info'].sId
    sPassword = session['user_info'].sPassword
          
          
        #: Form으로 넘어온 변수들의 값을 셋팅함
    sTitle = form.sTitle.data
    sContent = form.sContent.data
    dtWriteDate = datetime.today()
    
 
    try :
        #: 다이어리에 대한 정보 DB에 저장
        diary = Diary(sTitle, sContent, dtWriteDate, sId)
        category_dao.add(diary)
        category_dao.commit()
    
    except Exception as e:
        error = "Upload DB error : " + str(e)
        Log.error(error)
        category_dao.rollback()
        raise e
        

    return "True"
    
    
class WriteForm(Form):
    """다이어리 등록 화면에서 다이어리 작성한 내용을 검증함"""
    
    sTitle = TextField('sTitle', 
                    [validators.Length(
                        min=1, 
                        max=100, 
                        message='100자리 이하로 입력하세요.')])
    sContent = TextAreaField('sContent', 
                            [validators.Length(
                                min=1, 
                                max=1000, 
                                message='1000자리 이하로 입력하세요.')])

    dtWriteDate = HiddenField('Write Date')