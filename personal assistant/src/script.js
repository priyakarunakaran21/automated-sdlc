function appendMessage(sender, message, isUser = false) {
    const chatLog = document.getElementById("chat-log");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", isUser ? "user" : "bot");
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight;
}

function botResponse(userInput) {
    // You need to implement your backend or use an API for the chatbot logic.
    // For this example, let's just echo back the user's input.
    return " " + userInput;
}

function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    if (userInput.trim() !== "") {
        appendMessage("You", userInput, true);
        processUserInput(userInput);
        document.getElementById("user-input").value = "";
    }
}

function processUserInput(userInput) {
    // Simulate bot response delay (optional)
    setTimeout(() => {
        const botReply = botResponse(userInput);
        appendMessage("Assistant", botReply);
    }, 500);
}

function startSpeechToText() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log('Speech recognition started...');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
        console.log('Speech recognition ended.');
    };

    recognition.start();
}

document.getElementById("user-input").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

document.getElementById('user-input').addEventListener('input', function (event) {
    const userInput = event.target.value;
    // You can perform any real-time processing on the user input here if needed.
});

document.getElementById("speech-to-text-btn").addEventListener("click", function() {
    startSpeechToText();
});
