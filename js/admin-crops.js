/**
 * =============================================================================
 * ADMIN CROPS - Crop Management Page
 * =============================================================================
 * Displays crop master list with:
 * - Consistent table styling (table-card)
 * - 10 rows per page with pagination
 * - Search functionality
 * - Editable shelf life
 */

// Pagination configuration
const ITEMS_PER_PAGE = 10;

// Pagination state
const paginationState = {
    currentPage: 1,
    allData: [],
    filteredData: []
};

document.addEventListener('DOMContentLoaded', () => {
    loadCropsTable();
});

/**
 * Load and render crop table from MOCK_CROPS
 */
function loadCropsTable() {
    const tbody = document.getElementById('cropTableBody');
    if (!tbody) return;

    if (!window.MOCK_DATA || !window.MOCK_DATA.crops) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data-message">No mock data found.</td></tr>';
        return;
    }

    // Store all data
    paginationState.allData = window.MOCK_DATA.crops;
    paginationState.filteredData = [...paginationState.allData];
    paginationState.currentPage = 1;

    // Render table
    renderCropsTable(paginationState.filteredData);
}

/**
 * Render crops table with pagination
 */
function renderCropsTable(crops) {
    const tbody = document.getElementById('cropTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!crops || crops.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data-message">No crops found.</td></tr>';
        document.getElementById('cropPagination').innerHTML = '';
        return;
    }

    // Calculate pagination
    const startIndex = (paginationState.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageData = crops.slice(startIndex, endIndex);

    // Render rows
    pageData.forEach(crop => {
        const isActive = crop.is_active !== false; // Default to active if not specified
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.crop_id}</td>
            <td><strong>${crop.crop_name}</strong></td>
            <td>
                <div style="display: flex; align-items: center; gap: 6px;">
                   <input type="number" 
                          class="form-control" 
                          value="${crop.shelf_life || ''}" 
                          onchange="updateShelfLife('${crop.crop_id}', this.value)"
                          style="width: 80px; padding: 6px 10px; text-align: center;">
                   <span style="color: #666;">days</span>
                </div>
            </td>
            <td>${crop.storage || '-'}</td>
            <td>
                <label class="status-toggle" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                    <input type="checkbox" 
                           ${isActive ? 'checked' : ''} 
                           onchange="toggleCropStatus('${crop.crop_id}', this.checked)"
                           style="display: none;">
                    <span class="toggle-switch" style="
                        position: relative;
                        width: 48px;
                        height: 24px;
                        background: ${isActive ? '#2e7d32' : '#ccc'};
                        border-radius: 24px;
                        transition: background 0.3s;
                        display: inline-block;
                    ">
                        <span style="
                            position: absolute;
                            top: 2px;
                            left: ${isActive ? '26px' : '2px'};
                            width: 20px;
                            height: 20px;
                            background: white;
                            border-radius: 50%;
                            transition: left 0.3s;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        "></span>
                    </span>
                    <span style="
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: ${isActive ? '#2e7d32' : '#999'};
                    ">${isActive ? 'Active' : 'Inactive'}</span>
                </label>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Render pagination
    renderPaginationControls(crops.length);
}

/**
 * Render pagination controls
 */
function renderPaginationControls(totalItems) {
    const container = document.getElementById('cropPagination');
    if (!container) return;

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    const startItem = (paginationState.currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(paginationState.currentPage * ITEMS_PER_PAGE, totalItems);

    const pageNumbers = generatePageNumbers(paginationState.currentPage, totalPages);

    container.innerHTML = `
        <div class="table-pagination">
            <div class="pagination-info-text">
                Showing <strong>${startItem}</strong> to <strong>${endItem}</strong> of <strong>${totalItems}</strong> crops
            </div>
            <div class="pagination-controls">
                <button class="pagination-btn nav-btn" 
                        onclick="changePage(${paginationState.currentPage - 1})"
                        ${paginationState.currentPage <= 1 ? 'disabled' : ''}>
                    ‹
                </button>
                ${pageNumbers.map(p => {
        if (p === '...') {
            return `<span class="pagination-ellipsis">...</span>`;
        }
        return `<button class="pagination-btn ${p === paginationState.currentPage ? 'active' : ''}"
                                    onclick="changePage(${p})">${p}</button>`;
    }).join('')}
                <button class="pagination-btn nav-btn" 
                        onclick="changePage(${paginationState.currentPage + 1})"
                        ${paginationState.currentPage >= totalPages ? 'disabled' : ''}>
                    ›
                </button>
            </div>
        </div>
    `;
}

/**
 * Generate page numbers array
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
 * Change page
 */
window.changePage = function (newPage) {
    const totalPages = Math.ceil(paginationState.filteredData.length / ITEMS_PER_PAGE);
    if (newPage < 1 || newPage > totalPages) return;

    paginationState.currentPage = newPage;
    renderCropsTable(paginationState.filteredData);
};

/**
 * Search crops
 */
window.searchCrops = function () {
    const searchInput = document.getElementById('cropSearch');
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

    if (!searchTerm) {
        paginationState.filteredData = [...paginationState.allData];
    } else {
        paginationState.filteredData = paginationState.allData.filter(crop => {
            return (
                (crop.crop_id || '').toLowerCase().includes(searchTerm) ||
                (crop.crop_name || '').toLowerCase().includes(searchTerm) ||
                (crop.storage || '').toLowerCase().includes(searchTerm)
            );
        });
    }

    paginationState.currentPage = 1;
    renderCropsTable(paginationState.filteredData);
};

/**
 * Update Shelf Life in Mock Data
 */
window.updateShelfLife = function (cropId, newValue) {
    if (!window.MOCK_DATA || !window.MOCK_DATA.crops) return;

    const crop = window.MOCK_DATA.crops.find(c => c.crop_id === cropId);
    if (crop) {
        crop.shelf_life = parseInt(newValue);
        console.log(`✅ [MOCK] Updated Shelf Life for ${crop.crop_name}: ${crop.shelf_life} days`);
    } else {
        console.error(`Crop ID ${cropId} not found.`);
    }
};

/**
 * Toggle Crop Active/Inactive Status
 */
window.toggleCropStatus = function (cropId, isActive) {
    if (!window.MOCK_DATA || !window.MOCK_DATA.crops) return;

    const crop = window.MOCK_DATA.crops.find(c => c.crop_id === cropId);
    if (crop) {
        crop.is_active = isActive;
        console.log(`✅ [MOCK] ${crop.crop_name} is now ${isActive ? 'Active' : 'Inactive'}`);
        // Re-render to update the toggle appearance
        loadCropsTable();
    } else {
        console.error(`Crop ID ${cropId} not found.`);
    }
};
