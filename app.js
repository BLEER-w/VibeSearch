const API_KEY = '3bd4b23b8db71c70de8380ebc7f4bccb';

const SPOTIFY_CLIENT_ID = "d1d9a544e07a4dd999fe4cd3dbf26ebd";
const SPOTIFY_CLIENT_SECRET = "0d05c8793cb846e3a8a17519269458dd";
const YOUTUBE_API_KEY = "AIzaSyAZ2twXaUCGHKvSGVVhEdy57dbUGVIswsY";

let spotifyToken = null;
let currentAudio = null;
let allArtists = [];
let visibleCount = 12;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/* ================= SPOTIFY ================= */
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

/* ================= HELPERS ================= */
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

    if (img && img.trim()) return img;

    return null;
}

/* ================= YOUTUBE ================= */
async function getYouTubeVideoId(artist, song) {
    const query = encodeURIComponent(`${artist} ${song} official music video`);

    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1`
    );

    const data = await res.json();
    return data.items?.[0]?.id?.videoId || null;
}

/* ================= SPOTIFY ================= */
function openSpotify(name) {
    window.open(`https://open.spotify.com/search/${encodeURIComponent(name)}`, "_blank");
}

/* ================= FAVORITES ================= */
function toggleFavorite(name) {
    const exists = favorites.find(f => f.name === name);

    if (exists) {
        favorites = favorites.filter(f => f.name !== name);
    } else {
        favorites.push({ name });
    }

    saveFavorites();
}
function renderShowMoreButton() {
    const results = document.getElementById("results");

    // remove old button if exists
    const oldBtn = document.getElementById("show-more");
    if (oldBtn) oldBtn.remove();

    if (visibleCount >= allArtists.length) return;

    const btn = document.createElement("button");
    btn.id = "show-more";
    btn.textContent = "Show More";
    btn.className = "search-btn";
    btn.style.gridColumn = "1 / -1"; // full width

    btn.onclick = () => {
        visibleCount += 12;
        renderArtists();
    };

    results.appendChild(btn);
}

function openFavoritesPage() {
    const results = document.getElementById("results");
    results.innerHTML = "";

    favorites.forEach(a => {
        const card = document.createElement("div");
        card.className = "artist-card";

        card.innerHTML = `<div class="card-info"><h3>${a.name}</h3></div>`;
        card.onclick = () => openSpotify(a.name);

        results.appendChild(card);
    });
}
function openAbout() {
    let modal = document.getElementById("about-modal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "about-modal";
        modal.className = "about-modal";

        modal.innerHTML = `
            <div class="about-content">
                <h2>🎵 About VibeSearch</h2>
                <p>
                    VibeSearch lets you discover artists similar to your favorites.
                </p>

                <p>
                    🔎 Search any artist<br>
                    🎧 Listen to song previews<br>
                    🎬 Watch music videos<br>
                    ❤️ Save favorites<br>
                    🎵 Open Spotify pages
                </p>

                <button onclick="closeAbout()" class="search-btn">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    modal.style.display = "block";
}

function closeAbout() {
    const modal = document.getElementById("about-modal");
    if (modal) modal.style.display = "none";
}

/* ================= SEARCH ================= */
async function search() {
    const input = document.getElementById("artist").value;
    const results = document.getElementById("results");

    if (!input) return;

    results.innerHTML = "Loading...";

    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(input)}&api_key=${API_KEY}&format=json`);
    const data = await res.json();

    allArtists = data.similarartists?.artist || [];
    visibleCount = 12;

    results.innerHTML = "";
    renderArtists();
        async function renderArtists() {
    const results = document.getElementById("results");

    results.innerHTML = "";

    for (const a of allArtists.slice(0, visibleCount)) {

        const track = await getTopTrack(a.name);

        const card = document.createElement("div");
        card.className = "artist-card";

        card.innerHTML = `
            <div class="card-info">
                <h3>${a.name}</h3>

                ${track ? `
                    <p class="track-name">${track.name}</p>
                    <button class="video-btn">Watch Video</button>
                    <div class="video-container" style="display:none;"></div>
                ` : ""}
            </div>

            <div class="card-actions">
                <button class="spotify-btn">Spotify</button>
                <button class="fav-btn">${favorites.some(f => f.name === a.name) ? "❤️" : "🤍"}</button>
                ${track?.preview ? `<button class="play-btn">▶️</button>` : ""}
            </div>
        `;

        // (keep ALL your existing event listeners here exactly the same)

        results.appendChild(card);
    }

    renderShowMoreButton();
}

        const track = await getTopTrack(a.name);

        const card = document.createElement("div");
        card.className = "artist-card";

        card.innerHTML = `
            <div class="card-info">
                <h3>${a.name}</h3>

                ${track ? `
                    <p class="track-name">${track.name}</p>
                    <button class="video-btn">Watch Video</button>
                    <div class="video-container" style="display:none;"></div>
                ` : ""}
            </div>

            <div class="card-actions">
                <button class="spotify-btn">Spotify</button>
                <button class="fav-btn">${favorites.some(f => f.name === a.name) ? "❤️" : "🤍"}</button>
                ${track?.preview ? `<button class="play-btn">▶️</button>` : ""}
            </div>
        `;

        /* VIDEO */
        const videoBtn = card.querySelector(".video-btn");
        const container = card.querySelector(".video-container");

        if (videoBtn && container && track) {
            videoBtn.onclick = async (e) => {
                e.stopPropagation();

                container.innerHTML = "Loading...";

                const videoId = await getYouTubeVideoId(a.name, track.name);

                if (!videoId) {
                    container.innerHTML = "No video found";
                    return;
                }

                container.innerHTML = `
                    <iframe width="100%" height="200"
                        src="https://www.youtube.com/embed/${videoId}"
                        allowfullscreen>
                    </iframe>
                `;

                container.style.display = "block";
            };
        }

        /* BUTTONS */
        card.querySelector(".spotify-btn").onclick = (e) => {
            e.stopPropagation();
            openSpotify(a.name);
        };

        card.querySelector(".fav-btn").onclick = (e) => {
            e.stopPropagation();
            toggleFavorite(a.name);
            search();
        };

        /* AUDIO */
        if (track?.preview) {
            const playBtn = card.querySelector(".play-btn");

            playBtn.onclick = (e) => {
                e.stopPropagation();

                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio = null;
                    document.querySelectorAll(".play-btn").forEach(b => b.textContent = "▶️");
                }

                const audio = new Audio(track.preview);
                audio.play();
                currentAudio = audio;
                playBtn.textContent = "⏸️";

                audio.onended = () => {
                    playBtn.textContent = "▶️";
                    currentAudio = null;
                };
            };
        }

        results.appendChild(card);
    }


/* INIT */
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("artist").addEventListener("keypress", e => {
        if (e.key === "Enter") search();
    });
});
