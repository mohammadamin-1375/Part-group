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
# viwe list user for Admin ,dependencies=[Depends(require_admin)]
@router.get("/")
def list_user(db: Session =Depends(get_db)):
    users = db.query(User).all()
    result=[]
    for user in users:
        permissions=[up.permission.name for up in user.permissions] if user.permissions else []
        result.append({
            "id":str(user.id),
            "username": user.username,
            "email":user.email,
            "is_active": user.is_active,
            "role": user.role.name if user.role else None,
            "permissions": permissions
        })
    return result

# deactive user
@router.delete("/{user_id}",dependencies=[Depends(require_admin)])
def deactive_user(user_id: UUID , db:Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404 , detail="User not Found")
    user.is_active= False
    db.commit()
    return {"msg": "User deactivated"}

#Change Role
class RoleUpdate(BaseModel):
    role_id: UUID

@router.put("/{user_id}/role" , dependencies=[Depends((require_admin))])
def update_user_role(user_id: UUID , data:RoleUpdate , db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    role = db.query(Role).filter(Role.id == data.role_id).first()
    if not user or not role:
        raise HTTPException(status_code=404,detail="User or Role not found")
    user.role_id = role.id
    db.commit()
    return {"msg": "User role update"}