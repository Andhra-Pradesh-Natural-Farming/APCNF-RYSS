/**
 * ============================================================================
 * ADMIN APPROVAL SYSTEM - WITH PROPER PAGINATION & SORTING
 * ============================================================================
 * 
 * FEATURES:
 * - Load pending aggregators (status = 0)
 * - Load pending buyers (status = 0)
 * - Load application history (status IN (1, 2))
 * - Approve/Reject functionality
 * - Document viewing
 * - Dynamic count updates
 * - Real-time table updates
 * - Proper pagination (10 items per page) using shared table-utils
 * - Sorting enabled via shared table-utils
 * 
 * ============================================================================
 */

// Define API_BASE_URL fallback
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = 'http://localhost:8000';
}

// ============================================================================
// AUTHENTICATION HELPER
// ============================================================================

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error('❌ No access token found! Redirecting to login...');
        window.location.href = 'login.html';
        return null;
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

async function authFetch(url, options = {}) {
    const headers = getAuthHeaders();
    if (!headers) return null;

    return fetch(url, {
        ...options,
        headers: { ...headers, ...options.headers }
    });
}

// Check authentication on page load
(function checkAuth() {
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');

    // DEBUG: Check what is stored
    // alert(`DEBUG checkAuth: Role is '${userRole}' (Type: ${typeof userRole})`);

    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    // Only admin (role=1) should access this page
    if (userRole !== '1') {
        alert(`Access denied. Current Role: ${userRole}. Admin only.`);
        window.location.href = 'login.html';
        return;
    }
    console.log('✅ Admin authenticated');
})();

// ============================================================================
// PAGINATION STATE
// ============================================================================

const paginationState = {
    aggregators: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        allData: []
    },
    buyers: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        allData: []
    },
    history: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        allData: []
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Admin Approvals page loaded');
    loadPendingAggregators();
    loadPendingBuyers();
    loadApplicationHistory();
});

// ============================================================================
// LOAD PENDING AGGREGATORS
// ============================================================================

async function loadPendingAggregators() {
    const tbody = document.getElementById('aggregatorTableBody');
    const countSpan = document.getElementById('pendingAggCount');
    if (!tbody) return;

    try {
        const response = await authFetch(`${window.API_BASE_URL}/admin/pending_aggregators`);
        if (!response) return;
        const data = await response.json();

        paginationState.aggregators.allData = data.aggregators || [];
        paginationState.aggregators.totalItems = data.count || 0;
        countSpan.textContent = data.count || 0;

        // Initialize Sorting
        if (window.initTableSort) {
            window.initTableSort({
                tableId: 'aggregator-approval-table',
                data: paginationState.aggregators.allData,
                onSort: (sortedData) => {
                    paginationState.aggregators.allData = sortedData;
                    renderPaginatedTable('aggregators', tbody, createAggregatorRow);
                }
            });
        }

        renderPaginatedTable('aggregators', tbody, createAggregatorRow);
    } catch (error) {
        console.error('❌ Error loading aggregators:', error);
        tbody.innerHTML = `<tr><td colspan="7" class="placeholder text-danger">Error loading data</td></tr>`;
    }
}

function createAggregatorRow(agg) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', agg.user_id);
    tr.innerHTML = `
        <td><strong>${agg.user_id}</strong></td>
        <td>${agg.org_name}</td>
        <td>${agg.type}</td>
        <td>${agg.email}</td>
        <td>${agg.mobile}</td>
        <td>
             <button class="btn btn-small btn-secondary" onclick="viewDocuments('${agg.user_id}', 'aggregator', ${JSON.stringify(agg.documents || {}).replace(/"/g, '&quot;')})">
                <i class="fa-solid fa-file-arrow-down"></i> View Docs
            </button>
        </td>
        <td class="action-buttons">
            <button class="btn btn-small btn-success approve-btn" onclick="approveAggregator('${agg.user_id}', '${agg.org_name.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-check"></i> Approve
            </button>
            <button class="btn btn-small btn-danger reject-btn" onclick="rejectAggregator('${agg.user_id}', '${agg.org_name.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-times"></i> Reject
            </button>
        </td>
    `;
    return tr;
}

// ============================================================================
// LOAD PENDING BUYERS
// ============================================================================

async function loadPendingBuyers() {
    const tbody = document.getElementById('buyerTableBody');
    const countSpan = document.getElementById('pendingBuyerCount');
    if (!tbody) return;

    try {
        const response = await authFetch(`${window.API_BASE_URL}/admin/pending_buyers`);
        if (!response) return;
        const data = await response.json();

        paginationState.buyers.allData = data.buyers || [];
        paginationState.buyers.totalItems = data.count || 0;
        countSpan.textContent = data.count || 0;

        // Initialize Sorting
        if (window.initTableSort) {
            window.initTableSort({
                tableId: 'buyer-approval-table',
                data: paginationState.buyers.allData,
                onSort: (sortedData) => {
                    paginationState.buyers.allData = sortedData;
                    renderPaginatedTable('buyers', tbody, createBuyerRow);
                }
            });
        }

        renderPaginatedTable('buyers', tbody, createBuyerRow);
    } catch (error) {
        console.error('❌ Error loading buyers:', error);
        tbody.innerHTML = `<tr><td colspan="7" class="placeholder text-danger">Error loading data</td></tr>`;
    }
}

function createBuyerRow(buyer) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', buyer.user_id);
    tr.innerHTML = `
        <td><strong>${buyer.user_id}</strong></td>
        <td>${buyer.org_name}</td>
        <td>${buyer.type}</td>
        <td>${buyer.email}</td>
        <td>${buyer.mobile}</td>
        <td>
            <button class="btn btn-small btn-secondary" onclick="viewDocuments('${buyer.user_id}', 'buyer', ${JSON.stringify(buyer.documents || {}).replace(/"/g, '&quot;')})">
                <i class="fa-solid fa-file-arrow-down"></i> View Docs
            </button>
        </td>
        <td class="action-buttons">
            <button class="btn btn-small btn-success approve-btn" onclick="approveBuyer('${buyer.user_id}', '${buyer.org_name.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-check"></i> Approve
            </button>
            <button class="btn btn-small btn-danger reject-btn" onclick="rejectBuyer('${buyer.user_id}', '${buyer.org_name.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-times"></i> Reject
            </button>
        </td>
    `;
    return tr;
}

// ============================================================================
// LOAD APPLICATION HISTORY
// ============================================================================

async function loadApplicationHistory() {
    const tbody = document.getElementById('historyTableBody');
    const countSpan = document.getElementById('historyCount');
    if (!tbody) return;

    try {
        const response = await authFetch(`${window.API_BASE_URL}/admin/application_history`);
        if (!response) return;
        const data = await response.json();

        paginationState.history.allData = data.history || [];
        paginationState.history.totalItems = data.count || 0;
        countSpan.textContent = data.count || 0;

        // Initialize Sorting
        if (window.initTableSort) {
            window.initTableSort({
                tableId: 'history-table',
                data: paginationState.history.allData,
                onSort: (sortedData) => {
                    paginationState.history.allData = sortedData;
                    renderPaginatedTable('history', tbody, createHistoryRow);
                }
            });
        }

        renderPaginatedTable('history', tbody, createHistoryRow);
    } catch (error) {
        console.error('❌ Error loading history:', error);
        tbody.innerHTML = `<tr><td colspan="8" class="placeholder text-danger">Error loading data</td></tr>`;
    }
}

function createHistoryRow(record) {
    const tr = document.createElement('tr');
    const statusClass = record.status === 'Approved' ? 'approved' : 'rejected';
    const statusIcon = record.status === 'Approved' ? 'fa-check-circle' : 'fa-times-circle';
    const userType = record.type.toLowerCase();

    tr.innerHTML = `
        <td><span class="status-badge ${record.type === 'Aggregator' ? 'role-aggregator' : 'role-buyer'}">${record.type}</span></td>
        <td><strong>${record.user_id}</strong></td>
        <td>${record.org_name}</td>
        <td>${record.org_type}</td>
        <td>${record.email}</td>
        <td>${record.mobile}</td>
        <td>
             <button class="btn btn-small btn-secondary" onclick="viewDocuments('${record.user_id}', '${userType}', ${JSON.stringify(record.documents || {}).replace(/"/g, '&quot;')})">
                <i class="fa-solid fa-file-arrow-down"></i> View Docs
            </button>
        </td>
        <td>
            <span class="status-badge ${statusClass}"> <i class="fas ${statusIcon}"></i> ${record.status} </span>
        </td>
    `;
    return tr;
}

// ============================================================================
// PAGINATION FUNCTIONS
// ============================================================================

function renderPaginatedTable(tableType, tbody, rowCreator) {
    const state = paginationState[tableType];
    const { currentPage, itemsPerPage, allData } = state;

    if (allData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="placeholder">No data found</td></tr>`;
        document.getElementById(`${tableType.endsWith('s') ? tableType.slice(0, -1) : tableType}Pagination`).innerHTML = '';
        return;
    }

    // Calculate pagination
    const totalPages = Math.ceil(allData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = allData.slice(startIndex, endIndex);

    // Clear table
    tbody.innerHTML = '';
    pageItems.forEach(item => tbody.appendChild(rowCreator(item)));

    // Render controls using table-utils.js
    if (window.renderPagination) {
        // Map tableType to specific page change handler string
        let handlerName = 'changeAggregatorPage';
        if (tableType === 'buyers') handlerName = 'changeBuyerPage';
        if (tableType === 'history') handlerName = 'changeHistoryPage';

        const tableTypeSingular = tableType.endsWith('s') ? tableType.slice(0, -1) : tableType;

        window.renderPagination({
            containerId: `${tableTypeSingular}Pagination`,
            currentPage: currentPage,
            totalItems: allData.length,
            itemsPerPage: itemsPerPage,
            onPageChange: handlerName,
            itemLabel: tableType
        });
    }
}

// Global wrappers for pagination handling
window.changeAggregatorPage = (newPage) => changePage('aggregators', newPage);
window.changeBuyerPage = (newPage) => changePage('buyers', newPage);
window.changeHistoryPage = (newPage) => changePage('history', newPage);

function changePage(tableType, newPage) {
    paginationState[tableType].currentPage = newPage;

    const tbody = document.getElementById(
        tableType === 'aggregators' ? 'aggregatorTableBody' :
            tableType === 'buyers' ? 'buyerTableBody' :
                'historyTableBody'
    );

    const rowCreator =
        tableType === 'aggregators' ? createAggregatorRow :
            tableType === 'buyers' ? createBuyerRow :
                createHistoryRow;

    renderPaginatedTable(tableType, tbody, rowCreator);
}

// ============================================================================
// ACTIONS (Approve/Reject/View)
// ============================================================================

async function approveAggregator(id, name) {
    if (!confirm(`Approve ${name}?`)) return;
    // Mock logic: call API
    await authFetch(`${window.API_BASE_URL}/admin/approve_aggregator/${id}`, { method: 'PUT' });
    alert('Approved!');
    loadPendingAggregators();
    loadApplicationHistory();
}

async function rejectAggregator(id, name) {
    if (!confirm(`Reject ${name}?`)) return;
    await authFetch(`${window.API_BASE_URL}/admin/reject_aggregator/${id}`, { method: 'PUT' });
    alert('Rejected!');
    loadPendingAggregators();
    loadApplicationHistory();
}

async function approveBuyer(id, name) {
    if (!confirm(`Approve ${name}?`)) return;
    await authFetch(`${window.API_BASE_URL}/admin/approve_buyer/${id}`, { method: 'PUT' });
    alert('Approved!');
    loadPendingBuyers();
    loadApplicationHistory();
}

async function rejectBuyer(id, name) {
    if (!confirm(`Reject ${name}?`)) return;
    await authFetch(`${window.API_BASE_URL}/admin/reject_buyer/${id}`, { method: 'PUT' });
    alert('Rejected!');
    loadPendingBuyers();
    loadApplicationHistory();
}

window.approveAggregator = approveAggregator;
window.rejectAggregator = rejectAggregator;
window.approveBuyer = approveBuyer;
window.rejectBuyer = rejectBuyer;

window.viewDocuments = function (id, type, docs) {
    alert(`Viewing documents for ${type} ${id}:\n\n` + JSON.stringify(docs, null, 2));
};
