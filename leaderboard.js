import { createNavBar } from './nav.js';

export class LeaderboardManager {
    constructor() {
        // Insert navigation bar
        document.body.insertBefore(createNavBar(), document.body.firstChild);
        
        console.log('LeaderboardManager initializing...');
        this.currentSort = 'points';
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
        this.loadLeaderboardData();
    }

    attachEventListeners() {
        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleSort(e.target.dataset.sort);
            });
        });

        // Friends filter
        const friendsFilter = document.getElementById('friends-filter');
        if (friendsFilter) {
            friendsFilter.addEventListener('click', () => {
                this.toggleFriendsFilter();
            });
        }

        // Find me button
        const findMeBtn = document.querySelector('.find-me-btn');
        if (findMeBtn) {
            findMeBtn.addEventListener('click', () => {
                this.scrollToUser();
            });
        }
    }

    async loadLeaderboardData(sortBy = 'points', friendsOnly = false) {
        try {
            console.log('Loading leaderboard data...');
            // Use mock data instead of fetch
            const mockData = [
                {
                    id: '1',
                    username: 'TestUser1',
                    profilePic: 'https://via.placeholder.com/40',
                    seasonPoints: 1000,
                    currentStreak: 5,
                    longestStreak: 6
                },
                {
                    id: '2',
                    username: 'TestUser2',
                    profilePic: 'https://via.placeholder.com/40',
                    seasonPoints: 800,
                    currentStreak: 11,
                    longestStreak: 11
                }
            ];
            
            console.log('Mock data loaded successfully');
            this.renderLeaderboard(mockData);
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
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
        console.log('showLeaderboard called');
        
        // Hide all other containers
        document.querySelectorAll('main > div').forEach(div => {
            if (div.id !== 'leaderboard-container') {
                console.log('Hiding div:', div.id || 'unnamed div');
                div.style.display = 'none';
            }
        });

        // Show leaderboard container
        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (leaderboardContainer) {
            console.log('Showing leaderboard container');
            leaderboardContainer.style.display = 'block';
            
            // Ensure the table is populated
            if (!leaderboardContainer.querySelector('tbody tr')) {
                console.log('Loading initial data');
                this.loadLeaderboardData();
            }
        } else {
            console.error('Leaderboard container not found, creating it');
            this.createLeaderboardUI();
            this.loadLeaderboardData();
        }
    }
}

// Initialize if we're on the leaderboard page
if (window.location.pathname.includes('leaderboard.html')) {
    new LeaderboardManager();
}