/**
 * =============================================================================
 * TABLE UTILITIES v2 - APCNF-RySS Traceability Portal
 * =============================================================================
 * 
 * Shared utilities for table pagination with page numbers and search.
 * Matches reference design with "Showing X to Y of Z" format.
 * 
 * =============================================================================
 */

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Debounce function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =============================================================================
// PAGINATION RENDERER - Page Numbers Style
// =============================================================================

/**
 * Render pagination with page numbers
 * @param {Object} options - Pagination options
 * @param {string} options.containerId - Container element ID
 * @param {number} options.currentPage - Current page (1-based)
 * @param {number} options.totalItems - Total number of items
 * @param {number} options.itemsPerPage - Items per page
 * @param {Function} options.onPageChange - Callback when page changes
 * @param {string} options.itemLabel - Label for items (e.g., "farmers", "catchments")
 */
function renderPagination(options) {
    const {
        containerId,
        currentPage,
        totalItems,
        itemsPerPage,
        onPageChange,
        itemLabel = 'items'
    } = options;

    const container = document.getElementById(containerId);
    if (!container) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Hide if no data
    if (totalItems === 0) {
        container.innerHTML = '';
        return;
    }

    // Calculate showing range
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers
    const pageNumbers = generatePageNumbers(currentPage, totalPages);

    container.innerHTML = `
        <div class="table-pagination">
            <div class="pagination-info-text">
                Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> ${itemLabel}
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn nav-btn" 
                        onclick="${onPageChange}(${currentPage - 1})"
                        ${currentPage <= 1 ? 'disabled' : ''}>
                    ‹
                </button>
                ${pageNumbers.map(p => {
        if (p === '...') {
            return `<span class="pagination-ellipsis">...</span>`;
        }
        return `<button class="pagination-btn ${p === currentPage ? 'active' : ''}"
                                    onclick="${onPageChange}(${p})">${p}</button>`;
    }).join('')}
                <button class="pagination-btn nav-btn" 
                        onclick="${onPageChange}(${currentPage + 1})"
                        ${currentPage >= totalPages ? 'disabled' : ''}>
                    ›
                </button>
            </div>
        </div>
    `;
}

/**
 * Generate array of page numbers to display
 */
function generatePageNumbers(current, total) {
    const pages = [];
    const maxVisible = 5;

    if (total <= maxVisible + 2) {
        // Show all pages
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        if (current > 3) {
            pages.push('...');
        }

        // Pages around current
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (current < total - 2) {
            pages.push('...');
        }

        // Always show last page
        if (total > 1) {
            pages.push(total);
        }
    }

    return pages;
}

// =============================================================================
// STATUS BADGE HELPER
// =============================================================================

/**
 * Get status badge HTML (outline style)
 * @param {number|string} status - Status code (0=pending, 1=approved, 2=rejected)
 * @returns {string} HTML for status badge
 */
function getStatusBadge(status) {
    const statusMap = {
        0: { class: 'pending', text: 'Pending' },
        1: { class: 'approved', text: 'Approved' },
        2: { class: 'rejected', text: 'Rejected' },
        'pending': { class: 'pending', text: 'Pending' },
        'approved': { class: 'approved', text: 'Approved' },
        'rejected': { class: 'rejected', text: 'Rejected' }
    };

    const statusInfo = statusMap[status] || statusMap[0];
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

// =============================================================================
// SEARCH FUNCTIONALITY
// =============================================================================

/**
 * Initialize table search
 */
function initTableSearch(options) {
    const input = document.getElementById(options.inputId);
    const tableBody = document.getElementById(options.tableBodyId);

    if (!input || !tableBody) return;

    const searchHandler = debounce(function () {
        const searchTerm = input.value.toLowerCase().trim();
        const rows = tableBody.querySelectorAll('tr:not(.empty-state-row)');
        let visibleCount = 0;

        rows.forEach(row => {
            if (row.classList.contains('empty-state-row')) return;

            const cells = row.querySelectorAll('td');
            let matches = !searchTerm;

            if (searchTerm) {
                cells.forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(searchTerm)) {
                        matches = true;
                    }
                });
            }

            row.style.display = matches ? '' : 'none';
            if (matches) visibleCount++;
        });

        if (options.onFilter) {
            options.onFilter(visibleCount, searchTerm);
        }
    }, 300);

    input.addEventListener('input', searchHandler);
}

// =============================================================================
// SORTING FUNCTIONALITY
// =============================================================================

/**
 * Initialize table sorting
 * @param {Object} options
 * @param {string} options.tableId - Table ID
 * @param {Array} options.data - Data array to sort
 * @param {Function} options.onSort - Callback to render sorted data (receives sorted data)
 */
function initTableSort(options) {
    const table = document.getElementById(options.tableId);
    if (!table) return;

    const headers = table.querySelectorAll('th.sortable');
    let currentSort = { field: null, direction: 'asc' };

    headers.forEach(th => {
        // Add cursor pointer style
        th.style.cursor = 'pointer';

        // Add click listener
        th.addEventListener('click', () => {
            const field = th.dataset.sort;
            if (!field) return;

            // Toggle direction
            if (currentSort.field === field) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.field = field;
                currentSort.direction = 'asc';
            }

            // Update Header UI (Visual Feedback)
            headers.forEach(h => {
                h.classList.remove('asc', 'desc');
            });
            th.classList.add(currentSort.direction);

            // Sort Data
            const sortedData = [...options.data].sort((a, b) => {
                let valA = a[field];
                let valB = b[field];

                if (valA === null || valA === undefined) valA = '';
                if (valB === null || valB === undefined) valB = '';

                if (typeof valA === 'string') valA = valA.toLowerCase();
                if (typeof valB === 'string') valB = valB.toLowerCase();

                if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
                if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
                return 0;
            });

            // Trigger callback
            if (options.onSort) {
                options.onSort(sortedData);
            }
        });
    });
}

// =============================================================================
// EXPORTS
// =============================================================================

window.renderPagination = renderPagination;
window.getStatusBadge = getStatusBadge;
window.initTableSearch = initTableSearch;
window.debounce = debounce;
window.generatePageNumbers = generatePageNumbers;
window.initTableSort = initTableSort;
