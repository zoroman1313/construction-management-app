from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from parser import parse_receipt

app = FastAPI(title="OCR Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://YOUR-DOMAIN.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/v1/receipt:parse")
async def parse_endpoint(
    file: UploadFile = File(...),
    projectId: str | None = Form(default=None),
    locale: str = Form(default="en")
):
    image_bytes = await file.read()
    result = parse_receipt(image_bytes, locale=locale)
    return JSONResponse(result)


