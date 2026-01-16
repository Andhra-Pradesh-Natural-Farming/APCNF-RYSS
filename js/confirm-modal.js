/**
 * =============================================================================
 * CONFIRM MODAL - Custom Styled Confirmation Popup
 * =============================================================================
 * Replaces browser's native confirm() dialog with a styled modal popup.
 * 
 * Usage:
 *   showConfirmModal({
 *       title: 'Confirm Action',
 *       message: 'Are you sure you want to proceed?',
 *       confirmText: 'Yes',
 *       cancelText: 'No',
 *       type: 'warning' // 'warning', 'danger', 'info'
 *   }).then(confirmed => {
 *       if (confirmed) { // User clicked confirm }
 *   });
 */

(function () {
    'use strict';

    // Create modal HTML structure
    function createModalHTML() {
        const modalHTML = `
            <div id="confirmModalOverlay" class="confirm-modal-overlay">
                <div class="confirm-modal">
                    <div class="confirm-modal-icon" id="confirmModalIcon">
                        <i class="fas fa-question-circle"></i>
                    </div>
                    <h3 class="confirm-modal-title" id="confirmModalTitle">Confirm</h3>
                    <p class="confirm-modal-message" id="confirmModalMessage">Are you sure?</p>
                    <div class="confirm-modal-buttons">
                        <button class="confirm-modal-btn confirm-modal-cancel" id="confirmModalCancel">Cancel</button>
                        <button class="confirm-modal-btn confirm-modal-confirm" id="confirmModalConfirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;

        // Add styles if not already added
        if (!document.getElementById('confirmModalStyles')) {
            const styles = document.createElement('style');
            styles.id = 'confirmModalStyles';
            styles.textContent = `
                .confirm-modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10000;
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.2s ease;
                }

                .confirm-modal-overlay.active {
                    display: flex;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .confirm-modal {
                    background: white;
                    border-radius: 16px;
                    padding: 32px;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease;
                }

                .confirm-modal-icon {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 32px;
                }

                .confirm-modal-icon.warning {
                    background: #fff3cd;
                    color: #f59e0b;
                }

                .confirm-modal-icon.danger {
                    background: #fee2e2;
                    color: #dc2626;
                }

                .confirm-modal-icon.info {
                    background: #e0f2fe;
                    color: #0284c7;
                }

                .confirm-modal-icon.success {
                    background: #d1fae5;
                    color: #059669;
                }

                .confirm-modal-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1a1a1a;
                    margin: 0 0 12px;
                }

                .confirm-modal-message {
                    font-size: 1rem;
                    color: #666;
                    margin: 0 0 28px;
                    line-height: 1.5;
                }

                .confirm-modal-buttons {
                    display: flex;
                    gap: 12px;
                    justify-content: center;
                }

                .confirm-modal-btn {
                    padding: 12px 28px;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    min-width: 100px;
                }

                .confirm-modal-cancel {
                    background: #f3f4f6;
                    color: #374151;
                }

                .confirm-modal-cancel:hover {
                    background: #e5e7eb;
                }

                .confirm-modal-confirm {
                    background: #143d14;
                    color: white;
                }

                .confirm-modal-confirm:hover {
                    background: #0a2a0a;
                }

                .confirm-modal-confirm.danger {
                    background: #dc2626;
                }

                .confirm-modal-confirm.danger:hover {
                    background: #b91c1c;
                }

                .confirm-modal-confirm.warning {
                    background: #f59e0b;
                }

                .confirm-modal-confirm.warning:hover {
                    background: #d97706;
                }
            `;
            document.head.appendChild(styles);
        }

        // Add modal to DOM if not exists
        if (!document.getElementById('confirmModalOverlay')) {
            const div = document.createElement('div');
            div.innerHTML = modalHTML;
            document.body.appendChild(div.firstElementChild);
        }
    }

    // Show confirmation modal
    window.showConfirmModal = function (options = {}) {
        return new Promise((resolve) => {
            createModalHTML();

            const overlay = document.getElementById('confirmModalOverlay');
            const iconEl = document.getElementById('confirmModalIcon');
            const titleEl = document.getElementById('confirmModalTitle');
            const messageEl = document.getElementById('confirmModalMessage');
            const confirmBtn = document.getElementById('confirmModalConfirm');
            const cancelBtn = document.getElementById('confirmModalCancel');

            // Set content
            const title = options.title || 'Confirm';
            const message = options.message || 'Are you sure you want to proceed?';
            const confirmText = options.confirmText || 'Confirm';
            const cancelText = options.cancelText || 'Cancel';
            const type = options.type || 'warning'; // warning, danger, info, success

            titleEl.textContent = title;
            messageEl.textContent = message;
            confirmBtn.textContent = confirmText;
            cancelBtn.textContent = cancelText;

            // Set icon based on type
            iconEl.className = 'confirm-modal-icon ' + type;
            confirmBtn.className = 'confirm-modal-btn confirm-modal-confirm ' + type;

            const icons = {
                warning: 'fa-exclamation-triangle',
                danger: 'fa-trash-alt',
                info: 'fa-info-circle',
                success: 'fa-check-circle'
            };
            iconEl.innerHTML = `<i class="fas ${icons[type] || icons.warning}"></i>`;

            // Show modal
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Handle button clicks
            function cleanup() {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                confirmBtn.removeEventListener('click', onConfirm);
                cancelBtn.removeEventListener('click', onCancel);
                overlay.removeEventListener('click', onOverlayClick);
            }

            function onConfirm() {
                cleanup();
                resolve(true);
            }

            function onCancel() {
                cleanup();
                resolve(false);
            }

            function onOverlayClick(e) {
                if (e.target === overlay) {
                    cleanup();
                    resolve(false);
                }
            }

            confirmBtn.addEventListener('click', onConfirm);
            cancelBtn.addEventListener('click', onCancel);
            overlay.addEventListener('click', onOverlayClick);
        });
    };

})();
