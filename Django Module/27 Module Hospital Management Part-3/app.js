const loadServices = () => {
    fetch('https://testing-8az5.onrender.com/services/')
        .then(res => res.json())
        .then((data) => displayService(data)) 
        .catch((err) => console.log(err));
};

const displayService = (services) => {
    services.forEach((service) => {
        const parent = document.getElementById('services-container');
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="card shadow h-100">
                <div class="ratio ratio-16x9">
                    <img src="${service.image}" class="card-img-top" loading="lazy" alt="...">
                </div>
                <div class="card-body p-3 p-xl-5">
                    <h3 class="card-title h5">${service.name}</h3>
                    <p class="card-text">${service.description.slice(0, 150)}</p>
                    <div><a href="#" class="btn btn-primary">Show Details</a></div>
                </div>
            </div>
        `;
        parent.appendChild(li);
    });
};

loadServices();


const loadDoctors = (search) => {
    document.getElementById("doctors").innerHTML = "";
    document.getElementById('loading').style.display = 'block';
    console.log(search);

    fetch(`https://testing-8az5.onrender.com/doctor/list/?search=${search ? search : ""}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            document.getElementById('loading').style.display = 'none';

            if (data.results && data.results.length > 0) {
                document.getElementById('nodata').style.display = 'none';
                displayDoctors(data.results);
            } else {
                document.getElementById('nodata').style.display = 'block';
            }
        })
        .catch((error) => {
            console.error('Error fetching doctors data:', error);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('nodata').style.display = 'block';
        });
};

const displayDoctors = (doctors) => {

    doctors?.forEach((doctor) => {
        console.log(doctor);
        const parent = document.getElementById("doctors");
        const div = document.createElement("div");
        div.classList.add("doc-card");


        div.innerHTML = `
            <img class="cardimg" src=${doctor?.image} alt="" >
            <h4>${doctor?.full_name} </h4>
            <h6>${doctor?.designation[0]}</h6>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque, perspiciatis!</p>
            <p  class="border-none">${doctor?.specialization?.map((item) => { return `<button>${item}</button>`; })}</p>
            <button class="btn btn-primary">
                <a class="text-deoration-none text-white" href="docDetails.html?doctorId=${doctor.id}"  target="_blank">Details</a>
            </button>
        `;

        parent.appendChild(div);

    });
};



const loadDesignation = () => {
    fetch("https://testing-8az5.onrender.com/doctor/designation/")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((item) => {
                const parent = document.getElementById('drop-deg');
                const li = document.createElement('li');
                li.classList.add('dropdown-item');
                li.innerHTML = item?.name;
                parent.appendChild(li);

            });
        });

};

const loadSpecialization = () => {
    fetch("https://testing-8az5.onrender.com/doctor/specialization")
        .then((res) => res.json())
        .then((data) => {
            data.forEach((item) => {
                const parent = document.getElementById('drop-spe');
                const li = document.createElement('li');
                li.classList.add('dropdown-item');
                li.setAttribute('onclick', `loadDoctors('${item.name}')`);
                li.innerText = item.name;
                parent.appendChild(li);
            });
        })
        .catch((error) => {
            console.error('Error fetching specialization data:', error);
        });
};


const handleSearch = ()=>{
    const value = document.getElementById('search').value;
    // console.log(value);
    loadDoctors(value);

}



const loadReview =() =>{
    fetch("https://testing-8az5.onrender.com/doctor/review/")
    .then((res) =>res.json())
    .then((data) => displayReview(data));
}


const displayReview = (reviews) => {
    const parent = document.getElementById('review-container');
    parent.innerHTML = '';  // Clear existing reviews
    reviews.forEach((review) => {
        const li = document.createElement('li');
        li.classList.add('review-card');
        li.innerHTML = `
            <img src="Images/girl.png" alt="Reviewer Image">
            <h4>${review.reviewer}</h4>
            <p>${review.body.slice(0, 100)}...</p>
            <h6>Rating: ${review.rating}</h6>   
        `;
        parent.appendChild(li);
    });
}




loadDoctors();
loadServices();
loadDesignation();
loadSpecialization();
loadReview();