from datetime import datetime, timedelta, timezone
from app import app, conn
from flask import request, jsonify
from flask_jwt_extended import create_access_token, unset_jwt_cookies, get_jwt, get_jwt_identity
import json


@app.after_request
def refresh_expiring_jwts(response):
    if request.endpoint not in ['login', 'logout']:
        try:
            exp_timestamp = get_jwt()['exp']
            now = datetime.now(timezone.utc)
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                data = response.get_json()
                if type(data) is dict:
                    data['token'] = access_token
                    response.data = json.dumps(data)
            return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            return response
    else:
        return response


@app.route('/login', methods=['POST'])
def login():
    params = request.json
    cursor = conn.cursor()
    cursor.execute(
        "SELECT ID, Username, Password, Role, Name, Position FROM USERS WHERE Username = %s AND Role = %s;", (params["username"], params["role"]))
    conn.commit()
    data = list(cursor.fetchall())
    if len(data) > 0 and params["password"] == data[0][2]:
        access_token = create_access_token(identity=data[0][0])
        result = dict()
        result["token"] = access_token
        result["user"] = {"id": data[0][0], "username": data[0][1],
                          "role": data[0][3], "name": data[0][4], "position": data[0][5]}
        response = jsonify(result)
        cursor.close()
        return response
    else:
        cursor.close()
        if len(data) == 0:
            return {"msg": "Not found"}, 404
        else:
            return {"msg": "Wrong username or password"}, 401


@app.route('/logout')
def logout():
    response = jsonify(dict())
    unset_jwt_cookies(response)
    return response