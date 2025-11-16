const passBtn = document.querySelector("#passBtn");
passBtn.addEventListener("click", function () {
    const passInput = document.getElementById("account_password");
    const type = passInput.getAttribute("type");
    if (type === "password") {
        passInput.setAttribute("type", "text");
        passBtn.innerHTML = "Hide Password";
    } else {
        passInput.setAttribute("type", "password");
        passBtn.innerHTML = "Show Password";
    }
});