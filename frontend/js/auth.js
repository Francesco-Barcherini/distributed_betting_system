// Auth tab switching
function switchAuthTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Mock login - in real app, this would call backend API
    // If email is admin@betmarket.com, grant admin privileges
    const isAdmin = email === 'admin@betmarket.com';
    const user = { email, username: email.split('@')[0], isAdmin };
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }
    
    // Mock registration - in real app, this would call backend API
    const isAdmin = email === 'admin@betmarket.com';
    const user = { email, username, isAdmin };
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Check if already logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'dashboard.html';
    }
});
