//For the login and out message
function showToast(message, type = 'success') {
    const toastId = type === 'success' ? 'successToast' : 'errorToast';
    const toastEl = document.getElementById(toastId);
    toastEl.querySelector('.toast-body').innerText = message;
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}

//Dynamically updates the login or out button
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const authBtn = document.getElementById('auth-btn');
    //LOGGED IN
    if (token) {
        authBtn.innerText = 'Log Out';
        authBtn.removeAttribute('data-bs-toggle');
        authBtn.removeAttribute('data-bs-target');
        authBtn.onclick = function() {
            // Remove Token
            localStorage.removeItem('token');
            showToast('Logged out successfully.', 'success');
            updateAuthUI(); 
        };

    } 
    //LOGGED OUT
    else {
        authBtn.innerText = 'Log In';
        authBtn.setAttribute('data-bs-toggle', 'modal');
        authBtn.setAttribute('data-bs-target', '#loginModal');
        authBtn.onclick = null;
    }
}

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            //Save Token
            localStorage.setItem('token', data.token);
            const modalEl = document.getElementById('loginModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            showToast(`Welcome back, ${data.user?.username || 'User'}!`, 'success');
            updateAuthUI(); 
            
        } 
        
        else {
            showToast(data.message || "Login failed", 'error');
        }
    } 
    
    catch (err) {
        console.error(err);
        showToast("Server error. Please try again later.", 'error');
    }
});

document.addEventListener('DOMContentLoaded', updateAuthUI);