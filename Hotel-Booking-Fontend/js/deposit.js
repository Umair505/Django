const token = localStorage.getItem("token");
if (!token) {
    window.localStorage.href = "login.html";
}

const userId = localStorage.getItem('user_id');
let USER_ID;

fetch('https://hotel-booking-website-backend.vercel.app/user/account/', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',

    }
})
    .then(response => response.json())
    .then(data => {
        const matchingAccount = data.find(account => account.account_no == userId);

        if (matchingAccount) {
            console.log('Matching account details:');
            console.log('ID:', matchingAccount.id);
            console.log('Username:', matchingAccount.username);

            USER_ID = matchingAccount.id;
            // alert(USER_ID)
        } else {
            console.log('No matching account found for user_id:', userId);
        }
    })
    .catch(error => {
        console.error('Error fetching user accounts:', error);
    });


const handleDeposit = (event) => {
    event.preventDefault();
    const amount = parseInt(document.getElementById('amount').value);
    const userId = parseInt(USER_ID);
    if (isNaN(amount) || isNaN(userId)) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Input',
            text: 'Please enter a valid deposit amount.',
            confirmButtonColor: '#007bff'
        });
        return;
    }
    const depositData = {
        account: userId,
        amount: amount
    };
    console.log(userId);
    console.log(localStorage.getItem('user_id'));

    fetch('https://hotel-booking-website-backend.vercel.app/user/deposit/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
            'Authorization': `Token ${token}`
        },

        body: JSON.stringify(depositData)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Deposit failed.Please try again.');
            }
            return res.json();
        })
        .then(data => {
            Swal.fire({
                icon: 'success',
                title: 'Deposit Successful',
                text: `You have successfully deposited $${amount}`,
                confirmButtonColor: '#007bff'
            })
                .then(() => {
                    window.location.href = "index.html";
                });

        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Deposit Failed',
                text: error.message,
                confirmButtonColor: '#007bff'
            });
        });
}










