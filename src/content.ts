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

                    // Matching criteria for "Languages", "Frameworks", and "Technologies"
                    const matchKeyword = (keyword: string): boolean => {
                        const flag = keyword.length <= 3 || keyword === keyword.toUpperCase() ? "" : "i";
                        const escapedKeyword = keyword.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
                        const regex = new RegExp(
                            `(^|\\s|[.,!?;:/()\\[\\]{}\\-'""])${escapedKeyword}($|\\s|[.,!?;:/()\\[\\]{}\\-'""])`,
                            flag
                        );
                        return regex.test(selectedText);
                    };

                    // "Concepts" are matched with less strict criteria
                    const matchConcept = (keyword: string): boolean => {
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
            }
        );
    })
    .catch(error => console.error("Error loading keywords:", error));
