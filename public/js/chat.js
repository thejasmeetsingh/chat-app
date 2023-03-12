const socket = io();

socket.on("message", (message) => {
    console.log("Message Received", message)
    document.querySelector("#recevied-message").textContent = message;
})

document.querySelector("#send-message").addEventListener("click", (e) => {
    e.preventDefault();
    const message = document.querySelector("#message").value;

    if (message) {
        console.log("Sending message", message);
        socket.emit("sendMessage", message);
        document.querySelector("#message").value = "";
    }
})