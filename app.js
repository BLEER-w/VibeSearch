// =====================
// API KEY (FIXED)
// =====================
const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

// =====================
// FAVORITES
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

// =====================
// SPOTIFY LINK
// =====================
function openSpotify(name) {
    window.open(`https://open.spotify.com/search/${encodeURIComponent(name)}`, "_blank");
}

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
}

// =====================
// SEARCH
// =====================
function search() {
    const input = document.getElementById('artist');
    const results = document.getElementById('results');

    if (!input.value) return alert("Enter artist");

    results.innerHTML = "Loading...";

    fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(input.value)}&api_key=${API_KEY}&format=json`)
        .then(r => r.json())
        .then(data => {

            results.innerHTML = "";

            const artists = data.similarartists?.artist || [];

            artists.slice(0, 10).forEach(a => {

                const card = document.createElement("div");
                card.className = "artist-card";

                card.innerHTML = `
                    <img src="${a.image?.[2]?.['#text'] || ''}">
                    <h3>${a.name}</h3>
                    <p>${Math.round(a.match * 100)}%</p>

                    <button onclick="event.stopPropagation(); openSpotify('${a.name}')">
                        Spotify
                    </button>

                    <button onclick="event.stopPropagation(); toggleFavorite('${a.name}')">
                        ${favorites.includes(a.name) ? "❤️" : "🤍"}
                    </button>
                `;

                card.onclick = () => {
                    fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(a.name)}&api_key=${API_KEY}&format=json`)
                        .then(r => r.json())
                        .then(info => {
                            const bio = info.artist?.bio?.summary?.replace(/<[^>]+>/g, '') || "No bio";
                            openModal(a.name, bio);
                        });
                };

                results.appendChild(card);
            });
        })
        .catch(() => {
            results.innerHTML = "Error loading data";
        });
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {

    document.getElementById('artist').addEventListener('keypress', e => {
        if (e.key === 'Enter') search();
    });

    document.querySelector('.close-btn').onclick = () => {
        document.getElementById('artist-modal').style.display = 'none';
    };

    window.onclick = (e) => {
        if (e.target.id === 'artist-modal') {
            document.getElementById('artist-modal').style.display = 'none';
        }
    };
});
