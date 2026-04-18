// Populate Dropdowns on Load
function setupForm() {
    const heroSelect = document.getElementById('hero-select');
    const talentSelect = document.getElementById('talent-1');

    GAME_DATA.heroes.forEach(h => {
        heroSelect.innerHTML += `<option value="${h.name}">${h.name}</option>`;
    });

    GAME_DATA.talentTrees.forEach(t => {
        talentSelect.innerHTML += `<option value="${t}">${t}</option>`;
    });
}

// Update Traits when Hero changes
function updateTraits() {
    const heroName = document.getElementById('hero-select').value;
    const traitSelect = document.getElementById('trait-select');
    traitSelect.innerHTML = '<option value="">Select Trait</option>';
    
    const hero = GAME_DATA.heroes.find(h => h.name === heroName);
    if (hero) {
        hero.traits.forEach(trait => {
            traitSelect.innerHTML += `<option value="${trait}">${trait}</option>`;
        });
    }
}

setupForm();
