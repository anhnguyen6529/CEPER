import bcrypt
from flask import Flask
from flaskext.mysql import MySQL
from flask_cors import CORS

mysql = MySQL()
app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': 'http://localhost:3000'}})

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'anhnguyen6529'
app.config['MYSQL_DATABASE_DB'] = 'CEPER'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
app.config['CORS_HEADERS'] = 'Content-Type'
mysql.init_app(app)
conn = mysql.connect()

from app import index_views, hsba_views, danh_sach_hsba_views, spelling_error_views
