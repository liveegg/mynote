# -*- coding: utf-8 -*-
'''
Created on 2016. 3. 15.

    다이어리 리스트 모듈

@author: re0127
'''

from functools import wraps
from simulation.model.member import Member
from datetime import datetime

from sqlalchemy.sql.functions import current_user, current_timestamp
from wtforms import Form, TextField, TextAreaField, HiddenField, validators
from flask import request, redirect, url_for, current_app, render_template, session, jsonify
from simulation.database import category_dao
from simulation.model.diary import Diary
from simulation.controller.login import login_required
from simulation.simulation_logger import Log
from simulation.simulation_blueprint import simulationlog

    
    
@simulationlog.route('/diary/list', defaults={'page': 1})
@simulationlog.route('/diary/list/<int:page>')
@login_required
def show_all(page=1):    
    
    sId = session['user_info'].sId
    per_page = current_app.config['PER_PAGE']
    diary_count = category_dao.query(Diary).count()
    pagination = Pagination(page, per_page, diary_count)
    
    if page != 1:
        offset = per_page * (page - 1)
    else:
        offset = 0
    
    diary_pages = category_dao.query(Diary). \
                        filter_by(sId=sId). \
                        order_by(Diary.nNum.desc()). \
                        limit(per_page). \
                        offset(offset). \
                        all()
    
    return render_template('/diary/list.html',
        pagination=pagination,
        tDiary=diary_pages) 
    
    
""" 출처 : http://flask.pocoo.org/snippets/44/ """

from math import ceil


class Pagination(object):
    
    def __init__(self, page, per_page, total_count):
        self.page = page
        self.per_page = per_page
        self.total_count = total_count

    @property
    def pages(self):
        return int(ceil(self.total_count / float(self.per_page)))

    @property
    def has_prev(self):
        return self.page > 1

    @property
    def has_next(self):
        return self.page < self.pages

    def iter_pages(self, left_edge=2, left_current=2,
                   right_current=5, right_edge=2):
        last = 0
        for num in xrange(1, self.pages + 1):
            if num <= left_edge or \
               (num > self.page - left_current - 1 and \
                num < self.page + right_current) or \
               num > self.pages - right_edge:
                if last + 1 != num:
                    yield None
                yield num
                last = num
    

@simulationlog.route('/diary/update/<diary_id>', methods=['POST'])
@login_required
def update(diary_id):
    """ 업로드 화면에서 사용자가 수정한 내용을 DB에 업데이트 한다. """

    form = UploadForm(request.form)
    
    if form.validate(): 
        #: 업데이트 대상 항목들
        sTitle = form.sTitle.data
        sContent = form.sContent.data
        dtWriteDate = datetime.today()
        
        try :
            #: 변경전 원래의 diary 테이블 값을 읽어 온다.
            diary = category_dao.query(Diary).filter_by(nNum=diary_id).first()
            #: 업데이트 값 셋팅
            diary.sTitle = sTitle
            diary.sContent = sContent
            diary.dtWriteDate = dtWriteDate
            
            category_dao.commit()
    
        except Exception as e:
            category_dao.rollback()
            Log.error("Update DB error : " + str(e))
            raise e
    
    return "True"



@simulationlog.route('/diary/update/<diary_id>')
@login_required
def update_form(diary_id):
    """ 업로드폼에서 입력한 값들을 수정하기 위해 DB값을 읽어와 업로드폼 화면으로 전달한다. """

    diary = category_dao.query(Diary).filter_by(nNum=diary_id).first()
    form = UploadForm(request.form, diary)
    
    return render_template('/diary/write.html', diary=diary, form=form)



@simulationlog.route('/diary/remove/<diary_id>')
@login_required
def remove(diary_id):
    """ DB에서 해당 데이터를 삭제한다."""

    sId = session['user_info'].sId
    
    try:
        diary = category_dao.query(Diary).filter_by(nNum=str(diary_id)).first()
        category_dao.delete(diary)
        category_dao.commit()

    except Exception as e:
        category_dao.rollback()
        Log.error("Diary remove error => " + diary_id + ":" + sId + ", " + str(e))
        raise e
    
    
    return "True"

    
class UploadForm(Form):
    """등록 화면에서 날짜을 검증함"""
    
    sTitle = TextField('sTitle', 
                    [validators.Length(
                        min=1, 
                        max=100 )])
    sContent = TextAreaField('sContent', 
                            [validators.Length(
                                min=1, 
                                max=1000 )])

    dtWriteDate = HiddenField('Write Date')