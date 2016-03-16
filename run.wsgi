# -*- coding: utf-8 -*-
"""
    run.wsgi
    ~~~~~~~~
    
    uWSGI 애플리케이션 서버 실행을 위한 WSGI 모듈.
"""

import sys

reload(sys)
sys.setdefaultencoding('utf-8')

from mynote import app