console.log("popup.ts: loaded");

interface KeywordsResponse {
    keywords: [string[], string[], string[], string[]];
}

// On popup load, query for keywords of the active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabId = tabs[0]?.id;
    if (!activeTabId) return;

    chrome.runtime.sendMessage(
        { action: "getKeywords", tabId: activeTabId },
        (response?: KeywordsResponse) => {
            if (!response?.keywords || response.keywords.every((list) => list.length === 0)) {
                console.log("popup.ts: No keywords found.");
                return;
            }

            const [languagesList, frameworksList, technologiesList, conceptsList] = response.keywords;
            const keywordsListElement = document.getElementById("keywordsList") as HTMLElement;
            if (!keywordsListElement) return;

            keywordsListElement.innerHTML = ""; // Clear previous entries

            displayKeywords(keywordsListElement, languagesList, "Languages");
            displayKeywords(keywordsListElement, frameworksList, "Frameworks");
            displayKeywords(keywordsListElement, technologiesList, "Technologies");
            displayKeywords(keywordsListElement, conceptsList, "Concepts");

            document.querySelectorAll('li').forEach((item) => {
                item.addEventListener('click', () => item.classList.toggle('active'));
            });
        }
    );
});

// Function to display keywords under a title
function displayKeywords(keywordsListElement: HTMLElement, keywords: string[], title: string): void {
    const titleElement = document.createElement("h3");
    titleElement.textContent = title;
    keywordsListElement.appendChild(titleElement);

    keywords.forEach((keyword) => {
        const li = document.createElement("li");
        li.textContent = keyword;
        keywordsListElement.appendChild(li);
    });
}
