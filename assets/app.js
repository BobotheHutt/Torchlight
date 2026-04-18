// 1. CONFIGURATION - CHANGE THESE THREE LINES
const REPO_OWNER = "BobotheHutt"; 
const REPO_NAME = "torchlight-builds";
const FILE_PATH = "data/builds.json";

// 2. OFFICIAL GAME DATA (Updated for Season 5+)
const GAME_DATA = {
    heroes: [
        { name: "Gemma", traits: ["Flame of Pleasure", "Frostbitten Heart", "Ice-Fire Fusion"] },
        { name: "Rehan", traits: ["Anger", "Seething Silhouette"] },
        { name: "Thea", traits: ["Wisdom of the Gods", "Incarnation of the Gods", "Blasphemer"] },
        { name: "Youga", traits: ["Spacetime Illusion", "Spacetime Elapse"] },
        { name: "Carino", traits: ["Ranger of Glory", "Lethal Flash", "Zealot of War"] },
        { name: "Erika", traits: ["Wind Stalker", "Lightning Shadow", "Vendetta's Sting"] },
        { name: "Moto", traits: ["Order Calling", "Charge Calling"] },
        { name: "Bing", traits: ["Blast Nova", "Creative Genius"] },
        { name: "Iris", traits: ["Growing Breeze", "Vigilant Breeze"] },
        { name: "Rosa", traits: ["High Court Chariot", "Unsullied Blade"] },
        { name: "Selena", traits: ["Sing with the Tide"] },
        { name: "Sage", traits: ["Licorice Note"] }
    ],
    talentTrees: [
        "God of Might", "Goddess of Hunting", "Goddess of Knowledge", 
        "God of War", "Goddess of Deception", "God of Machines",
        "The Brave", "Marksman", "Magister", "Warlock", "Psychic", "Steel Vanguard"
    ]
};

// 3. INITIALIZATION
function init() {
    const heroSelect = document.getElementById('hero-select');
    const talent1 = document.getElementById('talent-1');
    
    // Fill Hero and Talent dropdowns
    GAME_DATA.heroes.forEach(h => heroSelect.innerHTML += `<option value="${h.name}">${h.name}</option>`);
    GAME_DATA.talentTrees.forEach(t => talent1.innerHTML += `<option value="${t}">${t}</option>`);
    
    loadBuilds(); // Fetch existing builds to display
}

// 4. HERO-TRAIT DYNAMICS
function updateTraits() {
    const heroName = document.getElementById('hero-select').value;
    const traitSelect = document.getElementById('trait-select');
    traitSelect.innerHTML = '<option value="">Select Trait</option>';
    
    const hero = GAME_DATA.heroes.find(h => h.name === heroName);
    if (hero) {
        hero.traits.forEach(trait => traitSelect.innerHTML += `<option value="${trait}">${trait}</option>`);
    }
}

// 5. GITHUB API - SAVE DATA
async function submitBuild() {
    const token = document.getElementById('gh-token').value;
    const newBuild = {
        hero: document.getElementById('hero-select').value,
        trait: document.getElementById('trait-select').value,
        talent: document.getElementById('talent-1').value,
        title: document.getElementById('title').value,
        code: document.getElementById('b-code').value,
        date: new Date().toLocaleDateString()
    };

    if (!token || !newBuild.code) return alert("Please enter your GitHub Token and a Build Code.");

    const url = `https://github.com{REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    try {
        const getRes = await fetch(url);
        const fileData = await getRes.json();
        // Decode existing builds from GitHub
        const currentBuilds = JSON.parse(atob(fileData.content));
        
        currentBuilds.push(newBuild);
        
        // Push updated list back to GitHub
        const putRes = await fetch(url, {
            method: "PUT",
            headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                message: `Added build: ${newBuild.title}`,
                content: btoa(unescape(encodeURIComponent(JSON.stringify(currentBuilds, null, 2)))),
                sha: fileData.sha
            })
        });

        if (putRes.ok) { 
            alert("Success! Build saved to GitHub."); 
            location.reload(); 
        }
    } catch (err) { 
        alert("Error connecting to GitHub. Check your token and repo name."); 
    }
}

// 6. DISPLAY LOGIC
async function loadBuilds() {
    const res = await fetch(`./${FILE_PATH}`);
    const builds = await res.json();
    const container = document.getElementById('build-container');
    
    container.innerHTML = builds.map(b => `
        <div class="build-card">
            <div class="card-header">
                <h2>${b.hero}: ${b.title}</h2>
                <small>${b.date || ''}</small>
            </div>
            <p><strong>Trait:</strong> ${b.trait} | <strong>Talent:</strong> ${b.talent}</p>
            <div class="code-box">
                <code>${b.code}</code>
                <button onclick="navigator.clipboard.writeText('${b.code}')">Copy</button>
            </div>
        </div>
    `).reverse().join(''); // Show newest first
}

window.onload = init;
