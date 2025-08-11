from fastapi import FastAPI, HTTPException, UploadFile, Form, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import aiplatform
from vertexai.generative_models import GenerativeModel, Part
from typing import List

MAX_FILE_SIZE_MB = 50
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with exact extension origin if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Vertex AI
aiplatform.init(project="dr-xray", location="us-central1")
model = GenerativeModel("gemini-2.5-flash")  # or "gemini-2.5-flash" if it supports multimodal

@app.post("/api/gemini")
async def gemini_endpoint(
    prompt: str = Form(""),
    files: List[UploadFile] = File(default=[]),
    temperature: float = Form(0.7),
    max_tokens: int = Form(2048),
):
    try:
        if not prompt and not files:
            raise HTTPException(status_code=400, detail="Prompt or at least one file is required.")

        # Prepare input parts
        input_parts = [prompt.strip()] if prompt.strip() else []

        for file in files:
            file_bytes = await file.read()
            if len(file_bytes) > MAX_FILE_SIZE_BYTES:
                raise HTTPException(
                    status_code=400,
                    detail=f"File '{file.filename}' too large. Max size is {MAX_FILE_SIZE_MB}MB."
                )

            input_parts.append(
                Part.from_data(
                    data=file_bytes,
                    mime_type=file.content_type or "application/octet-stream",  # default fallback
                    # file_name=file.filename
                )
            )

        # Generate multimodal response
        response = model.generate_content(
            input_parts,
            generation_config={
                "temperature": temperature,
                "max_output_tokens": max_tokens,
            }
        )
        return {"response": response.text}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
