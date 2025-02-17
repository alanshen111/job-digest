console.log("popup.js: loaded");

// On popup load, query for keywords of the active tab
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {

    const activeTabId = tabs[0].id;
    return browser.runtime.sendMessage({ action: "getKeywords", tabId: activeTabId });

}).then((response) => { // Then handle the response
    
    if (!response || !response.keywords) {
        console.log("popup.js: No keywords found.");
        return;
    }

    const keywordsList = response.keywords;
    const keywordsListElement = document.getElementById("keywordsList");

    // Display keywords in the HTML
    keywordsListElement.innerHTML = ""; // Clear previous entries
    keywordsList.forEach(keyword => {
        const li = document.createElement("li");
        li.textContent = keyword;
        keywordsListElement.appendChild(li);
    });

}).catch(error => console.error("popup.js: Error fetching keywords:", error)); // Catch any errors
