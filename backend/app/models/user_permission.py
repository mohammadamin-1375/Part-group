from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid
from app.models.permission import Permission

class UserPermission(Base):
    __tablename__ = "user_permissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    permission_id = Column(UUID(as_uuid=True), ForeignKey("permissions.id"))

    user = relationship("User", back_populates="permissions")
    permission = relationship("Permission", back_populates="user_permissions")  # ارجاع با رشته مجازه
