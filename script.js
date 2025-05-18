document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('image');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Backend API URL
    const API_URL = 'https://web-production-e7b0.up.railway.app';

    // Check if backend is available
    async function checkBackendHealth() {
        try {
            const response = await fetch(`${API_URL}/health`);
            const data = await response.json();
            console.log('Backend health status:', data);
            if (data.status === 'healthy') {
                showResult('Ready to detect glasses', 'alert-info');
            }
        } catch (error) {
            console.error('Backend health check failed:', error);
            showResult('Warning: Cannot connect to server', 'alert-warning');
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
                showResult('Image ready for processing', 'alert-info');
                submitButton.disabled = false;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.classList.add('d-none');
            submitButton.disabled = true;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form from submitting normally
        
        const file = imageInput.files[0];
        if (!file) {
            showResult('Please select an image first!', 'alert-danger');
            return;
        }

        // Disable the submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
        
        try {
            showResult('Processing image...', 'alert-info');

            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`${API_URL}/detect`, {
                method: 'POST',
                body: formData,
                mode: 'cors'
            });

            console.log('Response status:', response.status);
            
            const responseText = await response.text();
            console.log('Raw response:', responseText);

            try {
                const data = JSON.parse(responseText);
                console.log('Parsed response:', data);
                
                if (data.prediction) {
                    showResult(data.prediction, 'alert-success');
                } else {
                    showResult('No prediction received from server', 'alert-warning');
                }
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                showResult('Error: Invalid response from server', 'alert-danger');
            }

        } catch (error) {
            console.error('Request error:', error);
            showResult('Error connecting to server. Please try again.', 'alert-danger');
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
    }
}); 