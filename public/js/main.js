// API Base URL
const API_URL = '/api';

// State
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const cartModal = document.getElementById('cartModal');
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
        if (cartModal) cartModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Cart Button
document.getElementById('cartButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    showCart();
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
                <div class="room-card" data-room-id="${room.id}">
                    <div class="room-card-content">
                        <h3>Room ${room.number}</h3>
                        <p><strong>Type:</strong> ${room.type}</p>
                        <p class="room-price">$${room.price}/night</p>
                        <span class="room-status ${room.available ? 'status-available' : 'status-booked'}">
                            ${room.available ? 'Available' : 'Booked'}
                        </span>
                        ${room.available ? `
                            <button class="btn btn-secondary" style="width: 100%; margin-top: 0.5rem;" onclick="addToCart(${room.id}, '${room.number}', '${room.type}', ${room.price})">
                                🛒 Add to Cart
                            </button>
                            <button class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;" onclick="bookRoom(${room.id})">
                                Book Directly
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
    updateCartCount();
});

// Cart Functions
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        el.textContent = cart.length;
    });
}

function addToCart(roomId, roomNumber, roomType, price) {
    // Check if room is already in cart
    const existingItem = cart.find(item => item.roomId === roomId);
    if (existingItem) {
        alert('This room is already in your cart!');
        return;
    }

    // Add to cart
    const cartItem = {
        roomId,
        roomNumber,
        roomType,
        price,
        checkIn: '',
        checkOut: ''
    };

    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show success message
    alert(`Room ${roomNumber} added to cart!`);
}

function removeFromCart(roomId) {
    cart = cart.filter(item => item.roomId !== roomId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart(); // Refresh cart display
}

function showCart() {
    if (!cartModal) return;
    
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some rooms to get started!</p>
            </div>
        `;
        cartSummary.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>Room ${item.roomNumber}</h4>
                    <p><strong>Type:</strong> ${item.roomType}</p>
                    <div class="form-group" style="margin-top: 0.5rem;">
                        <label style="font-size: 0.9rem;">Check-in:</label>
                        <input type="date" 
                               class="cart-date-input" 
                               value="${item.checkIn}" 
                               onchange="updateCartDates(${item.roomId}, 'checkIn', this.value)"
                               min="${new Date().toISOString().split('T')[0]}"
                               style="padding: 0.4rem; border: 1px solid #ddd; border-radius: 5px; width: 100%;">
                    </div>
                    <div class="form-group" style="margin-top: 0.5rem;">
                        <label style="font-size: 0.9rem;">Check-out:</label>
                        <input type="date" 
                               class="cart-date-input" 
                               value="${item.checkOut}" 
                               onchange="updateCartDates(${item.roomId}, 'checkOut', this.value)"
                               min="${item.checkIn || new Date().toISOString().split('T')[0]}"
                               style="padding: 0.4rem; border: 1px solid #ddd; border-radius: 5px; width: 100%;">
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-item-price">$${item.price}/night</div>
                    <button class="btn-remove" onclick="removeFromCart(${item.roomId})">Remove</button>
                </div>
            </div>
        `).join('');
        
        const totalRooms = cart.length;
        const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        
        document.getElementById('totalRooms').textContent = totalRooms;
        document.getElementById('totalPrice').textContent = totalPrice;
        cartSummary.style.display = 'block';
    }
    
    cartModal.style.display = 'block';
}

function updateCartDates(roomId, field, value) {
    const item = cart.find(item => item.roomId === roomId);
    if (item) {
        item[field] = value;
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

async function checkoutCart() {
    if (!authToken) {
        alert('Please login to complete your reservation');
        cartModal.style.display = 'none';
        loginModal.style.display = 'block';
        return;
    }

    // Validate all items have dates
    const invalidItems = cart.filter(item => !item.checkIn || !item.checkOut);
    if (invalidItems.length > 0) {
        alert('Please set check-in and check-out dates for all rooms');
        return;
    }

    // Validate dates
    for (const item of cart) {
        if (new Date(item.checkIn) >= new Date(item.checkOut)) {
            alert(`Invalid dates for Room ${item.roomNumber}. Check-out must be after check-in.`);
            return;
        }
    }

    try {
        // Book each room
        const bookingPromises = cart.map(item => 
            fetch(`${API_URL}/rooms/${item.roomId}/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ 
                    checkIn: item.checkIn, 
                    checkOut: item.checkOut 
                })
            })
        );

        const responses = await Promise.all(bookingPromises);
        const results = await Promise.all(responses.map(r => r.json()));

        const failedBookings = responses.filter(r => !r.ok);
        
        if (failedBookings.length > 0) {
            alert(`Some bookings failed. Please check your reservations and try again.`);
        } else {
            alert(`Success! ${cart.length} room(s) booked successfully!`);
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            cartModal.style.display = 'none';
            loadRooms(); // Refresh room list
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('An error occurred during checkout. Please try again.');
    }
}

// Checkout button handler
document.getElementById('checkoutBtn')?.addEventListener('click', checkoutCart);

// Make functions available globally
window.bookRoom = bookRoom;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartDates = updateCartDates;
