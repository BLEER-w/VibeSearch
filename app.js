
// =====================
// API KEY
// =====================
const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

// =====================
// FAVORITES SYSTEM
// =====================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// =====================
// MODAL
// =====================
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

// =====================
// FAVORITE TOGGLE
// =====================
function toggleFavorite(name) {
    if (favorites.includes(name)) {
        favorites = favorites.filter(a => a !== name);
    } else {
        favorites.push(name);
    }
    saveFavorites();
    renderFavoritesBadge();
}

// check if favorite
function isFavorite(name) {
    return favorites.includes(name);
}

// optional UI indicator
function renderFavoritesBadge() {
    const badge = document.getElementById("fav-count");
    if (badge) badge.textContent = favorites.length;
}

// =====================
// SEARCH
// =====================
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

                fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(a.name)}&api_key=${API_KEY}&format=json`)
                    .then(res => res.json())
                    .then(info => {

                        let bio = "No description available";

                        if (info.artist?.bio?.summary) {
                            bio = info.artist.bio.summary
                                .replace(/<[^>]+>/g, '')
                                .slice(0, 120) + '...';
                        }

                        // =====================
                        // SPOTIFY STYLE CARD
                        // =====================
                        const card = document.createElement('div');
                        card.className = 'artist-card';

                        card.innerHTML = `
                            <div class="card-img-wrapper">
                                <img src="${img}">
                                <div class="overlay">▶</div>
                            </div>

                            <div class="card-info">
                                <h3>${a.name}</h3>
                                <p>${Math.round(a.match * 100)}% match</p>
                            </div>

                            <button class="fav-btn">
                                ${isFavorite(a.name) ? '❤️' : '🤍'}
                            </button>
                        `;

                        // click card = modal
                        card.onclick = (e) => {
                            if (e.target.classList.contains('fav-btn')) return;
                            openModal(a.name, bio);
                        };

                        // favorite button
                        card.querySelector('.fav-btn').onclick = (e) => {
                            e.stopPropagation();
                            toggleFavorite(a.name);
                            search(); // refresh UI
                        };

                        resultsDiv.appendChild(card);
                    });
            });
        });
}

// =====================
// ENTER KEY
// =====================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('artist').addEventListener('keypress', e => {
        if (e.key === 'Enter') search();
    });

    renderFavoritesBadge();
});
