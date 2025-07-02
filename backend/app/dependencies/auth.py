from fastapi import Depends,HTTPException,status
from jose import JWTError,jwt
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer


load_dotenv()
SECRET_KEY= os.getenv("SECRET_KEY")
ALGORITHM= os.getenv("ALGORITHM")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
def get_db():
    db =SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db) ):
    try:
        token = token.replace("Bearer ","")
        payload = jwt.decode(token, SECRET_KEY,algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401,detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid")
    user= db.query(User).filter(User.email==email).first()
    if user is None or not user.is_active:
        raise HTTPException(status_code=401,detail="User not found or inactive")
    
    return user

def require_admin(user: User = Depends(get_current_user)):
    if user.role.name !="ali":
        raise HTTPException(status_code=403 , detail="admin access required")
    return user