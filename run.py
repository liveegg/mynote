# -*- coding: utf-8 -*-
"""
    run
    ~~~
    
    로컬 테스트를 위한 개발서버 실행 모듈.
"""

import sys
from simulation import create_app 

reload(sys)
sys.setdefaultencoding('utf-8')

application = create_app() 

if __name__ == '__main__':
    # Run a test server.
    application.run(host='0.0.0.0', port=5000, debug=True,  use_reloader=True)