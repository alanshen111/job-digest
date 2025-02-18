console.log('Hello, world!');

async function loadJobPostings() {
    const container = document.getElementById('jobs-container');

    // Fetch the list of text files from the server
    const response = await fetch('/api/text-files');
    const txtFiles = await response.json();
    console.log(txtFiles);

    // Dynamically create boxes for each file
    txtFiles.forEach(async (fileName) => {
        const content = await fetch(`/texts/${fileName}`).then(response => response.text());
        const jobBox = document.createElement('div');
        jobBox.classList.add('job-box');
        jobBox.innerHTML = `<h3>${fileName}</h3><div>${content}</div>`;
        container.appendChild(jobBox);
    });
}

// Load all the job postings when the page loads
loadJobPostings();
