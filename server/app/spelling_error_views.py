from app import app
from flask import jsonify, request
from flask_jwt_extended import jwt_required


@app.route('/spelling-error/process-result')
@jwt_required()
def getProcessResult():
    text = request.args.get('text')
    result = dict()

    if "kháng sinh, men vi snh, chốngg ói, hạ sốt kháng sinh, men vi snh, chốngg ói, hạ sốt kháng sinh, men vi snh, chốngg ói, hạ sốt kháng sinh, men vi snh, chốngg ói, hạ sốt kháng sinh, men vi snh, chốngg ói, hạ sốt" in text:
        result["detection"] = "kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt"
        result["correction"] = [["sinh", "khuẩn"], ["chống"], ["sinh", "khuẩn"], ["chống"], [
            "sinh", "khuẩn"], ["chống"], ["sinh", "khuẩn"], ["chống"], ["sinh", "khuẩn"], ["chống"]]
    elif "kháng sinh, men vi snh, chốngg ói, hạ sốt kháng sinh, men vi snh, chốngg ói, hạ sốt" in text:
        result["detection"] = "kháng sinh, men vi <mask>, <mask> ói, hạ sốt kháng sinh, men vi <mask>, <mask> ói, hạ sốt"
        result["correction"] = [["sinh", "khuẩn"], [
            "chống"], ["sinh", "khuẩn"], ["chống"]]
    else:
        result["detection"] = ""
        result["correction"] = []

    response = jsonify(result)
    return response
