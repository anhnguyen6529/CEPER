from app import app
from flask import jsonify, request
from flask_jwt_extended import jwt_required
from .modules.demo import getResult


@app.route('/spelling-error/process-result')
@jwt_required()
def getProcessResult():
    input = request.args.get('text')
    output = getResult(input)
    result = dict()
    result["detection"] = output[0]
    result["correction"] = output[1]

    response = jsonify(result)
    return response
