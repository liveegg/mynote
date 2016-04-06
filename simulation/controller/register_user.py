# -*- coding: utf-8 -*-
"""
    simulation.controller.register_user
    ~~~~~~~~~~~~~~~~~~~~~~~~~

    회원가입 등록 모듈.

"""

from sqlalchemy.sql.functions import current_user
from simulation.model.member import Member
from simulation.database import DBManager
from flask import render_template, request, redirect , url_for, session, current_app, jsonify 
from wtforms import Form, TextField, PasswordField, HiddenField, validators
from werkzeug import generate_password_hash 
from simulation.simulation_logger import Log 
from simulation.simulation_blueprint import simulationlog 
from simulation.database import category_dao


@simulationlog.route('/regist')
def register_user_form():
    """simulationlog 사용자 등록을 위한 폼을 제공하는 함수"""
    
    return render_template('/root/regist.html')


@simulationlog.route('/regist', methods=['POST'])
def register_user():
    """simulationlog 사용자 등록을 위한 함수"""
    
    form = RegisterForm(request.form)

    sId = form.sId.data
    sPassword = form.sPassword.data
    
    try:
        member = Member(sId,
                    generate_password_hash(sPassword))
        category_dao.add(member)
        category_dao.commit()
    
        Log.debug(member) 
        
    except Exception as e:
        error = "DB error occurs : " + str(e)
        Log.error(error)
        category_dao.rollback()
        raise e
    
#     else:
#         # 성공적으로 사용자 등록이 되면, 로그인 화면으로 이동.
#         return redirect(url_for('.login', 
#                                 regist_sId=sId)) 
#     else:
#         return render_template('/root/regist.html', form=form)
    
    return "True"
          
        
def __get_user(sId):
    
    # db에 기존에 있는 id값을 가져옴 
    try:
        current_user = category_dao.query(Member).filter_by(sId=sId).first()
              
        Log.debug(current_user)
        return current_user
  
    except Exception as e:
        Log.error(str(e))
        raise e
     
    
@simulationlog.route('/regist/check_name', methods=['POST'])
def check_name():
    
    sId = request.form['sId']
    
    # : DB에서 sId 중복 확인
    if __get_user(sId) :
        return jsonify(result=False)
    else:
        return jsonify(result=True)
 
            
            
class RegisterForm(Form):
    """사용자 등록 화면에서 사용자명, 비밀번호 값을 검증함"""
    
    sId = TextField('sPassword',
                         [validators.Required('사용자명을 입력하세요.'),
                          validators.Length(
                            min=4,
                            max=10 )])
    
    sPassword = \
        PasswordField('sPassword',
                      [validators.Required('비밀번호를 입력하세요.'),
                       validators.Length(
                        min=4,
                        max=8 )])
        
    sPassword_confirm = PasswordField('Confirm Password')
    
    sId_check = \
        HiddenField('sId Check')
    
        
                  
