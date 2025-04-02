
// register 

document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    await registerUser();
});

async function registerUser() {
    const errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'none';
    errorContainer.classList.remove('text-success', 'text-danger');

    // Get form data
    const formData = {
        username: document.getElementById('username').value.trim(),
        first_name: document.getElementById('first_name').value.trim(),
        last_name: document.getElementById('last_name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value.trim(),
        confirm_password: document.getElementById('confirm_password').value.trim()
    };

    // Client-side validation
    if (!formData.username || !formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.confirm_password) {
        displayError('Please fill in all fields.');
        return;
    }

    if (formData.password !== formData.confirm_password) {
        displayError('Passwords do not match.');
        return;
    }

    try {
        // Fetch all users to check for existing username or email
        const usersResponse = await fetch('https://hotel-booking-website-backend.vercel.app/user/allUser/');
        if (!usersResponse.ok) {
            throw new Error('Failed to fetch existing users');
        }
        const usersData = await usersResponse.json();

        // Check if username or email already exists
        const existingUsername = usersData.some(user => user.username === formData.username);
        const existingEmail = usersData.some(user => user.email === formData.email);

        if (existingUsername) {
            displayError('Username already exists.');
            return;
        }

        if (existingEmail) {
            displayError('Email already exists.');
            return;
        }

        // Proceed with registration if no duplicates are found
        const registrationResponse = await fetch('https://hotel-booking-website-backend.vercel.app/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!registrationResponse.ok) {
            const errorData = await registrationResponse.json();
            throw new Error(errorData.detail || 'An error occurred during registration');
        }

        const responseData = await registrationResponse.json();
        Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Registration successful! Check your email. Redirecting to login page...',
            confirmButtonColor: '#007bff'
        }).then(() => {
            window.location.href = 'login.html'; 
        });

    } catch (error) {
        
    }
}

function displayError(message) {
    const errorContainer = document.getElementById('error-container');
    errorContainer.textContent = message;
    errorContainer.classList.add('text-danger');
    errorContainer.style.display = 'block';
}


// logged user restriction 

document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'index.html'; 
    }
});
