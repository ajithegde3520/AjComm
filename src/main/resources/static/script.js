// API Base URL
const API_BASE_URL = '/api/users';

// DOM Elements
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const loadUsersBtn = document.getElementById('loadUsers');
const clearUsersBtn = document.getElementById('clearUsers');
const usersList = document.getElementById('usersList');
const loginResult = document.getElementById('loginResult');

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    registerForm.addEventListener('submit', handleRegister);
    loginForm.addEventListener('submit', handleLogin);
    loadUsersBtn.addEventListener('click', loadAllUsers);
    clearUsersBtn.addEventListener('click', clearUsersDisplay);
});

// Handle User Registration
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phoneNumber: formData.get('phoneNumber') || null,
        role: formData.get('role')
    };

    console.log('Sending registration data:', userData); // Debug log

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        console.log('Response status:', response.status); // Debug log

        if (response.ok) {
            const result = await response.json();
            showMessage('User registered successfully!', 'success');
            registerForm.reset();
            // Reload users list to show the new user
            setTimeout(loadAllUsers, 1000);
        } else {
            const error = await response.text();
            console.log('Error response:', error); // Debug log
            console.log('Response headers:', response.headers); // Debug log
            console.log('Response status text:', response.statusText); // Debug log
            showMessage(`Registration failed: ${error}`, 'error');
        }
    } catch (error) {
        console.log('Exception:', error); // Debug log
        showMessage(`Error: ${error.message}`, 'error');
    }
}

// Handle User Login
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const loginData = {
        usernameOrEmail: formData.get('username'),
        password: formData.get('password')
    };

    console.log('Sending login data:', loginData); // Debug log

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData)
        });

        console.log('Login response status:', response.status); // Debug log

        if (response.ok) {
            const result = await response.json();
            showLoginResult(`Login successful! Token: ${result.token.substring(0, 50)}...`, 'success');
            loginForm.reset();
        } else {
            const error = await response.text();
            console.log('Login error response:', error); // Debug log
            showLoginResult(`Login failed: ${error}`, 'error');
        }
    } catch (error) {
        console.log('Login exception:', error); // Debug log
        showLoginResult(`Error: ${error.message}`, 'error');
    }
}

// Load All Users
async function loadAllUsers() {
    try {
        usersList.innerHTML = '<div class="loading">Loading users...</div>';
        
        const response = await fetch(API_BASE_URL);
        
        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            const error = await response.text();
            usersList.innerHTML = `<div class="result error">Error loading users: ${error}</div>`;
        }
    } catch (error) {
        usersList.innerHTML = `<div class="result error">Error: ${error.message}</div>`;
    }
}

// Display Users
function displayUsers(users) {
    if (users.length === 0) {
        usersList.innerHTML = '<div class="loading">No users found</div>';
        return;
    }

    const usersHTML = users.map(user => `
        <div class="user-card">
            <h3>${user.firstName} ${user.lastName}</h3>
            <div class="user-info">
                <div><span>ID:</span> ${user.id}</div>
                <div><span>Username:</span> ${user.username}</div>
                <div><span>Email:</span> ${user.email}</div>
                <div><span>Phone:</span> ${user.phoneNumber || 'N/A'}</div>
                <div><span>Role:</span> ${user.role}</div>
                <div><span>Status:</span> ${user.isActive ? 'Active' : 'Inactive'}</div>
            </div>
            <div class="user-actions">
                <button class="btn btn-info btn-small" onclick="getUserById(${user.id})">View Details</button>
                <button class="btn btn-warning btn-small" onclick="deleteUser(${user.id})">Delete</button>
            </div>
        </div>
    `).join('');

    usersList.innerHTML = usersHTML;
}

// Get User by ID
async function getUserById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        
        if (response.ok) {
            const user = await response.json();
            alert(`User Details:\nID: ${user.id}\nName: ${user.firstName} ${user.lastName}\nUsername: ${user.username}\nEmail: ${user.email}\nPhone: ${user.phoneNumber || 'N/A'}\nRole: ${user.role}\nStatus: ${user.isActive ? 'Active' : 'Inactive'}`);
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Delete User
async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('User deleted successfully!', 'success');
            loadAllUsers(); // Reload the list
        } else {
            const error = await response.text();
            showMessage(`Delete failed: ${error}`, 'error');
        }
    } catch (error) {
        showMessage(`Error: ${error.message}`, 'error');
    }
}

// Clear Users Display
function clearUsersDisplay() {
    usersList.innerHTML = '';
}

// Show Message
function showMessage(message, type) {
    // Create a temporary message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `result ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(messageDiv, mainContent.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Show Login Result
function showLoginResult(message, type) {
    loginResult.className = `result ${type}`;
    loginResult.textContent = message;
    
    // Clear after 5 seconds
    setTimeout(() => {
        loginResult.textContent = '';
        loginResult.className = 'result';
    }, 5000);
}

// Utility function to format dates
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
} 