/**
 * ============================================================================
 * TRACEABILITY PAGE - Dynamic Batch Display
 * ============================================================================
 * Renders batch details, farmer map pins, practices, and certificates
 * Uses global helper functions from mock-data.js
 */

document.addEventListener('DOMContentLoaded', () => {

    // Get batch ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const batchId = urlParams.get('batchId');

    // Get batch data using helper function
    let batch = null;

    // First try localStorage currentBatch
    const storedBatch = localStorage.getItem('currentBatch');
    if (storedBatch) {
        batch = JSON.parse(storedBatch);
    }

    // If batchId provided, try to get that specific batch
    if (batchId && window.getBatchById) {
        const foundBatch = window.getBatchById(batchId);
        if (foundBatch) batch = foundBatch;
    }

    // If still no batch, use first from MOCK_DATA
    if (!batch && window.MOCK_DATA && window.MOCK_DATA.batches.length > 0) {
        batch = window.MOCK_DATA.batches[0];
    }

    // Fallback default batch
    if (!batch) {
        batch = {
            batchId: 'BAT_20260105_A7X3K9',
            batchName: 'Finger Millet Ragi Batch - Kharif 2025',
            cropName: 'FINGER_MILLET_RAGI',
            cropVariety: 'Local Variety',
            procurementDate: '2026-01-05',
            aggregatorName: 'BAGYALAKSHMI Natural',
            farmerSources: []
        };
    }

    console.log('📦 Traceability page loading for batch:', batch.batchId);

    // =========================================================================
    // POPULATE PAGE TITLE & BATCH INFO
    // =========================================================================

    const titleEl = document.querySelector('.product-title h1');
    const batchIdEl = document.querySelector('.product-title p span');
    if (titleEl) titleEl.textContent = batch.cropName + ' - ' + (batch.batchName || 'Batch');
    if (batchIdEl) batchIdEl.textContent = batch.batchId;

    // Batch Info Grid
    const detailItems = document.querySelectorAll('.detail-item');
    const totalQuantity = batch.farmerSources ? batch.farmerSources.reduce((sum, f) => sum + (f.quantity || 0), 0) : 0;

    const infoMap = [
        batch.aggregatorName || 'BAGYALAKSHMI Natural',
        batch.aggregatorId || 'Aggregator',
        batch.cropName,
        batch.cropVariety,
        batch.season || 'Kharif',
        batch.year || '2025-26',
        batch.procurementDate,
        batch.expiryDate || 'N/A',
        totalQuantity.toFixed(2) + ' kgs',
        totalQuantity.toFixed(2) + ' kgs'
    ];

    detailItems.forEach((item, i) => {
        const span = item.querySelector('span');
        if (span && infoMap[i]) span.textContent = infoMap[i];
    });

    // Timeline - update aggregator name
    const timelineAgg = document.querySelector('.timeline-content strong');
    if (timelineAgg) timelineAgg.textContent = batch.aggregatorName || 'BAGYALAKSHMI Natural';

    // =========================================================================
    // FARMER TABLE (without Practices and PGS Certificate columns)
    // =========================================================================

    const farmerTbody = document.querySelector('#farmerDetailsSection tbody');
    const farmers = window.getFarmersForBatch ? window.getFarmersForBatch(batch.batchId) : [];

    if (farmerTbody) {
        farmerTbody.innerHTML = '';

        if (farmers.length > 0) {
            farmers.forEach(farmer => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${escapeHTML(farmer.farmer_name)}</td>
                    <td>${escapeHTML(farmer.mandal_name)}</td>
                    <td>${escapeHTML(farmer.village_name)}</td>
                    <td>${escapeHTML(farmer.crop_name)}</td>
                    <td>${farmer.acreage || 1.0}</td>
                    <td><span class="tag tag-category">${farmer.farmer_category || 'S2S'}</span></td>
                `;
                farmerTbody.appendChild(tr);
            });
        } else if (batch.farmerSources) {
            // Fallback to farmerSources if no MOCK_FARMERS match
            batch.farmerSources.forEach(source => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${escapeHTML(source.farmerName || 'Farmer')}</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${escapeHTML(batch.cropName)}</td>
                    <td>1.0</td>
                    <td><span class="tag tag-category">S2S</span></td>
                `;
                farmerTbody.appendChild(tr);
            });
        }
    }

    // =========================================================================
    // LEAFLET MAP WITH DYNAMIC FARMER PINS
    // =========================================================================

    try {
        // Get farmer coordinates
        let mapCenter = [13.83, 78.27]; // Default CHITTOOR area
        const farmerCoords = [];

        farmers.forEach(farmer => {
            if (farmer.geolocation_latitude && farmer.geolocation_longitude) {
                // Note: Data has lat/long swapped in some entries, handle both
                const lat = farmer.geolocation_longitude; // Actual latitude
                const lng = farmer.geolocation_latitude;  // Actual longitude
                farmerCoords.push({
                    lat: lat,
                    lng: lng,
                    name: farmer.farmer_name,
                    village: farmer.village_name,
                    mandal: farmer.mandal_name,
                    district: farmer.district_name,
                    acreage: farmer.acreage || 1.0
                });
            }
        });

        // Calculate center from farmer coordinates
        if (farmerCoords.length > 0) {
            const avgLat = farmerCoords.reduce((sum, c) => sum + c.lat, 0) / farmerCoords.length;
            const avgLng = farmerCoords.reduce((sum, c) => sum + c.lng, 0) / farmerCoords.length;
            mapCenter = [avgLat, avgLng];
        }

        var map = L.map('map').setView(mapCenter, 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        var farmerPinStyle = {
            radius: 8,
            fillColor: "#2e7d32",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        };

        var regionPinStyle = {
            radius: 10,
            fillColor: "#e67e22",
            color: "#ffffff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        };

        // Add region marker at center
        if (farmerCoords.length > 0) {
            L.circleMarker(mapCenter, regionPinStyle).addTo(map)
                .bindPopup(`<strong>${batch.catchmentArea || 'Sourcing Region'}</strong><br>Total Farmers: ${farmerCoords.length}`)
                .openPopup();
        }

        // Add individual farmer pins with tooltips
        farmerCoords.forEach(coord => {
            L.circleMarker([coord.lat, coord.lng], farmerPinStyle).addTo(map)
                .bindTooltip(`<strong>${coord.name}</strong><br>Area: ${coord.acreage} acres`, {
                    permanent: false,
                    direction: 'top',
                    className: 'farmer-tooltip'
                })
                .bindPopup(`
                    <strong>${coord.name}</strong><br>
                    Village: ${coord.village}<br>
                    Mandal: ${coord.mandal}<br>
                    District: ${coord.district}<br>
                    Land Area: ${coord.acreage} acres
                `);
        });

        console.log(`🗺️ Map loaded with ${farmerCoords.length} farmer pins`);

    } catch (e) {
        console.error("Map initialization failed: ", e);
    }

    // =========================================================================
    // BATCH PRACTICES SECTION
    // =========================================================================

    const batchPracticesTbody = document.getElementById('batchPracticesTbody');
    const practices = window.getPracticesForBatch ? window.getPracticesForBatch(batch.batchId) : [];

    if (batchPracticesTbody) {
        batchPracticesTbody.innerHTML = '';

        if (practices.length > 0) {
            practices.forEach(practice => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><span class="tag tag-practice">${escapeHTML(practice.name)}</span></td>
                    <td>${escapeHTML(practice.description)}</td>
                    <td><span class="tag tag-category">${escapeHTML(practice.category)}</span></td>
                `;
                batchPracticesTbody.appendChild(tr);
            });
        } else {
            batchPracticesTbody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; color: #666; padding: 2rem;">
                        <i class="fa-solid fa-info-circle"></i> No specific practices recorded for this batch.
                    </td>
                </tr>
            `;
        }
    }

    // =========================================================================
    // PGS CERTIFICATE SECTION
    // =========================================================================

    const certificate = window.getCertificateForBatch ? window.getCertificateForBatch(batch.batchId) : null;

    if (certificate) {
        const certIdEl = document.getElementById('certId');
        const certTypeEl = document.getElementById('certType');
        const certValidityEl = document.getElementById('certValidity');
        const certDownloadBtn = document.getElementById('certDownloadBtn');

        if (certIdEl) certIdEl.textContent = certificate.certId;
        if (certTypeEl) certTypeEl.textContent = certificate.type;
        if (certValidityEl) certValidityEl.textContent = `${certificate.validFrom} to ${certificate.validTo}`;
        if (certDownloadBtn) certDownloadBtn.href = certificate.link;
    }

    // =========================================================================
    // ABOUT NATURAL FARMING PRACTICES (All 22 practices)
    // =========================================================================

    const allPracticesTbody = document.getElementById('allPracticesTbody');
    const allPractices = window.getAllPractices ? window.getAllPractices() : [];

    if (allPracticesTbody) {
        allPracticesTbody.innerHTML = '';

        allPractices.forEach(practice => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${escapeHTML(practice.name)}</strong></td>
                <td>${escapeHTML(practice.description)}</td>
                <td><span class="tag tag-category">${escapeHTML(practice.category)}</span></td>
            `;
            allPracticesTbody.appendChild(tr);
        });
    }

    // =========================================================================
    // SMOOTH SCROLL
    // =========================================================================

    try {
        const viewFarmersBtn = document.getElementById('viewFarmersBtn');
        const farmerSection = document.getElementById('farmerDetailsSection');

        if (viewFarmersBtn && farmerSection) {
            viewFarmersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                farmerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    } catch (e) {
        console.error("Scroll script failed: ", e);
    }

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

});
