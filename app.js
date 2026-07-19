const chatsContent = document.querySelector(".chats-container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");

const API_KEY = "AIzaSyAx8kL6C0SrIQZtTf8kjKI8ErFltJAh_pw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

let userMessage = "";
const chatHistory = [];

chatsContainer.scrollTop = chatsContainer.scrollHeight;

// Function to create message elements
const createMsgElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}
// For Auto scrolling
const scrollToBottom = () => chatsContent.scrollTo({ top: chatsContent.scrollHeight, behavior: "smooth" });

const typingEffect = (text, textElement, botMsgDiv) => {
    textElement.textContent = "";
    const words = text.split(" ");
    let wordIndex = 0;

    const typingInterval = setInterval(() => {
        if (wordIndex < words.length) {
            textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
            scrollToBottom();
        }
        else {
            clearInterval(typingInterval);
            botMsgDiv.classList.remove("loading");
        }
    }, 60);
};

// Make the API call and generate the bot's response
const generateResponse = async (botMsgDiv) => {
    const textElement = botMsgDiv.querySelector(".message-text");

    // This is adding the user message to the chat history
    chatHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    })

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ contents: chatHistory })
        });

        const data = await response.json();
        if(!response.ok) throw new Error(data.error.message);

        // Process the response text and display it
        const responseText = data.candidates[0].content.parts[0].text.replace(/\*\*([^*]+)\*\*/g, "$1").trim();
        typingEffect(responseText, textElement, botMsgDiv);
    } catch (error) {
        console.error("Error:", error.message);
        textElement.textContent = "Something went wrong. Please try again.";        
    }
}


// This handles the form submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    userMessage = promptInput.value.trim();
    if(!userMessage) return;

    promptInput.value = "";

    // Generate user message HTML and add in the chats container
    const userMsgHTML = '<p class="message-text"></p>';
    const userMsgDiv = createMsgElement(userMsgHTML, "user-message");

    userMsgDiv.querySelector(".message-text").textContent = userMessage;
    chatsContainer.appendChild(userMsgDiv);
    scrollToBottom();

    setTimeout(() => {
        // Generate bot message HTML and add in the chats container after 600
        const botMsgHTML = '<span class="avatar-ai"><i class="ri-bard-fill"></i></span><p class="message-text">Just a sec..</p>';
        const botMsgDiv = createMsgElement(botMsgHTML, "bot-message", "loading");
        chatsContainer.appendChild(botMsgDiv);
        scrollToBottom();
        generateResponse(botMsgDiv);
    }, 600);
}

promptForm.addEventListener("submit", handleFormSubmit);


function toggleNav() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// Highlight active nav item on click
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});