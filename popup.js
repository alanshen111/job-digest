console.log("popup.js: loaded");

// On popup load, query for keywords of the active tab
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {

    const activeTabId = tabs[0].id;
    return browser.runtime.sendMessage({ action: "getKeywords", tabId: activeTabId });

}).then((response) => { // Then handle the response
    
    if (!response || !response.keywords || response.keywords.length === 0) {
        console.log("popup.js: No keywords found.");
        return;
    }

    const languagesList = response.keywords[0];
    const frameworksList = response.keywords[1];
    const technologiesList = response.keywords[2];
    const conceptsList = response.keywords[3];

    const keywordsListElement = document.getElementById("keywordsList");
    keywordsListElement.innerHTML = ""; // Clear previous entries
    
    displayKeywords(keywordsListElement, languagesList, "Languages");
    displayKeywords(keywordsListElement, frameworksList, "Frameworks");
    displayKeywords(keywordsListElement, technologiesList, "Technologies");
    displayKeywords(keywordsListElement, conceptsList, "Concepts");

}).catch(error => console.error("popup.js: Error fetching keywords:", error)); // Catch any errors

function displayKeywords(keywordsListElement, keywords, title) {
    const titleElement = document.createElement("h3");
    titleElement.textContent = title;
    keywordsListElement.appendChild(titleElement);
    keywords.forEach(keyword => {
        const li = document.createElement("li");
        li.textContent = keyword;
        keywordsListElement.appendChild(li);
    });
}
