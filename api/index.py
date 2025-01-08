from fastapi import FastAPI , UploadFile , File , Form 
from fastapi.responses import JSONResponse 
from fastapi.middleware.cors import CORSMiddleware
from api.models import SignupUser , LoginUser , UserSession , GetSessions
from api.db import AUTH_COLLECTION , CLIENT
import pandas as pd
import bcrypt

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or your Next.js production URL
    allow_credentials=True,
    allow_methods=["*"],  # Specify allowed methods
    allow_headers=["*"],  # Specify allowed headers
)
"""
    Endpoints till now :
ges
        /api/py/signup
        /api/py/login
        /api/py/check-session
        /api/py/get-display-data-for-new-session
        /api/py/save-new-session
        /api/py/get-session
        /api/py/load-session

"""


@app.post("/api/py/signup")
def add_user(newUser: SignupUser):  
    data = AUTH_COLLECTION.find_one({"username": newUser.username})   #Check if username already exists
    if data:
        return JSONResponse(content={"msg": "Username not available"}, status_code=400)
    
    if(newUser.repasswd != newUser.passwd): #Check if passwords match
        return JSONResponse(content={'msg': 'Passwords do not match'}, status_code=400)
    
    password = newUser.passwd.encode()  #Encrypting password
    hashed_passwd = bcrypt.hashpw(password, bcrypt.gensalt(10)).decode()
    newUser.passwd = hashed_passwd

    data = dict(newUser)
    data.pop('repasswd')
    AUTH_COLLECTION.insert_one(dict(data))
    
    return JSONResponse(content={'username': newUser.username}, status_code=200)

@app.post("/api/py/login")
def verify_user(verifyUser: LoginUser):
    data = AUTH_COLLECTION.find_one({"username": verifyUser.username})
    if not data:
        return JSONResponse(content={'msg': 'Username or Password is incorrect'}, status_code=401)
    
    valid = bcrypt.checkpw(verifyUser.passwd.encode(), data['passwd'].encode())
    if not valid:    
        return JSONResponse(content={'msg': 'Username or Password is incorrect'}, status_code=401)
    
    return JSONResponse(content={"username": data['username']}, status_code=200)

#for checking if session exists
@app.post("/api/py/check-session")
async def check_session(user: UserSession):
    DATA_DATABASE = CLIENT[user.username]
    isSession = user.session in DATA_DATABASE.list_collection_names()   
    if isSession:
        return JSONResponse(content={"msg": "exists"}, status_code=200)
    else:
        return JSONResponse(content={"msg": "doesn't exists"}, status_code=400)

#data display for new session
@app.post("/api/py/get-display-data-for-new-session")
async def one_time_data_display(file: UploadFile = File(...)):   
    try:
        df = pd.read_csv(file.file)
    except Exception:
        try:
            df = pd.read_excel(file.file)
        except Exception as e:
            return JSONResponse(content={"msg": str(e)}, status_code=400)
    df.drop(df.columns[df.isna().all() | (df == '').all()], axis=1, inplace=True)
    cols = df.columns.tolist()
    rows = df.astype(object).where(df.notna(), None).values.tolist()
    return JSONResponse(content={"head": cols, "body": rows}, status_code=200)

#for saving new session
@app.post('/api/py/save-new-session')
async def save_session(username: str = Form(...), session: str = Form(...), file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)
    except Exception:
        try:
            df = pd.read_excel(file.file)
        except Exception as e:
            return JSONResponse(content={"msg": str(e)}, status_code=400)
    df.drop(df.columns[df.isna().all() | (df == '').all()], axis=1, inplace=True)
    data = df.to_dict()
    for key in data:
        data[key] = {str(k): v for k, v in data[key].items()}

    data_changes = {'data': data}
    data = [
            {'_id': 'session_info' ,'filename': file.filename,'progress': 0},
            {'_id': 'original','data': data},
            {'_id': 'current' ,'data': data}    
        ]
    DATA_DATABASE = CLIENT[username]
    DATA_COLLECTION = DATA_DATABASE[session]
    DATA_COLLECTION.insert_many(data)
    CHANGES_COLLECTION = DATA_DATABASE[f'{session}.chngs']
    CHANGES_COLLECTION.insert_one(data_changes)
    return JSONResponse(content={"msg": "saved"}, status_code=201)

@app.post("/api/py/delete-session")
async def delete_session(user: UserSession):
    DATA_DATABASE = CLIENT[user.username]
    DATA_DATABASE.drop_collection(user.session)
    DATA_DATABASE.drop_collection(f'{user.session}.chngs')
    return JSONResponse(content={"msg": "deleted"}, status_code=200)

#get sessions for session dashboard
@app.post("/api/py/get-sessions")
async def get_sessions(user: GetSessions):
    DATA_DATABASE = CLIENT[user.username]
    sessions = DATA_DATABASE.list_collection_names()
    sessions = [x for x in sessions if not x.endswith('.chngs')]
    data = []
    for sess in sessions:
        DATA_COLLECTION = DATA_DATABASE[sess]
        current = DATA_COLLECTION.find_one({'_id': 'session_info'})
        dataType = {
            'session'  : sess,
            'filename' : current['filename'],
            'progress' : current['progress']
        }
        data.append(dataType)
    return JSONResponse(content=data, status_code=200)   

#for loading session 
@app.post('/api/py/load-session')
async def get_session_data(user: UserSession):
    DATA_DATABASE = CLIENT[user.username]       #Database name
    DATA_COLLECTION = DATA_DATABASE[user.session]   #Collection name
    
    def convert(data):
        for key in data:
            data[key] = {int(k): v for k, v in data[key].items()}
        df = pd.DataFrame(data)
        cols = df.columns.tolist()
        rows = df.astype(object).where(df.notna(), None).values.tolist()
        return cols,rows
    
    original = DATA_COLLECTION.find_one({"_id": "original"})['data']
    current = DATA_COLLECTION.find_one({"_id": "current"})['data']
    
    o_cols, o_rows = convert(current)
    c_cols ,c_rows = convert(original)

    original_data = {'head': c_cols, 'body': c_rows}   #Initialising Data
    current_data = {'head': o_cols , 'body': o_rows}

    return JSONResponse(content={'original':original_data,'current': current_data}, status_code=200)

