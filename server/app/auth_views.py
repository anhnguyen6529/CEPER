from app import app, mysql
from flask import request, jsonify
from flask_jwt_extended import create_access_token, unset_jwt_cookies


@app.route('/login', methods=['POST'])
def login():
    params = request.json
    conn = mysql.connect()
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
        conn.close()
        return response
    else:
        cursor.close()
        if len(data) == 0:
            return {"msg": "Not found"}, 404
        else:
            return {"msg": "Wrong username or password"}, 401


@app.route('/logout', methods=['GET'])
def logout():
    response = jsonify(dict())
    unset_jwt_cookies(response)
    return response
