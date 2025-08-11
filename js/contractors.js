// Contractors Management System - Construction Management App
// Contractors management system - Construction Management App

class ContractorsManager {
    constructor() {
        this.services = JSON.parse(localStorage.getItem('contractorServices')) || [];
        this.currentService = null;
        this.init();
    }

    init() {
        console.log('🏗️ Contractors management system initialized');
        this.initializeEventListeners();
        this.updateServiceCounts();
        this.loadSampleServices();
    }

    initializeEventListeners() {
        const contractorServices = document.querySelectorAll('.contractor-service');
        contractorServices.forEach(service => {
            service.addEventListener('click', (e) => {
                const serviceType = e.currentTarget.dataset.service;
                if (serviceType === 'ai' || serviceType === 'quick-quote') {
                    // These are handled by their own modules/modals
                    return;
                }
                this.showServiceDetails(serviceType);
            }, { passive: true });
        });

        const addServiceForm = document.getElementById('addServiceForm');
        if (addServiceForm) {
            addServiceForm.addEventListener('submit', (e) => this.handleAddService(e));
        }

        const addServiceModal = document.getElementById('addServiceModal');
        if (addServiceModal) {
            addServiceModal.addEventListener('click', (e) => {
                if (e.target === addServiceModal) {
                    this.closeAddServiceModal();
                }
            });
        }
    }

    updateServiceCounts() {
        const counts = {
            reports: this.services.filter(s => s.type === 'reports').length,
            estimates: this.services.filter(s => s.type === 'estimates').length,
            projects: this.services.filter(s => s.type === 'projects').length,
            finances: this.services.filter(s => s.type === 'finances').length
        };

        // Update display counts
        Object.keys(counts).forEach(type => {
            const countElement = document.getElementById(`${type}Count`);
            if (countElement) {
                countElement.textContent = counts[type];
            }
        });
    }

    loadSampleServices() {
        if (this.services.length === 0) {
            this.addSampleServices();
        }
    }

    addSampleServices() {
        const sampleServices = [
            {
                id: 1,
                name: 'Monthly project report',
                type: 'reports',
                description: 'Comprehensive report of project progress and costs',
                cost: 500000,
                date: '2024-01-15'
            },
            {
                id: 2,
                name: 'Residential project estimate',
                type: 'estimates',
                description: 'Full estimate of construction cost and time',
                cost: 2500000,
                date: '2024-01-10'
            },
            {
                id: 3,
                name: 'Commercial project management',
                type: 'projects',
                description: 'Full management of commercial building project',
                cost: 1500000,
                date: '2024-01-05'
            },
            {
                id: 4,
                name: 'Project financial control',
                type: 'finances',
                description: 'Control of project costs and revenues',
                cost: 800000,
                date: '2024-01-01'
            }
        ];

        this.services = sampleServices;
        localStorage.setItem('contractorServices', JSON.stringify(this.services));
        this.updateServiceCounts();
    }

    showServiceDetails(serviceType) {
        this.currentService = serviceType;
        const services = this.services.filter(s => s.type === serviceType);
        this.createServicePage(serviceType, services);
    }

    createServicePage(serviceType, services) {
        const mainContent = document.querySelector('.main .container');
        const serviceNames = {
            'reports': 'Reports',
            'estimates': 'Project estimates',
            'projects': 'Project management',
            'finances': 'Financial management'
        };

        mainContent.innerHTML = `
            <div class="page-header">
                <button class="back-btn" onclick="goBackToContractors()">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back</span>
                </button>
                <h1 class="page-title">${serviceNames[serviceType]}</h1>
            </div>
            
            <div class="category-stats">
                <div class="stat-card">
                    <i class="fas fa-chart-line"></i>
                    <div class="stat-number">${services.length}</div>
                    <div class="stat-label">Total ${serviceNames[serviceType]}</div>
                </div>
                <div class="stat-card">
                    <i class="fas fa-sterling-sign"></i>
                    <div class="stat-number">${this.formatCurrency(this.calculateTotalCost(services))}</div>
                    <div class="stat-label">Total cost</div>
                </div>
            </div>
            
            ${services.length > 0 ? this.renderServicesList(services) : this.renderEmptyState(serviceNames[serviceType])}
        `;
    }

    renderServicesList(services) {
        return `
            <div class="services-grid">
                ${services.map(service => this.renderServiceCard(service)).join('')}
            </div>
        `;
    }

    renderServiceCard(service) {
        return `
            <div class="service-card">
                <div class="service-card-header">
                    <div class="service-info">
                        <h3>${service.name}</h3>
                        <span class="service-date">${this.formatDate(service.date)}</span>
                    </div>
                    <div class="service-actions">
                        <button class="action-btn edit-btn" onclick="editService(${service.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="deleteService(${service.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="service-card-body">
                    <p>${service.description}</p>
                    <div class="service-details">
                        <span class="service-cost">
                            <i class="fas fa-sterling-sign"></i>
                            ${this.formatCurrency(service.cost)}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyState(categoryName) {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-folder-open"></i>
                </div>
                <h3>No ${categoryName} found</h3>
                <p>To get started, add the first ${categoryName.toLowerCase()}</p>
                <button class="add-btn" onclick="showAddServiceForm()">
                    <i class="fas fa-plus"></i>
                    <span>Add ${categoryName}</span>
                </button>
            </div>
        `;
    }

    showAddServiceForm() {
        const modal = document.getElementById('addServiceModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    closeAddServiceModal() {
        const modal = document.getElementById('addServiceModal');
        if (modal) {
            modal.style.display = 'none';
            // Reset form
            const form = document.getElementById('addServiceForm');
            if (form) {
                form.reset();
            }
        }
    }

    handleAddService(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const serviceData = {
            id: Date.now(),
            name: document.getElementById('serviceName').value,
            type: document.getElementById('serviceType').value,
            description: document.getElementById('serviceDescription').value,
            cost: parseInt(document.getElementById('serviceCost').value) || 0,
            date: new Date().toISOString().split('T')[0]
        };

        // Add to services array
        this.services.push(serviceData);
        localStorage.setItem('contractorServices', JSON.stringify(this.services));
        
        // Update counts and close modal
        this.updateServiceCounts();
        this.closeAddServiceModal();
        
        // Show success message
        this.showMessage('New service added successfully!', 'success');
        
        // Refresh current view if on a service page
        if (this.currentService) {
            this.showServiceDetails(this.currentService);
        }
    }

    editService(serviceId) {
        // Implementation for editing service
        this.showMessage('Editing capability will be added soon', 'info');
    }

    deleteService(serviceId) {
        if (confirm('Are you sure you want to delete this service?')) {
            this.services = this.services.filter(s => s.id !== serviceId);
            localStorage.setItem('contractorServices', JSON.stringify(this.services));
            
            this.updateServiceCounts();
            this.showMessage('Service deleted successfully', 'success');
            
            // Refresh current view
            if (this.currentService) {
                this.showServiceDetails(this.currentService);
            }
        }
    }

    calculateTotalCost(services) {
        return services.reduce((total, service) => total + (service.cost || 0), 0);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    goBackToContractors() {
        window.location.reload();
    }

    showMessage(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `message message-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function goBack() { window.history.back(); }
function goBackToContractors() { if (window.contractorsManager) { window.contractorsManager.goBackToContractors(); } }
function showAddServiceForm() { if (window.contractorsManager) { window.contractorsManager.showAddServiceForm(); } }
function closeAddServiceModal() { if (window.contractorsManager) { window.contractorsManager.closeAddServiceModal(); } }
function editService(serviceId) { if (window.contractorsManager) { window.contractorsManager.editService(serviceId); } }
function deleteService(serviceId) { if (window.contractorsManager) { window.contractorsManager.deleteService(serviceId); } }

document.addEventListener('DOMContentLoaded', function() {
    window.contractorsManager = new ContractorsManager();
    // Apply deep-link view if present
    try {
        const url = new URL(window.location.href);
        const viewParam = url.searchParams.get('view') || (url.hash.includes('view=') ? new URLSearchParams(url.hash.slice(1)).get('view') : null);
        if (viewParam) {
            window.contractorsManager.showServiceDetails(viewParam);
        }
    } catch(e) {}
});

console.log('🏗️ Contractors management system loaded!');
