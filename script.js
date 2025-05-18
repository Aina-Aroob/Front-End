document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('image');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    
    // Backend API URL
    const API_URL = 'https://web-production-e7b0.up.railway.app';

    // Check if backend is available
    async function checkBackendHealth() {
        try {
            const response = await fetch(`${API_URL}/health`);
            const data = await response.json();
            console.log('Backend health status:', data);
            showResult('Backend connected successfully', 'alert-success');
        } catch (error) {
            console.error('Backend health check failed:', error);
            showResult('Warning: Backend connection failed', 'alert-warning');
        }
    }

    // Check backend on page load
    checkBackendHealth();

    // Preview image before upload
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
                showResult(`Image selected: ${file.name}`, 'alert-info');
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = imageInput.files[0];
        if (!file) {
            showResult('Please select an image first!', 'alert-danger');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showResult('Please select a valid image file (JPEG, PNG)', 'alert-danger');
            return;
        }

        try {
            showResult('Uploading and processing image...', 'alert-info');

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
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            
            let responseText;
            try {
                responseText = await response.text();
                console.log('Raw response:', responseText);
                
                // Try to parse as JSON
                const data = JSON.parse(responseText);
                console.log('Parsed response data:', data);
                
                if (data.prediction) {
                    showResult(data.prediction, 'alert-success');
                } else {
                    showResult('No prediction received from server', 'alert-warning');
                }
            } catch (parseError) {
                console.error('Error parsing response:', parseError);
                showResult(`Server response error: ${responseText}`, 'alert-danger');
            }

        } catch (error) {
            console.error('Network or server error:', error);
            showResult(`Error: ${error.message}. Check console for details.`, 'alert-danger');
        }
    });

    function showResult(message, className = 'alert-info') {
        resultDiv.textContent = message;
        resultDiv.className = `alert ${className}`;
        resultDiv.classList.remove('d-none');
    }
}); 