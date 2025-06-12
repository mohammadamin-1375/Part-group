from sqlalchemy.orm import Session
from app.utils.security import hash_password, verify_password
from app.models.user import User, Role
from app.utils.token import create_access_token
from fastapi import HTTPException
import uuid
from datetime import datetime

def create_user(db: Session, username: str, email: str, password: str, role_id: str):
    # پاکسازی و استانداردسازی ایمیل
    email = email.strip().lower()

    # بررسی عدم تکرار ایمیل
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # بررسی وجود نقش
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role ID")

    # ساخت یوزر
    new_user = User(
        id=uuid.uuid4(),
        username=username,
        email=email,
        hashed_password=hash_password(password),
        role_id=role_id,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, email: str, password: str):
    # پاکسازی و استانداردسازی ایمیل
    email = email.strip().lower()

    # دریافت یوزر
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid Email or Password")

    # ساخت توکن JWT
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
