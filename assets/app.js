async function loadBuilds() {
    const response = await fetch('./data/builds.json');
    const builds = await response.json();
    const container = document.getElementById('build-container');

    builds.forEach(build => {
        const card = `
            <div class="build-card">
                <h3>${build.hero}: ${build.title}</h3>
                <p><em>${build.specialization}</em></p>
                <p>${build.description}</p>
                <div class="code-box">
                    <code>${build.code}</code>
                    <button onclick="navigator.clipboard.writeText('${build.code}')">Copy</button>
                </div>
            </div>`;
        container.innerHTML += card;
    });
}
loadBuilds();
