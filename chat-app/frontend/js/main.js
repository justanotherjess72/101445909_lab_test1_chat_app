const API_BASE_URL = "http://localhost:3000/api";

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        username: document.getElementById("username").value,
        firstname: document.getElementById("firstname").value,
        lastname: document.getElementById("lastname").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) alert("Signup successful");
    else alert("Signup failed");
});
