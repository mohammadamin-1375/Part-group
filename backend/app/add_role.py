from app.db.database import SessionLocal
from app.models.user import Role
import uuid

db = SessionLocal()

admin_role = Role(
    id=uuid.UUID("11111111-1111-1111-1111-111111111111"),
    name="admin"
)

db.add(admin_role)
db.commit()
db.close()

print("Admin role created.")