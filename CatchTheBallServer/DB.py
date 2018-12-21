import pymongo
from mongoengine import StringField, Document, connect, ListField, IntField

connect('ball123', host='mongodb://ball123:ball123@ds139334.mlab.com:39334/ball')

class MongoDB:
    def __init__(self, url='mongodb://ball123:ball123@ds139334.mlab.com:39334/ball',db_name='ball'):
        myclient = pymongo.MongoClient(url)
        self.db = myclient.get_database(db_name)

    def get_collection(self, name):
        return self.db.get_collection(name)

    def add_user(self, data):
        return self.get_collection('user').insert_one(data)

    def delete_user(self, data):
        return self.get_collection('user').delete_one(data)
        
    def find_user(self, q=None, arg=None):
        return self.get_collection('user').find_one(q,arg)

    def add_room(self, data):
        return self.get_collection('room').insert_one(data)

    def delete_room(self, data):
        return self.get_collection('room').delete_one(data)

    def find_room(self, q=None, arg=None):
        return self.get_collection('room').find_one(q, arg)


class User(Document):
    username = StringField(required=True)
    password = StringField(required=True)
    sid = StringField()
    roomID = IntField()

    def __init__(self, username, password, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.username = username
        self.password = password



    # def get_username(self):
    #     return self.username
    #
    # def get_password(self):
    #     return self.password

    # def get_sid(self):
    #     return self.sid
    #
    # def set_sid(self, sid):
    #     self.sid = sid

    #def set_password(self, password):
    #    self.password = generate_password_hash(password)


class Room(Document):
    roomID = IntField(required=True)
    userList = ListField(required=True)

    def __init__(self, roomID, userList, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.roomID = roomID
        self.userList = userList

    def get_roomID(self):
        return self.roomID

    def get_userList(self):
        return self.userList