/**
 * =============================================================================
 * RESPONSIVE.JS - Mobile Menu Toggle & Responsive Utilities
 * =============================================================================
 */

(function () {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', initResponsive);

    function initResponsive() {
        setupMobileMenu();
        handleResize();
        window.addEventListener('resize', debounce(handleResize, 150));
    }

    /**
     * Setup Mobile Hamburger Menu
     */
    function setupMobileMenu() {
        // Find navigation elements
        const header = document.querySelector('header');
        if (!header) return;

        const nav = header.querySelector('nav') || header.querySelector('.main-nav');
        const headerContent = header.querySelector('.header-content');

        if (!nav || !headerContent) return;

        // Check if toggle already exists
        if (header.querySelector('.mobile-menu-toggle')) return;

        // Create hamburger button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';

        // Create close button for mobile menu
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.setAttribute('aria-label', 'Close Menu');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';

        // Insert toggle button before logout or at end of header
        const logoutSection = headerContent.querySelector('.header-logout');
        if (logoutSection) {
            headerContent.insertBefore(toggleBtn, logoutSection);
        } else {
            headerContent.appendChild(toggleBtn);
        }

        // Insert overlay after header
        header.parentNode.insertBefore(overlay, header.nextSibling);

        // Open menu
        toggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openMobileMenu(nav, overlay, closeBtn);
        });

        // Close menu when overlay clicked
        overlay.addEventListener('click', function () {
            closeMobileMenu(nav, overlay, closeBtn);
        });

        // Close menu when close button clicked
        closeBtn.addEventListener('click', function () {
            closeMobileMenu(nav, overlay, closeBtn);
        });

        // Close menu on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('mobile-menu-active')) {
                closeMobileMenu(nav, overlay, closeBtn);
            }
        });

        // Close menu when a nav link is clicked
        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMobileMenu(nav, overlay, closeBtn);
            });
        });
    }

    /**
     * Open Mobile Menu
     */
    function openMobileMenu(nav, overlay, closeBtn) {
        nav.classList.add('mobile-menu-active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add close button to nav if not already there
        if (!nav.querySelector('.mobile-menu-close')) {
            nav.insertBefore(closeBtn, nav.firstChild);
        }

        // Update toggle icon
        const toggleBtn = document.querySelector('.mobile-menu-toggle i');
        if (toggleBtn) {
            toggleBtn.className = 'fas fa-times';
        }
    }

    /**
     * Close Mobile Menu
     */
    function closeMobileMenu(nav, overlay, closeBtn) {
        nav.classList.remove('mobile-menu-active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';

        // Update toggle icon
        const toggleBtn = document.querySelector('.mobile-menu-toggle i');
        if (toggleBtn) {
            toggleBtn.className = 'fas fa-bars';
        }
    }

    /**
     * Handle Window Resize
     */
    function handleResize() {
        const width = window.innerWidth;

        // Close mobile menu if resized to desktop
        if (width > 992) {
            const nav = document.querySelector('.mobile-menu-active');
            const overlay = document.querySelector('.mobile-menu-overlay.active');

            if (nav) {
                nav.classList.remove('mobile-menu-active');
                document.body.style.overflow = '';
            }
            if (overlay) {
                overlay.classList.remove('active');
            }

            // Reset toggle icon
            const toggleBtn = document.querySelector('.mobile-menu-toggle i');
            if (toggleBtn) {
                toggleBtn.className = 'fas fa-bars';
            }
        }
    }

    /**
     * Debounce utility
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Check if device supports touch
     */
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Add touch class to body if touch device
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    }

})();
