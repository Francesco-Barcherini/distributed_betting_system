// State management
let currentFilter = 'all';

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Show admin link if user is admin
    const user = JSON.parse(currentUser);
    if (user.isAdmin) {
        document.getElementById('admin-link').style.display = 'inline';
    }
    
    loadBets();
});

// Load and display bets
function loadBets() {
    const grid = document.getElementById('bets-grid');
    grid.innerHTML = '';
    
    const filteredBets = currentFilter === 'all' 
        ? mockBets 
        : mockBets.filter(bet => bet.category === currentFilter);
    
    filteredBets.forEach(bet => {
        const card = createBetCard(bet);
        grid.appendChild(card);
    });
}

// Create bet card element
function createBetCard(bet) {
    const card = document.createElement('div');
    card.className = 'bet-card';
    card.onclick = () => viewBetDetail(bet.id);
    
    card.innerHTML = `
        <div class="bet-card-header">
            <div class="bet-category">${bet.category}</div>
            <h3>${bet.title}</h3>
        </div>
        <div class="bet-outcomes">
            ${bet.outcomes.slice(0, 2).map(outcome => `
                <div class="outcome">
                    <span class="outcome-label">${outcome.label}</span>
                    <span class="outcome-odds">${outcome.odds}x</span>
                </div>
            `).join('')}
        </div>
        <div class="bet-info">
            <span>Volume: ${bet.volume}</span>
            <span>${bet.participants} participants</span>
        </div>
    `;
    
    return card;
}

// Filter bets by category
function filterBets(category) {
    currentFilter = category;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadBets();
}

// Navigate to bet detail page
function viewBetDetail(betId) {
    window.location.href = `bet-detail.html?id=${betId}`;
}
