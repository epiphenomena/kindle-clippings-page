// Global variables to store unique titles and authors for autocomplete
let allTitles = [];
let allAuthors = [];
let highlightedTitleIndex = -1;
let highlightedAuthorIndex = -1;

function remove_duplicate_titles() {
    var prior_title = '';
    document.querySelectorAll("div.clipping").forEach((e) => {
        let te = e.querySelector("h2.title");
        if (te && te.textContent === prior_title) {
            te.classList.add("hidden");
        } else {
            prior_title = te?.textContent;
        }
    });
}

function collectUniqueTitlesAndAuthors() {
    const titleSet = new Set();
    const authorSet = new Set();
    
    document.querySelectorAll("div.clipping").forEach((e) => {
        const title = e.getAttribute('data-title');
        const author = e.getAttribute('data-author');
        
        if (title) titleSet.add(title);
        if (author) authorSet.add(author);
    });
    
    allTitles = Array.from(titleSet).sort();
    allAuthors = Array.from(authorSet).sort();
    
    // Populate sidebars
    populateSidebars();
}

function populateSidebars() {
    const titlesList = document.getElementById('titlesList');
    const authorsList = document.getElementById('authorsList');
    
    // Clear existing content
    titlesList.innerHTML = '';
    authorsList.innerHTML = '';
    
    // Populate titles sidebar
    allTitles.forEach(title => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = title;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            filterByTitle(title);
        });
        li.appendChild(a);
        titlesList.appendChild(li);
    });
    
    // Populate authors sidebar
    allAuthors.forEach(author => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = author;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            filterByAuthor(author);
        });
        li.appendChild(a);
        authorsList.appendChild(li);
    });
}

function filterByTitle(title) {
    document.getElementById('titleFilter').value = title;
    filterHighlights();
}

function filterByAuthor(author) {
    document.getElementById('authorFilter').value = author;
    filterHighlights();
}

function filterHighlights() {
    const titleFilter = document.getElementById('titleFilter').value.toLowerCase();
    const authorFilter = document.getElementById('authorFilter').value.toLowerCase();
    
    document.querySelectorAll("div.clipping").forEach((e) => {
        const title = e.getAttribute('data-title').toLowerCase();
        const author = e.getAttribute('data-author').toLowerCase();
        
        // Enhanced partial matching
        const titleMatch = titleFilter === '' || title.includes(titleFilter);
        const authorMatch = authorFilter === '' || author.includes(authorFilter);
        
        if (titleMatch && authorMatch) {
            e.classList.remove('hidden');
        } else {
            e.classList.add('hidden');
        }
    });
    
    // Re-apply duplicate title removal to visible items only
    remove_duplicate_titles_visible();
    
    // Hide suggestions when filtering
    document.getElementById('titleSuggestions').style.display = 'none';
    document.getElementById('authorSuggestions').style.display = 'none';
    highlightedTitleIndex = -1;
    highlightedAuthorIndex = -1;
}

function remove_duplicate_titles_visible() {
    var prior_title = '';
    document.querySelectorAll("div.clipping:not(.hidden)").forEach((e) => {
        let te = e.querySelector("h2.title");
        if (te && te.textContent === prior_title) {
            te.classList.add("hidden");
        } else {
            prior_title = te?.textContent;
        }
    });
}

function clearFilters() {
    document.getElementById('titleFilter').value = '';
    document.getElementById('authorFilter').value = '';
    document.querySelectorAll("div.clipping").forEach((e) => {
        e.classList.remove('hidden');
    });
    remove_duplicate_titles();
    
    // Hide suggestions
    document.getElementById('titleSuggestions').style.display = 'none';
    document.getElementById('authorSuggestions').style.display = 'none';
    highlightedTitleIndex = -1;
    highlightedAuthorIndex = -1;
}

function showTitleSuggestions(filterText) {
    const suggestionsContainer = document.getElementById('titleSuggestions');
    
    if (!filterText) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    const filteredTitles = allTitles.filter(title => 
        title.toLowerCase().includes(filterText.toLowerCase())
    ).slice(0, 10); // Limit to 10 suggestions
    
    if (filteredTitles.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsContainer.innerHTML = '';
    filteredTitles.forEach((title, index) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = title;
        div.addEventListener('click', () => {
            document.getElementById('titleFilter').value = title;
            suggestionsContainer.style.display = 'none';
            filterHighlights();
        });
        suggestionsContainer.appendChild(div);
    });
    
    suggestionsContainer.style.display = 'block';
    highlightedTitleIndex = -1;
}

function showAuthorSuggestions(filterText) {
    const suggestionsContainer = document.getElementById('authorSuggestions');
    
    if (!filterText) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    const filteredAuthors = allAuthors.filter(author => 
        author.toLowerCase().includes(filterText.toLowerCase())
    ).slice(0, 10); // Limit to 10 suggestions
    
    if (filteredAuthors.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsContainer.innerHTML = '';
    filteredAuthors.forEach((author, index) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = author;
        div.addEventListener('click', () => {
            document.getElementById('authorFilter').value = author;
            suggestionsContainer.style.display = 'none';
            filterHighlights();
        });
        suggestionsContainer.appendChild(div);
    });
    
    suggestionsContainer.style.display = 'block';
    highlightedAuthorIndex = -1;
}

function highlightNextSuggestion(containerId, currentIndex, direction) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll('.suggestion-item');
    
    if (items.length === 0) return -1;
    
    // Remove highlight from current item
    if (currentIndex >= 0 && currentIndex < items.length) {
        items[currentIndex].classList.remove('highlighted');
    }
    
    // Calculate new index
    let newIndex = currentIndex + direction;
    
    // Handle wrapping
    if (newIndex >= items.length) newIndex = -1;
    if (newIndex < -1) newIndex = items.length - 1;
    
    // Highlight new item
    if (newIndex >= 0 && newIndex < items.length) {
        items[newIndex].classList.add('highlighted');
    }
    
    return newIndex;
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Apply initial duplicate title removal
    remove_duplicate_titles();
    
    // Collect unique titles and authors for autocomplete
    collectUniqueTitlesAndAuthors();
    
    // Set up filter event listeners
    const titleFilter = document.getElementById('titleFilter');
    const authorFilter = document.getElementById('authorFilter');
    
    titleFilter.addEventListener('input', function() {
        filterHighlights();
        showTitleSuggestions(this.value);
    });
    
    authorFilter.addEventListener('input', function() {
        filterHighlights();
        showAuthorSuggestions(this.value);
    });
    
    // Handle keyboard navigation for title suggestions
    titleFilter.addEventListener('keydown', function(e) {
        const suggestionsContainer = document.getElementById('titleSuggestions');
        
        if (suggestionsContainer.style.display === 'block') {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                highlightedTitleIndex = highlightNextSuggestion('titleSuggestions', highlightedTitleIndex, 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                highlightedTitleIndex = highlightNextSuggestion('titleSuggestions', highlightedTitleIndex, -1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const items = suggestionsContainer.querySelectorAll('.suggestion-item');
                if (highlightedTitleIndex >= 0 && highlightedTitleIndex < items.length) {
                    items[highlightedTitleIndex].click();
                } else if (items.length > 0) {
                    items[0].click();
                }
            } else if (e.key === 'Escape') {
                suggestionsContainer.style.display = 'none';
                highlightedTitleIndex = -1;
            }
        }
    });
    
    // Handle keyboard navigation for author suggestions
    authorFilter.addEventListener('keydown', function(e) {
        const suggestionsContainer = document.getElementById('authorSuggestions');
        
        if (suggestionsContainer.style.display === 'block') {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                highlightedAuthorIndex = highlightNextSuggestion('authorSuggestions', highlightedAuthorIndex, 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                highlightedAuthorIndex = highlightNextSuggestion('authorSuggestions', highlightedAuthorIndex, -1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const items = suggestionsContainer.querySelectorAll('.suggestion-item');
                if (highlightedAuthorIndex >= 0 && highlightedAuthorIndex < items.length) {
                    items[highlightedAuthorIndex].click();
                } else if (items.length > 0) {
                    items[0].click();
                }
            } else if (e.key === 'Escape') {
                suggestionsContainer.style.display = 'none';
                highlightedAuthorIndex = -1;
            }
        }
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-container')) {
            document.getElementById('titleSuggestions').style.display = 'none';
            document.getElementById('authorSuggestions').style.display = 'none';
            highlightedTitleIndex = -1;
            highlightedAuthorIndex = -1;
        }
    });
    
    // Set up clear filters button
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Set up mobile sidebar toggle buttons
    const toggleTitlesBtn = document.getElementById('toggleTitlesSidebar');
    const toggleAuthorsBtn = document.getElementById('toggleAuthorsSidebar');
    const titlesSidebar = document.getElementById('titlesSidebar');
    const authorsSidebar = document.getElementById('authorsSidebar');
    
    if (toggleTitlesBtn && toggleAuthorsBtn) {
        toggleTitlesBtn.addEventListener('click', function() {
            titlesSidebar.classList.add('active');
        });
        
        toggleAuthorsBtn.addEventListener('click', function() {
            authorsSidebar.classList.add('active');
        });
        
        // Set up close buttons for mobile sidebars
        const closeTitlesBtn = titlesSidebar.querySelector('.close-sidebar-btn');
        const closeAuthorsBtn = authorsSidebar.querySelector('.close-sidebar-btn');
        
        closeTitlesBtn.addEventListener('click', function() {
            titlesSidebar.classList.remove('active');
        });
        
        closeAuthorsBtn.addEventListener('click', function() {
            authorsSidebar.classList.remove('active');
        });
    }
});