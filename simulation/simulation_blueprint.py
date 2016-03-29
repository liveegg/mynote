# -*- coding: utf-8 -*- 
"""
    simulation.blueprint
    ~~~~~~~~~~~~~~~~~~

    mynote 어플리케이션에 적용할 blueprint 모듈.

"""

from flask import Blueprint 
from simulation.simulation_logger import Log 

simulationlog = Blueprint('simulationlog', __name__, 
                     template_folder='../templates', static_folder='../static') 

Log.info('static folder : %s' % simulationlog.static_folder) 

Log.info('template folder : %s' % simulationlog.template_folder)