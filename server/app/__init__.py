from datetime import timedelta
from flask import Flask
from flaskext.mysql import MySQL
from flask_cors import CORS
from flask_jwt_extended import JWTManager

mysql = MySQL()
app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': 'http://localhost:3000'}})

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'anhnguyen6529'
app.config['MYSQL_DATABASE_DB'] = 'CEPER'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JWT_SECRET_KEY'] = b'_5#y2L"F4Q8z\n\xec]/'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=8)
jwt = JWTManager(app)
mysql.init_app(app)
conn = mysql.connect()

from app import auth_views, index_views, hsba_views, danh_sach_hsba_views, spelling_error_views
