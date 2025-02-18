console.log("content.js: injected");

// Load keywords from JSON file
fetch(browser.runtime.getURL("keywords.json"))
    .then(response => response.json())
    .then(keywords => {
        // Listen for messages from the background script
        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === "extractKeywords") {

                const selectedText = message.selection;

                // Matching criteria for Languages, Frameworks, and Technologies
                const matchKeyword = (keyword) => {
                    const escapedKeyword = keyword.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
                    const regex = new RegExp(`(^|\\s|[.,!?;:/()\\[\\]{}\\-'""])${escapedKeyword}($|\\s|[.,!?;:/()\\[\\]{}\\-'""])`, "i");
                    return regex.test(selectedText);
                };

                // Concepts are matched differently, as they are common words with relaxed spellings and usage
                const matchConcept = (keyword) => {
                    // If the keyword is less than 3 characters or all uppercase, use sensitive matching
                    if (keyword.length <= 3 || keyword === keyword.toUpperCase()) {
                        return selectedText.includes(keyword);
                    }
                    return selectedText.toLowerCase().includes(keyword.toLowerCase());
                }

                const foundLanguages = keywords.languages.filter(matchKeyword);
                const foundFrameworks = keywords.frameworks.filter(matchKeyword);
                const foundTechnologies = keywords.technologies.filter(matchKeyword);
                const foundConcepts = keywords.concepts.filter(matchConcept);

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
