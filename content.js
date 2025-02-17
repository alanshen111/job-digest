console.log("content.js: injected");

// Listen for messages from the background script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // Extract keywords from selected text
    if (message.action === "extractKeywords") {
        const selectedText = message.selection;
        
        // placeholder
        // TODO: put in separate database
        // TODO: capitalization
        const techKeywords = ["JavaScript", "Javascript", "Python", "AWS", "React", "Node.js"]; 
        const foundKeywords = techKeywords.filter(keyword => selectedText.includes(keyword));

        browser.runtime.sendMessage({
            action: "storeKeywords",
            keywords: foundKeywords
        });
    }

});
  