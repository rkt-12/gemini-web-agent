document.addEventListener('DOMContentLoaded', function () {
    const promptInput = document.getElementById('promptInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const loading = document.getElementById('loading');
    const response = document.getElementById('response');
    const status = document.getElementById('status');
    const sendText = document.getElementById('sendText');
    const loadingText = document.getElementById('loadingText');
    const fileInput = document.getElementById('fileUpload');
    const progressContainer = document.getElementById('progressContainer');
    const uploadProgress = document.getElementById('uploadProgress');
    const fileList = document.getElementById('fileList');
    let selectedFiles = [];
    // API endpoint
    const API_URL = 'http://35.188.160.111/api/gemini';

    promptInput.focus();

    sendBtn.addEventListener('click', sendPrompt);
    clearBtn.addEventListener('click', clearAll);

    promptInput.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'Enter') {
            sendPrompt();
        }
    });
    
    promptInput.addEventListener('input', function () {
        updateStatus();
    });

    fileInput.addEventListener('change', function () {
        for (let i = 0; i < fileInput.files.length; i++) {
            const file = fileInput.files[i];

            // Prevent duplicates
            if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
            }
        }

        updateFileList();
        updateStatus();

        // Reset file input so same file can be re-selected later
        fileInput.value = '';
    });

    function sendPrompt() {
        const prompt = promptInput.value.trim();

        if (!prompt && selectedFiles.length === 0) {
            showError('Please enter a prompt or upload a file before sending');
            return;
        }

        setLoadingState(true);
        hideResponse();

        const formData = new FormData();
        formData.append('prompt', prompt);
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        const temperature = document.getElementById('temperature').value || '0.7';
        const maxTokens = document.getElementById('maxTokens').value || '2048';

        formData.append('temperature', temperature);
        formData.append('max_tokens', maxTokens);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', API_URL, true);

        xhr.onloadstart = () => {
            progressContainer.style.display = 'block';
            uploadProgress.value = 0;
        };

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                uploadProgress.value = percent;
            }
        };

        xhr.onload = () => {
            setLoadingState(false);
            progressContainer.style.display = 'none';

            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data.response) {
                        showResponse(data.response);
                        status.textContent = 'Prompt sent successfully!';
                    } else {
                        showError('No valid response received from server');
                    }
                } catch (e) {
                    showError('Error parsing server response');
                }
            } else {
                showError(`HTTP ${xhr.status}: ${xhr.responseText}`);
            }
        };

        xhr.onerror = () => {
            setLoadingState(false);
            progressContainer.style.display = 'none';
            showError('Upload failed due to a network error');
        };

        xhr.send(formData);
    }

    function clearAll() {
        promptInput.value = '';
        fileInput.value = null;
        selectedFiles = [];
        uploadProgress.value = 0;
        progressContainer.style.display = 'none';
        hideResponse();
        updateStatus();
        promptInput.focus();
    }

    function setLoadingState(isLoading) {
        sendBtn.disabled = isLoading;
        if (isLoading) {
            sendText.style.display = 'none';
            loadingText.style.display = 'inline';
            loading.style.display = 'block';
        } else {
            sendText.style.display = 'inline';
            loadingText.style.display = 'none';
            loading.style.display = 'none';
        }
    }

    function showResponse(responseText) {
        response.textContent = responseText;
        response.className = 'response';
        response.style.display = 'block';
    }

    function showError(errorMessage) {
        response.textContent = errorMessage;
        response.className = 'response error';
        response.style.display = 'block';
        status.textContent = 'Error processing request';
    }

    function hideResponse() {
        response.style.display = 'none';
    }

    function updateFileList() {
        fileList.innerHTML = selectedFiles.map(f => `📎 ${f.name}`).join('<br>');
    }

    function updateStatus() {
        const length = promptInput.value.length;
        status.textContent = `${length}/5000 characters — ${selectedFiles.length} file(s) attached`;
    }

    updateStatus();
});
