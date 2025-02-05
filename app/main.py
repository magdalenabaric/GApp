from fastapi import FastAPI
from app.routes import users
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Art Gallery Backend")

# ruta za usere
app.include_router(users.router, prefix="/users")


@app.get("/")
def home():
    return {"message": "Dobrodošli u Art Gallery!"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dozvoli sve izvore
    allow_credentials=True,
    allow_methods=["*"],  # Dozvoli sve metode (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Dozvoli sve zaglavlja
)
