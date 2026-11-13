// 1. Mobile Navigation Menu Toggle
const menuIcon = document.getElementById("menuIcon");
const navLinks = document.getElementById("navLinks");

if (menuIcon && navLinks) {
    menuIcon.addEventListener("click", function() {
        navLinks.classList.toggle("show");
    });
}

// 2. Smart "Email Me" Launcher (Opens Gmail App on Mobile, Gmail Web Tab on PC)
document.addEventListener("click", function(event) {
    const clickedLink = event.target.closest("a");
    if (clickedLink) {
        const text = clickedLink.textContent.trim().toLowerCase();
        if (text === "email me" || text === "send direct email" || text === "motechcompany001@gmail.com") {
            event.preventDefault();
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            if (isMobile) {
                const emailUser = "motechcompany001";
                const emailDomain = "gmail.com";
                window.location.href = "mailto:" + emailUser + "@" + emailDomain + "?subject=Inquiry%20for%20MOTECH";
            } else {
                const part1 = "https://";
                const part2 = "mail.google";
                const part3 = ".com/mail/?view=cm&fs=1&to=motechcompany001@gmail.com&su=Inquiry%20for%20MOTECH";
                const fullUrl = part1 + part2 + part3;

                const newTab = window.open(fullUrl, "_blank");
                if (!newTab) {
                    window.location.href = fullUrl;
                }
            }
        }
    }
});

// 3. Book a Technician Form -> Send via Web3Forms & Return to Home Page
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");

if (bookingForm && formMessage) {
    bookingForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const submitBtn = bookingForm.querySelector("button[type='submit']");
        submitBtn.textContent = "Sending Request...";
        submitBtn.disabled = true;

        try {
            const formData = new FormData(bookingForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            const endpoint = "https://" + "api.web3forms.com" + "/submit";

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: json
            });

            const result = await response.json();

            if (result.success) {
                formMessage.textContent = "Booking sent to MOTECH! Returning to Home page...";
                formMessage.className = "form-message success";
                bookingForm.reset();

                setTimeout(function() {
                    window.location.href = "index.html";
                }, 2000);
            } else {
                formMessage.textContent = "Error: " + (result.message || "Could not send right now.");
                formMessage.className = "form-message error";
                submitBtn.textContent = "Submit Booking Request";
                submitBtn.disabled = false;
            }
        } catch (error) {
            formMessage.textContent = "Could not send right now. Please call or WhatsApp +250 789 813 896.";
            formMessage.className = "form-message error";
            submitBtn.textContent = "Submit Booking Request";
            submitBtn.disabled = false;
        }
    });
}
