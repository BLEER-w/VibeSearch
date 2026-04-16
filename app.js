
// =====================
// API KEYS
// =====================
const API_KEY = '3bd4b23b8db71c70de8380ebc7c4bccb';

// =====================
// STATE
// =====================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let searchCache = [];

// =====================
// SAVE FAVORITES
// =====================
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// =====================
// SPOTIFY SEARCH LINK
// =====================
function openSpotify(name) {
    const url = `https://open.spotify.com/search/${encodeURIComponent(name)}`;
    window.open(url, "_blank");
}

// =====================
// FAVORITES TOGGLE
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

// =====================
// FAVORITES PAGE
// =====================
function openFavoritesPage() {
    const results = document.getElementById("results");

    if (favorites.length === 0) {
        results.innerHTML = `<div class="message">No favorites yet ❤️</div>`;
        return;
    }

    results.innerHTML = `<h2 style="grid-column:1/-1;text-align:center;">❤️ Your Favorites</h2>`;

    favorites.forEach(name => {
        const card = document.createElement("div");
        card.className = "artist-card";
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="https://via.placeholder.com/300x300?text=${name}">
                <div class="overlay">▶</div>
            </div>
            <div class="card-info">
                <h3>${name}</h3>
            </div>
        `;

        card.onclick = () => openSpotify(name);

        results.appendChild(card);
    });
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
        if (e.target === modal) modal.style.display = 'none';
    };
});

// =====================
// AUTOCOMPLETE (Spotify-like)
// =====================
function setupAutocomplete() {
    const input = document.getElementById("artist");
    const box = document.createElement("div");
    box.id = "autocomplete-box";
    box.style.position = "absolute";
    box.style.background = "#1a1a2e";
    box.style.width = input.offsetWidth + "px";
    box.style.zIndex = "1000";

    input.parentNode.appendChild(box);

    input.addEventListener("input", async () => {
        const query = input.value;
        if (!query) return box.innerHTML = "";

        const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${query}&api_key=${API_KEY}&format=json`);
        const data = await res.json();

        const results = data.results.artistmatches.artist.slice(0, 5);

        box.innerHTML = results.map(a => `
            <div class="auto-item" onclick="selectArtist('${a.name}')">
                🎵 ${a.name}
            </div>
        `).join("");
    });
}

function selectArtist(name) {
    document.getElementById("artist").value = name;
    document.getElementById("autocomplete-box").innerHTML = "";
    search();
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

            const artists = data.similarartists.artist || [];
            resultsDiv.innerHTML = "";

            artists.slice(0, 12).forEach(a => {

                fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(a.name)}&api_key=${API_KEY}&format=json`)
                    .then(res => res.json())
                    .then(info => {

                        let bio = "No description available";

                        if (info.artist?.bio?.summary) {
                            bio = info.artist.bio.summary
                                .replace(/<[^>]+>/g, '')
                                .slice(0, 120) + "...";
                        }

                        const card = document.createElement("div");
                        card.className = "artist-card animate";

                        card.innerHTML = `
                            <div class="card-img-wrapper">
                                <img src="${a.image?.[2]?.['#text'] || ''}">
                                <div class="overlay">▶</div>
                            </div>

                            <div class="card-info">
                                <h3>${a.name}</h3>
                                <p>${Math.round(a.match * 100)}% match</p>
                            </div>

                            <div class="card-actions">
                                <button class="fav-btn">
                                    ${favorites.includes(a.name) ? "❤️" : "🤍"}
                                </button>
                                <button class="spotify-btn">Spotify</button>
                            </div>
                        `;

                        // modal
                        card.onclick = () => openModal(a.name, bio);

                        // favorite
                        card.querySelector(".fav-btn").onclick = (e) => {
                            e.stopPropagation();
                            toggleFavorite(a.name);
                            search();
                        };

                        // spotify
                        card.querySelector(".spotify-btn").onclick = (e) => {
                            e.stopPropagation();
                            openSpotify(a.name);
                        };

                        resultsDiv.appendChild(card);
                    });
            });
        });
}

// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('artist').addEventListener('keypress', e => {
        if (e.key === 'Enter') search();
    });

    setupAutocomplete();
    renderFavoritesBadge();
});
