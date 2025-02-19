const loadUserDetails = () => {
    const user_id = localStorage.getItem('user_id');
    fetch(`https://testing-8az5.onrender.com/users/${user_id}`)
    .then((res) => res.json())
    .then((data) => {
        const parent = document.getElementById('user-details-container');
        const div = document.createElement('div'); 
        div.classList.add('user-all');
        
        div.innerHTML = `
        <div class="card-body p-1-9 p-sm-2-3 p-md-6 p-lg-7">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="...">
                </div>
                <div class="col-lg-6 px-xl-10">
                    <div class="bg-primary d-lg-inline-block py-1-9 px-1-9 px-sm-6 mb-1-9 rounded">
                        <h3 class="h2 text-white mb-0">${data.first_name + data.last_name}</h3>
                        <span class="text-primary">${data.username}</span>
                    </div>
                    <ul class="list-unstyled mb-1-9">

                        <li class="mb-2 mb-xl-3 display-28"><span class="display-26 text-secondary me-2 font-weight-600">Email:</span> ${data.email}</li>

                    </ul>
                </div>
            </div>
        </div>
        `;
        parent.appendChild(div);
    })
    .catch((error) => {
        console.error('Error fetching user details:', error);
    });
}

loadUserDetails();
