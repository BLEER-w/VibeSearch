// script.js

// Function to search for similar artists using the Last.fm API
async function searchSimilarArtists(artistName) {
    const apiKey = '3bd4b23b8db71c70de8380ebc7f4bccb'; // Substitute with your Last.fm API Key
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data.similarartists.artist;
    } catch (error) {
        console.error('Error fetching similar artists:', error);
        return [];
    }
}

// Function to display similar artists
function displaySimilarArtists(artists) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (artists.length === 0) {
        resultsContainer.innerHTML = '<p>No similar artists found.</p>';
        return;
    }

    artists.forEach(artist => {
        const artistElement = document.createElement('div');
        artistElement.textContent = artist.name;
        resultsContainer.appendChild(artistElement);
    });
}

// Example usage:
// (Uncomment the line below to test the function)
// searchSimilarArtists('Coldplay').then(displaySimilarArtists);
