import pymongo as pg
import os 

MONGO_URI = os.environ.get("DB_KEY")
CLIENT = pg.MongoClient(MONGO_URI)
AUTH_DATABASE = CLIENT['AUTH']
AUTH_COLLECTION = AUTH_DATABASE['USER_DATA']