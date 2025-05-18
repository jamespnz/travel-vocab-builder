document.addEventListener("DOMContentLoaded", function () {
    const wordDisplay = document.getElementById("word-display");
    const buttonContainer = document.getElementById("button-container");

    if (wordDisplay) {
        wordDisplay.style.display = "none"; // Hide vocab table initially
    } else {
        console.error("Error: 'word-display' not found.");
    }

    if (!buttonContainer) {
        console.error("Error: 'button-container' not found.");
        return;
    }

    fetch("travel.csv")
    .then(response => response.text())
    .then(csvData => {
        const parsedData = Papa.parse(csvData, { header: true }).data;

        let categories = {};

        parsedData.forEach(row => {
            let category = row["Category"]?.trim(); // Ensure category isn't empty

            // Skip rows with no valid category
            if (!category || category === "") return;

            if (!categories[category]) {
                categories[category] = [];
            }

            categories[category].push([
                row["Kanji"],
                row["Phonetic"],
                row["English Equivalent"]
            ]);
        });

        let activeCategory = null;

        Object.keys(categories).forEach(category => {
            // Ensure only buttons for categories with valid words are created
            if (categories[category].length === 0) return;

            let button = document.createElement("button");
            button.innerText = category;
            button.onclick = () => {
                if (activeCategory === category) {
                    wordDisplay.style.display = "none";
                    wordDisplay.innerHTML = "";
                    activeCategory = null;
                } else {
                    wordDisplay.innerHTML = "";
                    wordDisplay.style.display = "block";
                    displayWords(categories[category]);
                    activeCategory = category;
                }
            };
            buttonContainer.appendChild(button);
        });
    })
    .catch(error => console.error("Error loading CSV:", error));
});

// Function to display words in a table format
function displayWords(wordList) {
    let wordDisplay = document.getElementById("word-display");
    wordDisplay.innerHTML = ""; // Clear previous content
    wordDisplay.style.display = "block";

    let table = document.createElement("table");

    // Create headers (Updated: Use new column name)
    let headerRow = document.createElement("tr");
    ["Kanji", "Phonetic", "English Equivalent"].forEach(header => {
        let th = document.createElement("th");
        th.innerText = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Populate table rows
    wordList.forEach(row => {
        let tableRow = document.createElement("tr");
        row.forEach((word, index) => {
            let cell = document.createElement("td");
            cell.innerText = word || "⚠ Missing Data"; // Avoid undefined values
            tableRow.appendChild(cell);
        });
        table.appendChild(tableRow);
    });

    wordDisplay.appendChild(table);
}