// Last.fm API Key
const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

// ✅ Modal function (MOVE OUTSIDE)
function openModal(name, bio) {
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-bio').textContent = bio;
    document.getElementById('artist-modal').style.display = 'block';
}

// Search function
function handleSearch() {
    const artistInput = document.getElementById('artist-input').value;

    if (!artistInput) {
        alert('Please enter an artist name.');
        return;
    }

    const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistInput)}&api_key=${API_KEY}&format=json`;

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

// ✅ UPDATED display function (THIS is the big change)
function displayArtists(artists) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    artists.slice(0, 12).forEach(a => {
        const img = a.image[2] ? a.image[2]['#text'] : '';

        // fetch bio
        fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(a.name)}&api_key=${API_KEY}&format=json`)
            .then(res => res.json())
            .then(infoData => {
                let bio = "No description available";

                if (infoData.artist && infoData.artist.bio && infoData.artist.bio.summary) {
                    bio = infoData.artist.bio.summary
                        .replace(/<[^>]+>/g, '')
                        .slice(0, 120) + '...';
                }

                const card = `
                    <div class="artist-card" onclick="openModal('${a.name.replace(/'/g, "\\'")}', \`${bio.replace(/`/g, "")}\`)">
                        <img src="${img}">
                        <h3>${a.name}</h3>
                        <p>${Math.round(a.match * 100)}% match</p>
                        <p class="artist-description">${bio}</p>
                    </div>
                `;

                resultsDiv.innerHTML += card;
            });
    });
}

// Event listeners
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    handleSearch();
});

document.getElementById('search-button').addEventListener('click', handleSearch);

// Modal close
document.querySelector('.close-btn').onclick = () => {
    document.getElementById('artist-modal').style.display = 'none';
};

window.onclick = (e) => {
    const modal = document.getElementById('artist-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};
