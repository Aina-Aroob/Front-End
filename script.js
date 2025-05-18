document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('image');
    const resultDiv = document.getElementById('result');
    const imagePreview = document.getElementById('imagePreview');
    const detectButton = document.getElementById('detectButton');

    // Backend API URL
    const API_URL = 'https://web-production-e7b0.up.railway.app';

    // Handle file selection
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file (JPEG, PNG)');
                imageInput.value = '';
                return;
            }

            // Preview the image
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.classList.add('d-none');
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image first');
            return;
        }

        // Show loading state
        detectButton.disabled = true;
        detectButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';

        try {
            // Create form data
            const formData = new FormData();
            formData.append('image', file);

            // Make API request
            const response = await fetch(`${API_URL}/detect`, {
                method: 'POST',
                body: formData
            });

            // Check if request was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse response
            const result = await response.json();
            
            // Show result
            if (result.prediction) {
                showResult(result.prediction, 'success');
            } else {
                showResult('Could not detect glasses in the image', 'warning');
            }
        } catch (error) {
            console.error('Error:', error);
            showResult('Error processing image. Please try again.', 'danger');
        } finally {
            // Reset button state
            detectButton.disabled = false;
            detectButton.innerHTML = 'Detect Glasses';
        }
    });

    function showResult(message, type) {
        resultDiv.textContent = message;
        resultDiv.className = `alert alert-${type}`;
        resultDiv.classList.remove('d-none');
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
}); 