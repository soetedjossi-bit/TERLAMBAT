// ===== AUTHENTICATION SYSTEM =====

const DEFAULT_CREDENTIALS = {
    email: 'admin@presensi.com',
    password: 'admin123',
    name: 'Administrator'
};

// ===== CHECK USER LOGIN =====
function checkUserLogin() {
    const currentUser = getLoggedInUser();
    const userProfile = document.getElementById('userProfile');
    const profileSection = document.getElementById('profileSection');
    const loginSection = document.getElementById('loginSection');
    
    if (currentUser) {
        // User sudah login
        updateUserDisplay(currentUser);
        if (profileSection) profileSection.style.display = 'block';
        if (loginSection) loginSection.style.display = 'none';
    } else {
        // User belum login - show login prompt setelah 1 detik
        setTimeout(() => {
            showLoginModal();
        }, 1000);
        if (profileSection) profileSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'block';
    }
    
    // Setup event listeners untuk settings page
    setupAuthEventListeners();
}

// ===== SETUP AUTH EVENT LISTENERS =====
function setupAuthEventListeners() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const modalLoginBtn = document.getElementById('modalLoginBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const closeModal = document.getElementById('closeModal');
    const userProfile = document.getElementById('userProfile');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleDirectLogin);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    if (modalLoginBtn) {
        modalLoginBtn.addEventListener('click', handleModalLogin);
    }
    
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closeLoginModal);
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', closeLoginModal);
    }
    
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            const currentUser = getLoggedInUser();
            if (currentUser) {
                // Navigate ke settings tab
                const settingsLink = document.querySelector('[data-tab="settings"]');
                if (settingsLink) settingsLink.click();
            }
        });
    }
}

// ===== SHOW LOGIN MODAL =====
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'flex';
        // Auto-fill demo credentials
        document.getElementById('modalEmail').value = DEFAULT_CREDENTIALS.email;
        document.getElementById('modalPassword').value = DEFAULT_CREDENTIALS.password;
        document.getElementById('modalName').value = DEFAULT_CREDENTIALS.name;
    }
}

// ===== CLOSE LOGIN MODAL =====
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== HANDLE MODAL LOGIN =====
function handleModalLogin() {
    const email = document.getElementById('modalEmail').value;
    const password = document.getElementById('modalPassword').value;
    const name = document.getElementById('modalName').value;
    
    if (!email || !password || !name) {
        showNotification('✗ Silakan isi semua field', 'error');
        return;
    }
    
    // Validate credentials
    if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
        const user = {
            email: email,
            name: name,
            loginTime: new Date().toISOString()
        };
        
        saveUserLogin(user);
        updateUserDisplay(user);
        closeLoginModal();
        showNotification('✓ Login berhasil!', 'success');
        
        // Update profile section
        const profileSection = document.getElementById('profileSection');
        const loginSection = document.getElementById('loginSection');
        if (profileSection) profileSection.style.display = 'block';
        if (loginSection) loginSection.style.display = 'none';
    } else {
        showNotification('✗ Email atau password salah', 'error');
    }
}

// ===== HANDLE DIRECT LOGIN (dari settings page) =====
function handleDirectLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const name = document.getElementById('loginName').value;
    
    if (!email || !password || !name) {
        showNotification('✗ Silakan isi semua field', 'error');
        return;
    }
    
    if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
        const user = {
            email: email,
            name: name,
            loginTime: new Date().toISOString()
        };
        
        saveUserLogin(user);
        updateUserDisplay(user);
        showNotification('✓ Login berhasil!', 'success');
        
        // Hide login section
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('profileSection').style.display = 'block';
    } else {
        showNotification('✗ Email atau password salah', 'error');
    }
}

// ===== HANDLE LOGOUT =====
function handleLogout() {
    if (!confirm('Apakah Anda yakin ingin logout?')) return;
    
    localStorage.removeItem('currentUser');
    showNotification('✓ Logout berhasil', 'success');
    
    // Reload page
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

// ===== UPDATE USER DISPLAY =====
function updateUserDisplay(user) {
    const userDisplayName = document.getElementById('userDisplayName');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');
    
    if (userDisplayName) {
        userDisplayName.textContent = user.name;
    }
    
    if (profileName) {
        profileName.textContent = user.name;
    }
    
    if (profileEmail) {
        profileEmail.textContent = user.email;
    }
    
    if (profileAvatar) {
        profileAvatar.textContent = user.name.charAt(0).toUpperCase();
    }
}

// ===== SAVE USER LOGIN DATA =====
function saveUserLogin(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// ===== GET LOGGED IN USER =====
function getLoggedInUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Demo credentials info (untuk development)
console.log('\n===== DEMO CREDENTIALS =====');
console.log('Email: ' + DEFAULT_CREDENTIALS.email);
console.log('Password: ' + DEFAULT_CREDENTIALS.password);
console.log('\nGunakan kredensial ini untuk login');
console.log('============================\n');