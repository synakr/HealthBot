// References to DOM elements
const chatForm = document.getElementById("chatbot-form");
const chatInput = document.getElementById("chatbot-input");
const chatMessages = document.getElementById("chatbot-messages");

// Section-specific system prompts
const sectionPrompts = {
    symptoms: "You are a health assistant helping users check symptoms. Ask clarifying questions and suggest next steps, but never diagnose.",
    vaccination: "You are a health assistant giving accurate vaccination info (schedule, safety, benefits). Encourage consulting official sources.",
    mental: "You are a supportive mental health assistant. Listen empathetically, suggest coping strategies, and recommend professional help when needed.",
    emergency: "You are a health assistant trained in emergencies. Provide clear first aid steps and advise calling emergency services immediately."
};

// Default: general public health assistant
let chatHistory = [
    {
        role: "system",
        content: "You are a friendly public health assistant. Give clear, accurate, and empathetic health advice in simple words. Keep answers short and actionable. Always remind users to consult a doctor for serious issues."
    }
];

// Function to fetch bot reply
async function getBotResponse(userMessage) {
    chatHistory.push({ role: "user", content: userMessage });

    // Keep history short
    if (chatHistory.length > 13) {
        chatHistory = [chatHistory[0], ...chatHistory.slice(-12)];
    }

    try {
        const response = await fetch("https://chatbot-backend-ruby.vercel.app/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatHistory })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn’t process that.";

        chatHistory.push({ role: "assistant", content: reply });
        return reply;
    } catch (err) {
        console.error(err);
        return "Network error — please try again.";
    }
}

// Append a message to the chat UI (with Markdown support)
function appendMessage(content, sender = "AI") {
    const wrapper = document.createElement("div");
    wrapper.className = `flex gap-2 items-start ${sender === "You" ? "flex-row-reverse" : ""}`;

    const bubble = document.createElement("div");
    bubble.className = `${sender === "You"
        ? "bg-green-100 text-green-900"
        : "bg-blue-100 text-blue-900"} px-3 py-2 rounded-xl max-w-[70%] shadow chat-bubble-content`;

    // Parse Markdown → HTML
    bubble.innerHTML = marked.parse(content);

    const label = document.createElement("span");
    label.className = "text-xs text-gray-400 self-end";
    label.textContent = sender;

    wrapper.appendChild(bubble);
    wrapper.appendChild(label);

    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


// Handle sending messages
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Show user message
    appendMessage(userMessage, "You");
    chatInput.value = "";

    // Show loading placeholder
    appendMessage("...", "AI");
    const loadingBubble = chatMessages.lastChild.querySelector("div");

    // Fetch bot reply
    const reply = await getBotResponse(userMessage);

    // Replace placeholder with actual reply (Markdown parsed)
    loadingBubble.innerHTML = marked.parse(reply);
});

// Handle sidebar section switching
document.querySelectorAll("aside button").forEach(btn => {
    btn.addEventListener("click", () => {
        const section = btn.dataset.section;
        if (!sectionPrompts[section]) return;

        // Reset history with new role
        chatHistory = [{ role: "system", content: sectionPrompts[section] }];

        // Clear chat UI
        chatMessages.innerHTML = "";
        appendMessage(`🔄 New session started: ${btn.innerText}`, "AI");
    });
});
