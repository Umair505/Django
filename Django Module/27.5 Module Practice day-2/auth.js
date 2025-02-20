document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://fakestoreapi.com/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new alert('Invalid username or password');
            }
            return res.json();
        })
        .then(json => {
            console.log(json);
            document.getElementById('login-success').textContent="Login successful.";
            document.getElementById('login-success').style.display = 'block';
            document.getElementById('login-error').style.display = 'none';
            localStorage.setItem('authToken',json.token);
        })
        .catch(err => {
            console.error('Error:', err);
            document.getElementById('login-error').textContent = err.message;
            document.getElementById('login-error').style.display = 'block';
            document.getElementById('login-success').style.display = 'none';
        });

})