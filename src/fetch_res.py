from flask import Flask, request, jsonify
from http import HTTPStatus
from gevent import pywsgi
from flask_cors import CORS


import dashscope
from dashscope import Generation
from dashscope.api_entities.dashscope_response import Role

app = Flask(__name__)
CORS(app)
dashscope.api_key = "sk-d7ce18dedffc49cfb94e95bd4868d3a1"


@app.route('/test', methods=['POST'])
def conversation_with_messages():
    messages = [{'role': Role.SYSTEM, 'content': '你是专业心理咨询师'}]

    data = request.json
    user_input = data['user_input']
    print("user_input:",user_input)
    messages.append({'role': Role.USER, 'content': user_input})

    response = Generation.call(
        Generation.Models.qwen_turbo,
        messages=messages,
        result_format='message',  # set the result to be "message" format.
    )

    if response.status_code == HTTPStatus.OK:
        result = response.output.choices[0]['message']['content']
        messages.append({'role': response.output.choices[0]['message']['role'],
                         'content': response.output.choices[0]['message']['content']})
        print("result:",result)
        return jsonify({'result': result})
    else:
        error_message = 'Request id: %s, Status code: %s, error code: %s, error message: %s' % (
            response.request_id, response.status_code,
            response.code, response.message
        )
        return jsonify({'error': error_message}), 500


if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5000)
    server = pywsgi.WSGIServer(('localhost', 5000), app)
    server.serve_forever()