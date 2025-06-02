from datetime import datetime, timedelta
from jose import JWSError,jwt
import os
from dotenv import load_dotenv
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM= os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES",60))

def create_access_token(data: dict):
 to_encode=data.copy()
 expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
 to_encode.update({"exp":expire})
 encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
 return encoded_jwt
