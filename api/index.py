from fastapi import FastAPI , UploadFile , File , Form 
from fastapi.responses import JSONResponse 
from api.models import SignupUser , LoginUser ,CheckSession
from api.db import AUTH_COLLECTION , CLIENT
import pandas as pd
import bcrypt



app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")


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

@app.post("/api/py/check-session")
async def check_session(user: CheckSession):
    DATA_DATABASE = CLIENT[user.username]
    isSession = user.session in DATA_DATABASE.list_collection_names()   
    if isSession:
        return JSONResponse(content={"msg": "exists"}, status_code=200)
    else :
        return JSONResponse(content={"msg": "doesn't exists"}, status_code=400)

@app.post("/api/py/get-display-data-for-new-session")
async def upload_data(file: UploadFile = File(...)):   
    try:
        df = pd.read_csv(file.file)
    except Exception:
        try:
            df = pd.read_excel(file.file)
        except Exception as e:
            return JSONResponse(content={"msg": str(e)}, status_code=400)
    
    df.fillna('', inplace = True)
    df = df.head()
    cols = df.columns.tolist()
    rows = df.values.tolist()
    return JSONResponse(content={"head": cols, "body": rows}, status_code=200)

@app.post('/api/py/save-session')
async def save_session(username: str = Form(...), session: str = Form(...), file: UploadFile = File(...)):
    try:
        df = pd.read_csv(file.file)
    except Exception:
        try:
            df = pd.read_excel(file.file)
        except Exception as e:
            return JSONResponse(content={"msg": str(e)}, status_code=400)
    data = df.to_dict()
    for key in data:
        data[key] = {str(k): v for k, v in data[key].items()}
    data = {'_id': 'data_original','filename': file.filename,'data': data}
    DATA_DATABASE = CLIENT[username]
    DATA_COLLECTION = DATA_DATABASE[session]
    DATA_COLLECTION.insert_one(data)
    return JSONResponse(content={"msg": "saved"}, status_code=200)