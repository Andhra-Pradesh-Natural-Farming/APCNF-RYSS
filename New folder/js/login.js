/**
 * ============================================================================
 * LOGIN HANDLER - COMPLETE WITH DETAILED ERROR MESSAGES
 * ============================================================================
 * 
 * PURPOSE:
 *     Handle user login with proper error handling and role-based redirects
 * 
 * FEATURES:
 *     - Username validation
 *     - Password validation
 *     - Account status check
 *     - Role-based redirect (Admin/Aggregator/Buyer)
 *     - Detailed error messages
 *     - Loading state
 *  * FIXES:
 * - ✅ Handles account_pending error
 * - ✅ Handles account_rejected error
 * - ✅ Shows appropriate messages for each status
 * 
 * ============================================================================
 */

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================
// Define API_BASE_URL if not already defined by apcnf.js
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = 'http://localhost:8000';
    console.log('⚠️ API_BASE_URL not found, using default: http://localhost:8000');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Login page initialized');

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
        console.log('✅ Login form handler attached');
    }
});

// ============================================================================
// LOGIN FORM SUBMISSION
// ============================================================================

async function handleLoginSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    const form = event.target;
    const errorDiv = document.getElementById('errorMessage');
    const submitBtn = form.querySelector('button[type="submit"]');

    // --- Get form values ---
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // ========================================================================
    // VALIDATION - CHECK FOR EMPTY FIELDS
    // ========================================================================

    if (!username) {
        showError(errorDiv, 'Please enter your username');
        return;
    }

    if (!password) {
        showError(errorDiv, 'Please enter your password');
        return;
    }

    console.log(`🔐 Attempting login for username: ${username}`);

    // ========================================================================
    // DISABLE BUTTON + SHOW LOADING
    // ========================================================================

    // Hide error message
    errorDiv.style.display = 'none';

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    // ========================================================================
    // PREPARE FORM DATA
    // ========================================================================

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        // ====================================================================
        // MAKE API CALL TO BACKEND
        // ====================================================================

        console.log('📡 Sending login request to backend...');

        const response = await fetch(`${window.API_BASE_URL}/auth/login`, {
            method: 'POST',
            body: formData
        });

        console.log(`📥 Response status: ${response.status}`);

        // ====================================================================
        // PARSE RESPONSE
        // ====================================================================

        let data;

        try {
            data = await response.json();
            console.log('📦 Response data:', data);
        } catch (jsonError) {
            console.error('❌ Failed to parse JSON response:', jsonError);
            throw new Error('Invalid response from server. Please try again.');
        }

        // ====================================================================
        // CHECK IF LOGIN WAS SUCCESSFUL
        // ====================================================================

        if (!response.ok || !data.success) {
            // ================================================================
            // HANDLE SPECIFIC ERROR CASES
            // ================================================================

            const errorType = data.error;
            const errorMessage = data.message;

            console.log(`❌ Login failed: ${errorType} - ${errorMessage}`);

            // --- USERNAME NOT FOUND ---
            if (errorType === 'username_not_found') {
                showError(
                    errorDiv,
                    '❌ Username not found. Please check your username.'
                );
            }

            // --- INCORRECT PASSWORD ---
            else if (errorType === 'incorrect_password') {
                showError(
                    errorDiv,
                    '❌ Incorrect password. Please try again.'
                );
            }

            // --- ACCOUNT PENDING (STATUS = 0) ---
            else if (errorType === 'account_pending') {
                showError(
                    errorDiv,
                    '⏳ Your account is pending admin approval. Please wait for approval.'
                );
            }

            // --- ACCOUNT REJECTED (STATUS = 2) ---
            else if (errorType === 'account_rejected') {
                showError(
                    errorDiv,
                    '❌ Your account has been rejected. Please contact admin for more information.'
                );
            }

            // --- ACCOUNT INACTIVE (GENERIC) ---
            // else if (errorType === 'account_inactive') {
            //     showError(
            //         errorDiv,
            //         '⚠️ Your account is inactive. Please wait for admin approval or contact support.'
            //     );
            // }

            // --- OTHER ERRORS ---
            else {
                showError(
                    errorDiv,
                    errorMessage || 'Login failed. Please try again.'
                );
            }

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';

            return;
        }

        // ====================================================================
        // LOGIN SUCCESSFUL
        // ====================================================================

        console.log('✅ Login successful!');
        console.log(`   User: ${data.user.username}`);
        console.log(`   Role: ${data.user.role} (${data.user.user_role})`);

        // ====================================================================
        // STORE TOKEN
        // ====================================================================

        if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_id', data.user.user_id);
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('user_role', data.user.user_role);
            localStorage.setItem('role', data.user.role);

            // Store full user object for pages that read 'user' key (e.g., catchment-area.js)
            localStorage.setItem('user', JSON.stringify(data.user));

            console.log('💾 User data saved to localStorage');
        }

        // ====================================================================
        // ROLE-BASED REDIRECT
        // ====================================================================

        const userRole = data.user.user_role;

        // --- ADMIN (Role = 1) ---
        if (userRole === 1) {
            console.log('🔄 Redirecting to Admin Panel...');
            showSuccess(errorDiv, 'Login successful! Redirecting to Admin Panel...');

            setTimeout(() => {
                window.location.href = data.redirect_url || 'admin-approvals.html';
            }, 1000);
        }

        // --- AGGREGATOR (Role = 2) ---
        else if (userRole === 2) {
            console.log('🔄 Redirecting to Aggregator Dashboard...');
            showSuccess(errorDiv, 'Login successful! Redirecting to Dashboard...');

            setTimeout(() => {
                window.location.href = data.redirect_url || 'dashboard.html';
            }, 1000);
        }

        // --- BUYER (Role = 3) ---
        else if (userRole === 3) {
            console.log('⚠️  Buyer portal not available yet');

            const message = data.role_message || 'Buyer portal is under development. Please check back later.';
            showWarning(errorDiv, `ℹ️ ${message}`);

            // Re-enable button (no redirect for buyer)
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
        }

        // --- UNKNOWN ROLE ---
        else {
            console.error(`❌ Unknown user role: ${userRole}`);
            showError(errorDiv, 'Invalid user role. Please contact support.');

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
        }

    } catch (error) {
        // ====================================================================
        // HANDLE ERRORS
        // ====================================================================

        console.error('❌ Login error:', error);

        showError(
            errorDiv,
            error.message || 'Connection error. Please check your internet connection and try again.'
        );

        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Login';
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function showError(errorDiv, message) {
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.backgroundColor = '#fee';
    errorDiv.style.color = '#c33';
    errorDiv.style.border = '1px solid #fcc';

    console.log(`📢 Error displayed: ${message}`);
}

function showSuccess(errorDiv, message) {
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.backgroundColor = '#efe';
    errorDiv.style.color = '#3c3';
    errorDiv.style.border = '1px solid #cfc';

    console.log(`📢 Success displayed: ${message}`);
}

function showWarning(errorDiv, message) {
    if (!errorDiv) return;

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.backgroundColor = '#fffbeb';
    errorDiv.style.color = '#92400e';
    errorDiv.style.border = '1px solid #fef3c7';

    console.log(`📢 Warning displayed: ${message}`);
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLoginSubmit,
        showError,
        showSuccess,
        showWarning
    };
}