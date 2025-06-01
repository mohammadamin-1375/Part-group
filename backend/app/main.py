from fastapi import FastAPI

app = FastAPI(title="Part Group")

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}