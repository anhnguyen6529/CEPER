from app import app, correction
from flask import jsonify, request
from flask_jwt_extended import jwt_required


@app.route('/spelling-error/process-result')
@jwt_required()
def getProcessResult():
    input = request.args.get('text')
    output = correction.getResult(input)
    result = dict()
    result["detection"] = output[0]
    result["correction"] = output[1]

    response = jsonify(result)
    return response
