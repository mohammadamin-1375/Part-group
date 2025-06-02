from sqlalchemy.orm import Session
from app.utils.security  import hash_password
import uuid
from datetime import datetime
from app.models.user import User
from app.utils.security import verify_password
from app.utils.token import create_access_token
from fastapi import HTTPException

def create_user(db: Session, username: str, email: str ,password: str , role_id: str):
    new_user = User(
        id = uuid.uuid4(),
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

def authenticate_user(db,email: str , password: str):
    user = db.query(User).filter(User.email==email).first()
    if not user or not verify_password(password , user.hashed_password):
        raise HTTPException(status_code=401 , detail="Invalid Email Or Password")
    access_token = create_access_token(data={"sub":user.email})
    return {"access_token": access_token,"token_type":"bearer"}

