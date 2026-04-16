
// =====================
// API KEY (FIXED)
// =====================
const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

// =====================
// STATE
// =====================
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// =====================
// SAVE FAVORITES
// =====================
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// =====================
// BADGE (FIXED MISSING FUNCTION)
// =====================
function renderFavoritesBadge() {
    const el = document.getElementById("fav-count");
    if (el) el.textContent = favorites.length;
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
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector('.close-btn').onclick = () => {
        document.getElementById('artist-modal').style.display = 'none';
    };

    window.onclick = (e) => {
        if (e.target.id === "artist-modal") {
            document.getElementById('artist-modal').style.display = 'none';
        }
    };

    renderFavoritesBadge();
});

// =====================
// SPOTIFY LINK
// =====================
function openSpotify(name) {
    window.open(`https://open.spotify.com/search/${encodeURIComponent(name)}`, "_blank");
}

// =====================
// FAVORITES
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
// SEARCH
// =====================
function search() {
    const input = document.getElementById("artist").value;
    const results = document.getElementById("results");

    if (!input) return alert("Enter artist");

    results.innerHTML = "Loading...";

    fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(input)}&api_key=${API_KEY}&format=json`)
        .then(r => r.json())
        .then(data => {

            const artists = data.similarartists?.artist || [];
            results.innerHTML = "";

            artists.slice(0, 10).forEach(a => {

                const card = document.createElement("div");
                card.className = "artist-card";

                card.innerHTML = `
                    <img src="${a.image?.[2]?.['#text'] || ''}">
                    <div class="card-info">
                        <h3>${a.name}</h3>
                        <p>${Math.round(a.match * 100)}%</p>
                    </div>
                    <div class="card-actions">
                        <button class="spotify-btn">Spotify</button>
                        <button class="fav-btn">
                            ${favorites.includes(a.name) ? "❤️" : "🤍"}
                        </button>
                    </div>
                `;

                card.onclick = () => {
                    fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(a.name)}&api_key=${API_KEY}&format=json`)
                        .then(r => r.json())
                        .then(info => {

                            const bio =
                                info.artist?.bio?.summary?.replace(/<[^>]+>/g, '') ||
                                "No bio available";

                            openModal(a.name, bio);
                        });
                };

                card.querySelector(".spotify-btn").onclick = (e) => {
                    e.stopPropagation();
                    openSpotify(a.name);
                };

                card.querySelector(".fav-btn").onclick = (e) => {
                    e.stopPropagation();
                    toggleFavorite(a.name);
                    search();
                };

                results.appendChild(card);
            });
        })
        .catch(err => {
            console.error(err);
            results.innerHTML = "Error loading data";
        });
}

// =====================
// ENTER KEY
// =====================
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("artist").addEventListener("keypress", e => {
        if (e.key === "Enter") search();
    });
});
