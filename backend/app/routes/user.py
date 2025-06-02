from fastapi import APIRouter , Depends , HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User , Role
from pydantic import BaseModel
from uuid import UUID
from app.dependencies.auth import require_admin

router= APIRouter(prefix="/users",tags=["users"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def list_user(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.delete("/{user_id}")
def deactive_user(user_id: UUID , db:Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404 , detail="User not Found")
    user.is_active= False
    db.commit()
    return {"msg": "User deactivated"}

class RoleUpdate(BaseModel):
    role_id: UUID

@router.put("/{user_id}/role")
def update_user_role(user_id: UUID , data:RoleUpdate , db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    role = db.query(Role).filter(Role.id == data.role_id).first()
    if not user or not role:
        raise HTTPException(status_code=404,detail="User or Role not found")
    user.role_id = role.id
    db.commit()
    return {"msg": "User role update"}

@router.get("/",dependencies=[Depends(require_admin)])
def list_users(db: Session=Depends(get_db)):
    return db.query(User).all()