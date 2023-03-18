const socket = io();

socket.on("message", (message) => {
    console.log("Message Received", message)
    document.querySelector("#recevied-message").textContent = message.text;
    document.querySelector("#created-at").textContent = moment(message.createdAt).format("h:mm A");
})

socket.on("locationMessage", (locationMessage) => {
    console.log("Location", locationMessage)
    document.querySelector("#location").href = locationMessage.url;
    document.querySelector("#location").textContent = locationMessage.url;
    document.querySelector("#created-at").textContent = moment(locationMessage.createdAt).format("h:mm A");
})

const $sendMessage = document.querySelector("#send-message");
const $shareLocation = document.querySelector("#share-location");

$sendMessage.addEventListener("click", (e) => {
    e.preventDefault();
    const message = document.querySelector("#message").value;

    if (message) {
        console.log("Sending message", message);
        socket.emit("sendMessage", message);
        document.querySelector("#message").value = "";
    }
})

$shareLocation.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Your browser does not support this feature")
    }

    $shareLocation.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        }, () => {
            console.log("Location Shared!")
            $shareLocation.removeAttribute("disabled")
        })
    })
})