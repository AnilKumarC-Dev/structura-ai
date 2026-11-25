from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

from app.services.blob_service import upload_file_to_blob

router = APIRouter()


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):
    allowed_types = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "image/jpg"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and image files are supported."
        )

    file_content = await file.read()

    blob_url = await upload_file_to_blob(
        file_name=file.filename,
        file_content=file_content,
        content_type=file.content_type
    )

    return {
        "fileName": file.filename,
        "contentType": file.content_type,
        "blobUrl": blob_url,
        "status": "uploaded"
    }