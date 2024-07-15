document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(response => response.text())
  .then(data => {
    alert(`Hi ${username}, your registration is completed. Login now.`);
    document.getElementById('registerForm').reset();
    window.location.href = '/login';
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Registration failed');
  });
});

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(response => {
    if (response.ok) {
      window.location.href = '/dashboard';
    } else {
      response.text().then(data => alert(data));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Login failed');
  });
});
