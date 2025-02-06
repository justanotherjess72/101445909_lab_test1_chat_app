document.addEventListener("DOMContentLoaded", function () {
    const API_BASE_URL = "http://localhost:3000/api";
    const socket = io("http://localhost:3000");
    const username = localStorage.getItem("username");
    let currentRoom = localStorage.getItem("room") || null;

    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
        chatContainer.style.display = currentRoom ? "block" : "none";
    }

    // SIGNUP FORM HANDLER
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const username = document.getElementById("username").value.trim();
            const firstname = document.getElementById("firstname").value.trim();
            const lastname = document.getElementById("lastname").value.trim();
            const password = document.getElementById("password").value.trim();
            
            if (!username || !firstname || !lastname || !password) {
                alert("All fields are required.");
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, firstname, lastname, password })
                });
                
                if (response.ok) {
                    alert("Signup successful. Redirecting to login...");
                    window.location.href = "login.html";
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Signup failed.");
                }
            } catch (error) {
                console.error("Signup Error:", error);
                alert("An error occurred while signing up.");
            }
        });
    }
    
    // LOGIN FORM HANDLER
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();
            
            if (!username || !password) {
                alert("Username and password are required.");
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem("token", result.token);
                    localStorage.setItem("username", username);
                    alert("Login successful. Redirecting to chat...");
                    window.location.href = "chat.html";
                } else {
                    const errorData = await response.json();
                    alert(errorData.error || "Invalid username or password.");
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("An error occurred while logging in.");
            }
        });
    }

    // JOIN ROOM FUNCTIONALITY
    const roomSelect = document.getElementById("room-select");
    const joinRoomBtn = document.getElementById("join-room-btn");
    if (joinRoomBtn) {
        joinRoomBtn.addEventListener("click", () => {
            const selectedRoom = roomSelect.value;
            if (currentRoom) {
                socket.emit("leaveRoom", { username, room: currentRoom });
            }
            currentRoom = selectedRoom;
            localStorage.setItem("room", selectedRoom);
            socket.emit("joinRoom", { username, room: selectedRoom });
            alert(`Joined ${selectedRoom} room.`);
            if (chatContainer) chatContainer.style.display = "block";
        });
    }

    // LEAVE ROOM FUNCTIONALITY
    const leaveRoomBtn = document.getElementById("leave-room-btn");
    if (leaveRoomBtn) {
        leaveRoomBtn.addEventListener("click", () => {
            if (currentRoom) {
                socket.emit("leaveRoom", { username, room: currentRoom });
                alert(`Left ${currentRoom} room.`);
                currentRoom = null;
                localStorage.removeItem("room");
                if (chatContainer) chatContainer.style.display = "none";
            }
        });
    }

    // LOGOUT FUNCTIONALITY
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("room");
            alert("Logged out successfully. Redirecting to login...");
            window.location.href = "login.html";
        });
    }

    // CHAT FUNCTIONALITY
    const chatForm = document.getElementById("chat-form");
    const messagesDiv = document.getElementById("messages");
    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const message = document.getElementById("message").value.trim();
            if (!currentRoom) {
                alert("Please join a room first.");
                return;
            }
            socket.emit("sendMessage", { username, message, room: currentRoom });
            document.getElementById("message").value = "";
        });
    }

    // RECEIVE MESSAGES
    socket.on("message", ({ user, text }) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add(user === username ? "sent" : "received");
        messageElement.innerHTML = `<strong>${user}:</strong> ${text}`;
        messagesDiv.appendChild(messageElement);
    });

    // TYPING INDICATOR
    const messageInput = document.getElementById("message");
    if (messageInput) {
        messageInput.addEventListener("input", () => {
            socket.emit("typing", { username, room: currentRoom });
        });
    }

    socket.on("displayTyping", ({ user }) => {
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) {
            typingIndicator.innerText = `${user} is typing...`;
            setTimeout(() => { typingIndicator.innerText = ""; }, 2000);
        }
    });
});