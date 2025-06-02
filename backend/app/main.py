from fastapi import FastAPI
from app.routes import auth
from app.routes import role
from app.routes import user
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Part Chat Massenger")
app.include_router(auth.router)
app.include_router(role.router)
app.include_router(user.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")

def read_root():
    return {"message": "Backend is working!"}