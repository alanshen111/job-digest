console.log("content.js: injected");

// Load keywords from JSON file
fetch(chrome.runtime.getURL("keywords.json"))
    .then(response => response.json())
    .then(keywords => {
        // Listen for messages from the background script
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === "extractKeywords") {

                console.log("content.js: extracting keywords");

                const selectedText = message.selection;

                // Matching criteria for "Languages", "Frameworks", and "Technologies"
                const matchKeyword = (keyword) => {
                    const flag = (keyword.length <= 3 || keyword === keyword.toUpperCase()) ? "" : "i";
                    const escapedKeyword = keyword.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
                    const regex = new RegExp(`(^|\\s|[.,!?;:/()\\[\\]{}\\-'""])${escapedKeyword}($|\\s|[.,!?;:/()\\[\\]{}\\-'""])`, flag);
                    return regex.test(selectedText);
                };

                // "Concepts" are matched with less strict criteria
                const matchConcept = (keyword) => {
                    if (keyword.length <= 3 || keyword === keyword.toUpperCase()) {
                        return selectedText.includes(keyword);
                    }
                    return selectedText.toLowerCase().includes(keyword.toLowerCase());
                };

                const foundLanguages = keywords.languages.filter(matchKeyword);
                const foundFrameworks = keywords.frameworks.filter(matchKeyword);
                const foundTechnologies = keywords.technologies.filter(matchKeyword);
                const foundConcepts = keywords.concepts.filter(matchConcept);

                chrome.runtime.sendMessage({
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
