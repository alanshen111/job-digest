console.log("content.ts: injected");

interface Keywords {
    languages: string[];
    frameworks: string[];
    technologies: string[];
    concepts: string[];
}

// Inject CSS for keyword highlighting
const style = document.createElement('style');
style.textContent = `
    .highlighted-keyword {
        background-color: yellow;
    }
`;
document.head.appendChild(style);

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
                    const matchKeyword = (keyword: string): boolean => {
                        const escapedKeyword = keyword.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
                        const regex = new RegExp(`(^|\\s|[.,!?;:/()\\[\\]{}\\-'""])${escapedKeyword}(?:s)?($|\\s|[.,!?;:/()\\[\\]{}\\-'""])`, "i");
                        return regex.test(selectedText);
                    }

                    const foundLanguages = keywords.languages.filter(matchKeyword);
                    const foundFrameworks = keywords.frameworks.filter(matchKeyword);
                    const foundTechnologies = keywords.technologies.filter(matchKeyword);
                    const foundConcepts = keywords.concepts.filter(matchKeyword);

                    //highlightText(foundLanguages.concat(foundFrameworks, foundTechnologies, foundConcepts));

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

function highlightText(keywords: string[]) {
    console.log("content.ts: highlighting keywords");
    // Loop over each keyword
    keywords.forEach(keyword => {
        const searchRegEx = new RegExp(`(${keyword})`, 'gi');

        // Find all text nodes in the document
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        let node;

        while (node = walker.nextNode()) {
            if (node.nodeValue && searchRegEx.test(node.nodeValue)) {
                // Ensure parentNode is not null
                if (node.parentNode) {
                    const span = document.createElement('span');
                    span.classList.add('highlighted-keyword');
                    span.textContent = node.nodeValue || '';  // Safely handle null case
                    node.parentNode.replaceChild(span, node);  // Replace the node with the highlighted span
                } else {
                    console.log("content.ts: parentNode is null for keyword:", keyword);
                }
            }
        }
    });
}