// Chatbot page JS

document.addEventListener('DOMContentLoaded', function() {
    // Chatbot send message logic (front-end only)
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messages = document.getElementById('chatbot-messages');
    if (form && input && messages) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'flex gap-2 items-start flex-row-reverse';
            userMsg.innerHTML = `<div class="bg-green-100 text-green-900 px-3 py-2 rounded-xl max-w-[70%] shadow">${text}</div><span class="text-xs text-gray-400 self-end">You</span>`;
            messages.appendChild(userMsg);
            input.value = '';
            messages.scrollTop = messages.scrollHeight;
            // Simulate AI reply
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'flex gap-2 items-start';
                aiMsg.innerHTML = `<div class="bg-blue-100 text-blue-900 px-3 py-2 rounded-xl max-w-[70%] shadow">(AI reply placeholder)</div><span class="text-xs text-gray-400 self-end">AI</span>`;
                messages.appendChild(aiMsg);
                messages.scrollTop = messages.scrollHeight;
            }, 800);
        });
    }
});
