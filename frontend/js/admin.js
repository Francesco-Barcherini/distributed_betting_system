// Check authentication and admin status
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Check if user is admin
    const user = JSON.parse(currentUser);
    if (!user.isAdmin) {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'dashboard.html';
        return;
    }
    
    loadAdminBets();
});

// Load bets in admin table
function loadAdminBets() {
    const tbody = document.getElementById('admin-bets-list');
    tbody.innerHTML = '';
    
    mockBets.forEach(bet => {
        const row = document.createElement('tr');
        
        const status = bet.status || 'open';
        const result = bet.result || '-';
        
        row.innerHTML = `
            <td>${bet.id}</td>
            <td><span class="category-badge ${bet.category}">${bet.category}</span></td>
            <td>${bet.title}</td>
            <td><span class="status-badge ${status}">${status}</span></td>
            <td>${result}</td>
            <td class="actions-cell">
                ${status === 'open' ? `
                    <button class="btn-small btn-warning" onclick="stopBetting(${bet.id})">Stop Betting</button>
                ` : ``}
                <button class="btn-small btn-primary" onclick="openResultModal(${bet.id})">Set Result</button>
                ${status === 'closed' ? `
                    <button class="btn-small" onclick="reopenBetting(${bet.id})">Reopen</button>
                ` : ``}
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Create new bet
function createBet(event) {
    event.preventDefault();
    
    const category = document.getElementById('bet-category').value;
    const title = document.getElementById('bet-title').value;
    const option1 = document.getElementById('bet-option1').value;
    const option2 = document.getElementById('bet-option2').value;
    const initial1 = parseFloat(document.getElementById('bet-initial1').value);
    const initial2 = parseFloat(document.getElementById('bet-initial2').value);
    
    // Calculate odds based on initial bets (using simple formula)
    const total = initial1 + initial2;
    const odds1 = total > 0 ? parseFloat((total / initial1).toFixed(2)) : 1.50;
    const odds2 = total > 0 ? parseFloat((total / initial2).toFixed(2)) : 1.50;
    
    // Generate new ID
    const newId = Math.max(...mockBets.map(b => b.id)) + 1;
    
    // Create new bet object
    const newBet = {
        id: newId,
        category: category,
        title: title,
        outcomes: [
            { label: option1, odds: odds1 },
            { label: option2, odds: odds2 }
        ],
        volume: '$0',
        participants: 0,
        status: 'open'
    };
    
    // Add to mock data
    mockBets.push(newBet);
    
    // Save to localStorage for persistence
    localStorage.setItem('bets', JSON.stringify(mockBets));
    
    // Show success message
    alert(`Bet created successfully!\nID: ${newId}\nTitle: ${title}`);
    
    // Reset form
    document.getElementById('create-bet-form').reset();
    
    // Reload table
    loadAdminBets();
}

// Stop betting on a specific game
function stopBetting(betId) {
    const bet = mockBets.find(b => b.id === betId);
    if (!bet) return;
    
    if (confirm(`Stop betting on "${bet.title}"?`)) {
        bet.status = 'closed';
        localStorage.setItem('bets', JSON.stringify(mockBets));
        loadAdminBets();
        alert('Betting stopped successfully!');
    }
}

// Reopen betting
function reopenBetting(betId) {
    const bet = mockBets.find(b => b.id === betId);
    if (!bet) return;
    
    if (confirm(`Reopen betting on "${bet.title}"?`)) {
        bet.status = 'open';
        delete bet.result;
        localStorage.setItem('bets', JSON.stringify(mockBets));
        loadAdminBets();
        alert('Betting reopened successfully!');
    }
}

// Open result modal
let currentResultBetId = null;

function openResultModal(betId) {
    const bet = mockBets.find(b => b.id === betId);
    if (!bet) return;
    
    currentResultBetId = betId;
    
    // Set modal title
    document.getElementById('modal-bet-title').textContent = `Bet: ${bet.title}`;
    
    // Load result options
    const resultOptions = document.getElementById('result-options');
    resultOptions.innerHTML = '';
    
    bet.outcomes.forEach((outcome, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-large result-option-btn';
        btn.textContent = outcome.label;
        btn.onclick = () => setResult(betId, outcome.label);
        resultOptions.appendChild(btn);
    });
    
    // Show modal
    document.getElementById('result-modal').style.display = 'flex';
}

// Close result modal
function closeResultModal() {
    document.getElementById('result-modal').style.display = 'none';
    currentResultBetId = null;
}

// Set result for a bet
function setResult(betId, result) {
    const bet = mockBets.find(b => b.id === betId);
    if (!bet) return;
    
    if (confirm(`Set result to "${result}" for "${bet.title}"?`)) {
        bet.result = result;
        bet.status = 'closed';
        localStorage.setItem('bets', JSON.stringify(mockBets));
        
        closeResultModal();
        loadAdminBets();
        
        alert(`Result set successfully!\nBet: ${bet.title}\nWinner: ${result}`);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('result-modal');
    if (event.target === modal) {
        closeResultModal();
    }
}
