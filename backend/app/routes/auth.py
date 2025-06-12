from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from app.db.database import SessionLocal
from app.services.auth_service import create_user, authenticate_user
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

# اتصال به DB برای هر درخواست
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# مدل ثبت‌نام
class RegisterSchema(BaseModel):
    username: str
    email: str
    password: str
    role_id: uuid.UUID  # نقش باید از قبل ساخته شده باشد

@router.post("/register")
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    
    # بررسی تکراری نبودن ایمیل
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # ساخت یوزر جدید
    user = create_user(db, data.username, email, data.password, data.role_id)
    return {"msg": "User registered successfully", "user_id": str(user.id)}

# مدل لاگین
class LoginSchema(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginSchema, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    return authenticate_user(db, email, data.password)

# گرفتن اطلاعات کاربر لاگین‌شده
@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role.name if current_user.role else None
    }
