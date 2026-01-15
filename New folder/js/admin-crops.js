// This is js/admin-crops.js
document.addEventListener('DOMContentLoaded', () => {
    loadCropsTable();
});

/**
 * Load and render crop table from MOCK_CROPS
 */
function loadCropsTable() {
    const tbody = document.querySelector('#crop-master-table tbody');
    if (!tbody) return;

    if (!window.MOCK_DATA || !window.MOCK_DATA.crops) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No mock data found.</td></tr>';
        return;
    }

    const crops = window.MOCK_DATA.crops;
    tbody.innerHTML = '';

    if (crops.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No crops available.</td></tr>';
        return;
    }

    crops.forEach(crop => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${crop.crop_id}</td>
            <td class="font-bold">${crop.crop_name}</td>
            <td>
                <div class="input-with-icon">
                   <input type="number" 
                          class="form-control shelf-life-input" 
                          value="${crop.shelf_life || ''}" 
                          onchange="updateShelfLife('${crop.crop_id}', this.value)"
                          style="width: 100px;">
                   <span class="days-label">days</span>
                </div>
            </td>
            <td>${crop.storage || '-'}</td>
            <td>
                <button class="btn btn-small btn-danger remove-btn" onclick="deleteCrop('${crop.crop_id}')" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Update Shelf Life in Mock Data
 * @param {string} cropId 
 * @param {string|number} newValue 
 */
window.updateShelfLife = function (cropId, newValue) {
    if (!window.MOCK_DATA || !window.MOCK_DATA.crops) return;

    const crop = window.MOCK_DATA.crops.find(c => c.crop_id === cropId);
    if (crop) {
        crop.shelf_life = parseInt(newValue);
        console.log(`✅ [MOCK] Updated Shelf Life for ${crop.crop_name}: ${crop.shelf_life} days`);

        // Optional: show toast/notification
        // alert(`Updated ${crop.crop_name}`);
    } else {
        console.error(`Crop ID ${cropId} not found.`);
    }
};

/**
 * Delete Crop (Mock)
 */
window.deleteCrop = function (cropId) {
    if (!confirm('Are you sure you want to delete this crop?')) return;

    if (!window.MOCK_DATA || !window.MOCK_DATA.crops) return;

    const index = window.MOCK_DATA.crops.findIndex(c => c.crop_id === cropId);
    if (index > -1) {
        window.MOCK_DATA.crops.splice(index, 1);
        loadCropsTable(); // Re-render
        console.log(`✅ [MOCK] Deleted Crop ID ${cropId}`);
    }
};