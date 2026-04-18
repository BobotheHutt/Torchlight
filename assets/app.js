async function loadBuilds() {
    const response = await fetch('./data/builds.json');
    const builds = await response.json();
    const container = document.getElementById('build-container');
    container.innerHTML = ''; // Clear for refresh

    builds.forEach(build => {
        const card = `
            <div class="build-card" data-hero="${build.hero.toLowerCase()}">
                <div class="card-header">
                    <h2>${build.hero} - ${build.title}</h2>
                    <span class="tag">${build.tags || 'General'}</span>
                </div>
                
                <div class="build-section">
                    <strong>📍 Talents:</strong> <span>${build.talents}</span>
                </div>

                <div class="build-section">
                    <strong>🔥 Skills:</strong> <p>${build.skills}</p>
                </div>

                <div class="build-section">
                    <strong>🛡️ Gear Priority:</strong> <p>${build.gear_goals}</p>
                </div>

                <div class="code-copy">
                    <code>${build.code}</code>
                    <button onclick="navigator.clipboard.writeText('${build.code}')">Copy Code</button>
                </div>
            </div>`;
        container.innerHTML += card;
    });
}

function filterBuilds() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('build-card');
    for (let card of cards) {
        card.style.display = card.innerText.toLowerCase().includes(input) ? "block" : "none";
    }
}

loadBuilds();
