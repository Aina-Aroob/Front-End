document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('image');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    const submitBtn = document.getElementById('submitBtn');

    // Backend API URL
    const API_URL = 'https://web-production-e7b0.up.railway.app';

    // Initially disable the submit button
    submitBtn.disabled = true;

    // Preview image before upload
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showResult('Please select a valid image file (JPEG, PNG)', 'alert-danger');
                imageInput.value = '';
                imagePreview.classList.add('d-none');
                submitBtn.disabled = true;
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
                submitBtn.disabled = false;
                showResult('Image ready - Click "Detect Glasses" to process', 'alert-info');
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.classList.add('d-none');
            submitBtn.disabled = true;
            showResult('Please select an image', 'alert-warning');
        }
    });

    // Handle form submission
    form.addEventListener('submit', handleSubmit);

    async function handleSubmit(e) {
        e.preventDefault();

        const file = imageInput.files[0];
        if (!file) {
            showResult('Please select an image first!', 'alert-danger');
            return;
        }

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';

        try {
            const formData = new FormData();
            formData.append('image', file);

            showResult('Processing image...', 'alert-info');

            const response = await fetch(`${API_URL}/detect`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.prediction) {
                showResult(data.prediction, 'alert-success');
            } else {
                showResult('Could not determine if glasses are present', 'alert-warning');
            }

        } catch (error) {
            console.error('Error:', error);
            showResult('Error processing image. Please try again.', 'alert-danger');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Detect Glasses';
        }
    }

    function showResult(message, className = 'alert-info') {
        resultDiv.textContent = message;
        resultDiv.className = `alert ${className}`;
        resultDiv.classList.remove('d-none');
    }

    // Initial message
    showResult('Please select an image to begin', 'alert-info');
}); 