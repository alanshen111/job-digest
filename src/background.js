let tabKeywordMap = {}; 

// On install, create menu button
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "extractKeywords",
        title: "Digest selected text...",
        contexts: ["selection"]
    });
});

// On menu click, send command and text to content script
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("background.js: menu clicked");
    if (info.menuItemId === "extractKeywords") {
        chrome.tabs.sendMessage(tab.id, {
            action: "extractKeywords",
            selection: info.selectionText
        });
    }
});

// Helper function for injecting script (needed in MV3)
function sendExtractCommand(selectionText) {
    console.log("background.js: sending extract command");
    chrome.runtime.sendMessage({
        action: "extractKeywords",
        selection: selectionText
    });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storeKeywords") {
        tabKeywordMap[sender.tab.id] = [
            message.languages,
            message.frameworks,
            message.technologies,
            message.concepts
        ];
        chrome.storage.session.set({ tabKeywordMap });
    }

    if (message.action === "getKeywords") {
        const tabId = message.tabId;
        chrome.storage.session.get("tabKeywordMap", (data) => {
            sendResponse({ keywords: data.tabKeywordMap?.[tabId] || [] });
        });
        return true; // Keep message channel open for async response
    }
});

// Listen for tab updates (clear data on reload)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
        delete tabKeywordMap[tabId];
        chrome.storage.session.set({ tabKeywordMap });
    }
});
