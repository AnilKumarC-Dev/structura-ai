from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_router

app = FastAPI(
    title="Engineering Knowledge Fabric",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_origin_regex=r"http://(127\.0\.0\.1|192\.168\.\d+\.\d+):3000",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "application": "Engineering Knowledge Fabric",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

app.include_router(
    upload_router,
    prefix="/api"
)