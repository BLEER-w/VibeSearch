// Last.fm API Key (replace with your own key)
const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

// Function to handle search button click and form submission
function handleSearch() {
    const artistInput = document.getElementById('artist-input').value;

    // Check if input is empty
    if (!artistInput) {
        alert('Please enter an artist name.');
        return;
    }

    // API endpoint for searching similar artists
    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistInput)}&api_key=${API_KEY}&format=json`;

    // Fetch similar artists from Last.fm API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const similarArtists = data.similarartists.artist;
            displayArtists(similarArtists);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('An error occurred while searching for similar artists.');
        });
}

// Function to display similar artists on the webpage
function displayArtists(artists) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    
    artists.forEach(artist => {
        const artistElement = document.createElement('div');
        artistElement.textContent = artist.name;
        resultsDiv.appendChild(artistElement);
    });
}

// Event listeners for form submission and button click
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    handleSearch();
});

document.getElementById('search-button').addEventListener('click', handleSearch);
