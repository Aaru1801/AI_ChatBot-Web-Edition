document.addEventListener("DOMContentLoaded", function () {
    const chatHistory = document.getElementById("chat-history");
    const exampleButtons = document.querySelectorAll(".example-button");
    const promptInput = document.getElementById("prompt");
    const form = document.querySelector(".chat-input-form");

    let isResizing = false;

    // Automatically scroll to the bottom of the chat history
    const adjustScroll = () => {
        if (chatHistory) {
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }
    };

    adjustScroll(); // Scroll on load

    // Example buttons functionality
    exampleButtons.forEach(button => {
        button.addEventListener("click", function () {
            const exampleText = this.getAttribute("data-prompt");
            if (promptInput && form) {
                promptInput.value = exampleText; // Set the example text as the prompt
                form.submit(); // Automatically submit the form
            }
        });
    });

    // Dynamic textarea resizing
    const textarea = document.getElementById("prompt");
    if (textarea) {
        textarea.addEventListener("input", function () {
            this.style.height = "auto"; // Reset height
            this.style.height = `${this.scrollHeight}px`; // Adjust height dynamically
        });
    }

    // Sidebar resizing functionality
    const sidebar = document.getElementById("sidebar");
    const resizer = document.getElementById("resizer");
    const chatSection = document.querySelector(".chat-section");

    resizer.addEventListener("mousedown", function (e) {
        isResizing = true;
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none"; // Disable text selection during resize
    });

    document.addEventListener("mousemove", function (e) {
        if (!isResizing) return;

        // Calculate new sidebar width
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
            sidebar.style.width = `${newWidth}px`;
        }
    });

    document.addEventListener("mouseup", function () {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = "default";
            document.body.style.userSelect = ""; // Re-enable text selection
        }
    });

    // Adjust chat section width dynamically
    const adjustChatSection = () => {
        const sidebarWidth = sidebar.offsetWidth;
        const resizerWidth = resizer.offsetWidth;
        const totalWidth = window.innerWidth;

        chatSection.style.width = `${totalWidth - sidebarWidth - resizerWidth}px`;
    };

    // Adjust chat section on window resize and sidebar resize
    window.addEventListener("resize", adjustChatSection);
    resizer.addEventListener("mousemove", adjustChatSection);
    adjustChatSection();

    // Simulate new message rendering (for debugging small content rendering)
    const simulateNewMessage = (message) => {
        const newMessage = document.createElement("div");
        newMessage.className = "chat-message assistant";
        newMessage.innerHTML = `
            <div class="bubble">
                <strong>Assistant:</strong>
                <p>${message}</p>
            </div>`;
        chatHistory.appendChild(newMessage);
        adjustScroll(); // Ensure new messages are visible
    };

    // Logout button functionality
    const logoutButton = document.querySelector(".logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            console.log("Logout button clicked");
            const confirmLogout = confirm("Are you sure you want to clear history?");
            if (confirmLogout) {
                fetch("/logout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                })
                    .then(() => {
                        console.log("Logout request successful");
                        document.body.innerHTML = `
                            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #343541; color: white; font-family: Arial, sans-serif;">
                                <h1>Goodbye! See you soon.</h1>
                            </div>`;
                    })
                    .catch((err) => {
                        console.error("Error during logout:", err);
                    });
            }
        });
    }
});