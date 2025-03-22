let emailGlobal = ""; // Stores user email
let otpGlobal = ""; // Stores OTP for verification

async function sendOTP() {
    emailGlobal = document.getElementById("email").value;

    if (!emailGlobal.includes("@") || !emailGlobal.includes(".")) {
        alert("Please enter a valid email address!");
        return;
    }

    let response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailGlobal }),
    });

    let result = await response.json();
    alert(result.message);

    if (result.success) {
        otpGlobal = result.otp; // Store OTP temporarily (for testing)
        document.getElementById("otpSection").style.display = "block";
    }
}

async function verifyOTP() {
    let enteredOTP = document.getElementById("otp").value;
    let message = document.getElementById("message");

    let response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailGlobal, otp: enteredOTP }),
    });

    let result = await response.json();
    message.textContent = result.message;
    message.style.color = result.success ? "green" : "red";
}
