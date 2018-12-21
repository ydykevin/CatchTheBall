from flask import Flask, request, jsonify, json
from flask_restplus import Resource, Api, reqparse, cors, fields
from flask_socketio import SocketIO, emit, send, join_room, leave_room, disconnect
from DB import MongoDB, User, Room

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
        self.mdb = MongoDB()


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
            if db.mdb.find_user({"username":username,"password":password}):
                return jsonify({"login": True}), 200
            else:
                return jsonify({"login": False}), 200
        else:
            return jsonify({"login": False}), 400

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
            if db.mdb.find_user({"username":username}):
                return jsonify({"register": False}), 200
            else:
                # user = dict()
                # user['username'] = username
                # user['password'] = password
                # db.mdb.insertUser(user)
                user = User(username, password)
                user.save()
                return jsonify({"register": True}), 200
        else:
            return jsonify({"register": False}), 400

    @cors.crossdomain(origin='*', headers=['content-type'])
    def options(self):
        return {}, 200


@socketio.on('connect')
def connect():
    #emit('message', {'data': 'Connected'})
    print('connected ' + request.sid)

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected '+request.sid)
    #delete room and broadcast all rooms
    num = 0
    for r in Room.objects():
        userList = r['userList']
        for user in r['userList']:
            if request.sid == user['sid']:
                userList.remove(user)
                if not userList:
                    db.mdb.delete_room({"roomID":r['roomID']})
                    print("removed room")
                    print(request.sid)
                    break
                else:
                    r.update(userList=userList)
                    print("removed user")
                    print(request.sid)


@socketio.on('doDisconnect')
def doDisconnect():
    disconnect(sid=request.sid)

@socketio.on('create_room')
def create_room(args):
    print('create_room: ' + args)
    data = json.loads(args)
    roomID = 1
    while db.mdb.find_room({"roomID": roomID}):
        roomID = roomID + 1
    userList = [{"username":data['username'],"sid":request.sid}]
    newRoom = Room(roomID,userList)
    newRoom.save()
    roomList(True)


@socketio.on('join_room')
def join_room(args):
    print('join: ' + args + " "+request.sid)
    data = json.loads(args)
    for r in Room.objects():
        if r['roomID'] == data['roomID']:
            #print(r)
            userList = r['userList']
            userList.append({"username":data['username'],"sid":request.sid})
            r.update(userList=userList)
            roomInfo(data['roomID'])
            roomList(True)
            break


@socketio.on('roomList')
def roomList(broadcast):
    #print(broadcast)
    roomList = list()
    for r in db.mdb.get_collection('room').find():
        room = dict()
        room['roomID'] = r['roomID']
        room['userList'] = r['userList']
        roomList.append(room)
    emit('roomList', roomList, broadcast=broadcast)


@socketio.on('roomInfo')
def roomInfo(roomID):
    print("find roominfo: ",roomID)
    r = db.mdb.find_room({"roomID": roomID})
    #print(r['roomID'])
    #print(r['userList'])
    d = dict()
    d['roomID'] = r['roomID']
    d['userList'] = r['userList']
    roomInfo = list()
    roomInfo.append(d)
    emit('roomInfo', roomInfo)


if __name__ == '__main__':
    app.run(host="0.0.0.0")
