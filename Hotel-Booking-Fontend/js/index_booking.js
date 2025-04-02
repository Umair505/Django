
// Select hotel name dynamically
document.addEventListener('DOMContentLoaded', function () {
    fetch('https://hotel-booking-website-backend.vercel.app/hotel/names/')
        .then(response => response.json())
        .then(data => {
            const hotelSelect = document.getElementById('hotel_select');

            data.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel.id;
                option.textContent = hotel.name;
                hotelSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching hotel list:', error);
        });
});

// Function to handle booking process
function handleBooking() {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        Swal.fire({
            icon: 'error',
            title: 'User not logged in',
            text: 'User not found. Please log in.',
        }).then(() => {
            window.location.href = 'login.html';
            return;
        })
    }

    const hotel_id = document.getElementById('hotel_select').value;
    const start_date = document.getElementById('start_date').value;
    const end_date = document.getElementById('end_date').value;
    const number_of_rooms = document.getElementById('number_of_rooms').value;
    const payment_method = document.getElementById('payment_method').value;

    // Basic validation
    if (!hotel_id || !start_date || !end_date || !number_of_rooms) {
        Swal.fire({
            icon: 'error',
            title: 'Incomplete Booking Details',
            text: 'Please fill out all booking details before proceeding.',
        });
        return;
    }

    // Get current date
    const currentDate = new Date().toISOString().split('T')[0];

    // Validate dates
    if (start_date < currentDate) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Start Date',
            text: 'The start date cannot be earlier than today.',
        });
        return;
    }

    if (start_date > end_date) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid End Date',
            text: 'The end date cannot be earlier than the start date.',
        });
        return;
    }

    const formData = {
        hotel_id: parseInt(hotel_id),
        start_date: start_date,
        end_date: end_date,
        number_of_rooms: parseInt(number_of_rooms),
        user_id: parseInt(user_id),
    };
    // pay form account balance
    if (payment_method === 'account') {

        fetch('https://hotel-booking-website-backend.vercel.app/hotel/book/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(JSON.stringify(errorData));
                    });
                }
                return response.json();
            })
            .then(data => {
                Swal.fire({
                    icon: 'success',
                    title: 'Booking Successful',
                    text: 'Hotel booked successfully!',
                }).then(() => {

                    window.location.reload();
                });
                console.log(data);
            })
            .catch(error => {
                // Parse the error message
                let errorMessage = 'Failed to book hotel.';
                try {
                    const errorData = JSON.parse(error.message);
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    } else {
                        errorMessage = Object.values(errorData).join(' ');
                    }
                } catch (e) {
                    console.error('Error parsing error message:', e);
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                    text: errorMessage,
                });
                console.error('Error:', error);
            });
    }
    // apy by sslcommerz
    else if (payment_method === 'sslcommerz') {

        fetch('https://hotel-booking-website-backend.vercel.app/payment/payment-booking/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.payment_url) {
                    window.location.href = data.payment_url;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Payment Failed',
                        text: 'Failed to initiate SSLCommerz payment process.',
                    });
                }
            })
            .catch(error => {
                console.error('Error initiating SSLCommerz payment:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Failed',
                    text: 'Failed to initiate SSLCommerz payment process.',
                });
            });

    }


}
