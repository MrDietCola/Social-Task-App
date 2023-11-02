const registerFormHandler = async (event) => {
    event.preventDefault();
    // Collect values from the login form
    const first_name = document.getElementById('first_name-signup').value.trim();
    const last_name = document.getElementById('last_name-signup').value.trim();
    const username = document.getElementById('username-signup').value.trim();
    const email = document.getElementById('email-signup').value.trim();
    const password = document.getElementById('password-signup').value.trim();
    const verifypassword = document.getElementById('verifypassword-signup').value.trim();

    if (password !== verifypassword) {
        alert('Passwords do not match.');
        return;
    }

    if (first_name && last_name && username && email && password) {
        // Send a POST request to the API endpoint
        const response = await fetch('/api/users/', {
            method: 'POST',
            body: JSON.stringify({ first_name, last_name, username, email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            // If successful, redirect the browser to the profile page
            document.location.replace('/tasks');
        } else {
            alert(response.statusText);
        }
    }
};

document.getElementById('signup-form').addEventListener('submit', registerFormHandler);