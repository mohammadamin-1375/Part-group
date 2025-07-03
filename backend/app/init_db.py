from app.db.database import Base, engine
from app.models.user import User, Role
from app.models.permission import Permission
from app.models.user_permission import UserPermission



Base.metadata.create_all(bind=engine)
print("Database tables created.")
