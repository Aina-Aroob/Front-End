document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('image');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    
    // Backend API URL
    const API_URL = 'https://web-production-e7b0.up.railway.app';

    // Preview image before upload
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
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

        try {
            const formData = new FormData();
            formData.append('image', file);

            showResult('Processing...', 'alert-info');

            const response = await fetch(`${API_URL}/detect`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            showResult(data.prediction, 'alert-success');
        } catch (error) {
            console.error('Error:', error);
            showResult('Error processing image. Please try again.', 'alert-danger');
        }
    });

    function showResult(message, className = 'alert-info') {
        resultDiv.textContent = message;
        resultDiv.className = `alert ${className}`;
        resultDiv.classList.remove('d-none');
    }
}); 