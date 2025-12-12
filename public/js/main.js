// API Base URL
const API_URL = '/api';

// State
let authToken = localStorage.getItem('authToken');
let currentUser = null;

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const contactForm = document.getElementById('contactForm');

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Modal Functions
document.querySelectorAll('.btn-login').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'block';
    });
});

document.getElementById('showRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Login Form
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                alert('Login successful!');
                loginModal.style.display = 'none';
                updateUIForLoggedInUser();
                loginForm.reset();
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        }
    });
}

// Register Form
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                alert('Registration successful!');
                registerModal.style.display = 'none';
                updateUIForLoggedInUser();
                registerForm.reset();
            } else {
                const errorMsg = data.errors ? data.errors.map(e => e.msg).join(', ') : data.error;
                alert(errorMsg || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration');
        }
    });
}

// Contact Form
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('contactEmail').value;
        const phone = document.getElementById('phone').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // In a real application, this would send to a backend endpoint
        alert(`Thank you for contacting us, ${name}! We'll get back to you soon.`);
        contactForm.reset();
    });
}

// Load Rooms
async function loadRooms() {
    const roomsContainer = document.getElementById('roomsContainer');
    
    if (!roomsContainer) return;

    try {
        const response = await fetch(`${API_URL}/rooms`);
        const data = await response.json();

        if (response.ok && data.rooms) {
            roomsContainer.innerHTML = data.rooms.map(room => `
                <div class="room-card">
                    <div class="room-card-content">
                        <h3>Room ${room.number}</h3>
                        <p><strong>Type:</strong> ${room.type}</p>
                        <p class="room-price">$${room.price}/night</p>
                        <span class="room-status ${room.available ? 'status-available' : 'status-booked'}">
                            ${room.available ? 'Available' : 'Booked'}
                        </span>
                        ${room.available ? `
                            <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="bookRoom(${room.id})">
                                Book Now
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            roomsContainer.innerHTML = '<p class="loading">Unable to load rooms</p>';
        }
    } catch (error) {
        console.error('Error loading rooms:', error);
        roomsContainer.innerHTML = '<p class="loading">Error loading rooms</p>';
    }
}

// Book Room
async function bookRoom(roomId) {
    if (!authToken) {
        alert('Please login to book a room');
        loginModal.style.display = 'block';
        return;
    }

    const checkIn = prompt('Enter check-in date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
    if (!checkIn) return;

    const checkOut = prompt('Enter check-out date (YYYY-MM-DD):');
    if (!checkOut) return;

    try {
        const response = await fetch(`${API_URL}/rooms/${roomId}/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ checkIn, checkOut })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Room booked successfully!');
            loadRooms(); // Reload rooms to update availability
        } else {
            alert(data.error || 'Booking failed');
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('An error occurred while booking');
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const loginButtons = document.querySelectorAll('.btn-login');
    loginButtons.forEach(btn => {
        btn.textContent = `Hi, ${currentUser.username}`;
        btn.onclick = (e) => {
            e.preventDefault();
            if (confirm('Do you want to logout?')) {
                logout();
            }
        };
    });
}

// Logout
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    const loginButtons = document.querySelectorAll('.btn-login');
    loginButtons.forEach(btn => {
        btn.textContent = 'Login';
        btn.onclick = (e) => {
            e.preventDefault();
            loginModal.style.display = 'block';
        };
    });
    
    alert('Logged out successfully');
}

// Check if user is already logged in
function initAuth() {
    const storedUser = localStorage.getItem('currentUser');
    if (authToken && storedUser) {
        currentUser = JSON.parse(storedUser);
        updateUIForLoggedInUser();
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadRooms();
});

// Make bookRoom available globally
window.bookRoom = bookRoom;
