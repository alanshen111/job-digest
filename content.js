console.log("content.js: injected");

// Load keywords from JSON file
fetch(browser.runtime.getURL("keywords.json"))
    .then(response => response.json())
    .then(keywords => {
        // Listen for messages from the background script
        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === "extractKeywords") {

                const selectedText = message.selection;

                // Matching criteria 
                const matchKeyword = (keyword) => {
                    // Escape special characters in the keyword for regex matching
                    const escapedKeyword = keyword.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
                    const regex = new RegExp(`(^|\\s|[.,!?;:/()\\[\\]{}\\-'""])${escapedKeyword}($|\\s|[.,!?;:/()\\[\\]{}\\-'""])`, "i");
                    return regex.test(selectedText);
                };

                const foundLanguages = keywords.languages.filter(matchKeyword);
                const foundFrameworks = keywords.frameworks.filter(matchKeyword);
                const foundTechnologies = keywords.technologies.filter(matchKeyword);
                const foundConcepts = keywords.concepts.filter(matchKeyword);

                browser.runtime.sendMessage({
                    action: "storeKeywords",
                    languages: foundLanguages,
                    frameworks: foundFrameworks,
                    technologies: foundTechnologies,
                    concepts: foundConcepts
                });
            }
        });
    })
    .catch(error => console.error("Error loading keywords:", error));
