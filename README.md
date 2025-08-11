# 📌 Chrome Extension – Gemini API (Vertex AI) Assistant

## 🚀 Overview
This Chrome extension is a conversational AI tool powered by **Google Cloud's Vertex AI Gemini API**.  
It allows users to interact with an **AI Agent** directly from their browser — sending both **text prompts** and **file inputs** — and receiving intelligent responses based on the provided input.

The AI model parameters such as **temperature** and **max tokens** can be configured directly in the extension.

The backend server is hosted on a **Google Cloud Platform (GCP) Virtual Machine**, which processes requests from the extension and communicates with the Vertex AI API.

---

## 🛠 Features
- **Text Input:** Type a prompt and get AI-generated responses.
- **File Upload:** Send files (PDF, TXT, etc.) for AI to analyze and respond to.
- **Customizable Parameters:**
  - `temperature` – Controls creativity of responses.
  - `maxTokens` – Sets maximum output length.
- **Real-time Communication:** Instant interaction between extension and backend.
- **Backend Hosted on GCP VM:** Secure, scalable processing of requests.
- **Uses Gemini API via Vertex AI Service Agent.**

---

## 📂 Project Structure
extension-front/<br>
│── manifest.json # Chrome extension manifest<br>
│── popup.html # UI for text/file input<br>
│── popup.js # Handles user actions and sends requests to backend<br>
backend/<br>
│── main.py # python (FastAPI) backend<br>
│── requirements.txt # Modules required for running backend<br>


---

## ⚙️ Setup & Installation

### 1️⃣ Prerequisites
- **Google Cloud Project** with Vertex AI enabled.
- **Service Account** with permission to use the Gemini API.
- **Python** installed on your backend VM.
- **GCP VM** created with public IP to receive requests from the extension.

---

### 2️⃣ Clone Repository
```bash
git clone https://github.com/rkt-12/gemini-web-agent.git

cd gemini-web-agent
```
---
3️⃣ Configure GCP Service Account

Create a Service Account in GCP.
Assign the role : Vertex AI User

---
4️⃣ Backend Setup
```bash

cd geminiapi

python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app
```
---

5️⃣ Deploy Backend on GCP VM
```
gcloud compute ssh your-vm-name --zone=your-zone

cd /path/to/backend

uvicorn main:app
```
Make sure firewall rules allow inbound traffic on your backend’s port.
---

6️⃣ Load Chrome Extension

Open Chrome → Go to chrome://extensions/

Enable Developer mode.

Click Load unpacked and select the chrome-extension folder.
---

🖥 Usage
Click the extension icon in Chrome.

Enter text in the input box or select a file.

Adjust temperature and max tokens if needed.

Click Send → The backend forwards your request to Vertex AI Gemini API.

View the AI’s response directly in the extension.
