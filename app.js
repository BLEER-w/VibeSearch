const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

const SPOTIFY_CLIENT_ID = "d1d9a544e07a4dd999fe4cd3dbf26ebd";
const SPOTIFY_CLIENT_SECRET = "0d05c8793cb846e3a8a17519269458dd";

let spotifyToken = null;
let currentAudio = null;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/* =====================
   SPOTIFY AUTH
===================== */
async function getSpotifyToken() {
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)
        },
        body: "grant_type=client_credentials"
    });

    const data = await res.json();
    spotifyToken = data.access_token;
}

async function getSpotifyArtistImage(name) {
    if (!spotifyToken) await getSpotifyToken();

    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(name)}&type=artist&limit=1`, {
        headers: { "Authorization": "Bearer " + spotifyToken }
    });

    const data = await res.json();
    return data.artists?.items?.[0]?.images?.[0]?.url || null;
}

/* =====================
   HELPERS
===================== */
function saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}
async function getTopTrack(artistName) {
    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=song&limit=1`);
        const data = await res.json();

        const track = data.results?.[0];
        if (!track) return null;

        return {
            name: track.trackName,
            preview: track.previewUrl
        };
    } catch {
        return null;
    }
}

function getArtistImage(a) {
    const img =
        a.image?.[3]?.['#text'] ||
        a.image?.[2]?.['#text'] ||
        a.image?.[1]?.['#text'];

    if (img && img.trim() !== "") return img;

    // fallback (always works)
    return `https://placehold.co/300x300/1a003d/ffffff?text=${encodeURIComponent(a.name)}`;
}

function openSpotify(name) {
    window.open(`https://open.spotify.com/search/${encodeURIComponent(name)}`, "_blank");
}

/* =====================
   FAVORITES
===================== */
function toggleFavorite(name, image) {
    const exists = favorites.find(a => a.name === name);

    if (exists) {
        favorites = favorites.filter(a => a.name !== name);
    } else {
        favorites.push({ name, image });
    }

    saveFavorites();
}

function openFavoritesPage() {
    const results = document.getElementById("results");
    results.innerHTML = "";

    if (favorites.length === 0) {
        results.innerHTML = "<p>No favorites yet ❤️</p>";
        return;
    }

    favorites.forEach(a => {
        const card = document.createElement("div");
        card.className = "artist-card";

        card.innerHTML = `
            <img src="${a.image}">
            <div class="card-info"><h3>${a.name}</h3></div>
        `;

        card.onclick = () => openSpotify(a.name);
        results.appendChild(card);
    });
}

/* =====================
   SEARCH
===================== */
async function search() {
    const input = document.getElementById("artist").value;
    const results = document.getElementById("results");

    if (!input) return;

    results.innerHTML = "Loading...";

    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(input)}&api_key=${API_KEY}&format=json`);
    const data = await res.json();

    const artists = data.similarartists?.artist || [];
    results.innerHTML = "";

    for (const a of artists.slice(0, 12)) {
        const img = getArtistImage(a);
        const card = document.createElement("div");
        card.className = "artist-card";

        card.innerHTML = `
            <img src="${img}">
            <div class="card-info">
                <h3>${a.name}</h3>
                <p>${Math.round(a.match * 100)}%</p>
            </div>
            <div class="card-actions">
                <button class="spotify-btn">Spotify</button>
                <button class="fav-btn">
                    ${favorites.some(f => f.name === a.name) ? "❤️" : "🤍"}
                </button>
            </div>
        `;

        card.onclick = () => openSpotify(a.name);

        card.querySelector(".spotify-btn").onclick = (e) => {
            e.stopPropagation();
            openSpotify(a.name);
        };

        card.querySelector(".fav-btn").onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(a.name, img);
            search();
        };

        results.appendChild(card);
    }
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("artist").addEventListener("keypress", e => {
        if (e.key === "Enter") search();
    });
});
