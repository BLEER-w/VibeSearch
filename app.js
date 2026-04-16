const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function renderFavoritesBadge() {
    const el = document.getElementById("fav-count");
    if (el) el.textContent = favorites.length;
}

/* =====================
   IMAGE FIX (IMPORTANT)
===================== */
function getArtistImage(a) {
    const img =
        a.image?.[3]?.['#text'] ||
        a.image?.[2]?.['#text'] ||
        a.image?.[1]?.['#text'];

    if (img && img.length > 0) return img;

    return `https://placehold.co/300x300/1a003d/ffffff?text=${encodeURIComponent(a.name)}`;
}

/* =====================
   MODAL
===================== */
function openModal(name, bio) {
    document.getElementById('modal-name').textContent = name;
    document.getElementById('modal-bio').textContent = bio;
    document.getElementById('artist-modal').style.display = 'block';
}

/* =====================
   SPOTIFY LINK
===================== */
function openSpotify(name) {
    window.open(`https://open.spotify.com/search/${encodeURIComponent(name)}`, "_blank");
}

/* =====================
   FAVORITES PAGE
===================== */
function openFavoritesPage() {
    const results = document.getElementById("results");

    if (favorites.length === 0) {
        results.innerHTML = "<p style='text-align:center'>No favorites yet ❤️</p>";
        return;
    }

    results.innerHTML = "";

    favorites.forEach(name => {
        const card = document.createElement("div");
        card.className = "artist-card";
        card.innerHTML = `
            <img src="https://placehold.co/300x300/1a003d/fff?text=${name}">
            <div class="card-info"><h3>${name}</h3></div>
        `;

        card.onclick = () => openSpotify(name);
        results.appendChild(card);
    });
}

/* =====================
   FAVORITE TOGGLE
===================== */
function toggleFavorite(name) {
    if (favorites.includes(name)) {
        favorites = favorites.filter(a => a !== name);
    } else {
        favorites.push(name);
    }
    saveFavorites();
    renderFavoritesBadge();
}

/* =====================
   SEARCH
===================== */
function search() {
    const input = document.getElementById("artist").value;
    const results = document.getElementById("results");

    if (!input) return;

    results.innerHTML = "Loading...";

    fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(input)}&api_key=${API_KEY}&format=json`)
        .then(r => r.json())
        .then(data => {

            const artists = data.similarartists?.artist || [];
            results.innerHTML = "";

            artists.slice(0, 12).forEach(a => {

                const card = document.createElement("div");
                card.className = "artist-card";

                card.innerHTML = `
                    <img src="${getArtistImage(a)}">
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
        });
}

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("artist").addEventListener("keypress", e => {
        if (e.key === "Enter") search();
    });

    document.querySelector(".close-btn").onclick = () => {
        document.getElementById("artist-modal").style.display = "none";
    };

    window.onclick = (e) => {
        if (e.target.id === "artist-modal") {
            document.getElementById("artist-modal").style.display = "none";
        }
    };

    renderFavoritesBadge();
});
