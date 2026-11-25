import os
from azure.storage.blob import BlobServiceClient
from azure.storage.blob import ContentSettings
from azure.core.pipeline.transport import RequestsTransport


def get_blob_service_client():
    connection_string = os.getenv(
        "AZURE_STORAGE_CONNECTION_STRING"
    )

    transport = RequestsTransport(
        connection_verify=False
    )

    return BlobServiceClient.from_connection_string(
        connection_string,
        transport=transport
    )


async def upload_file_to_blob(
    file_name,
    file_content,
    content_type
):
    container_name = os.getenv(
        "AZURE_BLOB_CONTAINER"
    )

    if content_type == "application/pdf":
        blob_name = f"pdfs/{file_name}"
    else:
        blob_name = f"images/{file_name}"

    blob_service_client = get_blob_service_client()

    blob_client = blob_service_client.get_blob_client(
        container=container_name,
        blob=blob_name
    )

    blob_client.upload_blob(
        file_content,
        overwrite=True,
        content_settings=ContentSettings(
            content_type=content_type
        )
    )

    return blob_client.url