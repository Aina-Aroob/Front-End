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
            showResult('Processing...', 'alert-info');

            const formData = new FormData();
            formData.append('image', file);

            console.log('Sending request to:', `${API_URL}/detect`);
            console.log('File being sent:', file.name, file.type, file.size);

            const response = await fetch(`${API_URL}/detect`, {
                method: 'POST',
                body: formData,
                // Add CORS headers
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.prediction) {
                showResult(data.prediction, 'alert-success');
            } else {
                showResult('No prediction received from server', 'alert-warning');
            }
        } catch (error) {
            console.error('Detailed error:', error);
            showResult(`Error: ${error.message}`, 'alert-danger');
        }
    });

    function showResult(message, className = 'alert-info') {
        resultDiv.textContent = message;
        resultDiv.className = `alert ${className}`;
        resultDiv.classList.remove('d-none');
    }
}); 