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




// display booked info 
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token'); 

    if (!token) {
        window.location.href="login.html";
        return;
    }
    const tableBody = document.getElementById('bookings-table-body');

    async function fetchBookings() {
        try {
            const response = await fetch('https://hotel-booking-website-backend.vercel.app/hotel/bookings/');
            const data = await response.json();
            data.sort((a, b) => new Date(b.booked_at) - new Date(a.booked_at));
            data.forEach(booking => {
            const row = document.createElement('tr');

                row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.hotel.name}</td>
            <td>${booking.hotel.address}</td>
            <td>${booking.hotel.district_name}</td>
            <td><img src="${booking.hotel.photo}" alt="Hotel Photo" width="100"></td>
            <td>${booking.hotel.price_per_night}</td>
            <td>${booking.hotel.available_room}</td>
            <td>${booking.start_date}</td>
            <td>${booking.end_date}</td>
            <td>${booking.number_of_rooms}</td>
            <td>${new Date(booking.booked_at).toLocaleString()}</td>
            <td>${booking.user}</td>
        `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    fetchBookings();
});