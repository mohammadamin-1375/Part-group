from fastapi import APIRouter , Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import Role
from pydantic import BaseModel

router = APIRouter(prefix="/roles",tags=["roles"])

#اتصال به دیتابیس
def get_db():
    db=SessionLocal()
    try :
        yield db 
    finally:
        db.close()

#مدل ورودی برای ایجاد نقش درست کنیم 
class RoleCreate(BaseModel):
    name: str

@router.post("/create")
def create_role(data: RoleCreate , db: Session= Depends(get_db)):
    role = db.query(Role).filter(Role.name==data.name).first()
    if role:
        raise HTTPException(status_code=400,detail="Role already exists")
    
    new_role=Role(name=data.name)
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return {"msg":"Rolew created" , "role_id":str(new_role.id)}

@router.get("/list")
def list_roles(db: Session=Depends(get_db)):
    roles = db.query(Role).all()
    return roles
