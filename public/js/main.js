document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateCartUI();
});


/* 
=====================================================
Register
=====================================================
*/
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();

            if (response.ok) {
                showToast("Account created! Please log in.", 'success');
                
                const regModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                regModal.hide();
                
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
                
                registerForm.reset();
            } 
            
            else {
                showToast(data.message || "Registration failed", 'error');
            }
        } 
        
        catch (err) {
            console.error(err);
            showToast("Server error. Please try again.", 'error');
        }
    });
}
/*
=====================================================
Log in, Log out
=====================================================
*/

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
    const username = localStorage.getItem('username');
    
    const authBtn = document.getElementById('auth-btn');
    const regItem = document.getElementById('register-nav-item');
    const userDisplay = document.getElementById('user-display'); 

    // LOGGED IN
    if (token) {
        if (userDisplay) userDisplay.innerText = `Hello, ${username}`;

        authBtn.innerText = 'Log Out';
        authBtn.removeAttribute('data-bs-toggle');
        authBtn.removeAttribute('data-bs-target');
        
        authBtn.onclick = function() {
            localStorage.removeItem('token');
            localStorage.removeItem('username'); // <--- Clear it on logout!
            
            showToast('Logged out successfully.', 'success');
            updateAuthUI(); 
        };
        
        if (regItem) regItem.style.display = 'none';
    } 
    // LOGGED OUT
    else {
        if (userDisplay) userDisplay.innerText = '';

        authBtn.innerText = 'Log In';
        authBtn.setAttribute('data-bs-toggle', 'modal');
        authBtn.setAttribute('data-bs-target', '#loginModal');
        authBtn.onclick = null;
        
        if (regItem) regItem.style.display = 'block';
    }
}

//Log in form
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();

        if (response.ok) {
            //Save Token
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user?.username || 'User');
            const modalEl = document.getElementById('loginModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            showToast(`Welcome back, ${data.user?.username || 'User'}!`, 'success');
            updateAuthUI(); 
            
        } 
        else if (response.status === 429) {
            showToast("Too many attempts in past 10 minutes. Please wait.", 'error');
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


/*
=====================================================
Cart
=====================================================
*/

let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

//Add to Cart Function
function addToCart(id, name, price, image) {
    const existingItem = cart.find(item => item.id == id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    saveCart();
    updateCartUI();

    if (typeof showToast === 'function') {
        showToast(`Added ${name} to cart`, 'success');
    }

    const cartSidebar = new bootstrap.Offcanvas(document.getElementById('cartSidebar'));
    cartSidebar.show();
}

//Remove Item Function
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}
//Save to storage
function saveCart() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

//Sidebar List
function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const totalEl = document.getElementById('cart-total');
    
    //Update Badge Count
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (badge) {
        badge.innerText = totalCount;
        badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    }

    //Calculate Total Price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (totalEl) totalEl.innerText = '$' + totalPrice.toFixed(2);

    //Render Items in Sidebar
    if (container) {
        container.innerHTML = '';
        
        if (cart.length === 0) {
            container.innerHTML = '<div class="text-center text-muted mt-5">Your cart is empty.</div>';
            return;
        }

        cart.forEach((item, index) => {
            container.innerHTML += `
                <div class="d-flex align-items-center mb-3">
                    <img src="${item.image}" class="me-3" style="width: 60px; height: 60px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 font-serif">${item.name}</h6>
                        <small class="text-muted">$${item.price.toFixed(2)} x ${item.quantity}</small>
                    </div>
                    <button class="btn btn-sm text-danger" onclick="removeFromCart(${index})">&times;</button>
                </div>
            `;
        });
    }
}
