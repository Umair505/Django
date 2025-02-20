




const LoadAllUser = () => {
    fetch('https://fakestoreapi.com/users')
        .then(res => res.json())
        // .then(json=>console.log(json))
        .then(data => DisplayAllUser(data))
}


const DisplayAllUser = (data) => {
    const parent = document.getElementById('all-user-info');
    parent.innerHTML = "";
    data.forEach(item => {
        const tr = document.createElement('tr');
        const fullName = ` ${item.name.firstname} ${item.name.lastname}`;
        tr.innerHTML = `
        
                <td>${item.id}</td>
                <td><a class="usrnamesty" href="single_user.html?userId=${item.id}">${item.username}</a></td>
                <td>${item.email}</td>
                <td>${fullName}</td>
                <td>${item.address.city}</td>
                <td>${item.address.street}</td>
                <td>${item.address.zipcode}</td>
                <td>${item.phone}</td>          
            `;
        parent.appendChild(tr);

    });
};


const LoadSingleUser = () => {
    const userId = new URLSearchParams(window.location.search).get('userId');
    fetch(`https://fakestoreapi.com/users/${userId}`)
        .then(res => res.json())
        .then(data => DisplaySingleUser(data))
}

const DisplaySingleUser = (data) => {
    const parent = document.getElementById('single-user-container');
    parent.innerHTML = "";
    const div = document.createElement('div');
    div.classList.add('single-user');
   
    div.innerHTML = `
                <div class="card mb-4">
                    <div class="body text-center pt-4">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                            alt="avatar" class="rounded-circle img-fluid" style="width: 150px;">
                        <h5 class="my-3">${data.name.firstname} ${data.name.lastname}</h5>
                        <p class="text-muted mb-1">${data.email}</p>
                        <p class="text-muted mb-4">${data.address.city}, ${data.address.street}, ${data.address.zipcode}</p>
                    </div>
                    <div class="mb-4">
                        <div class="mx-2">
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="mb-0">Full Name</p>
                                </div>
                                <div class="col-sm-9">
                                    <p class="text-muted mb-0">${data.name.firstname} ${data.name.lastname}</p>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="mb-0">Email</p>
                                </div>
                                <div class="col-sm-9">
                                    <p class="text-muted mb-0">${data.email}</p>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="mb-0">Phone</p>
                                </div>
                                <div class="col-sm-9">
                                    <p class="text-muted mb-0">${data.phone}</p>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="mb-0">Address</p>
                                </div>
                                <div class="col-sm-9">
                                    <p class="text-muted mb-0">${data.address.city}, ${data.address.street}, ${data.address.zipcode}</p>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-sm-3">
                                    <p class="mb-0">Geolocation</p>
                                </div>
                                <div class="col-sm-9">
                                    <p class="text-muted mb-0">lat: ${data.address.geolocation.lat},  long:${data.address.geolocation.long}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;


    parent.appendChild(div);
}




LoadAllUser();
LoadSingleUser();

document.getElementById('add-user-form').addEventListener('submit',function(event){
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;
    const zipcode = document.getElementById('zipcode').value;
    const phone = document.getElementById('phone').value;

    fetch('https://fakestoreapi.com/users',{
            method:"POST",
            body:JSON.stringify(
                {
                    email:email,
                    username:username,
                    password:password,
                    name:{
                        firstname:firstname,
                        lastname:lastname
                    },
                    address:{
                        city:city,
                        street:street,
                        number:3,
                        zipcode:zipcode,
                        geolocation:{
                            lat:'-37.3159',
                            long:'81.1496'
                        }
                    },
                    phone:phone
                }
            ),
            headers:{
                'Content-Type':'application/json'
            }
        })
            .then(res=>res.json())
            .then(json=>{
                console.log(json);
                alert('user added successful.')
                localStorage.setItem('newUser', JSON.stringify(json));
                document.getElementById('add-user-form').reset();
                window.location.href = 'get_all_user.html'; 
            })
            .catch(err => {
                console.error('Error:', err);
                document.getElementById('add-user-error').textContent = 'Failed to add user.';
                document.getElementById('add-user-error').style.display = 'block';
            });
});
