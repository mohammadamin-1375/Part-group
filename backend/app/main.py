from fastapi import FastAPI
from app.routes import auth, role, user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Part Chat Massenger" , debug=True)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(role.router)
app.include_router(user.router)

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}
