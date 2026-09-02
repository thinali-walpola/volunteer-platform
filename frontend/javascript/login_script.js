document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    // 1. Password Visibility Toggle
    togglePassword.addEventListener("click", () => {
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        
        // Toggle FontAwesome classes
        togglePassword.classList.toggle("fa-eye-slash");
        togglePassword.classList.toggle("fa-eye");
    });

    // 2. Client-Side Validation Function
    function validateForm() {
        let isValid = true;

        // Email Validation (Regex check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.parentElement.classList.add("invalid");
            isValid = false;
        } else {
            emailInput.parentElement.classList.remove("invalid");
        }

        // Password Validation (Length check)
        if (passwordInput.value.trim().length < 6) {
            passwordInput.parentElement.parentElement.classList.add("invalid");
            isValid = false;
        } else {
            passwordInput.parentElement.parentElement.classList.remove("invalid");
        }

        return isValid;
    }

    // 3. Form Submission Handling
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Stop default browser refresh

        if (validateForm()) {
            // Logic to forward data to backend/server API goes here
            alert("Logging in successfully...");
            console.log("Submitted payload:", {
                email: emailInput.value,
                password: passwordInput.value,
                remember: document.getElementById("remember").checked
            });
        }
    });

    // Optional: Clear error state as user types
    emailInput.addEventListener("input", () => emailInput.parentElement.classList.remove("invalid"));
    passwordInput.addEventListener("input", () => passwordInput.parentElement.parentElement.classList.remove("invalid"));
});
