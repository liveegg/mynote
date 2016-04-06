# -*- coding: utf-8 -*-
"""
    mynote.controller.login
    ~~~~~~~~~~~~~~~~~~~~~~~~~

    로그인 확인 데코레이터와 로그인 처리 모듈.

"""
from functools import wraps
from sqlalchemy.sql.functions import current_user
from simulation.model.member import Member
from flask import render_template, request, redirect , url_for, session, current_app, jsonify 
from wtforms import Form, TextField, PasswordField, HiddenField, validators
from werkzeug import check_password_hash, generate_password_hash 
from simulation.simulation_logger import Log 
from simulation.simulation_blueprint import simulationlog 
from simulation.database import category_dao


@simulationlog.route
def close_db_session(exception=None):
    """요청이 완료된 후에 db연결에 사용된 세션을 종료함"""
    
    try:
        category_dao.remove()
    except Exception as e:
        Log.error(str(e))
    
def login_required(f):
    """현재 사용자가 로그인 상태인지 확인하는 데코레이터
    로그인 상태에서 접근 가능한 함수에 적용함
    """
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:

            session_key = request.cookies.get(
                    current_app.config['SESSION_COOKIE_NAME'])

            is_login = False
            if session.sid == session_key and session.__contains__('user_info') : is_login = True

            if not is_login:
                return redirect(url_for('.login', 
                                        next=request.url))

            return f(*args, **kwargs)

        except Exception as e:
            print e
            """
            Log.error("mynote error occurs : %s" % 
                      str(e))
            """
            pass
            raise e

    return decorated_function


@simulationlog.route('/')
@login_required
def index():
    """로그인이 성공한 다음에 보여줄 초기 페이지"""

    return redirect('/diary/list')


@simulationlog.route('/login')
def login_form():
    """아이디/비밀번호 기반의 로그인 화면을 제공함 """

    regist_sId = request.args.get('regist_sId', '')    

    return render_template('/root/login.html',
                           regist_sId=regist_sId)
    
    

@simulationlog.route('/login', methods=['POST'])
def login():
    """아이디/비밀번호 기반의 로그인 기능을 제공함
    로그인 성공 시 세션에 사용자 정보를 저장하여 사용함
    """
    form = LoginForm(request.form)
    login_error = None
    
    if form.validate():
        session.permanent = True
    
        sId = form.sId.data
        sPassword = form.sPassword.data
    #     next_url = form.next_url.data
        
        try:
            member = category_dao.query(Member).filter_by(sId=sId).first()
            
        except Exception as e:
            Log.error(str(e))
            raise e
            
            
        if member:
            if not check_password_hash(member.sPassword, sPassword):
                login_error = 'Invalid password'
                return "False"
            else:
                # 세션에 추가할 정보를 session 객체의 값으로 추가함
                # 가령, User 클래스 같은 사용자 정보를 추가하는 객체 생성하고
                # 사용자 정보를 구성하여 session 객체에 추가
                session['user_info'] = member
    #             if next_url != '':
    #                 return redirect(next_url)
    #             else:
    #                 return redirect(url_for('.index'))
        else:
            login_error = 'member does not exist!'
            return "False"
        
    return "True"
     

@simulationlog.route('/logout')
@login_required
def logout():
    """로그아웃 시에 호출되며 세션을 초기화함"""
    
    session.clear()

    return redirect('/login')
#     return redirect(url_for('.login'))


class LoginForm(Form):
    """로그인 화면에서 사용자명과 비밀번호 입력값을 검증함"""
    sId = TextField('sId', 
                         [validators.Required('사용자명을 입력하세요.'),
                          validators.Length(
                            min=4, 
                            max=50 )])
    
    sPassword = \
        PasswordField('sPassword', 
                      [validators.Required('비밀번호를 입력하세요.'),
                       validators.Length(
                        min=4, 
                        max=8 )])
        
    
    next_url = HiddenField('Next URL')

    
        