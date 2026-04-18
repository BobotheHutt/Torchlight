const REPO_OWNER = "BobotheHutt"; 
const REPO_NAME = "Torchlight";
const FILE_PATH = "data/builds.json";

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
    talentTrees: ["God of Might", "Goddess of Hunting", "Goddess of Knowledge", "God of War", "Goddess of Deception", "God of Machines", "The Brave", "Marksman", "Magister", "Warlock", "Psychic", "Steel Vanguard"]
};

function init() {
    const heroSelect = document.getElementById('hero-select');
    const talent1 = document.getElementById('talent-1');
    if(heroSelect) GAME_DATA.heroes.forEach(h => heroSelect.innerHTML += `<option value="${h.name}">${h.name}</option>`);
    if(talent1) GAME_DATA.talentTrees.forEach(t => talent1.innerHTML += `<option value="${t}">${t}</option>`);
    loadBuilds();
}

function updateTraits() {
    const heroName = document.getElementById('hero-select').value;
    const traitSelect = document.getElementById('trait-select');
    traitSelect.innerHTML = '<option value="">Select Trait</option>';
    const hero = GAME_DATA.heroes.find(h => h.name === heroName);
    if (hero) hero.traits.forEach(trait => traitSelect.innerHTML += `<option value="${trait}">${trait}</option>`);
}

function updatePreview() {
    const hero = document.getElementById('hero-select').value;
    const trait = document.getElementById('trait-select').value;
    const talent = document.getElementById('talent-1').value;
    const title = document.getElementById('title').value || "New Build";
    document.getElementById('preview-text').innerText = `${hero || 'Hero'} (${trait || 'Trait'}) | Tree: ${talent || 'Tree'} | Name: ${title}`;
}

async function submitBuild() {
    const token = document.getElementById('gh-token').value;
    const btn = document.getElementById('submit-btn');
    const newBuild = {
        hero: document.getElementById('hero-select').value,
        trait: document.getElementById('trait-select').value,
        talent: document.getElementById('talent-1').value,
        title: document.getElementById('title').value || "Untitled Build",
        code: document.getElementById('b-code').value || "NO_CODE_YET",
        date: new Date().toLocaleDateString()
    };

    if (!token) return alert("Enter your GitHub Token!");
    btn.innerText = "Publishing...";
    btn.disabled = true;

    const url = `https://github.com{REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    
    try {
        const getRes = await fetch(url);
        const fileData = await getRes.json();
        const currentBuilds = JSON.parse(atob(fileData.content));
        currentBuilds.push(newBuild);
        
        const putRes = await fetch(url, {
            method: "PUT",
            headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                message: `Added build: ${newBuild.title}`,
                content: btoa(JSON.stringify(currentBuilds)),
                sha: fileData.sha
            })
        });

        if (putRes.ok) { alert("Build Published!"); location.reload(); }
        else { throw new Error("GitHub rejected the save."); }
    } catch (err) { 
        alert("Check token permissions (must have 'Contents: Read & Write')."); 
        btn.innerText = "Save Build to Site";
        btn.disabled = false;
    }
}

async function loadBuilds() {
    try {
        const res = await fetch(`./${FILE_PATH}`);
        const builds = await res.json();
        const container = document.getElementById('build-container');
        container.innerHTML = builds.map(b => `
            <div class="build-card">
                <h2>${b.title}</h2>
                <p><strong>Hero:</strong> ${b.hero} (${b.trait})</p>
                <p><strong>Talent:</strong> ${b.talent}</p>
                <div class="code-box"><code>${b.code}</code></div>
            </div>
        `).reverse().join('');
    } catch (e) { console.log("Builds log empty."); }
}

window.onload = init;
