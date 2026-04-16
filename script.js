const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb'; // Your Last.fm API key

async function searchSimilarArtists(artistName) {
    if (!artistName.trim()) {
        alert('Please enter an artist name');
        return;
    }

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p style="color: white;">Loading...</p>';

    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistName)}&api_key=${API_KEY}&format=json`;
        const response = await fetch(url);
        const data = await response.json();

        console.log('API Response:', data); // Debug log

        if (data.error) {
            resultsDiv.innerHTML = '<p style="color: white;">Artist not found. Try another search.</p>';
            return;
        }

        if (!data.similarartists || !data.similarartists.artist) {
            resultsDiv.innerHTML = '<p style="color: white;">No similar artists found.</p>';
            return;
        }

        displayArtists(data.similarartists.artist);
    } catch (error) {
        console.error('Error:', error);
        resultsDiv.innerHTML = '<p style="color: white;">Error fetching data. Please try again.</p>';
    }
}

function displayArtists(artists) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    artists.slice(0, 12).forEach(artist => {
        const card = document.createElement('div');
        card.className = 'artist-card';
        const img = artist.image && artist.image[2] ? artist.image[2]['#text'] : 'https://via.placeholder.com/200';

        card.innerHTML = `
            <img src="${img}" alt="${artist.name}" style="width: 150px; height: 150px; border-radius: 5px;" onerror="this.src='https://via.placeholder.com/200'">
            <h3 style="margin-top: 10px;">${artist.name}</h3>
            <p style="color: #1DB954;">Match: ${Math.round(artist.match * 100)}%</p>
        `;

        card.onclick = () => {
            document.getElementById('artist-search').value = artist.name;
            searchSimilarArtists(artist.name);
        };

        resultsDiv.appendChild(card);
    });
}

// **CRITICAL: Event listeners to make search work**
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded'); // Debug log
    
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('artist-search');

    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            const artistName = searchInput.value;
            console.log('Searching for:', artistName); // Debug log
            searchSimilarArtists(artistName);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const artistName = searchInput.value;
                console.log('Searching for:', artistName); // Debug log
                searchSimilarArtists(artistName);
            }
        });
    }
});
