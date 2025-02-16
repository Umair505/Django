const getParams = () => {
    const param = new URLSearchParams(window.location.search).get('doctorId');

    loadTime(param);
    fetch(`https://testing-8az5.onrender.com/doctor/list/${param}`)
        .then((result) => result.json())
        .then((data) => displayDetails(data))


    fetch(`https://testing-8az5.onrender.com/doctor/review/?doctor_id=${param}`)
        .then((result) => result.json())
        .then((data) => doctorReview(data))


};
const displayDetails = (doctor) => {
    const parent = document.getElementById('doc-details');
    const div = document.createElement('div');
    div.classList.add('doc-details-container');
    div.innerHTML = `
        <div class="doctor-img">
            <img src="${doctor.image}" alt="Doctor Image">
        </div>
        <div class="doctor-info">
            <h1>${doctor.full_name}</h1>
            ${doctor.designation.map((item) => {
        return `<h6>${item}</h6>`
    })}
            
            ${doctor.specialization.map((item) => {
        return `<button class='doc-details-btn'>${item}</button>`
    })}
            <p class="w-75">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cum cumque sequi nihil modi dolor commodi, accusantium maxime aspernatur quibusdam quia?</p>
            <h3>Fees: ${doctor.fee} BDT</h3>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Appointment
          </button>
          
        </div>
    `;
    parent.appendChild(div);
};

const doctorReview = (reviews) => {
    const parent = document.getElementById('doctors-review-container');
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



const loadTime = (id) => {
    fetch(`https://testing-8az5.onrender.com/doctor/availabletime/?doctor_id=${id}`)
        .then((result) => result.json())
        .then((data) => {
            data.forEach((item) => {
                const parent = document.getElementById('time-container');
                const option = document.createElement('option');
                option.value = item.id;
                option.innerHTML = item.name;
                parent.appendChild(option);

            });

        })

}

const handleAppointment = () => {
    const status = document.getElementsByName('status');
    const selected = Array.from(status).find((button) => button.checked);
    const symptom = document.getElementById('symptom').value;
    const time = document.getElementById('time-container');
    const selectedTime = time.options[time.selectedIndex];
    // console.log(selectedTime.value, symptom, selected ? selected.value : 'No status selected');

    const info ={
        appointment_type: selected.value,
        appointment_status:"Pending",
        time: selectedTime.value,
        symptom: symptom,
        cancel: false,
        patient: 1,
        doctor: 2
    };
    fetch('https://testing-8az5.onrender.com/appointment/',{
        method : "POST",
        headers: {'content-type':'application/json' },
        body:JSON.stringify(info),
    })
    .then(res=>res.json())
    .then (data => {
        console.log(data);
    })
};


loadTime();
getParams();
