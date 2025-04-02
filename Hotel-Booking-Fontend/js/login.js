

// Function to handle login
const handleLogin = (event) => {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Make the login request
    fetch("https://hotel-booking-website-backend.vercel.app/user/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed. Please check your username and password.');
        }
        return response.json(); 
    })
    .then(data => {
        if (data.token) {
            // Save token and user information in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('is_staff', data.is_staff);

            // Check if the user is staff (admin)
            if (data.is_staff && data.token && data.user_id) {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome To Your Admin Account!',
                    confirmButtonColor: '#007bff'
                }).then((result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                        window.location.href = 'admin_dashboard.html'; 
                    }
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome To Your User Account!',
                    confirmButtonColor: '#007bff'
                }).then((result) => {
                    if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                        window.location.href = 'index.html'; 
                    }
                });
            }
        } else {
            throw new Error('Login failed. Please check your username and password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayError(error.message || 'An error occurred during login. Please try again.');
    });
}

// Function to display error message
function displayError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = message;
    errorContainer.classList.add('text-danger');
    errorContainer.style.display = 'block';
}

// Event listener for login form submission
document.getElementById('login-form').addEventListener('submit', handleLogin);




// logged user restriction 

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html'; 
    }
});
