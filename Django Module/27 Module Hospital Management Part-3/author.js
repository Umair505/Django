document.addEventListener('DOMContentLoaded', () => {
    const handleRegistration = (event) => {
        event.preventDefault();
        const username = getvalue('username');
        const first_name = getvalue('first_name');
        const last_name = getvalue('last_name');
        const email = getvalue('email');
        const password = getvalue('password');
        const confirm_password = getvalue('confirm_password');
        const info = { username, first_name, last_name, email, password, confirm_password };

        if (password === confirm_password) {
            document.getElementById('error').innerText = "";
            if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
                console.log(info);

                fetch('https://testing-8az5.onrender.com/patient/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(info)
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        if (data.success) {
                            alert('Registration successful. Please check your email.');
                        } else {
                            document.getElementById('error').innerText = data.message || 'Registration failed. Please try again.';
                        }
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        document.getElementById('error').innerText = "Registration failed. Please try again.";
                    });
            } else {
                document.getElementById('error').innerText = "Minimum eight characters, at least one letter, one number, and one special character";
            }
        } else {
            document.getElementById('error').innerText = "Password and confirm password do not match";
        }
    };

    const getvalue = (id) => {
        const value = document.getElementById(id).value;
        return value;
    };

    // Attach the registration handler to the form
    document.querySelector('form').addEventListener('submit', handleRegistration);
});

const handleLogin =(event)=>{
    event.preventDefault()
    const username = getvalue('login-username');
    const password = getvalue('login-password');
    fetch("https://testing-8az5.onrender.com/patient/login/",{
        method :"POST",
        headers:{"content-type":"application/json"},
        body: JSON.stringify({username,password}),
    })
    .then((res) => res.json())
    .then((data)=>{
        console.log(data);
       if(data.token && data.user_id){
        localStorage.setItem("token",data.token);
        localStorage.setItem('user_id',data.user_id);
        window.location.href='index.html';
       }
    });
} 
