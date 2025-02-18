let tabKeywordMap = {}; // Map of keyword arrays by tab ID

// On install, create menu button
browser.runtime.onInstalled.addListener(() => { 
    browser.contextMenus.create({
      id: "extractKeywords",
      title: "Digest selected text...",
      contexts: ["selection"] 
    });
});
  
// On menu click, send command and text to content script
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extractKeywords") {
        browser.tabs.sendMessage(tab.id, {
            action: "extractKeywords",
            selection: info.selectionText
        });
    }
});

// Listen for messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // Store keywords in the map
    if (message.action === "storeKeywords") {
        tabKeywordMap[sender.tab.id] = [
            message.languages,
            message.frameworks,
            message.technologies,
            message.concepts
        ];
    }

    // Get keywords for a specific tab
    if (message.action === "getKeywords") {
        const tabId = message.tabId;
        const keywords = tabKeywordMap[tabId] || []; 
        sendResponse({ keywords });
    }
    
    return true;
});

// Listen for tab updates 
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        delete tabKeywordMap[tabId]; // Clear keywords data when tab is reloaded
    }
});