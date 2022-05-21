from datetime import timedelta
from os.path import join, dirname
from flask import Flask
from flaskext.mysql import MySQL
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from .modules.demo import AutoCorrection

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

mysql = MySQL()
app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': ['https://localhost:3000',
     'https://3542-2001-ee0-5206-4260-f5bb-4f0c-6934-dba.ap.ngrok.io']}})

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'anhnguyen6529'
app.config['MYSQL_DATABASE_DB'] = 'CEPER'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JWT_SECRET_KEY'] = b'_5#y2L"F4Q8z\n\xec]/'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
jwt = JWTManager(app)
correction = AutoCorrection()
mysql.init_app(app)

from app import auth_views, index_views, hsba_views, danh_sach_hsba_views, spelling_error_views
