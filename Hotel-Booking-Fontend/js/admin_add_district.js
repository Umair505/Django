

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

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token'); 

    if (!token) {
        window.location.href = "login.html";
        return;
    }
    const apiUrl = 'https://hotel-booking-website-backend.vercel.app/hotel/districts/';
    const tableBody = document.querySelector('#hotelTable tbody');

    try {
        // Fetch data from the API
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}` 
            }
        });

        if (response.ok) {
            const data = await response.json();

            data.forEach(hotel => {
                const row = document.createElement('tr');
                const nameCell = document.createElement('td');
                const slugCell = document.createElement('td');
                const deleteCell = document.createElement('td');
                const deleteIcon = document.createElement('i');

                nameCell.textContent = hotel.district_name; 
                slugCell.textContent = hotel.slug;
                deleteIcon.className = 'fas fa-trash-alt delete-icon';
                deleteIcon.dataset.id = hotel.id;

                deleteCell.appendChild(deleteIcon);
                row.appendChild(nameCell);
                row.appendChild(slugCell);
                row.appendChild(deleteCell);
                tableBody.appendChild(row);

                deleteIcon.addEventListener('click', async function() {
                    const districtId = this.dataset.id;
                    await deleteDistrict(districtId);
                });
            });
        } else {
            console.error('Failed to fetch data from the API');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Delete district function
async function deleteDistrict(districtId) {
    const token = localStorage.getItem('token');
    const url = `https://hotel-booking-website-backend.vercel.app/hotel/districts/${districtId}/`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'District has been deleted.',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete district.',
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error: ${error.message}`,
        });
    }
}

// Add new district by modal 
document.getElementById("submitDistrict").addEventListener("click", async function(event) {
    event.preventDefault();

    const districtName = document.getElementById("districtName").value;
    const feedback = document.getElementById("feedback");
    const url = 'https://hotel-booking-website-backend.vercel.app/hotel/districts/';

    const data = {
        district_name: districtName,
        slug: districtName.toLowerCase().replace(/\s+/g, '-')
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Successfully added district: ${result.district_name}`,
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                location.reload();
            });
        } else {
            const responseData = await response.json();
            if (response.status === 409) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `District '${districtName}' already exists.`,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to add district. Please check if it already exists!',
                });
            }
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Error: ${error.message}`,
        });
    }

    setTimeout(function() {
        $('#addDistrictModal').modal('hide');
    }, 2000); 
});