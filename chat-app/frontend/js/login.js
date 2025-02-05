document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.msg === 'Login successful') {
            localStorage.setItem('username', username);
            window.location.href = '/chat.html'; // Redirect to chat page after login
        }
    })
    .catch(err => console.error('Error during login:', err));
});
