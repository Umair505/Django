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




document.addEventListener("DOMContentLoaded", () => {
    // API URL
    const apiUrl = 'https://hotel-booking-website-backend.vercel.app/hotel/hotels/';
 
    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            // Get the total count from the response
            const totalHotels = data.count;
 
            // Display the total number of hotels in the HTML
            document.getElementById('total-hotels').textContent = totalHotels;
        })
        .catch(error => {
            console.error('Error fetching the API:', error);
            
        });
 });


document.addEventListener('DOMContentLoaded',()=>{
    const url = 'https://hotel-booking-website-backend.vercel.app/hotel/hotels/';
    fetch(url)
    .then(res =>res.json())
    .then(data=>{
     display(data);
    })
    .catch(error=console.error('Error fetching data : ',error));
    function display(hotels){
     const TotalHotel = hotels.length;
     const TotalAvailableRoom  = hotels.reduce((sum,hotel)=>sum+hotel.available_room, 0) ;
     
     document.getElementById('total-available-rooms').textContent = TotalAvailableRoom;
    }
 })


 document.addEventListener('DOMContentLoaded',()=>{
    const url = 'https://hotel-booking-website-backend.vercel.app/user/allUser/';
    fetch(url)
    .then(res =>res.json())
    .then(data=>{
     display(data);
    })
    .catch(error=console.error('Error fetching data : ',error));
    function display(clients){
     const TotalClient = clients.length ;
    ;
     document.getElementById('total-clients').textContent= TotalClient;
    
    }
 })

 


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
            let totalBookedRooms = 0;
            data.forEach(booking => {
            const row = document.createElement('tr');
            totalBookedRooms += booking.number_of_rooms;
            document.getElementById('total-booked-room').textContent=  totalBookedRooms;
            });

        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    fetchBookings();
});