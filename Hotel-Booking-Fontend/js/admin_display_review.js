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



// display review
document.addEventListener('DOMContentLoaded', fetchReviews);

async function fetchReviews() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = "login.html";
        return;
    }

 
    try {
        const response = await fetch('https://hotel-booking-website-backend.vercel.app/hotel/reviews/');
        const reviews = await response.json();

        const tableBody = document.getElementById('reviewTableBody');
        reviews.forEach((review, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${review.hotel.name}</td>
                <td>${review.hotel.address}</td>
                <td>${review.rating}</td>
                <td>${review.user}</td>
                <td>${review.body}</td>
                <td>${new Date(review.created).toLocaleString()}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteReview(${review.id}, this)">Delete</button></td>
          
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}



// review delete
async function deleteReview(reviewId, button) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://hotel-booking-website-backend.vercel.app/hotel/review_add/${reviewId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete review');
        }
        
        const row = button.closest('tr');
        row.remove();
        Swal.fire({
            icon: 'success',
            title: 'Review deleted successfully',
        });
        console.log('Review deleted successfully');
    } catch (error) {
        console.error('Error deleting review:', error);
        Swal.fire({
            icon: 'error',
            title: 'Failed to delete review',
            text: error.message,
        });
    }
}