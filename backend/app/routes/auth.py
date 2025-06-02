from fastapi import APIRouter , Depends , HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.services.auth_service import create_user
from pydantic import BaseModel
import uuid
from app.services.auth_service import authenticate_user
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth" , tags=["auth"])

#اتصال به DB برای هر درخواست
def get_db():
    db = SessionLocal()
    try :
        yield db
    finally:
        db.close()

#مدل ورودی
class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str
    role_id: uuid.UUID # باید نقش از قبل ساخته شده باشه

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    email =data.email.lower().strip()
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email Already registered")
    
    user = create_user(db ,data.username,data.email,data.password,data.role_id)
    return {"msg": "User registered successfully","user_id":str(user.id)}


class LoginSchema(BaseModel):
    email: str
    password: str
@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    email =data.email.lower().strip()
    return authenticate_user(db , data.email , data.password)

@router.get("/me")
def get_me(current_user: User=Depends(get_current_user)):
    return{
        "id":str(current_user.id),
        "username": current_user.username ,
        "email": current_user.email,
        "role": current_user.role.name
    }
