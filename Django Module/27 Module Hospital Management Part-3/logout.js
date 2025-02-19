
const handleLogout = () => {
    const token = localStorage.getItem("token");

    fetch("https://testing-8az5.onrender.com/patient/logout", {
        method: "POST",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Logout failed');
        }
        return res.json();
    })
    .then((data) => {
        console.log(data);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        alert("You have been logged out successfully.");

        window.location.href = "login.html";
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("An error occurred while logging out. Please try again.");
    });
};
