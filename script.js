document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('image');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Backend API URL with HTTPS
    const API_URL = 'https://web-production-e7b0.up.railway.app';

    // Preview image before upload
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                showResult('Please select an image file (JPEG, PNG)', 'alert-danger');
                imageInput.value = '';
                imagePreview.classList.add('d-none');
                return;
            }

            // Preview the image
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
                showResult('Image selected - Click "Detect Glasses" to process', 'alert-info');
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.classList.add('d-none');
            showResult('Please select an image', 'alert-warning');
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const file = imageInput.files[0];
        if (!file) {
            showResult('Please select an image first!', 'alert-danger');
            return;
        }

        try {
            // Show loading state
            submitBtn.textContent = 'Processing...';
            loadingSpinner.classList.remove('d-none');
            showResult('Processing image...', 'alert-info');

            // Prepare form data
            const formData = new FormData();
            formData.append('image', file);

            // Make API request with CORS headers
            console.log('Sending request to:', `${API_URL}/detect`);
            const response = await fetch(`${API_URL}/detect`, {
                method: 'POST',
                body: formData,
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'omit'
            });

            // Log response details for debugging
            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`Server error: ${response.status}`);
            }

            const responseText = await response.text();
            console.log('Raw response:', responseText);

            // Try to parse the response
            let result;
            try {
                result = JSON.parse(responseText);
                console.log('Parsed response:', result);
            } catch (e) {
                console.error('Failed to parse response:', e);
                throw new Error('Invalid response format');
            }

            if (result.prediction) {
                showResult(result.prediction, 'alert-success');
            } else if (result.error) {
                showResult(`Error: ${result.error}`, 'alert-warning');
            } else {
                showResult('Could not process the image. Please try again.', 'alert-warning');
            }

        } catch (error) {
            console.error('Request failed:', error);
            showResult(`Error: ${error.message}. Please try again.`, 'alert-danger');
        } finally {
            // Reset UI state
            submitBtn.textContent = 'Detect Glasses';
            loadingSpinner.classList.add('d-none');
        }
    });

    function showResult(message, className = 'alert-info') {
        resultDiv.textContent = message;
        resultDiv.className = `alert ${className}`;
        resultDiv.classList.remove('d-none');
    }

    // Test backend connection
    async function testBackendConnection() {
        try {
            const response = await fetch(`${API_URL}/health`);
            const data = await response.json();
            console.log('Backend health check:', data);
            if (data.status === 'healthy') {
                showResult('Ready to detect glasses', 'alert-info');
            }
        } catch (error) {
            console.error('Backend connection test failed:', error);
            showResult('Warning: Cannot connect to server', 'alert-warning');
        }
    }

    // Test connection on page load
    testBackendConnection();
}); 