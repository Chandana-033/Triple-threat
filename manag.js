document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real app, this would come from a database
    const crops = [
        {
            id: 1,
            name: "Wheat",
            plantedOn: "2023-10-15",
            area: 2.5,
            soilType: "Loamy",
            status: "Growing",
            hasPestIssues: false
        },
        {
            id: 2,
            name: "Tomato",
            plantedOn: "2023-11-01",
            area: 1.2,
            soilType: "Black",
            status: "Flowering",
            hasPestIssues: true
        }
    ];

    const cropData = {
        "Wheat": {
            description: "Wheat is a cereal grain grown for its seed, a worldwide staple food.",
            pesticides: ["Imidacloprid", "Chlorpyriphos", "Deltamethrin"],
            managementTips: [
                "Ensure proper irrigation during tillering and flowering stages",
                "Apply nitrogen fertilizer in split doses",
                "Control weeds in the early growth stage"
            ],
            growthStages: [
                { stage: "Germination", days: 7 },
                { stage: "Tillering", days: 30 },
                { stage: "Stem Extension", days: 50 },
                { stage: "Heading", days: 70 },
                { stage: "Maturity", days: 120 }
            ]
        },
        "Tomato": {
            description: "Tomato is a widely cultivated fruit (used as vegetable) with many varieties.",
            pesticides: ["Spinosad", "Acetamiprid", "Emamectin benzoate"],
            managementTips: [
                "Provide support with stakes or cages for better growth",
                "Mulch to maintain soil moisture and prevent weeds",
                "Prune suckers to direct energy to fruit production"
            ],
            growthStages: [
                { stage: "Germination", days: 10 },
                { stage: "Seedling", days: 25 },
                { stage: "Vegetative Growth", days: 50 },
                { stage: "Flowering", days: 70 },
                { stage: "Fruiting", days: 90 },
                { stage: "Maturity", days: 110 }
            ]
        }
    };

    const suggestions = [
        {
            crop: "Maize",
            reason: "Based on your soil type and previous crops, maize would be a good rotation crop."
        },
        {
            crop: "Soybean",
            reason: "Soybean can help improve soil nitrogen content and is suitable for your region."
        }
    ];

    // Load crops table
    function loadCropsTable() {
        const tableBody = document.getElementById('cropsTableBody');
        tableBody.innerHTML = '';

        crops.forEach(crop => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${crop.name}</td>
                <td>${formatDate(crop.plantedOn)}</td>
                <td>${crop.area}</td>
                <td><span class="badge ${getStatusBadgeClass(crop.status)}">${crop.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-success view-crop" data-id="${crop.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-outline-primary manage-crop" data-id="${crop.id}">
                        <i class="fas fa-tasks"></i> Manage
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Add event listeners to view buttons
        document.querySelectorAll('.view-crop').forEach(button => {
            button.addEventListener('click', function() {
                const cropId = parseInt(this.getAttribute('data-id'));
                const crop = crops.find(c => c.id === cropId);
                showCropDetails(crop);
            });
        });

        // Add event listeners to manage buttons
        document.querySelectorAll('.manage-crop').forEach(button => {
            button.addEventListener('click', function() {
                const cropId = parseInt(this.getAttribute('data-id'));
                const crop = crops.find(c => c.id === cropId);
                showCropManagement(crop);
            });
        });
    }

    // Load crop suggestions
    function loadCropSuggestions() {
        const suggestionsContainer = document.getElementById('cropSuggestions');
        suggestionsContainer.innerHTML = '';

        suggestions.forEach(suggestion => {
            const suggestionCard = document.createElement('div');
            suggestionCard.className = 'col-md-6';
            suggestionCard.innerHTML = `
                <div class="card crop-card h-100">
                    <div class="card-body">
                        <h5 class="card-title text-success">${suggestion.crop}</h5>
                        <p class="card-text">${suggestion.reason}</p>
                        <button class="btn btn-sm btn-outline-success learn-more" data-crop="${suggestion.crop}">
                            Learn More
                        </button>
                    </div>
                </div>
            `;
            suggestionsContainer.appendChild(suggestionCard);
        });

        // Add event listeners to learn more buttons
        document.querySelectorAll('.learn-more').forEach(button => {
            button.addEventListener('click', function() {
                const cropName = this.getAttribute('data-crop');
                showCropInfo(cropName);
            });
        });
    }

    // Load reminders
    function loadReminders() {
        const remindersList = document.getElementById('remindersList');
        remindersList.innerHTML = '';

        // Generate reminders based on crops
        crops.forEach(crop => {
            const cropInfo = cropData[crop.name];
            if (!cropInfo) return;

            // Calculate days since planting
            const plantedDate = new Date(crop.plantedOn);
            const today = new Date();
            const daysSincePlanting = Math.floor((today - plantedDate) / (1000 * 60 * 60 * 24));

            // Check for upcoming growth stage transitions
            let nextStage = null;
            for (const stage of cropInfo.growthStages) {
                if (daysSincePlanting < stage.days) {
                    nextStage = stage;
                    break;
                }
            }

            if (nextStage) {
                const daysToNextStage = nextStage.days - daysSincePlanting;
                if (daysToNextStage <= 7) {
                    const reminderItem = document.createElement('a');
                    reminderItem.className = 'list-group-item list-group-item-action reminder-item';
                    reminderItem.innerHTML = `
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${crop.name} - ${nextStage.stage} Stage</h6>
                            <small>${daysToNextStage === 0 ? 'Today' : `In ${daysToNextStage} day${daysToNextStage === 1 ? '' : 's'}`}</small>
                        </div>
                        <p class="mb-1">Your ${crop.name} crop will soon enter the ${nextStage.stage} stage. Prepare for necessary actions.</p>
                    `;
                    remindersList.appendChild(reminderItem);
                }
            }

            // Add pest control reminder if needed
            if (crop.hasPestIssues) {
                const reminderItem = document.createElement('a');
                reminderItem.className = 'list-group-item list-group-item-action pesticide-card';
                reminderItem.innerHTML = `
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">Pest Control Needed</h6>
                        <small>Urgent</small>
                    </div>
                    <p class="mb-1">Your ${crop.name} crop has reported pest issues. Consider applying appropriate pesticides.</p>
                `;
                remindersList.appendChild(reminderItem);
            }
        });

        // Add general reminders
        const generalReminders = [
            {
                title: "Soil Testing",
                description: "It's recommended to test your soil every 6 months. Schedule a soil test soon.",
                days: 3
            },
            {
                title: "Equipment Maintenance",
                description: "Check and service your farming equipment before the next season.",
                days: 15
            }
        ];

        generalReminders.forEach(reminder => {
            const reminderItem = document.createElement('a');
            reminderItem.className = 'list-group-item list-group-item-action';
            reminderItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${reminder.title}</h6>
                    <small>Due in ${reminder.days} days</small>
                </div>
                <p class="mb-1">${reminder.description}</p>
            `;
            remindersList.appendChild(reminderItem);
        });
    }

    // Show crop details in modal
    function showCropDetails(crop) {
        const cropInfo = cropData[crop.name] || {};
        
        document.getElementById('cropDetailsTitle').textContent = `${crop.name} Details`;
        
        const content = document.getElementById('cropDetailsContent');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Basic Information</h6>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Planted On:</span>
                            <span>${formatDate(crop.plantedOn)}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Area:</span>
                            <span>${crop.area} acres</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Soil Type:</span>
                            <span>${crop.soilType}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between">
                            <span>Status:</span>
                            <span class="badge ${getStatusBadgeClass(crop.status)}">${crop.status}</span>
                        </li>
                    </ul>
                    
                    ${crop.hasPestIssues ? `
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        Pest issues detected! Check the management section for solutions.
                    </div>
                    ` : ''}
                </div>
                <div class="col-md-6">
                    <h6>Crop Description</h6>
                    <p>${cropInfo.description || 'No description available.'}</p>
                </div>
            </div>
            
            <div class="mt-4">
                <h6>Growth Progress</h6>
                <div class="progress mb-3" style="height: 25px;">
                    <div class="progress-bar progress-bar-striped bg-success" 
                         style="width: ${calculateGrowthProgress(crop)}%">
                        ${calculateGrowthProgress(crop)}% Complete
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table class="table table-sm">
                        <thead>
                            <tr>
                                <th>Stage</th>
                                <th>Expected Days</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${generateGrowthStagesTable(crop)}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('cropDetailsModal'));
        modal.show();
    }

    // Show crop management in modal
    function showCropManagement(crop) {
        const cropInfo = cropData[crop.name] || {};
        
        document.getElementById('cropDetailsTitle').textContent = `${crop.name} Management`;
        
        const content = document.getElementById('cropDetailsContent');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-danger text-white">
                            <h6 class="mb-0"><i class="fas fa-bug me-2"></i>Pest Control</h6>
                        </div>
                        <div class="card-body">
                            ${crop.hasPestIssues ? `
                                <div class="alert alert-warning">
                                    <i class="fas fa-exclamation-circle me-2"></i>
                                    Pest issues detected in your ${crop.name} crop.
                                </div>
                            ` : `
                                <div class="alert alert-success">
                                    <i class="fas fa-check-circle me-2"></i>
                                    No current pest issues reported.
                                </div>
                            `}
                            
                            <h6>Recommended Pesticides:</h6>
                            ${cropInfo.pesticides && cropInfo.pesticides.length > 0 ? `
                                <ul class="list-group">
                                    ${cropInfo.pesticides.map(pesticide => `
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            ${pesticide}
                                            <button class="btn btn-sm btn-outline-info">Details</button>
                                        </li>
                                    `).join('')}
                                </ul>
                            ` : '<p>No pesticide data available for this crop.</p>'}
                            
                            <div class="mt-3">
                                <button class="btn btn-sm btn-outline-danger">
                                    <i class="fas fa-bug me-1"></i> Report Pest Issue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-3">
                        <div class="card-header bg-primary text-white">
                            <h6 class="mb-0"><i class="fas fa-tasks me-2"></i>Management Tips</h6>
                        </div>
                        <div class="card-body">
                            ${cropInfo.managementTips && cropInfo.managementTips.length > 0 ? `
                                <div class="list-group">
                                    ${cropInfo.managementTips.map((tip, index) => `
                                        <div class="list-group-item management-tip">
                                            <div class="d-flex w-100 justify-content-between">
                                                <h6 class="mb-1">Tip ${index + 1}</h6>
                                                <small><i class="fas fa-check-circle text-success"></i></small>
                                            </div>
                                            <p class="mb-1">${tip}</p>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : '<p>No management tips available for this crop.</p>'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-2">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header bg-info text-white">
                            <h6 class="mb-0"><i class="fas fa-calendar-alt me-2"></i>Schedule Tasks</h6>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Task</th>
                                            <th>Due Date</th>
                                            <th>Priority</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${generateCropTasks(crop)}
                                    </tbody>
                                </table>
                            </div>
                            <button class="btn btn-sm btn-success mt-2">
                                <i class="fas fa-plus me-1"></i> Add New Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('cropDetailsModal'));
        modal.show();
    }

    // Show crop information for suggestions
    function showCropInfo(cropName) {
        const cropInfo = cropData[cropName] || {};
        
        document.getElementById('cropDetailsTitle').textContent = `About ${cropName}`;
        
        const content = document.getElementById('cropDetailsContent');
        content.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Description</h6>
                    <p>${cropInfo.description || 'No description available.'}</p>
                    
                    <h6 class="mt-4">Best Growing Conditions</h6>
                    <ul>
                        <li><strong>Soil Type:</strong> Loamy, well-drained</li>
                        <li><strong>pH Range:</strong> 6.0-7.0</li>
                        <li><strong>Temperature:</strong> 20-30°C</li>
                        <li><strong>Rainfall:</strong> 500-800mm per cycle</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Expected Yield</h6>
                    <div class="alert alert-info">
                        Average yield for ${cropName}: 2-3 tons/acre (varies by variety and conditions)
                    </div>
                    
                    <h6 class="mt-4">Market Potential</h6>
                    <p>${cropName} has good demand in local and international markets. 
                    Current market price range: ₹${getRandomPrice(1500, 3000)}-₹${getRandomPrice(3500, 6000)} per quintal.</p>
                    
                    <button class="btn btn-success mt-3">
                        <i class="fas fa-plus me-1"></i> Add to My Crops
                    </button>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <h6 class="mb-0"><i class="fas fa-seedling me-2"></i>Growing Guide</h6>
                        </div>
                        <div class="card-body">
                            <div class="accordion" id="growingGuideAccordion">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#guidePreparation">
                                            Land Preparation
                                        </button>
                                    </h2>
                                    <div id="guidePreparation" class="accordion-collapse collapse show" data-bs-parent="#growingGuideAccordion">
                                        <div class="accordion-body">
                                            Prepare land by plowing and harrowing to fine tilth. 
                                            Apply 10-15 tons of FYM/compost per acre before last harrowing.
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#guideSowing">
                                            Sowing
                                        </button>
                                    </h2>
                                    <div id="guideSowing" class="accordion-collapse collapse" data-bs-parent="#growingGuideAccordion">
                                        <div class="accordion-body">
                                            Sow seeds at ${getRandomPrice(10, 15)} kg/acre with spacing of ${getRandomPrice(20, 30)} cm between rows.
                                            Optimal sowing depth is ${getRandomPrice(2, 5)} cm.
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#guideIrrigation">
                                            Irrigation
                                        </button>
                                    </h2>
                                    <div id="guideIrrigation" class="accordion-collapse collapse" data-bs-parent="#growingGuideAccordion">
                                        <div class="accordion-body">
                                            Provide first irrigation immediately after sowing. 
                                            Subsequent irrigations at ${getRandomPrice(10, 15)} day intervals depending on soil moisture.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        const modal = new bootstrap.Modal(document.getElementById('cropDetailsModal'));
        modal.show();
    }

    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Helper function to get status badge class
    function getStatusBadgeClass(status) {
        switch(status.toLowerCase()) {
            case 'growing': return 'bg-primary';
            case 'flowering': return 'bg-info text-dark';
            case 'harvested': return 'bg-success';
            case 'failed': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    // Helper function to calculate growth progress
    function calculateGrowthProgress(crop) {
        const cropInfo = cropData[crop.name];
        if (!cropInfo || !cropInfo.growthStages || cropInfo.growthStages.length === 0) return 0;
        
        const plantedDate = new Date(crop.plantedOn);
        const today = new Date();
        const daysSincePlanting = Math.floor((today - plantedDate) / (1000 * 60 * 60 * 24));
        
        const totalGrowthDays = cropInfo.growthStages[cropInfo.growthStages.length - 1].days;
        
        if (daysSincePlanting >= totalGrowthDays) return 100;
        return Math.min(100, Math.floor((daysSincePlanting / totalGrowthDays) * 100));
    }

    // Helper function to generate growth stages table
    function generateGrowthStagesTable(crop) {
        const cropInfo = cropData[crop.name];
        if (!cropInfo || !cropInfo.growthStages) return '<tr><td colspan="3">No growth stage data available</td></tr>';
        
        const plantedDate = new Date(crop.plantedOn);
        const today = new Date();
        const daysSincePlanting = Math.floor((today - plantedDate) / (1000 * 60 * 60 * 24));
        
        let html = '';
        let currentStage = '';
        
        for (let i = 0; i < cropInfo.growthStages.length; i++) {
            const stage = cropInfo.growthStages[i];
            const stageDate = new Date(plantedDate);
            stageDate.setDate(stageDate.getDate() + stage.days);
            
            let status = '';
            if (daysSincePlanting >= stage.days) {
                status = '<span class="badge bg-success">Completed</span>';
                currentStage = stage.stage;
            } else if (i > 0 && daysSincePlanting >= cropInfo.growthStages[i-1].days) {
                status = '<span class="badge bg-primary">Current</span>';
                currentStage = stage.stage;
            } else {
                status = '<span class="badge bg-secondary">Pending</span>';
            }
            
            html += `
                <tr>
                    <td>${stage.stage}</td>
                    <td>${stage.days} days</td>
                    <td>${status}</td>
                </tr>
            `;
        }
        
        return html;
    }

    // Helper function to generate crop tasks
    function generateCropTasks(crop) {
        const cropInfo = cropData[crop.name];
        if (!cropInfo) return '<tr><td colspan="5">No task data available</td></tr>';
        
        const plantedDate = new Date(crop.plantedOn);
        const today = new Date();
        const daysSincePlanting = Math.floor((today - plantedDate) / (1000 * 60 * 60 * 24));
        
        // Generate tasks based on growth stages
        const tasks = [];
        
        if (daysSincePlanting < 15) {
            tasks.push({
                name: "First Weeding",
                dueDate: new Date(plantedDate),
                dueDate.setDate(plantedDate.getDate() + 10),
                priority: "High",
                status: daysSincePlanting >= 10 ? "Overdue" : "Pending"
            });
            
            tasks.push({
                name: "First Fertilizer Application",
                dueDate: new Date(plantedDate),
                dueDate.setDate(plantedDate.getDate() + 15),
                priority: "Medium",
                status: daysSincePlanting >= 15 ? "Overdue" : "Pending"
            });
        }
        
        if (crop.hasPestIssues) {
            tasks.push({
                name: "Pest Control Treatment",
                dueDate: new Date(),
                priority: "Urgent",
                status: "Pending"
            });
        }
        
        // Add irrigation tasks
        tasks.push({
            name: "Regular Irrigation",
            dueDate: new Date(),
            dueDate.setDate(today.getDate() + 2),
            priority: "High",
            status: "Pending"
        });
        
        // Add harvest task if crop is near maturity
        const totalGrowthDays = cropInfo.growthStages ? 
            cropInfo.growthStages[cropInfo.growthStages.length - 1].days : 120;
        if (daysSincePlanting >= totalGrowthDays - 14) {
            tasks.push({
                name: "Harvest Preparation",
                dueDate: new Date(plantedDate),
                dueDate.setDate(plantedDate.getDate() + totalGrowthDays - 7),
                priority: "High",
                status: daysSincePlanting >= (totalGrowthDays - 7) ? "Overdue" : "Pending"
            });
        }
        
        // Generate HTML for tasks
        let html = '';
        tasks.forEach(task => {
            const dueDateStr = formatDate(task.dueDate);
            
            html += `
                <tr class="${task.status === 'Overdue' ? 'table-danger' : ''}">
                    <td>${task.name}</td>
                    <td>${dueDateStr}</td>
                    <td>
                        <span class="badge ${getPriorityBadgeClass(task.priority)}">
                            ${task.priority}
                        </span>
                    </td>
                    <td>${task.status}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary">
                            <i class="fas fa-check"></i> Mark Complete
                        </button>
                    </td>
                </tr>
            `;
        });
        
        return html;
    }

    // Helper function to get priority badge class
    function getPriorityBadgeClass(priority) {
        switch(priority.toLowerCase()) {
            case 'urgent': return 'bg-danger';
            case 'high': return 'bg-warning text-dark';
            case 'medium': return 'bg-info text-dark';
            case 'low': return 'bg-secondary';
            default: return 'bg-light text-dark';
        }
    }

    // Helper function to generate random price
    function getRandomPrice(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min;
    }

    // Form submission for adding new crop
    document.getElementById('addCropForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cropName = document.getElementById('cropName').value;
        const plantingDate = document.getElementById('plantingDate').value;
        const cropArea = parseFloat(document.getElementById('cropArea').value);
        const soilType = document.getElementById('soilType').value;
        const hasPestIssues = document.getElementById('pestIssues').checked;
        
        // Create new crop object
        const newCrop = {
            id: crops.length > 0 ? Math.max(...crops.map(c => c.id)) + 1 : 1,
            name: cropName,
            plantedOn: plantingDate,
            area: cropArea,
            soilType: soilType,
            status: "Planted",
            hasPestIssues: hasPestIssues
        };
        
        // Add to crops array (in real app, this would be an API call)
        crops.push(newCrop);
        
        // Refresh the display
        loadCropsTable();
        loadReminders();
        
        // Show success message
        alert(`${cropName} crop added successfully!`);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCropModal'));
        modal.hide();
        
        // Reset form
        this.reset();
    });

    // Initialize the page
    loadCropsTable();
    loadCropSuggestions();
    loadReminders();
});