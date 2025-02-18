let tabKeywordMap: Record<number, string[][]> = {}; // Map by tab, each containing an array of 4 arrays of keywords

// On install, create menu button
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "extractKeywords",
        title: "Digest...",
        contexts: ["selection"]
    });
});

// On menu click, send command and text to content script
chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (info.menuItemId === "extractKeywords" && tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
            action: "extractKeywords",
            selection: info.selectionText
        });
    }
});

// Helper function for injecting script (needed in MV3)
function sendExtractCommand(selectionText: string): void {
    chrome.runtime.sendMessage({
        action: "extractKeywords",
        selection: selectionText
    });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(
    (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
        if (message.action === "storeKeywords" && sender.tab?.id) {
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
            chrome.storage.session.get("tabKeywordMap", (data: { tabKeywordMap?: Record<number, string[][]> }) => {
                sendResponse({ keywords: data.tabKeywordMap?.[tabId] || [] });
            });
            return true; 
        }

        if (message.action === "updateBadge") {
            chrome.action.setBadgeText({ text: message.totalFound.toString() });
            chrome.action.setBadgeBackgroundColor({ color: "#2b2a33" });
            chrome.action.setBadgeTextColor({ color: "#cfcfd8" });
        }

    }
);

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
    if (changeInfo.status === "loading") {
        delete tabKeywordMap[tabId];
        chrome.storage.session.set({ tabKeywordMap });
        chrome.action.setBadgeText({ text: "" });
    }
});