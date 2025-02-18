console.log("content.ts: injected");

interface Keywords {
    languages: string[];
    frameworks: string[];
    technologies: string[];
    concepts: string[];
}

// Load keywords from JSON file
fetch(chrome.runtime.getURL("keywords.json"))
    .then(response => response.json())
    .then((keywords: Keywords) => {
        // Listen for messages from the background script
        chrome.runtime.onMessage.addListener(
            (message: { action: string; selection: string }, sender, sendResponse) => {
                if (message.action === "extractKeywords") {
                    console.log("content.ts: extracting keywords");

                    const selectedText: string = message.selection;
                    
                    // Matching criteria for keywords
                    // - Whole words only, with exceptions to pluralization and punctuation
                    // - Case-insensitive
                    const matchKeyword = (keyword: string): boolean => {
                        const escapedKeyword = keyword.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
                        const regex = new RegExp(`(^|\\s|[.,!?;:/()\\[\\]{}\\-'""])${escapedKeyword}(?:s)?($|\\s|[.,!?;:/()\\[\\]{}\\-'""])`, "i");
                        return regex.test(selectedText);
                    }

                    const foundLanguages = keywords.languages.filter(matchKeyword);
                    const foundFrameworks = keywords.frameworks.filter(matchKeyword);
                    const foundTechnologies = keywords.technologies.filter(matchKeyword);
                    const foundConcepts = keywords.concepts.filter(matchKeyword);

                    chrome.runtime.sendMessage({
                        action: "storeKeywords",
                        languages: foundLanguages,
                        frameworks: foundFrameworks,
                        technologies: foundTechnologies,
                        concepts: foundConcepts
                    });
                }
            }
        );
    })
    .catch(error => console.error("Error loading keywords:", error));