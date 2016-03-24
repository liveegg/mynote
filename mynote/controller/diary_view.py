# -*- coding: utf-8 -*-
'''
Created on 2016. 3. 21.

@author: re0127
'''

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


@simulationlog.route('/diary/view')
def diary_view_form():
    """ 다이어리 작성하기 위해 작성 화면으로 전환시켜주는 함수 """
    
    print "aaa"
    form = ViewForm(request.form)
    
    print "form: ", form
    print "request : ", request.form
    
    return render_template('/diary/view.html')


class ViewForm(Form):
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

