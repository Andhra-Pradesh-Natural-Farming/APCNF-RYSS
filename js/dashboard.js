/**
 * =============================================================================
 * AGGREGATOR DASHBOARD - JAVASCRIPT
 * =============================================================================
 * 
 * Displays:
 * - Dashboard summary stats (approved catchments, approved farmers, total batches)
 * - My Catchment Areas table (all statuses)
 * - My Farmer List table (all statuses)
 * 
 * Status Mapping:
 * - 0 = Pending
 * - 1 = Approved
 * - 2 = Rejected
 * 
 * UPDATED: Uses mock-data.js for presentation purposes
 */

// Use global API_BASE_URL from apcnf.js, fallback to localhost
const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8000';

// =============================================================================
// LOGOUT FUNCTION
// =============================================================================

function handleLogout() {
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
}

// =============================================================================
// PAGINATION CONFIGURATION
// =============================================================================

const ITEMS_PER_PAGE = 10;

// Pagination state for each table
const paginationState = {
    catchments: {
        currentPage: 1,
        totalItems: 0,
        allData: []
    },
    farmers: {
        currentPage: 1,
        totalItems: 0,
        allData: []
    }
};

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', function () {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (user && user.user_id) {
        // Display aggregator name
        const nameDisplay = document.getElementById('aggregatorNameDisplay');
        if (nameDisplay) {
            nameDisplay.textContent = user.org_name || user.username || 'Aggregator';
        }

        // Load all data
        loadDashboardSummary(user.user_id);
        loadCatchmentAreas(user.user_id);
        loadFarmerList(user.user_id);
    } else {
        console.error('[ERROR] No user found in localStorage. Redirecting to login.');
        // Show error message instead of demo data
        document.getElementById('statCatchments').textContent = '-';
        document.getElementById('statFarmers').textContent = '-';
        document.getElementById('statBatches').textContent = '-';

        document.getElementById('catchmentTableBody').innerHTML = `
            <tr>
                <td colspan="7" class="no-data-message">
                    Please <a href="login.html">login</a> to view your dashboard.
                </td>
            </tr>
        `;
        document.getElementById('farmerTableBody').innerHTML = `
            <tr>
                <td colspan="9" class="no-data-message">
                    Please <a href="login.html">login</a> to view your farmers.
                </td>
            </tr>
        `;
    }
});

// =============================================================================
// STATUS MAPPING HELPER
// =============================================================================

function getStatusDisplay(statusCode) {
    // Use new status-badge classes from table-styles.css
    const statusMap = {
        0: { text: 'Pending', class: 'status-badge pending' },
        1: { text: 'Approved', class: 'status-badge approved' },
        2: { text: 'Rejected', class: 'status-badge rejected' }
    };

    const status = statusMap[statusCode] || statusMap[0];
    return `<span class="${status.class}">${status.text}</span>`;
}

// =============================================================================
// LOAD DASHBOARD SUMMARY (APPROVED COUNTS)
// =============================================================================

async function loadDashboardSummary(aggregatorId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/catchment/dashboard/summary/${aggregatorId}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            document.getElementById('statCatchments').textContent = data.approved_catchments || 0;
            document.getElementById('statFarmers').textContent = data.approved_farmers || 0;
            document.getElementById('statBatches').textContent = data.total_batches || 0;
            console.log('[OK] Dashboard summary loaded:', data);
        }
    } catch (error) {
        console.error('[ERROR] Error loading dashboard summary:', error);
        document.getElementById('statCatchments').textContent = '0';
        document.getElementById('statFarmers').textContent = '0';
        document.getElementById('statBatches').textContent = '0';
    }
}

// =============================================================================
// LOAD CATCHMENT AREAS (ALL STATUSES)
// =============================================================================

async function loadCatchmentAreas(aggregatorId) {
    const tbody = document.getElementById('catchmentTableBody');

    try {
        const response = await fetch(`${API_BASE_URL}/api/catchment/my-requests/${aggregatorId}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.requests && data.requests.length > 0) {
            // Store original data for search
            window.allCatchments = data.requests;
            renderCatchmentTable(data.requests);

            // Initialize Sorting
            if (window.initTableSort) {
                window.initTableSort({
                    tableId: 'catchmentTable',
                    data: window.allCatchments,
                    onSort: renderCatchmentTable
                });
            }

            console.log(`[OK] Loaded ${data.count} catchment areas`);
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="no-data-message">
                        No catchment areas found. <a href="catchment-area.html">Request one now!</a>
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('[ERROR] Error loading catchment areas:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data-message">
                    Error loading catchment areas. Please try again later.
                </td>
            </tr>
        `;
    }
}

function renderCatchmentTable(catchments) {
    const tbody = document.getElementById('catchmentTableBody');
    tbody.innerHTML = '';

    // Store all data for pagination state
    paginationState.catchments.allData = catchments;

    // Calculate pagination slice
    const state = paginationState.catchments;
    const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = catchments.slice(startIndex, endIndex);

    // Render rows for current page
    pageData.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${c.aggregator_id || '-'}</td>
            <td>${c.district_name || '-'}</td>
            <td>${c.mandal_name || '-'}</td>
            <td>${c.panchayat_name || '-'}</td>
            <td>${c.village_name || '-'}</td>
            <td>${c.crop_name || '-'}</td>
            <td>${getStatusDisplay(c.status)}</td>
        `;
        tbody.appendChild(row);
    });

    // Render pagination controls
    renderPaginationControls('catchments');
}

// =============================================================================
// LOAD FARMER LIST (ALL STATUSES)
// =============================================================================

async function loadFarmerList(aggregatorId) {
    const tbody = document.getElementById('farmerTableBody');

    try {
        const response = await fetch(`${API_BASE_URL}/api/catchment/farmers/${aggregatorId}?status=1`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.farmers && data.farmers.length > 0) {
            // Store original data for search
            window.allFarmers = data.farmers;
            renderFarmerTable(data.farmers);

            // Initialize Sorting
            if (window.initTableSort) {
                window.initTableSort({
                    tableId: 'farmerTable',
                    data: window.allFarmers,
                    onSort: renderFarmerTable
                });
            }

            console.log(`[OK] Loaded ${data.count} farmers`);
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="no-data-message">
                        No farmers found. Farmers are added when your catchment areas are approved.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('[ERROR] Error loading farmer list:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="no-data-message">
                    Error loading farmers. Please try again later.
                </td>
            </tr>
        `;
    }
}

function renderFarmerTable(farmers) {
    const tbody = document.getElementById('farmerTableBody');
    tbody.innerHTML = '';

    // Store all data for pagination state
    paginationState.farmers.allData = farmers;

    // Calculate pagination slice
    const state = paginationState.farmers;
    const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = farmers.slice(startIndex, endIndex);

    // Render rows for current page
    pageData.forEach(f => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${f.farmer_id || f.aggregator_farmer_id || '-'}</td>
            <td>${f.farmer_name || f.aggregator_farmer_name || '-'}</td>
            <td>${f.farmer_category || f.aggregator_farmer_category || '-'}</td>
            <td>${f.district_name || f.dm_district_name || '-'}</td>
            <td>${f.mandal_name || f.dm_mandal_name || '-'}</td>
            <td>${f.panchayat_name || f.dm_panchayat_name || '-'}</td>
            <td>${f.village_name || f.dm_village_name || '-'}</td>
            <td>${f.crop_name || '-'}</td>
            <td>${getStatusDisplay(f.mapping_status || f.status || 1)}</td>
        `;
        tbody.appendChild(row);
    });

    // Render pagination controls
    renderPaginationControls('farmers');
}

// =============================================================================
// SEARCH FUNCTIONS
// =============================================================================

// Store original data for search
window.allCatchments = [];
window.allFarmers = [];

function searchDashboardCatchments() {
    const searchInput = document.getElementById('catchmentSearch');
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

    if (!window.allCatchments || window.allCatchments.length === 0) return;

    if (!searchTerm) {
        paginationState.catchments.currentPage = 1;
        renderCatchmentTable(window.allCatchments);
        return;
    }

    const filtered = window.allCatchments.filter(c => {
        return (
            (c.aggregator_id || '').toLowerCase().includes(searchTerm) ||
            (c.district_name || '').toLowerCase().includes(searchTerm) ||
            (c.mandal_name || '').toLowerCase().includes(searchTerm) ||
            (c.village_name || '').toLowerCase().includes(searchTerm) ||
            (c.crop_name || '').toLowerCase().includes(searchTerm)
        );
    });

    if (filtered.length === 0) {
        document.getElementById('catchmentTableBody').innerHTML = `
            <tr><td colspan="7" class="no-data-message">No matching catchments found</td></tr>
        `;
        document.getElementById('catchmentPagination').innerHTML = '';
        return;
    }

    paginationState.catchments.currentPage = 1;
    renderCatchmentTable(filtered);
}

function searchDashboardFarmers() {
    const searchInput = document.getElementById('farmerSearch');
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

    if (!window.allFarmers || window.allFarmers.length === 0) return;

    if (!searchTerm) {
        paginationState.farmers.currentPage = 1;
        renderFarmerTable(window.allFarmers);
        return;
    }

    const filtered = window.allFarmers.filter(f => {
        return (
            (f.farmer_id || f.aggregator_farmer_id || '').toLowerCase().includes(searchTerm) ||
            (f.farmer_name || f.aggregator_farmer_name || '').toLowerCase().includes(searchTerm) ||
            (f.farmer_category || '').toLowerCase().includes(searchTerm) ||
            (f.district_name || f.dm_district_name || '').toLowerCase().includes(searchTerm) ||
            (f.mandal_name || f.dm_mandal_name || '').toLowerCase().includes(searchTerm) ||
            (f.village_name || f.dm_village_name || '').toLowerCase().includes(searchTerm) ||
            (f.crop_name || '').toLowerCase().includes(searchTerm)
        );
    });

    if (filtered.length === 0) {
        document.getElementById('farmerTableBody').innerHTML = `
            <tr><td colspan="9" class="no-data-message">No matching farmers found</td></tr>
        `;
        document.getElementById('farmerPagination').innerHTML = '';
        return;
    }

    paginationState.farmers.currentPage = 1;
    renderFarmerTable(filtered);
}

// Make search functions globally accessible
window.searchDashboardCatchments = searchDashboardCatchments;
window.searchDashboardFarmers = searchDashboardFarmers;

// =============================================================================
// PAGINATION FUNCTIONS
// =============================================================================

/**
 * Render pagination controls for a table
 * @param {string} tableType - 'catchments' or 'farmers'
 */
function renderPaginationControls(tableType) {
    const state = paginationState[tableType];
    const containerId = tableType === 'catchments' ? 'catchmentPagination' : 'farmerPagination';
    const container = document.getElementById(containerId);
    const itemLabel = tableType === 'catchments' ? 'catchment areas' : 'approved farmers';

    if (!container) return;

    const totalItems = state.allData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    // Calculate showing range
    const startItem = (state.currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(state.currentPage * ITEMS_PER_PAGE, totalItems);

    // Generate page numbers
    const pageNumbers = generatePageNumbers(state.currentPage, totalPages);

    container.innerHTML = `
        <div class="table-pagination">
            <div class="pagination-info-text">
                Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> ${itemLabel}
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn nav-btn" 
                        onclick="changePage('${tableType}', ${state.currentPage - 1})"
                        ${state.currentPage <= 1 ? 'disabled' : ''}>
                    ‹
                </button>
                ${pageNumbers.map(p => {
        if (p === '...') {
            return `<span class="pagination-ellipsis">...</span>`;
        }
        return `<button class="pagination-btn ${p === state.currentPage ? 'active' : ''}"
                                    onclick="changePage('${tableType}', ${p})">${p}</button>`;
    }).join('')}
                <button class="pagination-btn nav-btn" 
                        onclick="changePage('${tableType}', ${state.currentPage + 1})"
                        ${state.currentPage >= totalPages ? 'disabled' : ''}>
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
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        if (current > 3) pages.push('...');

        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (current < total - 2) pages.push('...');
        if (total > 1) pages.push(total);
    }

    return pages;
}

/**
 * Change page for a table
 * @param {string} tableType - 'catchments' or 'farmers'
 * @param {number} newPage - New page number
 */
function changePage(tableType, newPage) {
    const state = paginationState[tableType];
    const totalPages = Math.ceil(state.allData.length / ITEMS_PER_PAGE);

    if (newPage < 1 || newPage > totalPages) return;

    state.currentPage = newPage;

    if (tableType === 'catchments') {
        renderCatchmentTable(state.allData);
    } else if (tableType === 'farmers') {
        renderFarmerTable(state.allData);
    }
}

// Make pagination functions globally accessible
window.changePage = changePage;
window.handleLogout = handleLogout;