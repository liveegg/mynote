# -*- coding: utf-8 -*-
'''
Created on 2016. 3. 25.

    파일 리스트, 업로드 모듈
  
@author: re0127
'''
  
from functools import wraps
from simulation.model.member import Member
  
from sqlalchemy.sql.functions import current_user, current_timestamp
from wtforms import Form, TextField, validators
from flask import request, redirect, url_for, current_app, render_template, session, jsonify
from simulation.database import category_dao
import uuid, os
from simulation.model.file import File
from simulation.controller.login import login_required
from simulation.simulation_logger import Log
from simulation.simulation_blueprint import simulationlog
from fileinput import filename
  
  
ALLOWED_EXTENSIONS = set(['jpg', 'jpeg', 'png', 'gif'])

  
def __allowed_file(filename):
    
    return '.' in filename and filename.rsplit('.', 1)[-1].lower() in ALLOWED_EXTENSIONS
  
  
@simulationlog.route('/file/upload', methods=['POST'])
@login_required
def upload_photo():
    """ Form으로 파일과 변수들을 DB에 저장하는 함수. """
    
    form = FileUploadForm(request.form)
            
    #: Session에 저장된 사용자 정보를 셋팅
    sId = session['user_info'].sId
        
 
    #: 업로드되는 파일정보 값들을 셋팅한다.
    upload_photo = request.files['fileName']
    
    
    try:
        #: 파일 확장자 검사 : jpg, jpeg, png, gif만 가능
        if upload_photo and __allowed_file(upload_photo.filename):
            sType = upload_photo.filename.rsplit('.', 1)[-1].lower()

                
            try :
            #: 사진에 대한 정보 DB에 저장
                file = File(sId, sType)
                category_dao.add(file)
                category_dao.commit()
         
            except Exception as e:
                category_dao.rollback()
                Log.error("Upload DB error : " + str(e))
                raise e
            
            #: 완전한 파일명
            newfileName = str(file.nNum) + "." + sType 
    
            #: 업로드 폴더 위치
            upload_folder = \
                os.path.join(current_app.root_path, 
                             current_app.config['UPLOAD_FOLDER'])
              
            upload_photo.save(os.path.join(upload_folder, newfileName))
                
                
        else:
            raise Exception("File upload error : illegal file.")
    
    except Exception as e:
        Log.error(str(e))
        raise e
    

    return redirect('/file/upload')
  
  
@simulationlog.route('/file/upload', defaults={'page': 1})
@simulationlog.route('/file/upload/<int:page>')
@login_required
def pg_show_all(page=1):    
        
    sId = session['user_info'].sId
    per_page = current_app.config['PER_PAGE']
    file_count = category_dao.query(File).count()
    pagination = Pagination(page, per_page, file_count)
        
    if page != 1:
        offset = per_page * (page - 1)
    else:
        offset = 0
        
    file_pages = category_dao.query(File). \
                        filter_by(sId=sId). \
                        order_by(File.nNum.desc()). \
                        limit(per_page). \
                        offset(offset). \
                        all()
                        
    
        
    return render_template('/file/list.html',
        pagination=pagination,
        tFile=file_pages) 
       
       
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
   
   
   
@simulationlog.route('/file/remove/<file_id>')
@login_required
def file_remove(file_id):
    """ DB에서 해당 데이터를 삭제한다."""
    
    sId = session['user_info'].sId

    try:
        file = category_dao.query(File).filter_by(nNum=str(file_id)).first()
       
        newfileName = str(file.nNum) + "." + str(file.sType) 
        upload_folder = os.path.join(current_app.root_path, 
                                     current_app.config['UPLOAD_FOLDER'])
        os.remove(upload_folder + newfileName)
        
        category_dao.delete(file)
        category_dao.commit()
        
        
    except Exception as e:
        category_dao.rollback()
        Log.error("File remove error => " + file_id + ":" + sId + ", " + str(e))
        raise e
        
        
    return "True"


class FileUploadForm(Form):
    """등록 화면에서 확장자를 검증함"""
   
    sType = TextField('sType', 
                            [validators.Length(
                                min=1, 
                                max=4 )])
    
       