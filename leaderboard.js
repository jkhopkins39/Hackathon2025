export class LeaderboardManager {
    constructor() {
        this.currentSort = 'points'; // Default sort
        this.showFriendsOnly = false;
        this.currentUserId = null; // Will be set when user logs in
        this.initializeLeaderboard();
    }

    async initializeLeaderboard() {
        // Add tab to navigation
        this.addLeaderboardTab();
        // Create leaderboard container
        this.createLeaderboardUI();
        // Initial data load
        await this.loadLeaderboardData();
    }

    addLeaderboardTab() {
        const nav = document.querySelector('nav ul');
        const tab = document.createElement('li');
        tab.innerHTML = '<a href="#leaderboard">Leaderboard</a>';
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLeaderboard();
        });
        nav.appendChild(tab);
    }

    createLeaderboardUI() {
        const container = document.createElement('div');
        container.id = 'leaderboard-container';
        container.style.display = 'none';
        
        container.innerHTML = `
            <div class="leaderboard-controls">
                <div class="sort-controls">
                    <button class="sort-btn active" data-sort="points">Sort by Points</button>
                    <button class="sort-btn" data-sort="streak">Sort by Streak</button>
                </div>
                <div class="filter-controls">
                    <button class="filter-btn" id="friends-filter">Show Friends Only</button>
                    <button class="find-me-btn">Find Me</button>
                </div>
            </div>
            <div class="leaderboard-table-container">
                <table class="leaderboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Profile</th>
                            <th>Username</th>
                            <th>Season Points</th>
                            <th>Current Streak</th>
                            <th>Longest Streak</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        `;

        document.querySelector('main').appendChild(container);
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSort(e.target.dataset.sort);
            });
        });

        // Friends filter
        document.getElementById('friends-filter').addEventListener('click', () => {
            this.toggleFriendsFilter();
        });

        // Find me button
        document.querySelector('.find-me-btn').addEventListener('click', () => {
            this.scrollToUser();
        });
    }

    async loadLeaderboardData(sortBy = 'points', friendsOnly = false) {
        try {
            // This would be replaced with actual API call
            const response = await fetch('/api/leaderboard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sortBy,
                    friendsOnly,
                    userId: this.currentUserId
                })
            });
            
            const data = await response.json();
            this.renderLeaderboard(data);
        } catch (error) {
            console.error('Failed to load leaderboard data:', error);
        }
    }

    renderLeaderboard(data) {
        const tbody = document.querySelector('.leaderboard-table tbody');
        tbody.innerHTML = '';

        data.forEach((user, index) => {
            const row = document.createElement('tr');
            if (user.id === this.currentUserId) {
                row.classList.add('current-user');
            }
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><img src="${user.profilePic}" alt="${user.username}" class="profile-pic"></td>
                <td>${user.username}</td>
                <td>${user.seasonPoints}</td>
                <td>${user.currentStreak}</td>
                <td>${user.longestStreak}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    async handleSort(sortType) {
        this.currentSort = sortType;
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.sort === sortType);
        });
        await this.loadLeaderboardData(sortType, this.showFriendsOnly);
    }

    async toggleFriendsFilter() {
        this.showFriendsOnly = !this.showFriendsOnly;
        const btn = document.getElementById('friends-filter');
        btn.classList.toggle('active');
        await this.loadLeaderboardData(this.currentSort, this.showFriendsOnly);
    }

    scrollToUser() {
        const userRow = document.querySelector('.leaderboard-table tr.current-user');
        if (userRow) {
            userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            userRow.classList.add('highlight');
            setTimeout(() => userRow.classList.remove('highlight'), 2000);
        }
    }

    showLeaderboard() {
        // Hide other content
        document.querySelectorAll('main > div').forEach(div => {
            div.style.display = 'none';
        });
        // Show leaderboard
        document.getElementById('leaderboard-container').style.display = 'block';
    }
}