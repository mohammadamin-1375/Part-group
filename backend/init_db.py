from app.db.database import Base, engine
from app.models.user import User, Role

Base.metadata.create_all(bind=engine)
print("Database tables created.")
