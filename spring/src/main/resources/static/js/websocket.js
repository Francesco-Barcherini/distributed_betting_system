// Common WebSocket connection management
let ws = null;
let wsMessageHandlers = [];
let pingInterval = null;

function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
        // Send auth token in the format expected by the Erlang backend
        const token = localStorage.getItem('authToken');
        if (token) {
            ws.send(JSON.stringify({ 
                opcode: 'authenticate', 
                token: token 
            }));
        }
        
        // Start ping interval to keep connection alive
        if (pingInterval) {
            clearInterval(pingInterval);
        }
        pingInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ opcode: 'keepalive' }));
            }
        }, 30000); // 30 seconds
    };
    
    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            // Call all registered message handlers
            wsMessageHandlers.forEach(handler => {
                try {
                    handler(data);
                } catch (e) {
                    console.error('Error in WebSocket message handler:', e);
                }
            });
        } catch (e) {
            console.error('Error parsing WebSocket message:', e);
        }
    };
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
        // Clear ping interval
        if (pingInterval) {
            clearInterval(pingInterval);
            pingInterval = null;
        }
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
    };
}

// Register a message handler
function registerWSMessageHandler(handler) {
    if (typeof handler === 'function') {
        wsMessageHandlers.push(handler);
    }
}

// Send a message through WebSocket
function sendWSMessage(data) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    } else {
        console.warn('WebSocket is not connected');
    }
}

// Get WebSocket connection status
function isWSConnected() {
    return ws && ws.readyState === WebSocket.OPEN;
}
