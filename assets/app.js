const repoOwner = "YOUR_GITHUB_USERNAME";
const repoName = "torchlight-builds";
const filePath = "data/builds.json";

// --- SAVE BUILD FUNCTION ---
async function submitBuild() {
    const token = document.getElementById('gh-token').value;
    const newBuild = {
        hero: document.getElementById('hero').value,
        title: document.getElementById('title').value,
        description: document.getElementById('desc').value,
        code: document.getElementById('b-code').value
    };

    // 1. Get the current file (GitHub requires the 'sha' to update)
    const url = `https://github.com{repoOwner}/${repoName}/contents/${filePath}`;
    const getRes = await fetch(url);
    const fileData = await getRes.json();
    
    // 2. Decode current content, add new build, and re-encode
    const currentBuilds = JSON.parse(atob(fileData.content));
    currentBuilds.push(newBuild);
    const updatedContent = btoa(JSON.stringify(currentBuilds, null, 2));

    // 3. Push back to GitHub
    const putRes = await fetch(url, {
        method: "PUT",
        headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            message: `Added build: ${newBuild.title}`,
            content: updatedContent,
            sha: fileData.sha
        })
    });

    if (putRes.ok) { alert("Build added! Refresh in 1 minute."); location.reload(); }
    else { alert("Error saving build. Check your token."); }
}

// --- LOAD BUILD FUNCTION (Keep your existing load logic here) ---
