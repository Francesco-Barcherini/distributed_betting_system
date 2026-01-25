// Mock data for bets
const mockBets = [
    {
        id: 1,
        category: 'real',
        title: 'Will Manchester City win the Premier League 2026?',
        outcomes: [
            { label: 'Yes', odds: 1.65 },
            { label: 'No', odds: 2.40 }
        ],
        volume: '$245,000',
        participants: 1247,
        status: 'open'
    },
    {
        id: 2,
        category: 'virtual',
        title: 'Will Bitcoin reach $150,000 in 2026?',
        outcomes: [
            { label: 'Yes', odds: 3.20 },
            { label: 'No', odds: 1.35 }
        ],
        volume: '$892,000',
        participants: 3421,
        status: 'open'
    },
    {
        id: 3,
        category: 'real',
        title: 'US Presidential Election 2028 - Democratic Nomination',
        outcomes: [
            { label: 'Yes', odds: 2.10 },
            { label: 'No', odds: 3.50 }
        ],
        volume: '$567,000',
        participants: 2156,
        status: 'open'
    },
    {
        id: 4,
        category: 'real',
        title: 'NBA Championship 2026 Winner - Lakers',
        outcomes: [
            { label: 'Yes', odds: 4.50 },
            { label: 'No', odds: 2.80 }
        ],
        volume: '$423,000',
        participants: 1823,
        status: 'open'
    },
    {
        id: 5,
        category: 'virtual',
        title: 'Will Ethereum 2.0 be fully deployed by end of 2026?',
        outcomes: [
            { label: 'Yes', odds: 1.85 },
            { label: 'No', odds: 2.05 }
        ],
        volume: '$312,000',
        participants: 987,
        status: 'open'
    },
    {
        id: 6,
        category: 'real',
        title: 'UK General Election 2026 - Labour Majority?',
        outcomes: [
            { label: 'Yes', odds: 1.95 },
            { label: 'No', odds: 1.95 }
        ],
        volume: '$198,000',
        participants: 756,
        status: 'open'
    }
];

// Mock activity data
const mockActivity = [
    { action: 'Bet $500 on Yes', time: '2 minutes ago' },
    { action: 'Bet $250 on No', time: '8 minutes ago' },
    { action: 'Bet $1,000 on Yes', time: '15 minutes ago' },
    { action: 'Bet $150 on No', time: '23 minutes ago' },
    { action: 'Bet $750 on Yes', time: '31 minutes ago' }
];

// Load bets from localStorage on page load
function loadBetsFromStorage() {
    const storedBets = localStorage.getItem('bets');
    if (storedBets) {
        const parsedBets = JSON.parse(storedBets);
        // Update mockBets array
        mockBets.length = 0;
        parsedBets.forEach(bet => mockBets.push(bet));
    }
}

// Initialize bets from storage
if (typeof window !== 'undefined') {
    loadBetsFromStorage();
}

// Logout function (shared across pages)
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
