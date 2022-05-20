from datetime import datetime
import json
from app import app, mysql
from flask import request, jsonify
from flask_jwt_extended import create_access_token, unset_jwt_cookies, jwt_required


@app.route('/login', methods=['POST'])
def login():
    params = request.json
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM USERS WHERE Username = %s AND Role = %s;", (params["username"], params["role"]))
    conn.commit()
    user_key = ["id", "username", "", "avatar", "role", "name", "dateOfBirth", "gender",
                "address", "email", "phone", "speciality", "department", "medicalLicenseNo", "signature", "position"]
    data = list(cursor.fetchall())
    if len(data) > 0 and params["password"] == data[0][2]:
        access_token = create_access_token(identity=data[0][0])
        result = dict()
        result["token"] = access_token
        result["user"] = dict()
        for i in range(0, len(user_key)):
            if i != 2:
                result["user"][user_key[i]] = data[0][i]
        result["settings"] = dict()
        result["settings"]["appearance"] = dict()
        result["settings"]["appearance"]["accentColor"] = data[0][len(
            user_key)]
        result["settings"]["functionality"] = dict()
        result["settings"]["functionality"]["autoUpdateWithProcessResult"] = bool(
            data[0][len(user_key) + 1])
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


@app.route('/user/<id>/notifications', methods=['GET'])
@jwt_required()
def getNotifications(id):
    result = dict()
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT ID, Type, Content, Time_Created, Time_Seen FROM NOTIFICATIONS WHERE User_ID = %s AND Status = 'Chưa đọc' ORDER BY Time_Created DESC;", (id))
    conn.commit()

    notifications = []
    for dt in cursor.fetchall():
        d = dict()
        d["id"] = dt[0]
        d["type"] = dt[1]
        d["content"] = json.loads(dt[2])
        d["timeCreated"] = dt[3]
        d["timeSeen"] = dt[4]
        notifications.append(d)
    result["notifications"] = notifications

    response = jsonify(result)
    cursor.close()
    conn.close()
    return response


@app.route('/user/<uid>/notifications/<nid>')
@jwt_required()
def markNotificationSeen(uid, nid):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE NOTIFICATIONS SET Status = \'Đã đọc\', Time_Seen = %s WHERE User_ID = %s AND ID = %s;", (now, uid, nid))
    conn.commit()
    response = jsonify({"msg": "Successfully!"})
    cursor.close()
    conn.close()
    return response


@app.route('/user/<uid>/settings/appearance/accent-color')
@jwt_required()
def changeAccentColor(uid):
    color = request.args.get('color')
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE USERS SET Accent_Color = %s WHERE ID = %s;", (color, uid))
    conn.commit()
    response = jsonify({"msg": "Change accent color succesfully!"})
    cursor.close()
    conn.close()
    return response


@app.route('/user/<uid>/settings/functionality/auto-update-with-process-result')
@jwt_required()
def toggleAutoUpdateWithProcessResult(uid):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE USERS SET Auto_Update_With_Process_Result = NOT Auto_Update_With_Process_Result WHERE ID = %s;", (uid))
    conn.commit()
    response = jsonify(
        {"msg": "Change auto update with process result succesfully!"})
    cursor.close()
    conn.close()
    return response


@app.route('/user/<uid>', methods=['POST'])
@jwt_required()
def updateUserInfo(uid):
    data = request.json
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute("UPDATE USERS SET Email = %s, Phone = %s, Address = %s WHERE ID = %s;",
                   (data["email"], data["phone"], data["address"], uid))
    conn.commit()
    response = jsonify(
        {"msg": "Update user information succesfully!"})
    cursor.close()
    conn.close()
    return response
