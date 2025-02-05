document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("message").value;
    socket.emit("sendMessage", { message });
});