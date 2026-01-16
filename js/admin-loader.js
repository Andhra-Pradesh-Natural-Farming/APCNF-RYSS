/**
 * ============================================================================
 * ADMIN-LOADER.JS - Admin Page Component Loader
 * ============================================================================
 * Loads header and footer components dynamically for admin pages.
 * Also provides global logout function for all admin pages.
 */

/**
 * GLOBAL LOGOUT FUNCTION
 * Available globally for all admin pages.
 * Logs out directly without confirmation.
 */
window.logout = function () {
    // Clear all stored session data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('aggregatorId');
    localStorage.removeItem('aggregatorName');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    localStorage.removeItem('role');
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = 'login.html';
};

// Also expose as 'handleLogout' for compatibility
window.handleLogout = window.logout;

document.addEventListener("DOMContentLoaded", () => {

    /**
     * Load a component into a placeholder element
     */
    const loadComponent = (id, url, callback) => {
        const placeholder = document.getElementById(id);
        if (!placeholder) return;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`Could not load ${url}`);
                return response.text();
            })
            .then(data => {
                placeholder.innerHTML = data;
                if (callback) callback();
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    };

    /**
     * Highlight the active navigation link
     */
    const highlightActiveNav = () => {
        const currentPage = window.location.pathname.split('/').pop();
        if (!currentPage) return;

        const navLinks = document.querySelectorAll('#admin-header-placeholder nav a.admin-nav-link');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    };

    /**
     * Initialize mobile menu after header is loaded
     */
    const initMobileMenu = () => {
        // Small delay to ensure DOM is fully updated
        setTimeout(() => {
            if (typeof window.setupMobileMenu === 'function') {
                window.setupMobileMenu();
            } else {
                console.warn('[admin-loader] setupMobileMenu not available yet');
            }
        }, 50);
    };

    /**
     * Load responsive.js if not already present
     */
    const loadResponsiveJS = (callback) => {
        if (document.querySelector('script[src*="responsive.js"]')) {
            // Already loaded, just call callback
            if (callback) callback();
            return;
        }

        const script = document.createElement('script');
        script.src = '../js/responsive.js';
        script.onload = () => {
            if (callback) callback();
        };
        document.body.appendChild(script);
    };

    // Load admin header, then highlight nav and setup mobile menu
    loadComponent('admin-header-placeholder', 'admin-header.html', () => {
        highlightActiveNav();
        loadResponsiveJS(initMobileMenu);
    });

    // Load admin footer
    loadComponent('admin-footer-placeholder', 'admin-footer.html');

    /**
     * Add back button to admin pages for streamlined navigation
     * Excludes: admin-approvals (main admin dashboard)
     */
    const addBackButton = () => {
        const currentPage = window.location.pathname.split('/').pop().toLowerCase();
        const excludePages = ['admin-approvals.html', 'login.html', ''];

        if (excludePages.includes(currentPage)) return;

        // Find the main content container
        const container = document.querySelector('.admin-content') || document.querySelector('main');
        if (!container) return;

        // Check if back button already exists
        if (document.querySelector('.back-btn')) return;

        // Create back button
        const backBtn = document.createElement('a');
        backBtn.className = 'back-btn';
        backBtn.href = 'javascript:history.back()';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back';

        // Insert at the top of container
        container.insertBefore(backBtn, container.firstChild);
    };

    // Add back button after a short delay to ensure DOM is ready
    setTimeout(addBackButton, 100);
});