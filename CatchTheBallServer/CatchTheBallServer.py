from flask import Flask, request, jsonify
from flask_restplus import Resource, Api, reqparse, cors, fields
from flask_socketio import SocketIO, emit, send, join_room, leave_room, disconnect
import DB

app = Flask(__name__)
api = Api(app, default='CatchTheBall', default_label='Server')
socketio = SocketIO(app)

parser = reqparse.RequestParser()
parser.add_argument('username')
parser.add_argument('password')

form = api.model('form', {
    'username': fields.String,
    'password': fields.String
})


class Database:
    def __init__(self):
        self.mdb = DB.MongoDB()


db = Database();


@api.route('/login')
@api.expect(form, validate=True)
@api.expect(parser)
class Login(Resource):
    @cors.crossdomain(origin='*', headers=['content-type'])
    def post(self):
        username = parser.parse_args()['username']
        password = parser.parse_args()['password']
        if username and password:
            if db.mdb.findUser({"username":username,"password":password}):
                return (jsonify({"Login": True}), 200)
            else:
                return (jsonify({"Login": False}), 200)
        else:
            return (jsonify({"Login": False}), 400)

    @cors.crossdomain(origin='*', headers=['content-type'])
    def options(self):
        return {}, 200


@api.route('/register')
@api.expect(form, validate=True)
@api.expect(parser)
class Register(Resource):
    @cors.crossdomain(origin='*', headers=['content-type'])
    def post(self):
        username = parser.parse_args()['username']
        password = parser.parse_args()['password']
        if username and password:
            if db.mdb.findUser({"username":username,"password":password}):
                return (jsonify({"Register": False}), 200)
            else:
                user = dict()
                user['username'] = username
                user['password'] = password
                db.mdb.insertUser(user)
                return (jsonify({"Register": True}), 200)
        else:
            return (jsonify({"Register": False}), 400)

    @cors.crossdomain(origin='*', headers=['content-type'])
    def options(self):
        return {}, 200


@socketio.on('connect', namespace='/chat')
def test_connect():
    emit('my response', {'data': 'Connected'})


if __name__ == '__main__':
    app.run(host="0.0.0.0")
