# -*- coding: utf-8 -*- 
""" 
    simulation.controller.link
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  
""" 

import os
import string
import requests
from urllib import quote

from flask import render_template, request, redirect , url_for, session, current_app, jsonify 
from werkzeug import generate_password_hash 
from simulation.simulation_logger import Log 
from simulation.simulation_blueprint import simulationlog 
from simulation.database import category_dao
from collections import defaultdict
from sqlalchemy import or_
from sqlalchemy.sql import text
from urlparse import urlparse

@simulationlog.route('/link/list', methods=['GET','POST']) 
def view_board_list():

    return render_template('/link/list.html', a='test')


