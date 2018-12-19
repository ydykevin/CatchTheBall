import pymongo

class MongoDB:
    def __init__(self, url='mongodb://ball123:ball123@ds139334.mlab.com:39334/ball',db_name='ball'):
        myclient = pymongo.MongoClient(url)
        self.db = myclient.get_database(db_name)

    def getCollection(self, name):
        return self.db.get_collection(name)

    def insertUser(self, data):
        return self.getCollection('User').insert_one(data)

    def deleteUser(self, data):
        return self.getCollection('User').delete_one(data)
        
    def findUser(self, q=None, arg=None):
        return self.getCollection('User').find_one(q,arg);


