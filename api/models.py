from pydantic import BaseModel


class SignupUser(BaseModel):
    username : str
    passwd : str
    repasswd : str

class LoginUser(BaseModel):
    username : str
    passwd : str

class CheckSession(BaseModel):
    username : str
    session : str

