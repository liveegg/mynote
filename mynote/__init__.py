# -*- coding: utf-8 -*-
"""
    mynote
    ~~~~~~
    
    mynote 애플리케이션 패키지.
"""

from flask import Flask

app = Flask(__name__)

app.config.from_object('config')

from mynote.note.controllers import note

app.register_blueprint(note)
