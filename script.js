class NetworkManagementSystem {
    constructor() {
        this.networkData = { 
            nodes: [], 
            links: [] 
        };
        this.adminStructure = {
            global: [],
            regional: [],
            local: []
        };
    }

    // Advanced Device Management
    addDevice(deviceName, deviceType, location) {
        if (!deviceName || this.networkData.nodes.some(n => n.id === deviceName)) {
            this.showAlert("Device already exists or name is empty!", "error");
            return false;
        }

        const newDevice = { 
            id: deviceName, 
            type: deviceType, 
            location: location 
        };
        
        this.networkData.nodes.push(newDevice);
        this.addToAdminStructure(newDevice);
        this.renderGraph();
        this.renderAdminTree();
        
        return true;
    }

    // Hierarchical Admin Structure Management
    addToAdminStructure(device) {
        switch(device.location) {
            case 'global':
                this.adminStructure.global.push(device);
                break;
            case 'regional':
                this.adminStructure.regional.push(device);
                break;
            case 'local':
                this.adminStructure.local.push(device);
                break;
        }
    }

    // Enhanced Connection Management
    addConnection(source, target, connectionType) {
        // Validate devices exist
        const sourceDevice = this.networkData.nodes.find(n => n.id === source);
        const targetDevice = this.networkData.nodes.find(n => n.id === target);

        if (!sourceDevice || !targetDevice) {
            this.showAlert("One or both devices do not exist!", "error");
            return false;
        }

        // Prevent duplicate connections
        const linkExists = this.networkData.links.some(
            l => (l.source === source && l.target === target)
        );

        if (linkExists) {
            this.showAlert("This connection already exists!", "warning");
            return false;
        }

        this.networkData.links.push({ 
            source, 
            target, 
            type: connectionType 
        });

        this.renderGraph();
        return true;
    }

    // Advanced Graph Rendering with D3 and Dagre
    renderGraph() {
        const svg = d3.select('#graph');
        svg.selectAll('*').remove();

        const dagreGraph = new dagreD3.graphlib.Graph().setGraph({});

        // Add nodes
        this.networkData.nodes.forEach(node => {
            dagreGraph.setNode(node.id, {
                label: node.id,
                class: `node-${node.type}`
            });
        });

        // Add links
        this.networkData.links.forEach(link => {
            dagreGraph.setEdge(link.source, link.target, {
                class: `link-${link.type}`
            });
        });

        const render = new dagreD3.render();
        const svgGroup = svg.append('g');
        render(svgGroup, dagreGraph);

        // Center the graph
        const graphWidth = dagreGraph.graph().width;
        const graphHeight = dagreGraph.graph().height;
        const svgWidth = parseInt(svg.attr('width'));
        const svgHeight = parseInt(svg.attr('height'));

        const zoomListener = d3.zoom().on('zoom', (event) => {
            svgGroup.attr('transform', event.transform);
        });
        svg.call(zoomListener);
    }

    // Render Administrative Hierarchy Tree
    renderAdminTree() {
        const tree = document.getElementById('adminTree');
        tree.innerHTML = '';

        Object.keys(this.adminStructure).forEach(level => {
            const levelLi = document.createElement('li');
            levelLi.textContent = level.toUpperCase() + ' Network';
            
            if (this.adminStructure[level].length > 0) {
                const ul = document.createElement('ul');
                this.adminStructure[level].forEach(device => {
                    const deviceLi = document.createElement('li');
                    deviceLi.textContent = `${device.id} (${device.type})`;
                    ul.appendChild(deviceLi);
                });
                levelLi.appendChild(ul);
            }

            tree.appendChild(levelLi);
        });
    }

    // Performance Metrics Simulation
    updatePerformanceMetrics() {
        const metrics = {
            bandwidthUsage: Math.floor(Math.random() * 100),
            networkHealth: Math.floor(Math.random() * 100),
            routingEfficiency: Math.floor(Math.random() * 100)
        };

        document.getElementById('bandwidthUsage').textContent = 
            `${metrics.bandwidthUsage}% Used`;
        document.getElementById('networkHealth').textContent = 
            metrics.networkHealth > 70 ? 'Healthy' : 'Needs Attention';
        document.getElementById('routingEfficiency').textContent = 
            `${metrics.routingEfficiency}% Efficient`;
    }

    // Utility Alert Method
    showAlert(message, type = 'info') {
        alert(`[${type.toUpperCase()}] ${message}`);
    }
}

// Initialize the Network Management System
const networkSystem = new NetworkManagementSystem();

// Event Listeners
document.getElementById('addDeviceBtn').addEventListener('click', () => {
    const deviceName = document.getElementById('deviceName').value.trim();
    const deviceType = document.getElementById('deviceType').value;
    const deviceLocation = document.getElementById('deviceLocation').value;

    if (networkSystem.addDevice(deviceName, deviceType, deviceLocation)) {
        document.getElementById('deviceName').value = '';
    }
});

document.getElementById('addConnectionBtn').addEventListener('click', () => {
    const sourceDevice = document.getElementById('sourceDevice').value.trim();
    const targetDevice = document.getElementById('targetDevice').value.trim();
    const connectionType = document.getElementById('connectionType').value;

    if (networkSystem.addConnection(sourceDevice, targetDevice, connectionType)) {
        document.getElementById('sourceDevice').value = '';
        document.getElementById('targetDevice').value = '';
    }
});

// Periodic Updates
setInterval(() => {
    networkSystem.updatePerformanceMetrics();
}, 3000);