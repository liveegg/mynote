# -*- coding: utf-8 -*-
"""
    mynote.note.controllers
    ~~~~~~~~~~~~~~~~~~~~~~~
    
    노트 읽기/쓰기/수정/삭제, 목록 조회 등 노트 관련 컨트롤러 모듈.
"""

from flask import Blueprint, render_template

note = Blueprint('note', __name__)

@note.route('/')
def index():
    return render_template('note/list.html')