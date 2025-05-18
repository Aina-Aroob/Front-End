document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('image');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Backend API URL - make sure there's no trailing slash
    const API_URL = 'https://web-production-e7b0.up.railway.app';

    // Check if backend is available
    async function checkBackendHealth() {
        try {
            showResult('Connecting to server...', 'alert-info');
            const response = await fetch(`${API_URL}/health`);
            const data = await response.json();
            console.log('Backend health check:', data);
            
            if (data.status === 'healthy') {
                showResult('Server connected! Upload a photo to begin.', 'alert-success');
            } else {
                showResult('Server status unknown. Try uploading anyway.', 'alert-warning');
            }
        } catch (error) {
            console.error('Health check failed:', error);
            showResult('Cannot connect to server. Please try again later.', 'alert-danger');
        }
    }

    // Check backend on page load
    checkBackendHealth();

    // Preview image before upload
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showResult('Please select a valid image file (JPEG, PNG)', 'alert-danger');
                imageInput.value = '';
                imagePreview.classList.add('d-none');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
                showResult('Image selected - Click "Detect Glasses" to process', 'alert-info');
                submitButton.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.classList.add('d-none');
            submitButton.disabled = true;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = imageInput.files[0];
        if (!file) {
            showResult('Please select an image first!', 'alert-danger');
            return;
        }

        // Disable the submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        
        try {
            showResult('Sending image to server...', 'alert-info');

            const formData = new FormData();
            formData.append('image', file);

            console.log('Sending request to:', `${API_URL}/detect`);
            console.log('File details:', {
                name: file.name,
                type: file.type,
                size: `${(file.size / 1024).toFixed(2)} KB`
            });

            const response = await fetch(`${API_URL}/detect`, {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            if (!responseText) {
                throw new Error('Empty response from server');
            }

            try {
                const data = JSON.parse(responseText);
                console.log('Parsed response:', data);
                
                if (data.prediction) {
                    showResult(data.prediction, 'alert-success');
                } else if (data.error) {
                    showResult(`Error: ${data.error}`, 'alert-danger');
                } else {
                    showResult('Received invalid response from server', 'alert-warning');
                }
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                showResult(`Server returned invalid data: ${responseText.substring(0, 100)}...`, 'alert-danger');
            }

        } catch (error) {
            console.error('Request failed:', error);
            showResult(`Connection error: ${error.message}`, 'alert-danger');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = 'Detect Glasses';
        }
    });

    function showResult(message, className = 'alert-info') {
        resultDiv.textContent = message;
        resultDiv.className = `alert ${className}`;
        resultDiv.classList.remove('d-none');
        // Scroll to the result
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}); 