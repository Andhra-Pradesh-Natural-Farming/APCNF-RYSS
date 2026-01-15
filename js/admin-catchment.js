/**
 * ============================================================================
 * ADMIN CATCHMENT MANAGEMENT - JavaScript
 * ============================================================================
 */

// Ensure API_BASE_URL is defined
if (typeof window.API_BASE_URL === 'undefined') {
    window.API_BASE_URL = 'http://localhost:8000';
}

// ============================================================================
// AUTHENTICATION HELPER
// ============================================================================

function getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

async function authFetch(url, options = {}) {
    options.headers = { ...options.headers, ...getAuthHeaders() };
    const response = await fetch(url, options);
    if (response.status === 401) {
        localStorage.clear();
        window.location.href = 'login.html';
        return;
    }
    return response;
}

// Check auth on page load
(function checkAuth() {
    // If mocking, skip strict check or mock it
    const token = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('user_role');
    // For demo purposes, allow if using mock token
    if (!token) {
        window.location.href = 'login.html';
    }
})();

// ============================================================================
// STATE
// ============================================================================

const state = {
    pending: { page: 1, limit: 10, data: [], allData: [] },
    history: { page: 1, limit: 10, data: [], allData: [], total: 0, search: '' }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Admin Catchment Management loaded');
    loadPendingCatchments();
    loadCatchmentHistory();
});

// ============================================================================
// LOAD PENDING CATCHMENTS
// ============================================================================

async function loadPendingCatchments() {
    const tbody = document.getElementById('pendingCatchmentTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="11" class="placeholder"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';

    try {
        const response = await authFetch(`${API_BASE_URL}/api/catchment/pending`);
        const data = await response.json();

        if (data.success && data.pending_requests) {
            state.pending.allData = data.pending_requests;
            state.pending.total = data.count || data.pending_requests.length;

            // Initialize Sort
            if (window.initTableSort) {
                window.initTableSort({
                    tableId: 'pending-catchment-table',
                    data: state.pending.allData,
                    onSort: (sortedData) => {
                        state.pending.allData = sortedData;
                        renderPendingTable();
                    }
                });
            }

            renderPendingTable();
            document.getElementById('pendingCount').textContent = state.pending.total;
        } else {
            tbody.innerHTML = '<tr><td colspan="11" class="placeholder">No pending requests</td></tr>';
        }
    } catch (error) {
        console.error('Error loading pending catchments:', error);
        tbody.innerHTML = '<tr><td colspan="11" class="placeholder text-danger">Error loading data</td></tr>';
    }
}

function renderPendingTable() {
    const tbody = document.getElementById('pendingCatchmentTableBody');
    if (!tbody || !state.pending.allData.length) {
        tbody.innerHTML = '<tr><td colspan="11" class="placeholder">No pending requests</td></tr>';
        document.getElementById('pendingPagination').innerHTML = '';
        return;
    }

    // Client-side pagination logic
    const startIndex = (state.pending.page - 1) * state.pending.limit;
    const endIndex = startIndex + state.pending.limit;
    const pageData = state.pending.allData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(state.pending.allData.length / state.pending.limit);

    tbody.innerHTML = pageData.map(req => `
        <tr data-id="${req.acm_id}">
            <td><strong>${req.aggregator_id || 'N/A'}</strong></td>
            <td>${req.aggregator_name || 'N/A'}</td>
            <td>${req.aggregator_type || 'N/A'}</td>
            <td>${req.district_name || ''}</td>
            <td>${req.mandal_name || ''}</td>
            <td>${req.village_name || ''}</td>
            <td>${req.season || ''}</td>
            <td>${req.period || ''}</td>
            <td>${req.crop_name || ''}</td>
            <td>${req.creation_date || ''}</td>
            <td class="action-buttons">
                <button class="btn btn-small btn-success" onclick="approveCatchment('${req.acm_id}', '${req.village_name}')">
                    <i class="fa-solid fa-check"></i> Approve
                </button>
                <button class="btn btn-small btn-danger" onclick="rejectCatchment('${req.acm_id}', '${req.village_name}')">
                    <i class="fa-solid fa-times"></i> Reject
                </button>
            </td>
        </tr>
    `).join('');

    renderPaginationControls('pending', totalPages);
}

// ============================================================================
// LOAD CATCHMENT HISTORY
// ============================================================================

async function loadCatchmentHistory() {
    const tbody = document.getElementById('catchmentHistoryTableBody');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="12" class="placeholder"><i class="fas fa-spinner fa-spin"></i> Loading...</td></tr>';

    try {
        const params = new URLSearchParams({
            page: state.history.page,
            limit: state.history.limit
        });
        if (state.history.search) {
            params.append('search', state.history.search);
        }

        const response = await authFetch(`${API_BASE_URL}/api/catchment/history?${params}`);
        const data = await response.json();

        if (data.success) {
            state.history.allData = data.history || [];
            state.history.total = data.total || 0;

            // Initialize Sort
            if (window.initTableSort) {
                window.initTableSort({
                    tableId: 'history-catchment-table',
                    data: state.history.allData,
                    onSort: (sortedData) => {
                        state.history.allData = sortedData;
                        renderHistoryTable();
                    }
                });
            }

            renderHistoryTable();
            renderPaginationControls('history', Math.ceil(state.history.total / state.history.limit) || 1);
            document.getElementById('historyCount').textContent = state.history.total || 0;
        } else {
            tbody.innerHTML = '<tr><td colspan="12" class="placeholder">No history found</td></tr>';
        }
    } catch (error) {
        console.error('Error loading catchment history:', error);
        tbody.innerHTML = '<tr><td colspan="12" class="placeholder text-danger">Error loading data</td></tr>';
    }
}

function renderHistoryTable() {
    const tbody = document.getElementById('catchmentHistoryTableBody');
    if (!tbody || !state.history.allData.length) {
        tbody.innerHTML = '<tr><td colspan="12" class="placeholder">No history found</td></tr>';
        return;
    }

    // Pagination for History (using allData slice if client side, or direct if server side - sticking to client side logic for now to allow sorting)
    const startIndex = (state.history.page - 1) * state.history.limit;
    const endIndex = startIndex + state.history.limit;
    const pageData = state.history.allData.slice(startIndex, endIndex);

    tbody.innerHTML = pageData.map(req => {
        const statusClass = req.status === 1 ? 'approved' : 'rejected';
        const statusText = req.status === 1 ? 'Approved' : 'Rejected';

        return `
        <tr data-id="${req.acm_id}">
            <td><strong>${req.aggregator_id || 'N/A'}</strong></td>
            <td>${req.aggregator_name || 'N/A'}</td>
            <td>${req.aggregator_type || 'N/A'}</td>
            <td>${req.district_name || ''}</td>
            <td>${req.mandal_name || ''}</td>
            <td>${req.village_name || ''}</td>
            <td>${req.season || ''}</td>
            <td>${req.period || ''}</td>
            <td>${req.crop_name || ''}</td>
            <td>
                <span class="status-badge ${statusClass} clickable" 
                      onclick="showStatusChangeModal('${req.acm_id}', ${req.status}, '${req.village_name}')">
                    ${statusText} <i class="fas fa-edit"></i>
                </span>
            </td>
            <td>${req.status_changed_at || req.activation_date || req.rejection_date || '-'}</td>
            <td>${req.changed_by || '-'}</td>
        </tr>
    `}).join('');
}

// ============================================================================
// GENERIC PAGINATION (Simplified from table-utils or custom logic)
// ============================================================================

function renderPaginationControls(type, totalPages) {
    const container = document.getElementById(`${type}Pagination`);
    if (!container) return;

    // Use state directly
    const s = state[type];
    const currentPage = s.page;
    const itemsPerPage = s.limit;
    const totalItems = s.total;

    // Calculate item range
    const startIndex = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

    container.className = 'table-pagination';

    let html = `
        <div class="pagination-info-text">
            Showing <strong>${startIndex}</strong> to <strong>${endIndex}</strong> of <strong>${totalItems}</strong> entries
        </div>
        <div class="pagination-controls">
    `;

    // Previous Button
    html += `
        <button class="pagination-btn" ${currentPage <= 1 ? 'disabled' : ''} 
            onclick="changePage('${type}', ${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    // Page Numbers (Simplified 1..N)
    for (let i = 1; i <= totalPages; i++) {
        // Limit max buttons for view
        if (totalPages > 7 && (i > 2 && i < totalPages - 1 && Math.abs(i - currentPage) > 1)) {
            if (i === 3 && currentPage > 4) html += `<span class="pagination-ellipsis">...</span>`;
            continue;
        }

        html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage('${type}', ${i})">${i}</button>`;
    }

    // Next Button
    html += `
        <button class="pagination-btn" ${currentPage >= totalPages || totalPages === 0 ? 'disabled' : ''} 
            onclick="changePage('${type}', ${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    html += `</div>`;
    container.innerHTML = html;
}

function changePage(type, newPage) {
    if (newPage < 1) return;
    state[type].page = newPage;
    if (type === 'pending') renderPendingTable();
    else if (type === 'history') renderHistoryTable();
}

// ============================================================================
// HELPERS
// ============================================================================

window.approveCatchment = async function (acmId, villageName) {
    if (!confirm(`Approve request for ${villageName}?`)) return;
    try {
        const response = await authFetch(`${API_BASE_URL}/api/catchment/approve/${acmId}`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            alert('Approved successfully');
            loadPendingCatchments();
            loadCatchmentHistory();
        }
    } catch (e) { console.error(e); }
};

window.rejectCatchment = async function (acmId, villageName) {
    const r = prompt(`Reject request for ${villageName}? Reason:`);
    if (!r) return;
    try {
        const response = await authFetch(`${API_BASE_URL}/api/catchment/reject/${acmId}`, { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            alert('Rejected');
            loadPendingCatchments();
            loadCatchmentHistory();
        }
    } catch (e) { console.error(e); }
};

window.changePage = changePage;
