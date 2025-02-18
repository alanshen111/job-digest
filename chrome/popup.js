console.log("popup.js: loaded");

// On popup load, query for keywords of the active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabId = tabs[0].id;
    chrome.runtime.sendMessage({ action: "getKeywords", tabId: activeTabId }, (response) => {
        
        if (!response || !response.keywords || response.keywords.length === 0) {
            console.log("popup.js: No keywords found.");
            return;
        }

        const [languagesList, frameworksList, technologiesList, conceptsList] = response.keywords;
        const keywordsListElement = document.getElementById("keywordsList");
        keywordsListElement.innerHTML = ""; // Clear previous entries

        displayKeywords(keywordsListElement, languagesList, "Languages");
        displayKeywords(keywordsListElement, frameworksList, "Frameworks");
        displayKeywords(keywordsListElement, technologiesList, "Technologies");
        displayKeywords(keywordsListElement, conceptsList, "Concepts");

        document.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => item.classList.toggle('active'));
        });
    });
});

// Function to display keywords under a title
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
