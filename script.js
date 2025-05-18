document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('image');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    const submitBtn = document.getElementById('submitBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    // Backend API URL
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
        event.preventDefault(); // Prevent default form submission

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

            // Make API request
            console.log('Sending request to:', `${API_URL}/detect`);
            const response = await fetch(`${API_URL}/detect`, {
                method: 'POST',
                body: formData
            });

            // Handle response
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);

            if (result.prediction) {
                showResult(result.prediction, 'alert-success');
            } else {
                showResult('Could not process the image. Please try again.', 'alert-warning');
            }

        } catch (error) {
            console.error('Error:', error);
            showResult('Error processing image. Please try again.', 'alert-danger');
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

    // Show initial message
    showResult('Please select an image to begin', 'alert-info');
}); 