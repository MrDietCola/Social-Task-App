const loginFormHandler = async (event) => {
  event.preventDefault();
  console.log('clicked');
  // Collect values from the login form
  const email = document.querySelector('#inputEmail3').value.trim();
  const password = document.querySelector('#inputPassword3').value.trim();


  if (email && password) {
    // Send a POST request to the API endpoint
    const response = await fetch('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      // If successful, redirect the browser to the profile page
      document.location.assign('/tasks');
     
    } else {
      alert(response.statusText);
    }
  }
  else {
    console.log("here");
  }
};

document.getElementById('login-form').addEventListener('submit', loginFormHandler);


// document
//   .querySelector('.login-form')
//   .addEventListener('submit', loginFormHandler);


