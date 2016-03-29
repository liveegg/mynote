# -*- coding: utf-8 -*- 
""" 
	runserver 
	~~~~~~~~~ 
	
	테스트 서버 실행. 
""" 

import sys 
from simulation import create_app 

reload(sys) 
sys.setdefaultencoding('utf-8') 

application = create_app()

if __name__ == '__main__': 
	print "starting test server..." 
	application.run(host='0.0.0.0', port=5000, debug=True)