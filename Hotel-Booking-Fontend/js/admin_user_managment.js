// User is staff, proceed with loading the admin page
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const isStaff = localStorage.getItem('is_staff'); 
    
    if (!token || !userId || !isStaff || isStaff === 'false') {
        window.location.href = "index.html"; 
        return;
    }

    async function checkIsStaff() {
        try {
            const response = await fetch('https://hotel-booking-website-backend.vercel.app/user/is_users_staff/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const users = await response.json();

            const user = users.find(user => user.id === parseInt(userId));

            if (!user || !user.is_staff) {
                window.location.href = "index.html"; 
            } else {

                console.log('Welcome to the admin page');
            }
        } catch (error) {
            console.error('Error:', error);
            window.location.href = "index.html"; 
        }
    }

    checkIsStaff();
});








// user managment
const fetchUserDetails = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
        window.location.href="login.html";
        return;
    }
    try {
        const resAccount = await fetch('https://hotel-booking-website-backend.vercel.app/user/account/');
        const userAccounts = await resAccount.json();

        const resAllUsers = await fetch('https://hotel-booking-website-backend.vercel.app/user/allUser/');
        const allUsers = await resAllUsers.json();

        const mergedUsers = userAccounts.map(account => ({
            ...account,
            ...allUsers.find(user => user.username === account.username)
        }));

        // Show all data in table format
        const tableBody = document.getElementById('userTableBody');
        mergedUsers.forEach((user, index) => {
            const profileImage = user.profile_image ? user.profile_image : './img/user.png';
            const row = document.createElement('tr');
            row.setAttribute('data-id', user.id);
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${profileImage}" alt="profile Photo" style="max-width: 30px; max-height: 30px;"></td>
                <td>${user.username}</td>
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.account_no}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
};



// Function to delete a user
const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`https://hotel-booking-website-backend.vercel.app/user/is_users_staff/${userId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (!res.ok) {
            throw new Error('Failed to delete user');
        }
        const deletedRow = document.querySelector(`tr[data-id="${userId}"]`);
        if (deletedRow) {
            deletedRow.remove();
        }
        Swal.fire({
            icon: 'success',
            title: 'User deleted successfully',
        });
        console.log('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
            icon: 'error',
            title: 'Failed to delete user',
            text: error.message,
        });
    }
};


fetchUserDetails();