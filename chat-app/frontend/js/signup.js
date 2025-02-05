document.querySelector("#signup-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const firstname = document.querySelector("#firstname").value;
    const lastname = document.querySelector("#lastname").value;

    // Perform the signup request
    fetch('http://localhost:7000/auth/signup', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, firstname, lastname })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to the chat page or show success message
            window.location.href = '/chat'; // Or show a success message
        } else {
            // Show error message
            alert('Signup failed: ' + data.message);
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('There was an error during signup');
    });
});
