// Last.fm API Key
const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

// --------------------
// MODAL
// --------------------
function openModal(name, bio) {
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-bio').textContent = bio;
    document.getElementById('artist-modal').style.display = 'block';
}

// close modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('artist-modal');

    document.querySelector('.close-btn').onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };
});

// --------------------
// SEARCH
// --------------------
function search() {
    const artist = document.getElementById('artist').value;
    if (!artist) return alert('Enter an artist name');

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="message">Loading...</div>';

    fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                resultsDiv.innerHTML = '<div class="message">Artist not found</div>';
                return;
            }

            const artists = data.similarartists.artist || [];
            resultsDiv.innerHTML = '';

            artists.slice(0, 12).forEach(a => {
                const img = a.image?.[2]?.['#text'] || '';

                // fetch bio for each artist
                fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(a.name)}&api_key=${API_KEY}&format=json`)
                    .then(res => res.json())
                    .then(info => {

                        let bio = "No description available";

                        if (info.artist?.bio?.summary) {
                            bio = info.artist.bio.summary
                                .replace(/<[^>]+>/g, '')
                                .slice(0, 120) + '...';
                        }

                        const card = document.createElement('div');
                        card.className = 'artist-card';

                        card.innerHTML = `
                            <img src="${img}">
                            <h3>${a.name}</h3>
                            <p>${Math.round(a.match * 100)}% match</p>
                        `;

                        card.onclick = () => openModal(a.name, bio);

                        resultsDiv.appendChild(card);
                    });
            });
        })
        .catch(err => {
            console.error(err);
            resultsDiv.innerHTML = '<div class="message">Error fetching data</div>';
        });
}

// --------------------
// ENTER KEY SUPPORT
// --------------------
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('artist').addEventListener('keypress', e => {
        if (e.key === 'Enter') search();
    });
});
