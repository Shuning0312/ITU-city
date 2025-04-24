// Interactive Demo Page JavaScript Functionality

// Digital Twin Visualization
function initDigitalTwinVisualization() {
    const container = document.getElementById('digital-twin-container');
    if (!container) return;
    
    // Clear loading indicator
    container.innerHTML = '';
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'digitalTwinCanvas';
    canvas.width = container.clientWidth;
    canvas.height = 400;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Network nodes and connections
    const nodes = [];
    const connections = [];
    
    // Create network nodes
    for (let i = 0; i < 20; i++) {
        nodes.push({
            x: Math.random() * (width - 100) + 50,
            y: Math.random() * (height - 100) + 50,
            radius: Math.random() * 5 + 5,
            pressure: Math.random() * 0.8 + 0.2, // 0.2-1.0
            type: Math.random() > 0.8 ? 'pump' : 'junction'
        });
    }
    
    // Create network connections
    for (let i = 0; i < nodes.length; i++) {
        const numConnections = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numConnections; j++) {
            const targetIndex = Math.floor(Math.random() * nodes.length);
            if (targetIndex !== i) {
                connections.push({
                    source: i,
                    target: targetIndex,
                    flow: Math.random() * 0.8 + 0.2 // 0.2-1.0
                });
            }
        }
    }
    
    // Draw function
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        connections.forEach(conn => {
            const source = nodes[conn.source];
            const target = nodes[conn.target];
            
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            
            // Set line width based on flow
            ctx.lineWidth = conn.flow * 5;
            
            // Set color based on pressure
            const avgPressure = (source.pressure + target.pressure) / 2;
            const r = Math.floor(avgPressure * 255);
            const g = Math.floor((1 - avgPressure) * 255);
            const b = 150;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
            
            ctx.stroke();
        });
        
        // Draw nodes
        nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            
            // Set color based on node type
            if (node.type === 'pump') {
                ctx.fillStyle = '#0077b6';
            } else {
                // Set color based on pressure
                const r = Math.floor(node.pressure * 255);
                const g = Math.floor((1 - node.pressure) * 255);
                const b = 150;
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }
            
            ctx.fill();
        });
    }
    
    // Initial draw
    draw();
    
    // Handle interaction
    const pressureSlider = document.getElementById('pressure-slider');
    const flowSlider = document.getElementById('flow-slider');
    const qualitySlider = document.getElementById('quality-slider');
    const runSimulationButton = document.getElementById('run-simulation');
    const resetSimulationButton = document.getElementById('reset-simulation');
    
    if (pressureSlider && flowSlider && qualitySlider && runSimulationButton && resetSimulationButton) {
        runSimulationButton.addEventListener('click', function() {
            const pressure = parseInt(pressureSlider.value);
            const flow = parseInt(flowSlider.value);
            const quality = parseInt(qualitySlider.value);
            
            // Update simulation based on parameters
            updateSimulation(pressure, flow, quality);
            
            // Show simulation running animation
            runSimulationButton.disabled = true;
            runSimulationButton.textContent = 'Simulation Running...';
            
            setTimeout(() => {
                runSimulationButton.disabled = false;
                runSimulationButton.textContent = 'Run Simulation';
            }, 2000);
        });
        
        resetSimulationButton.addEventListener('click', function() {
            // Reset sliders
            pressureSlider.value = 70;
            flowSlider.value = 50;
            qualitySlider.value = 90;
            
            // Reset simulation
            resetSimulation();
        });
    }
    
    // Update simulation
    function updateSimulation(pressure, flow, quality) {
        // Update node pressure based on pressure parameter
        nodes.forEach(node => {
            // Pressure parameter affects node pressure
            let pressureChange = (pressure - 50) / 100;
            
            // Flow affects connection widths
            // Quality affects color (handled in draw)
            
            // Update node pressure, ensure within 0.1-1.0 range
            node.pressure = Math.max(0.1, Math.min(1.0, 0.5 + pressureChange));
        });
        
        // Update connection flow based on flow parameter
        connections.forEach(conn => {
            const source = nodes[conn.source];
            const target = nodes[conn.target];
            
            // Flow parameter affects connection width
            const flowFactor = flow / 50;
            
            // Pressure difference also affects flow
            const pressureDiff = Math.abs(source.pressure - target.pressure);
            conn.flow = Math.max(0.2, Math.min(1.0, pressureDiff * flowFactor));
        });
        
        // Redraw
        draw();
    }
    
    // Reset simulation
    function resetSimulation() {
        // Reset nodes
        nodes.forEach(node => {
            node.pressure = Math.random() * 0.8 + 0.2;
        });
        
        // Reset connections
        connections.forEach(conn => {
            conn.flow = Math.random() * 0.8 + 0.2;
        });
        
        // Redraw
        draw();
    }
}

// Blockchain Data Flow Visualization
function initBlockchainFlow() {
    const container = document.getElementById('blockchainFlow');
    if (!container) return;
    
    // Set up SVG
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Blockchain nodes
    const nodes = [
        { id: 'source', label: 'Data Source', x: 50, y: height/2, type: 'source' },
        { id: 'validation', label: 'Data Validation', x: width/4, y: height/2, type: 'process' },
        { id: 'blockchain', label: 'Blockchain Network', x: width/2, y: height/2, type: 'blockchain' },
        { id: 'consumer1', label: 'Data Consumer 1', x: 3*width/4, y: height/3, type: 'consumer' },
        { id: 'consumer2', label: 'Data Consumer 2', x: 3*width/4, y: 2*height/3, type: 'consumer' }
    ];
    
    // Connections
    const links = [
        { source: 'source', target: 'validation' },
        { source: 'validation', target: 'blockchain' },
        { source: 'blockchain', target: 'consumer1' },
        { source: 'blockchain', target: 'consumer2' }
    ];
    
    // Draw connections
    svg.selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => nodes.find(n => n.id === d.source).x)
        .attr('y1', d => nodes.find(n => n.id === d.source).y)
        .attr('x2', d => nodes.find(n => n.id === d.target).x)
        .attr('y2', d => nodes.find(n => n.id === d.target).y)
        .attr('stroke', '#0077b6')
        .attr('stroke-width', 2);
    
    // Draw nodes
    const nodeGroups = svg.selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);
    
    // Node circles
    nodeGroups.append('circle')
        .attr('r', 30)
        .attr('fill', d => {
            switch(d.type) {
                case 'source': return '#48cae4';
                case 'process': return '#00b4d8';
                case 'blockchain': return '#0077b6';
                case 'consumer': return '#023e8a';
                default: return '#90e0ef';
            }
        });
    
    // Node labels
    nodeGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 40)
        .text(d => d.label)
        .attr('fill', '#333')
        .attr('font-size', '12px');
    
    // Blockchain icon
    nodeGroups.filter(d => d.type === 'blockchain')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .text('🔗')
        .attr('font-size', '20px');
    
    // Data source icon
    nodeGroups.filter(d => d.type === 'source')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .text('📊')
        .attr('font-size', '20px');
    
    // Process icon
    nodeGroups.filter(d => d.type === 'process')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .text('✓')
        .attr('font-size', '20px');
    
    // Consumer icon
    nodeGroups.filter(d => d.type === 'consumer')
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .text('👤')
        .attr('font-size', '20px');
    
    // Data flow animation
    function animateDataFlow() {
        svg.selectAll('circle.data-point').remove();
        
        const dataPoint = svg.append('circle')
            .attr('class', 'data-point')
            .attr('r', 5)
            .attr('fill', '#e76f51')
            .attr('cx', nodes[0].x)
            .attr('cy', nodes[0].y);
        
        // Animation path
        const path = [
            { x: nodes[0].x, y: nodes[0].y },
            { x: nodes[1].x, y: nodes[1].y },
            { x: nodes[2].x, y: nodes[2].y }
        ];
        
        // Randomly select a consumer
        const consumer = Math.random() > 0.5 ? nodes[3] : nodes[4];
        path.push({ x: consumer.x, y: consumer.y });
        
        // Execute animation
        let currentStep = 0;
        
        function moveToNextStep() {
            if (currentStep >= path.length - 1) return;
            
            currentStep++;
            
            dataPoint.transition()
                .duration(1000)
                .attr('cx', path[currentStep].x)
                .attr('cy', path[currentStep].y)
                .on('end', moveToNextStep);
        }
        
        moveToNextStep();
    }
    
    // Add data button event
    const addDataButton = document.getElementById('addDataButton');
    if (addDataButton) {
        addDataButton.addEventListener('click', function() {
            const dataSource = document.getElementById('dataSourceSelect').value;
            const dataType = document.getElementById('dataTypeSelect').value;
            
            // Update data source node label
            svg.selectAll('g')
                .filter(d => d.id === 'source')
                .select('text')
                .attr('dy', 40)
                .text(`${dataSource} - ${dataType}`);
            
            // Execute data flow animation
            animateDataFlow();
        });
    }
}

// Water Quality Dashboard
function initWaterQualityDashboard() {
    const chartCanvas = document.getElementById('waterQualityChart');
    if (!chartCanvas) return;
    
    // Create chart
    const ctx = chartCanvas.getContext('2d');
    
    // Generate dates for past 30 days
    const dates = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Generate simulated data
    const phData = [];
    const codData = [];
    const radioactivityData = [];
    
    // pH values fluctuate between 6.5-8.5
    let ph = 7.2;
    for (let i = 0; i < 30; i++) {
        ph += (Math.random() - 0.5) * 0.2;
        ph = Math.max(6.5, Math.min(8.5, ph));
        phData.push(ph);
    }
    
    // COD fluctuates between 20-50
    let cod = 35;
    for (let i = 0; i < 30; i++) {
        cod += (Math.random() - 0.5) * 5;
        cod = Math.max(20, Math.min(50, cod));
        codData.push(cod);
    }
    
    // Radioactivity fluctuates between 5-20
    let radioactivity = 12;
    for (let i = 0; i < 30; i++) {
        radioactivity += (Math.random() - 0.5) * 3;
        radioactivity = Math.max(5, Math.min(20, radioactivity));
        radioactivityData.push(radioactivity);
    }
    
    // Create chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'pH Value',
                    data: phData,
                    borderColor: '#0077b6',
                    backgroundColor: 'rgba(0, 119, 182, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'COD (mg/L)',
                    data: codData,
                    borderColor: '#00b4d8',
                    backgroundColor: 'rgba(0, 180, 216, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                },
                {
                    label: 'Radioactivity (Bq/L)',
                    data: radioactivityData,
                    borderColor: '#e76f51',
                    backgroundColor: 'rgba(231, 111, 81, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'pH Value'
                    },
                    min: 6,
                    max: 9
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'COD (mg/L)'
                    },
                    min: 0,
                    max: 60,
                    grid: {
                        drawOnChartArea: false,
                    }
                },
                y2: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Radioactivity (Bq/L)'
                    },
                    min: 0,
                    max: 30,
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
    
    // Run prediction button event (updated logic)
    const runPredictionButton = document.getElementById('runPredictionButton');
    const predictionStatus = document.getElementById('predictionStatus');

    if (runPredictionButton && predictionStatus) {
        runPredictionButton.addEventListener('click', function() {
            runPredictionButton.disabled = true;
            runPredictionButton.textContent = 'Predicting...';

            predictionStatus.className = "alert alert-secondary";
            predictionStatus.textContent = "Generating prediction, please wait...";

            setTimeout(() => {
                const predictions = [
                    "System predicts that water quality parameters will remain within the normal range, with no abnormal trends.",

                    "Predictions indicate that the pH value may slightly rise in the next 48 hours, but it will still be within the safe range.",

                    "The AI model predicts that the COD value will decrease by about 10% within the next 72 hours, resulting in an improvement in water quality.",

                    "Note: The prediction shows that the tritium concentration may rise to nearly the warning level within the next 72 hours, and it is recommended to increase the monitoring frequency.",

                    "The system predicts that there may be a short-term fluctuation in water quality within the next 24 hours, but it will not exceed the safe range."
                ];

                const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
                predictionStatus.textContent = randomPrediction;

                if (randomPrediction.includes("Attention")) {
                    predictionStatus.className = "alert alert-warning";
                } else {
                    predictionStatus.className = "alert alert-info";
                }

                runPredictionButton.disabled = false;
                runPredictionButton.textContent = '运行新预测';
            }, 2000);
        });
    }
}

// Emergency Response Plan Generator
function initEmergencyResponsePlan() {
    const generatePlanButton = document.getElementById('generate-plan');
    if (!generatePlanButton) return;
    const responsePlanStatus = document.getElementById('response-plan-status');
    
    generatePlanButton.addEventListener('click', function() {
        const eventType = document.getElementById('event-type').value;
        const eventSeverity = document.getElementById('event-severity').value;
        const affectedArea = document.getElementById('affected-area').value;
        
        // Disable button during generation
        generatePlanButton.disabled = true;
        generatePlanButton.textContent = 'Generating Plan...';

        if (responsePlanStatus) {
            responsePlanStatus.className = "alert alert-secondary";
            responsePlanStatus.textContent = "please wait...";
        }
        
        setTimeout(() => {
            // Generate response plan based on inputs
            const responsePlan = generateResponsePlan(eventType, eventSeverity, affectedArea);
            
            // Update response plan display
            const responsePlanElement = document.getElementById('response-plan');
            if (responsePlanElement) {
                responsePlanElement.innerHTML = responsePlan;
            }
            if (responsePlanStatus) {
                responsePlanStatus.className = "alert alert-success";
                responsePlanStatus.textContent = "alert alert-success";
            }
            
            // Re-enable button
            generatePlanButton.disabled = false;
            generatePlanButton.textContent = 'Generate Response Plan';
        }, 1500);
    });
    
    // Generate response plan based on inputs
    function generateResponsePlan(eventType, eventSeverity, affectedArea) {
        let plan = '';
        
        // Event type specific responses
        switch (eventType) {
            case 'Extreme Rainfall':
                plan += `<p><strong>Event:</strong> ${eventSeverity} ${eventType} in ${affectedArea}</p>`;
                plan += '<p><strong>Recommended Actions:</strong></p>';
                plan += '<ul>';
                plan += '<li>Activate stormwater management protocols</li>';
                plan += '<li>Increase monitoring frequency of drainage system capacity</li>';
                plan += '<li>Deploy mobile pumping stations to potential flooding areas</li>';
                
                if (eventSeverity === 'Severe' || eventSeverity === 'Critical') {
                    plan += '<li>Issue public alert for potential flooding</li>';
                    plan += '<li>Prepare emergency overflow facilities</li>';
                }
                
                plan += '</ul>';
                break;
                
            case 'Flooding':
                plan += `<p><strong>Event:</strong> ${eventSeverity} ${eventType} in ${affectedArea}</p>`;
                plan += '<p><strong>Recommended Actions:</strong></p>';
                plan += '<ul>';
                plan += '<li>Activate flood response team</li>';
                plan += '<li>Deploy water barriers and sandbags to critical infrastructure</li>';
                plan += '<li>Reroute water flow to retention basins</li>';
                
                if (eventSeverity === 'Severe' || eventSeverity === 'Critical') {
                    plan += '<li>Evacuate affected low-lying areas</li>';
                    plan += '<li>Shut down vulnerable water treatment facilities</li>';
                }
                
                plan += '</ul>';
                break;
                
            case 'Drought':
                plan += `<p><strong>Event:</strong> ${eventSeverity} ${eventType} in ${affectedArea}</p>`;
                plan += '<p><strong>Recommended Actions:</strong></p>';
                plan += '<ul>';
                plan += '<li>Implement water conservation measures</li>';
                plan += '<li>Increase monitoring of reservoir levels</li>';
                plan += '<li>Optimize water distribution network to minimize losses</li>';
                
                if (eventSeverity === 'Severe' || eventSeverity === 'Critical') {
                    plan += '<li>Activate water rationing protocols</li>';
                    plan += '<li>Prepare for emergency water supply distribution</li>';
                }
                
                plan += '</ul>';
                break;
                
            case 'Contamination':
                plan += `<p><strong>Event:</strong> ${eventSeverity} ${eventType} in ${affectedArea}</p>`;
                plan += '<p><strong>Recommended Actions:</strong></p>';
                plan += '<ul>';
                plan += '<li>Isolate affected water supply segments</li>';
                plan += '<li>Increase water quality sampling frequency</li>';
                plan += '<li>Deploy mobile water treatment units</li>';
                
                if (eventSeverity === 'Severe' || eventSeverity === 'Critical') {
                    plan += '<li>Issue boil water advisory for affected areas</li>';
                    plan += '<li>Activate alternative water supply routes</li>';
                }
                
                plan += '</ul>';
                break;
                
            case 'Infrastructure Failure':
                plan += `<p><strong>Event:</strong> ${eventSeverity} ${eventType} in ${affectedArea}</p>`;
                plan += '<p><strong>Recommended Actions:</strong></p>';
                plan += '<ul>';
                plan += '<li>Dispatch emergency repair teams</li>';
                plan += '<li>Isolate affected infrastructure components</li>';
                plan += '<li>Reroute water flow through backup systems</li>';
                
                if (eventSeverity === 'Severe' || eventSeverity === 'Critical') {
                    plan += '<li>Deploy temporary infrastructure solutions</li>';
                    plan += '<li>Coordinate with emergency services for critical facilities</li>';
                }
                
                plan += '</ul>';
                break;
                
            default:
                plan += `<p>No specific response plan available for ${eventType}.</p>`;
        }
        
        // Add estimated recovery time based on severity
        plan += '<p><strong>Estimated Recovery Time:</strong> ';
        switch (eventSeverity) {
            case 'Minor':
                plan += '12-24 hours';
                break;
            case 'Moderate':
                plan += '1-3 days';
                break;
            case 'Severe':
                plan += '3-7 days';
                break;
            case 'Critical':
                plan += '1-4 weeks';
                break;
            default:
                plan += 'Unknown';
        }
        plan += '</p>';
        
        return plan;
    }
}

// Initialize all interactive elements when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Digital Twin Visualization
    initDigitalTwinVisualization();
    
    // Initialize Blockchain Data Flow
    initBlockchainFlow();
    
    // Initialize Water Quality Dashboard
    initWaterQualityDashboard();
    
    // Initialize Emergency Response Plan Generator
    initEmergencyResponsePlan();
});

