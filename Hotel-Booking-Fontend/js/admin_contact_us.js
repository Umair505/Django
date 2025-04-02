const token = localStorage.getItem('token');
const userId = localStorage.getItem('user_id');
const isStaff = localStorage.getItem('is_staff'); 

if (!token || !userId || !isStaff || isStaff === 'false') {
    window.location.href = "index.html"; 
    return;
}

const apiUrl = 'https://hotel-booking-website-backend.vercel.app/user/admin-messages/';

function getToken() {
    return localStorage.getItem('token');
}

async function getAdminMessages() {
    const token = getToken();
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Authentication token is missing. Please login.'
        });
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch admin messages');
        }

        const responseData = await response.json();
        console.log('Admin messages fetched:', responseData);
        displayMessages(responseData);
    } catch (error) {
        console.error('Error fetching admin messages:', error);
        Swal.fire({
            icon: 'error',
            title: 'Fetch Error',
            text: 'Failed to fetch admin messages. Please try again.'
        });
    }
}

function displayMessages(messages) {
    const messagesTableBody = document.getElementById('messagesTable').querySelector('tbody');
    messagesTableBody.innerHTML = ''; 

    messages.forEach(message => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${message.id}</td>
            <td>${message.subject}</td>
            <td>${message.message}</td>
            <td>${new Date(message.created_at).toLocaleString()}</td>
            <td>${message.user}</td>
            <td>
                <button onclick="deleteMessage(${message.id})" class="btn btn-danger">Delete</button>
            </td>
        `;
        messagesTableBody.appendChild(newRow);
    });
}

async function deleteMessage(messageId) {
    const token = getToken();
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: 'Authentication token is missing. Please login.'
        });
        return;
    }

    try {
        const response = await fetch(`${apiUrl}${messageId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete message');
        }

        Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: 'Message deleted successfully'
        });
        getAdminMessages(); 
    } catch (error) {
        console.error('Error deleting message:', error);
        Swal.fire({
            icon: 'error',
            title: 'Delete Error',
            text: 'Failed to delete message. Please try again.'
        });
    }
}

document.addEventListener('DOMContentLoaded', getAdminMessages);