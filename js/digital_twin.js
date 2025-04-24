// Digital Twin Visualization
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('digitalTwinCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    // Enhance canvas clarity: set higher resolution for clarity
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 500;
    canvas.width *= window.devicePixelRatio;
    canvas.height *= window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Node types and colors
    const nodeTypes = {
        pumpStation: { color: '#0077b6', radius: 8, label: 'Pumping Station' },
        junction: { color: '#00b4d8', radius: 6, label: 'Junction' },
        storageTank: { color: '#90e0ef', radius: 10, label: 'Storage Tank' },
        treatment: { color: '#03045e', radius: 9, label: 'Treatment Facility' }
    };
    
    // Pressure levels and colors
    const pressureLevels = {
        low: { color: '#caf0f8', width: 2 },
        medium: { color: '#90e0ef', width: 3 },
        high: { color: '#00b4d8', width: 4 },
        veryHigh: { color: '#0077b6', width: 5 }
    };
    
    // Generate nodes
    let nodes = [];
    let nodeCount = 30; // Default node count
    
    function generateNodes() {
        nodes = [];
        const margin = 50;
        const width = canvas.width - 2 * margin;
        const height = canvas.height - 2 * margin;
        
        // Create nodes with different types
        for (let i = 0; i < nodeCount; i++) {
            const typeKeys = Object.keys(nodeTypes);
            const typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)];
            const type = nodeTypes[typeKey];
            
            nodes.push({
                x: margin + Math.random() * width,
                y: margin + Math.random() * height,
                type: typeKey,
                color: type.color,
                radius: type.radius,
                label: type.label,
                connections: []
            });
        }
        
        // Create connections between nodes
        for (let i = 0; i < nodes.length; i++) {
            const connectionsCount = Math.floor(Math.random() * 3) + 1; // 1-3 connections per node
            
            for (let j = 0; j < connectionsCount; j++) {
                const targetIndex = Math.floor(Math.random() * nodes.length);
                if (targetIndex !== i && !nodes[i].connections.includes(targetIndex)) {
                    nodes[i].connections.push(targetIndex);
                    
                    // Assign random pressure level
                    const pressureKeys = Object.keys(pressureLevels);
                    const pressureKey = pressureKeys[Math.floor(Math.random() * pressureKeys.length)];
                    const pressure = pressureLevels[pressureKey];
                    
                    nodes[i].pressureTo = nodes[i].pressureTo || {};
                    nodes[i].pressureTo[targetIndex] = {
                        level: pressureKey,
                        color: pressure.color,
                        width: pressure.width,
                        flowOffset: 0 // For animation
                    };
                }
            }
        }
    }
    
    // Draw the network
    function drawNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw subtle grid background for orientation
        ctx.save();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 0.5;
        const gridSpacing = 50;
        for (let x = 0; x < canvas.width; x += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += gridSpacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.restore();

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            for (const targetIndex of node.connections) {
                const target = nodes[targetIndex];
                const pressure = node.pressureTo[targetIndex];

                // Draw the connection line
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(target.x, target.y);
                ctx.strokeStyle = pressure.color;
                ctx.lineWidth = pressure.width;
                ctx.stroke();

                // Draw flow animation
                if (isSimulationRunning) {
                    const dx = target.x - node.x;
                    const dy = target.y - node.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Number of flow particles based on distance
                    const particleCount = Math.max(2, Math.floor(distance / 50));
                    const particleSpacing = 1 / particleCount;

                    // Update flow offset for animation
                    pressure.flowOffset = (pressure.flowOffset + 0.005) % particleSpacing;

                    // Draw flow particles
                    for (let t = pressure.flowOffset; t < 1; t += particleSpacing) {
                        const x = node.x + dx * t;
                        const y = node.y + dy * t;

                        ctx.beginPath();
                        ctx.arc(x, y, 2, 0, Math.PI * 2);
                        ctx.fillStyle = '#ffffff';
                        ctx.fill();
                    }
                }
            }
        }

        // Draw nodes
        for (const node of nodes) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = node.color;
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw node labels next to nodes (below node drawing loop)
        ctx.font = '10px Poppins, sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        for (const node of nodes) {
            ctx.fillText(node.label, node.x, node.y + node.radius + 12);
        }
    }
    
    // Animation loop
    let isSimulationRunning = false;
    let animationFrameId;
    
    function animate() {
        drawNetwork();
        if (isSimulationRunning) {
            animationFrameId = requestAnimationFrame(animate);
        }
    }
    
    // Initialize
    generateNodes();
    drawNetwork();
    
    // Event listeners for controls
    const nodeCountSlider = document.getElementById('nodeCount');
    if (nodeCountSlider) {
        nodeCountSlider.addEventListener('input', function() {
            nodeCount = parseInt(this.value);
            generateNodes();
            drawNetwork();
        });
    }
    
    const runSimulationBtn = document.getElementById('runSimulation');
    if (runSimulationBtn) {
        runSimulationBtn.addEventListener('click', function() {
            isSimulationRunning = true;
            animate();
        });
    }
    
    const resetSimulationBtn = document.getElementById('resetSimulation');
    if (resetSimulationBtn) {
        resetSimulationBtn.addEventListener('click', function() {
            isSimulationRunning = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            generateNodes();
            drawNetwork();
        });
    }
    
    // Responsive canvas
    window.addEventListener('resize', function() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = 500;
        canvas.width *= window.devicePixelRatio;
        canvas.height *= window.devicePixelRatio;
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        generateNodes();
        drawNetwork();
    });
});

// Blockchain Data Flow Visualization
document.addEventListener('DOMContentLoaded', function() {
    const blockchainFlow = document.getElementById('blockchainFlow');
    if (!blockchainFlow) return;
    
    let blocks = [];
    const maxBlocks = 10;
    
    function createBlock(data) {
        const block = document.createElement('div');
        block.className = 'blockchain-block';
        block.style.backgroundColor = '#0077b6';
        block.style.color = 'white';
        block.style.padding = '10px';
        block.style.margin = '10px';
        block.style.borderRadius = '5px';
        block.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        block.style.display = 'inline-block';
        block.style.width = '120px';
        block.style.textAlign = 'center';
        
        const blockNumber = document.createElement('div');
        blockNumber.textContent = `Block #${blocks.length + 1}`;
        blockNumber.style.fontWeight = 'bold';
        blockNumber.style.marginBottom = '5px';
        
        const blockData = document.createElement('div');
        blockData.textContent = `Data: ${data}`;
        blockData.style.fontSize = '0.8em';
        
        const timestamp = document.createElement('div');
        timestamp.textContent = new Date().toLocaleTimeString();
        timestamp.style.fontSize = '0.7em';
        timestamp.style.marginTop = '5px';
        
        block.appendChild(blockNumber);
        block.appendChild(blockData);
        block.appendChild(timestamp);
        
        return block;
    }
    
    function addBlock() {
        const dataSource = document.getElementById('dataSource');
        const consensusMechanism = document.getElementById('consensusMechanism');
        
        let data = 'Default';
        if (dataSource) {
            data = dataSource.options[dataSource.selectedIndex].text;
        }
        
        const block = createBlock(data);
        
        // Add connection arrow if not the first block
        if (blocks.length > 0) {
            const arrow = document.createElement('div');
            arrow.innerHTML = '→';
            arrow.style.display = 'inline-block';
            arrow.style.margin = '0 5px';
            arrow.style.fontSize = '20px';
            arrow.style.color = '#0077b6';
            arrow.style.verticalAlign = 'middle';
            
            blockchainFlow.appendChild(arrow);
        }
        
        blockchainFlow.appendChild(block);
        blocks.push(block);
        
        // Remove oldest block if exceeding max
        if (blocks.length > maxBlocks) {
            blockchainFlow.removeChild(blocks[0]);
            blockchainFlow.removeChild(blockchainFlow.children[0]); // Remove arrow
            blocks.shift();
        }
    }
    
    function verifyData() {
        if (blocks.length === 0) return;
        
        // Visual verification effect
        blocks.forEach(block => {
            block.style.backgroundColor = '#ccc';
            
            setTimeout(() => {
                block.style.backgroundColor = '#28a745'; // Green for verified
                
                setTimeout(() => {
                    block.style.backgroundColor = '#0077b6'; // Back to original
                }, 500);
            }, 500);
        });
    }
    
    function resetChain() {
        while (blockchainFlow.firstChild) {
            blockchainFlow.removeChild(blockchainFlow.firstChild);
        }
        blocks = [];
    }
    
    // Event listeners
    const addDataBlockBtn = document.getElementById('addDataBlock');
    if (addDataBlockBtn) {
        addDataBlockBtn.addEventListener('click', addBlock);
    }
    
    const verifyDataBtn = document.getElementById('verifyData');
    if (verifyDataBtn) {
        verifyDataBtn.addEventListener('click', verifyData);
    }
    
    const resetBlockchainBtn = document.getElementById('resetBlockchain');
    if (resetBlockchainBtn) {
        resetBlockchainBtn.addEventListener('click', resetChain);
    }
    
    // Initialize with one block
    addBlock();
});

// Water Quality Monitoring Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') return;
    
    // Create charts if containers exist
    const chartContainers = [
        { id: 'phChart', label: 'pH Level', color: 'rgba(0, 119, 182, 0.7)' },
        { id: 'turbidityChart', label: 'Turbidity (NTU)', color: 'rgba(0, 180, 216, 0.7)' },
        { id: 'oxygenChart', label: 'Dissolved Oxygen (mg/L)', color: 'rgba(144, 224, 239, 0.7)' },
        { id: 'conductivityChart', label: 'Conductivity (μS/cm)', color: 'rgba(3, 4, 94, 0.7)' }
    ];
    
    const charts = [];
    
    chartContainers.forEach(container => {
        const element = document.getElementById(container.id);
        if (!element) return;
        
        // Generate random data
        const labels = Array.from({length: 24}, (_, i) => `${i}:00`);
        const data = Array.from({length: 24}, () => Math.random() * 10 + 2);
        
        // Create chart
        const chart = new Chart(element, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: container.label,
                    data: data,
                    backgroundColor: container.color,
                    borderColor: container.color.replace('0.7', '1'),
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
        
        charts.push(chart);
    });
    
    // Update dashboard function
    function updateDashboard() {
        charts.forEach(chart => {
            // Generate new random data
            chart.data.datasets[0].data = Array.from(
                {length: chart.data.labels.length}, 
                () => Math.random() * 10 + 2
            );
            chart.update();
        });
    }
    
    // Event listeners
    const updateDashboardBtn = document.getElementById('updateDashboard');
    if (updateDashboardBtn) {
        updateDashboardBtn.addEventListener('click', updateDashboard);
    }
    
    const monitoringStation = document.getElementById('monitoringStation');
    if (monitoringStation) {
        monitoringStation.addEventListener('change', updateDashboard);
    }
    
    const timeRange = document.getElementById('timeRange');
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            let newLabels;
            const value = this.value;
            
            if (value === '24h') {
                newLabels = Array.from({length: 24}, (_, i) => `${i}:00`);
            } else if (value === '7d') {
                newLabels = Array.from({length: 7}, (_, i) => `Day ${i+1}`);
            } else if (value === '30d') {
                newLabels = Array.from({length: 30}, (_, i) => `Day ${i+1}`);
            }
            
            charts.forEach(chart => {
                chart.data.labels = newLabels;
                chart.data.datasets[0].data = Array.from(
                    {length: newLabels.length}, 
                    () => Math.random() * 10 + 2
                );
                chart.update();
            });
        });
    }
});
