const apiUrl = 'https://hotel-booking-website-backend.vercel.app/user/admin-messages/';

function getToken() {
    return localStorage.getItem('token');
}

async function createAdminMessage(subject, message) {
    const token = getToken();
    if (!token) {
        Swal.fire('Error', 'Authentication token is missing. Please login.', 'error');
        return;
    }
    const user_id = localStorage.getItem('user_id');

    const formData = {
        "subject": subject,
        "message": message,
        "user": parseInt(user_id)
    };
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(formData),
        });
        console.log(formData);

        if (!response.ok) {
            throw new Error('Failed to create admin message');
        }

        const responseData = await response.json();
        console.log('Message created:', responseData);
        Swal.fire('Success', 'Message sent successfully!', 'success');
    } catch (error) {
        console.error('Error creating admin message:', error);
        Swal.fire('Error', 'Failed to message sent. Please try again.', 'error');
    }
}

document.getElementById('adminMessageForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    createAdminMessage(subject, message);
});