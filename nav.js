export function createNavBar() {
    const nav = document.createElement('nav');
    nav.className = 'top-nav';
    nav.innerHTML = `
        <div class="nav-container">
            <div class="nav-left">
                <img src="./assets/ksu-logo.png" alt="KSU Logo" class="nav-logo-img">
                <h1 class="nav-title">KSU Fan Rewards</h1>
            </div>
            
            <div class="nav-center">
                <ul class="nav-links">
                    <li><a href="index.html" class="nav-link ${window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ? 'active' : ''}">Home</a></li>
                    <li><a href="leaderboard.html" class="nav-link ${window.location.pathname.endsWith('leaderboard.html') ? 'active' : ''}">Leaderboard</a></li>
                    <li><a href="rewards.html" class="nav-link ${window.location.pathname.endsWith('rewards.html') ? 'active' : ''}">Rewards</a></li>
                    <li><a href="events.html" class="nav-link ${window.location.pathname.endsWith('events.html') ? 'active' : ''}">Events</a></li>
                </ul>
            </div>

            <div class="nav-right">
                <div class="points-display">
                    <span class="points-icon">🏆</span>
                    <span class="points-value">1,234</span>
                    <span class="points-label">points</span>
                </div>
                <a href="#profile" class="profile-link">
                    <img src="./assets/default-profile.png" alt="Profile" class="profile-img" 
                         onerror="this.src='https://via.placeholder.com/40';">
                </a>
            </div>
        </div>
    `;

    // Add error handling for logo image
    const logo = nav.querySelector('.nav-logo-img');
    logo.onerror = function() {
        this.src = 'https://via.placeholder.com/40';
        console.log('Logo image failed to load, using placeholder');
    };

    return nav;
}

// Function to update points (can be called from other files)
export function updatePoints(points) {
    const pointsValue = document.querySelector('.points-value');
    if (pointsValue) {
        pointsValue.textContent = points.toLocaleString();
    }
}

// Function to update profile picture
export function updateProfilePic(imageUrl) {
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.src = imageUrl;
    }
} 