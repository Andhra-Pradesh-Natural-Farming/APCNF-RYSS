document.addEventListener("DOMContentLoaded", () => {

    // --- Element Selections ---
    const batchListTbody = document.getElementById("batchListTbody");
    const noBatchesRow = document.getElementById("noBatchesRow");
    const qrModal = document.getElementById("qrModal");
    const qrModalTitle = document.getElementById("qrModalTitle");
    const qrCodeContainer = document.getElementById("qrCodeContainer");
    const closeButton = document.querySelector("#qrModal .close-btn");

    // Form elements
    const aggregatorNameInput = document.getElementById("aggregatorName");
    const aggregatorIdInput = document.getElementById("aggregatorId");
    const batchIdInput = document.getElementById("batchId");
    const cropCodeSelect = document.getElementById("cropCode");
    const cropVarietySelect = document.getElementById("cropVariety");

    // =========================================================================
    // INITIALIZE BATCH FORM - Populate aggregator details and dropdowns
    // =========================================================================

    function initializeBatchForm() {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (user) {
            // Populate aggregator details
            if (aggregatorNameInput) aggregatorNameInput.value = user.org_name || user.username || '';
            if (aggregatorIdInput) aggregatorIdInput.value = user.user_id || '';
        }

        // Generate batch ID
        if (batchIdInput) {
            const today = new Date();
            const dateStr = today.getFullYear().toString() +
                String(today.getMonth() + 1).padStart(2, '0') +
                String(today.getDate()).padStart(2, '0');
            const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
            batchIdInput.value = `BAT_${dateStr}_${randomStr}`;
        }

        // Populate crops dropdown
        if (cropCodeSelect) {
            // Add FINGER_MILLET_RAGI and PADDY options
            cropCodeSelect.innerHTML = `
                <option value="">Select Crop...</option>
                <option value="C001" data-variety="Local Variety">FINGER_MILLET_RAGI</option>
                <option value="C002" data-variety="BPT-5204">PADDY</option>
            `;

            // Handle crop selection to update variety
            cropCodeSelect.addEventListener('change', function () {
                const selectedOption = this.options[this.selectedIndex];
                const variety = selectedOption.getAttribute('data-variety') || '';

                if (cropVarietySelect) {
                    cropVarietySelect.disabled = !this.value;
                    if (this.value) {
                        cropVarietySelect.innerHTML = `<option value="${variety}">${variety}</option>`;
                    } else {
                        cropVarietySelect.innerHTML = '<option value="">Select Variety...</option>';
                    }
                }

                // Also filter farmers based on selected crop
                populateFarmerDropdowns(this.value);
            });
        }

        // Populate farmer dropdowns
        populateFarmerDropdowns('');
    }

    // Populate farmer dropdowns with mock farmers
    function populateFarmerDropdowns(cropCode) {
        const farmerSelects = document.querySelectorAll('.farmer-select');

        // Get mock farmers from window (set by mock-data.js) or use default list
        const farmers = window.MOCK_FARMERS_LIST || [
            { id: '103221240710072544', name: 'BAGYALAKSHMI', crop: 'FINGER_MILLET_RAGI' },
            { id: '103220933712421919', name: 'MAHESWARI', crop: 'FINGER_MILLET_RAGI' },
            { id: '103220938510896199', name: 'PADMA M', crop: 'FINGER_MILLET_RAGI' },
            { id: '103230353674344571', name: 'BAGYALAKSHMI K', crop: 'FINGER_MILLET_RAGI' },
            { id: '103220936710204318', name: 'S SUREKHA', crop: 'FINGER_MILLET_RAGI' },
            { id: '103220935104129912', name: 'DANALAKSHMI', crop: 'FINGER_MILLET_RAGI' },
            { id: '103220937795133051', name: 'RAJESWAR', crop: 'PADDY' },
            { id: '103221407116464881', name: 'JANAMMA R', crop: 'PADDY' },
            { id: '103230536881851510', name: 'PAVITHRA', crop: 'PADDY' },
            { id: '103305637001001685', name: 'VIJAYALAKSHMI', crop: 'PADDY' },
            { id: '103230537449065176', name: 'SAROJAMM', crop: 'PADDY' },
            { id: '103221241252277180', name: 'VENKATAPATI', crop: 'PADDY' }
        ];

        // Filter farmers by crop if selected
        let filteredFarmers = farmers;
        if (cropCode === 'C001') {
            filteredFarmers = farmers.filter(f => f.crop === 'FINGER_MILLET_RAGI');
        } else if (cropCode === 'C002') {
            filteredFarmers = farmers.filter(f => f.crop === 'PADDY');
        }

        farmerSelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Farmer...</option>';
            filteredFarmers.forEach(farmer => {
                const option = document.createElement('option');
                option.value = farmer.id;
                option.textContent = `${farmer.name} (${farmer.id})`;
                select.appendChild(option);
            });
            // Restore previous value if still valid
            if (currentValue && filteredFarmers.some(f => f.id === currentValue)) {
                select.value = currentValue;
            }
        });
    }

    // Make populateFarmerDropdowns available for Add Farmer button
    window.populateFarmerDropdowns = populateFarmerDropdowns;

    // Initialize the form on page load
    initializeBatchForm();

    // =========================================================================
    // ADD FARMER BUTTON HANDLER
    // =========================================================================

    let farmerCount = 1;
    const addFarmerBtn = document.getElementById('addFarmerRowBtn');
    const farmerSourceList = document.getElementById('farmer-source-list');

    if (addFarmerBtn && farmerSourceList) {
        addFarmerBtn.addEventListener('click', function () {
            farmerCount++;
            const newFarmerEntry = document.createElement('div');
            newFarmerEntry.className = 'farmer-entry';
            newFarmerEntry.style.cssText = 'border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; background: #fafafa;';

            newFarmerEntry.innerHTML = `
                <div class="farmer-entry-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h5 style="margin: 0; color: var(--primary);"><i class="fa-solid fa-user"></i> Farmer ${farmerCount}</h5>
                    <button type="button" class="btn btn-danger btn-small remove-farmer-row">
                        <i class="fa-solid fa-trash"></i> Remove
                    </button>
                </div>
                
                <div class="form-row">
                    <div class="form-group" style="flex: 2;">
                        <label>Farmer ID <span class="required">*</span></label>
                        <select class="form-control farmer-select" required>
                            <option value="">Select Farmer...</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>Quantity (kgs) <span class="required">*</span></label>
                        <input type="number" class="form-control quantity-input" placeholder="e.g., 500" min="0" required>
                    </div>
                </div>

                <div class="consent-section" style="margin: 1rem 0; padding: 1rem; background: linear-gradient(135deg, #e8f5e9 0%, #fff8e1 100%); border-radius: 8px; border: 1px solid #c8e6c9;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 26px; flex-shrink: 0;">
                            <input type="checkbox" class="consent-check" id="consent-${farmerCount}" required style="opacity: 0; width: 0; height: 0;">
                            <span class="toggle-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .3s; border-radius: 26px;"></span>
                        </label>
                        <div style="flex: 1;">
                            <strong style="color: #2e7d32; font-size: 0.95rem;"><i class="fa-solid fa-handshake"></i> Farmer Consent</strong>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.85rem; color: #555;">Have you taken consent from the farmer for supplying the produce?</p>
                        </div>
                    </div>
                </div>

                <div class="farmer-images" style="margin-top: 1rem;">
                    <label style="font-weight: 600; color: var(--dark); margin-bottom: 0.5rem; display: block;"><i class="fa-solid fa-images"></i> Upload/Click Images</label>
                    <div class="image-upload-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem;">
                        <div class="image-upload-box" style="padding: 0.75rem; text-align: center;">
                            <label style="cursor: pointer; display: block;">
                                <div class="image-upload-icon"><i class="fa-solid fa-user-circle"></i></div>
                                <strong style="font-size: 0.85rem;">Farmer Picture</strong>
                                <div class="image-upload-text" style="font-size: 0.75rem;">📷 Click or Upload</div>
                                <input type="file" accept="image/*" capture="environment" style="display:none;" class="farmer-pic-input">
                            </label>
                        </div>
                        <div class="image-upload-box" style="padding: 0.75rem; text-align: center;">
                            <label style="cursor: pointer; display: block;">
                                <div class="image-upload-icon"><i class="fa-solid fa-camera"></i></div>
                                <strong style="font-size: 0.85rem;">Activity Picture</strong>
                                <div class="image-upload-text" style="font-size: 0.75rem;">📷 Click or Upload</div>
                                <input type="file" accept="image/*" capture="environment" style="display:none;" class="activity-pic-input">
                            </label>
                        </div>
                        <div class="image-upload-box" style="padding: 0.75rem; text-align: center;">
                            <label style="cursor: pointer; display: block;">
                                <div class="image-upload-icon"><i class="fa-solid fa-tractor"></i></div>
                                <strong style="font-size: 0.85rem;">Farm Picture</strong>
                                <div class="image-upload-text" style="font-size: 0.75rem;">📷 Click or Upload</div>
                                <input type="file" accept="image/*" capture="environment" style="display:none;" class="farm-pic-input">
                            </label>
                        </div>
                    </div>
                </div>
            `;

            farmerSourceList.appendChild(newFarmerEntry);

            // Populate farmer dropdown for new entry
            const cropCode = cropCodeSelect ? cropCodeSelect.value : '';
            populateFarmerDropdowns(cropCode);

            // Add remove button handler
            const removeBtn = newFarmerEntry.querySelector('.remove-farmer-row');
            removeBtn.addEventListener('click', function () {
                newFarmerEntry.remove();
                updateFarmerNumbers();
            });
        });
    }

    // Update farmer numbers after removal
    function updateFarmerNumbers() {
        const entries = document.querySelectorAll('.farmer-entry');
        entries.forEach((entry, index) => {
            const header = entry.querySelector('h5');
            if (header) {
                header.innerHTML = `<i class="fa-solid fa-user"></i> Farmer ${index + 1}`;
            }
            // Update visibility of remove button (hide for first farmer)
            const removeBtn = entry.querySelector('.remove-farmer-row');
            if (removeBtn) {
                removeBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
            }
        });
        farmerCount = entries.length;
    }

    // =========================================================================
    // FORM SUBMISSION HANDLER
    // =========================================================================

    const batchForm = document.getElementById('batchCreationForm');
    if (batchForm) {
        batchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect batch data
            const batchData = {
                batchId: batchIdInput ? batchIdInput.value : '',
                batchName: `Batch ${new Date().toLocaleDateString()}`,
                cropCode: cropCodeSelect ? cropCodeSelect.value : '',
                cropName: cropCodeSelect ? cropCodeSelect.options[cropCodeSelect.selectedIndex].text : '',
                cropVariety: cropVarietySelect ? cropVarietySelect.value : '',
                season: document.getElementById('season') ? document.getElementById('season').value : 'Kharif',
                year: document.getElementById('year') ? document.getElementById('year').value : '2025-26',
                procurementDate: document.getElementById('procurementDate') ? document.getElementById('procurementDate').value : '',
                expiryDate: document.getElementById('expiryDate') ? document.getElementById('expiryDate').value : '',
                aggregatorId: aggregatorIdInput ? aggregatorIdInput.value : '',
                aggregatorName: aggregatorNameInput ? aggregatorNameInput.value : '',
                farmerSources: []
            };

            // Collect farmer data
            const farmerEntries = document.querySelectorAll('.farmer-entry');
            farmerEntries.forEach(entry => {
                const farmerSelect = entry.querySelector('.farmer-select');
                const quantityInput = entry.querySelector('.quantity-input');
                const consentCheck = entry.querySelector('.consent-check');

                if (farmerSelect && farmerSelect.value) {
                    const farmerName = farmerSelect.options[farmerSelect.selectedIndex].text.split(' (')[0];
                    batchData.farmerSources.push({
                        farmerId: farmerSelect.value,
                        farmerName: farmerName,
                        quantity: parseFloat(quantityInput.value) || 0,
                        consent: consentCheck ? consentCheck.checked : false
                    });
                }
            });

            // Save using Unified Mock Data API (persists to LocalStorage and updates Mock Data)
            if (window.MOCK_DATA_API) {
                window.MOCK_DATA_API.saveBatch(batchData);
            } else {
                console.warn("MOCK_DATA_API missing, falling back to sessionStorage");
                const existingBatches = JSON.parse(sessionStorage.getItem('myBatches') || '[]');
                existingBatches.push(batchData);
                sessionStorage.setItem('myBatches', JSON.stringify(existingBatches));
            }

            // Show success message
            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.textContent = `✅ Batch ${batchData.batchId} created successfully with ${batchData.farmerSources.length} farmer(s)!`;
                successMsg.style.display = 'block';
            }

            // Reset form and reload batches
            batchForm.reset();
            initializeBatchForm();
            loadBatches();

            // Scroll to batches table
            const batchesSection = document.getElementById('myBatchesSection');
            if (batchesSection) {
                batchesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- Utility Function (for security) ---
    /**
     * Escapes HTML to prevent XSS attacks.
     * @param {string} str The string to escape.
     * @returns {string} The escaped string.
     */
    function escapeHTML(str) {
        if (!str) return ""; // Handle null or undefined
        return str.replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    // --- Modal Functions ---

    /**
     * Closes the QR code modal.
     */
    function closeQrModal() {
        qrModal.style.display = "none";
        qrCodeContainer.innerHTML = ""; // Clear the QR code
    }

    // Make closeQrModal globally accessible for the HTML onclick=""
    window.closeQrModal = closeQrModal;

    // Add event listeners for closing the modal
    closeButton.addEventListener("click", closeQrModal);
    qrModal.addEventListener("click", (e) => {
        // Close if user clicks on the dark background
        if (e.target === qrModal) {
            closeQrModal();
        }
    });

    // --- QR Code Generation ---

    /**
     * Generates and displays a QR code for a specific batch.
     * @param {object} batch The batch data object.
     */
    function generateQrCode(batch) {
        qrModalTitle.textContent = `QR Code for: ${escapeHTML(batch.batchName)}`;
        qrCodeContainer.innerHTML = ""; // Clear previous QR code

        // Calculate total quantity for the QR data
        const totalQuantity = batch.farmerSources.reduce((sum, source) => sum + (source.quantity || 0), 0);

        // Create a public-friendly data object for the QR code
        const traceabilityData = {
            batchId: batch.batchId,
            batchName: batch.batchName,
            crop: batch.cropName,
            variety: batch.cropVariety,
            procurementDate: batch.procurementDate,
            aggregator: batch.aggregatorName,
            totalQuantity: totalQuantity.toFixed(2) + " kgs",
            // Map farmer data
            farmers: batch.farmerSources.map(f => ({
                farmerId: f.farmerId, // The ID itself
                quantity: f.quantity,
                consent: f.consent
            }))
        };

        // Stringify the data to be embedded in the QR code
        const dataString = JSON.stringify(traceabilityData);

        // Generate the QR code
        new QRCode(qrCodeContainer, {
            text: dataString,
            width: 220, // Size of the QR code
            height: 220,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M // Medium correction level
        });

        // Show the modal
        qrModal.style.display = "block";
    }

    // --- NEW: Action Button Functions ---

    /**
     * Edit a batch - opens a modal with batch details for editing
     * @param {string} batchId The ID of the batch to edit.
     */
    function editBatch(batchId) {
        console.log(`Editing batch: ${batchId}`);

        // Find the batch data
        const batchesData = sessionStorage.getItem("myBatches");
        const batches = JSON.parse(batchesData) || [];
        const batch = batches.find(b => b.batchId === batchId);

        if (!batch) {
            alert('Batch not found!');
            return;
        }

        // Create edit modal
        const modal = document.createElement('div');
        modal.id = 'editBatchModal';
        modal.style.cssText = 'display: block; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7);';
        modal.innerHTML = `
            <div style="background-color: #fff; margin: 5% auto; padding: 0; border-radius: 12px; width: 90%; max-width: 500px; box-shadow: 0 5px 30px rgba(0,0,0,0.3); max-height: 80vh; overflow-y: auto;">
                <div style="background: linear-gradient(135deg, #143d14 0%, #2e7d32 100%); color: white; padding: 1rem 1.5rem; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0;"><i class="fa-solid fa-pencil"></i> Edit Batch</h3>
                    <button onclick="closeEditModal()" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;">&times;</button>
                </div>
                <div style="padding: 1.5rem;">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">Batch ID</label>
                        <input type="text" value="${batch.batchId}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; background: #f5f5f5;" disabled>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">Crop Name</label>
                        <input type="text" id="editCropName" value="${batch.cropName}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">Crop Variety</label>
                        <input type="text" id="editCropVariety" value="${batch.cropVariety}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">Procurement Date</label>
                        <input type="date" id="editProcDate" value="${batch.procurementDate}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;">
                    </div>
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333;">Farmers (${batch.farmerSources ? batch.farmerSources.length : 0})</label>
                        <div style="background: #f5f5f5; padding: 0.75rem; border-radius: 6px; max-height: 100px; overflow-y: auto;">
                            ${batch.farmerSources ? batch.farmerSources.map(f => `<span style="display: inline-block; background: #e8f5e9; padding: 4px 10px; border-radius: 12px; margin: 2px; font-size: 0.85rem;">${f.farmerName || f.farmerId}</span>`).join('') : 'No farmers'}
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button onclick="saveBatchEdit('${batchId}')" style="flex: 1; padding: 0.75rem; background: #2e7d32; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            <i class="fa-solid fa-save"></i> Save Changes
                        </button>
                        <button onclick="closeEditModal()" style="flex: 1; padding: 0.75rem; background: #ddd; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeEditModal();
        });
    }

    // Close edit modal
    window.closeEditModal = function () {
        const modal = document.getElementById('editBatchModal');
        if (modal) modal.remove();
    };

    // Save batch edit
    window.saveBatchEdit = function (batchId) {
        // Get edited values
        const cropName = document.getElementById('editCropName').value;
        const cropVariety = document.getElementById('editCropVariety').value;
        const procDate = document.getElementById('editProcDate').value;

        // Update batch in sessionStorage
        const batchesData = sessionStorage.getItem("myBatches");
        let batches = JSON.parse(batchesData) || [];
        const batchIndex = batches.findIndex(b => b.batchId === batchId);

        if (batchIndex !== -1) {
            batches[batchIndex].cropName = cropName;
            batches[batchIndex].cropVariety = cropVariety;
            batches[batchIndex].procurementDate = procDate;
            sessionStorage.setItem("myBatches", JSON.stringify(batches));
        }

        closeEditModal();

        // Show success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #d4edda; color: #155724; padding: 1rem 1.5rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1001; display: flex; align-items: center; gap: 0.5rem;';
        successDiv.innerHTML = '<i class="fa-solid fa-check-circle"></i> Batch updated successfully!';
        document.body.appendChild(successDiv);

        setTimeout(() => successDiv.remove(), 3000);

        // Reload table
        loadBatches();
    };

    /**
     * Deletes a batch from sessionStorage and the table.
     * @param {string} batchId The ID of the batch to cancel.
     * @param {HTMLElement} rowElement The table row element to remove.
     */
    async function cancelBatch(batchId, rowElement) {
        console.log(`Cancelling batch: ${batchId}`);

        // 1. Confirm with the user using custom modal
        const confirmed = await showConfirmModal({
            title: 'Cancel Batch',
            message: `Are you sure you want to cancel batch B...${batchId.slice(-6)}? This action cannot be undone.`,
            confirmText: 'Yes, Cancel',
            cancelText: 'No, Keep It',
            type: 'danger'
        });

        if (!confirmed) {
            return; // User clicked "Cancel"
        }

        // 2. Get current batches from sessionStorage
        const batchesData = sessionStorage.getItem("myBatches");
        let batches = JSON.parse(batchesData) || [];

        // 3. Filter out the batch to be deleted
        batches = batches.filter(batch => batch.batchId !== batchId);

        // 4. Save the updated array back to sessionStorage
        sessionStorage.setItem("myBatches", JSON.stringify(batches));

        // 5. Remove the row from the table
        rowElement.remove();

        // 6. Check if the table is now empty
        if (batches.length === 0 && noBatchesRow) {
            noBatchesRow.style.display = "table-row";
        }

        alert(`Batch B...${batchId.slice(-6)} has been cancelled.`);
    }

    // --- Main Function: Load Batches into Table ---

    function loadBatches() {
        // 1. Get data from Unified API (merges Mock + Session + Local)
        let batches = [];
        if (window.MOCK_DATA_API) {
            batches = window.MOCK_DATA_API.getAllBatches();
        } else {
            console.warn("MOCK_DATA_API missing, loading from sessionStorage");
            const batchesData = sessionStorage.getItem("myBatches");
            batches = JSON.parse(batchesData) || [];
        }

        // 2. Check if any batches exist
        if (batches.length === 0) {
            // Show the "no batches" row
            if (noBatchesRow) {
                noBatchesRow.style.display = "table-row";
            }
        } else {
            // Hide the "no batches" row
            if (noBatchesRow) {
                noBatchesRow.style.display = "none";
            }

            // Clear the table body
            batchListTbody.innerHTML = "";

            // 3. Loop through batches and create rows
            batches.forEach(batch => {
                // Calculate total quantity from all farmer sources
                const totalQuantity = batch.farmerSources.reduce((sum, source) => sum + (source.quantity || 0), 0);

                const tr = document.createElement("tr");
                tr.setAttribute("data-batch-id", batch.batchId);

                // --- CHANGE 1: Column Fix ---
                // Removed the "batchName" <td> to match the 6-column HTML header.
                //
                // Render table row without Actions column
                tr.innerHTML = `
                    <td style="white-space: nowrap; font-family: monospace; font-size: 0.85rem;">${escapeHTML(batch.batchId)}</td>
                    <td>${escapeHTML(batch.cropName)}</td>
                    <td>${escapeHTML(batch.cropVariety)}</td>
                    <td>${totalQuantity.toFixed(2)}</td>
                    <td>${escapeHTML(batch.procurementDate)}</td>
                    <td class="actions-cell">
                        <button class="btn btn-small btn-primary qr-btn" title="Generate QR Code">
                            <i class="fa-solid fa-qrcode"></i>
                        </button>
                        <button class="btn btn-small btn-success trace-btn" title="View Traceability">
                            <i class="fa-solid fa-route"></i>
                        </button>
                        <button class="btn btn-small btn-secondary edit-btn" title="Edit Batch">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button class="btn btn-small btn-danger delete-btn" title="Delete Batch">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;

                // Add event listener for the QR button
                tr.querySelector(".qr-btn").addEventListener("click", () => {
                    generateQrCode(batch);
                });

                // Add event listener for the Traceability button
                tr.querySelector(".trace-btn").addEventListener("click", () => {
                    // Store batch data for traceability page
                    localStorage.setItem('currentBatch', JSON.stringify(batch));
                    // Navigate to traceability page with batch ID
                    window.location.href = `traceability.html?batchId=${encodeURIComponent(batch.batchId)}`;
                });

                // Add event listener for the Edit button
                tr.querySelector(".edit-btn").addEventListener("click", () => {
                    editBatch(batch.batchId);
                });

                // Add event listener for the Delete button
                tr.querySelector(".delete-btn").addEventListener("click", () => {
                    cancelBatch(batch.batchId, tr);
                });

                // 4. Append the new row to the table
                batchListTbody.appendChild(tr);
            });
        }
    }

    // --- Initial Execution ---
    // Load the batches as soon as the DOM is ready
    loadBatches();
});