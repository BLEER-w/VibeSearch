<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VibeSearch</title>

<style>
/* =========================
   🌌 GALAXY BACKGROUND
========================= */
body {
    margin: 0;
    min-height: 100vh;
    overflow-x: hidden;
    font-family: 'Segoe UI', sans-serif;
    color: white;
    background: radial-gradient(circle at 20% 20%, #2a0a4a, transparent 40%),
                radial-gradient(circle at 80% 30%, #0a1b4a, transparent 40%),
                radial-gradient(circle at 50% 80%, #3b0a4a, transparent 40%),
                #05010a;
}

/* moving nebula */
body::before {
    content: "";
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at 30% 40%, rgba(124,58,237,0.25), transparent 40%),
                radial-gradient(circle at 70% 60%, rgba(0,212,255,0.15), transparent 45%);
    animation: drift 12s ease-in-out infinite alternate;
    z-index: -2;
}

/* stars */
body::after {
    content: "";
    position: fixed;
    inset: 0;
    background-image: radial-gradient(white 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.15;
    animation: starMove 60s linear infinite;
    z-index: -1;
}

@keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to { transform: translate(25px,-25px) scale(1.1); }
}

@keyframes starMove {
    from { transform: translateY(0); }
    to { transform: translateY(-200px); }
}

/* =========================
   HEADER
========================= */
.header {
    text-align: center;
    padding: 20px;
}

.header h1 {
    font-size: 2.5em;
    color: #00d4ff;
}

/* =========================
   SEARCH
========================= */
.search-section {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 20px;
    position: relative;
}

#artist {
    width: 300px;
    padding: 12px;
    border-radius: 25px;
    border: none;
    background: #1a003d;
    color: white;
}

button {
    padding: 12px 16px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
}

.search-btn { background:#7c3aed; color:white; }
.fav-btn-top { background:#ff4081; color:white; }

/* =========================
   RESULTS
========================= */
#results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
}

/* =========================
   CARD (Spotify style)
========================= */
.artist-card {
    background: #120022;
    border-radius: 14px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.3s;
    position: relative;
}

.artist-card:hover {
    transform: translateY(-6px) scale(1.02);
}

.artist-card img {
    width: 100%;
    height: 160px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.artist-card:hover img {
    transform: scale(1.05);
}

.card-info {
    padding: 10px;
}

.card-info h3 {
    color: #00d4ff;
    margin: 0;
}

/* buttons */
.card-actions {
    display:flex;
    justify-content: space-between;
    padding: 10px;
}

.spotify-btn {
    background:#1DB954;
    color:white;
}

.fav-btn {
    background:#ff4081;
    color:white;
}

/* =========================
   AUTOCOMPLETE
========================= */
#autocomplete-box {
    position:absolute;
    top:60px;
    background:#1a003d;
    width:300px;
    border-radius:10px;
    overflow:hidden;
    z-index:10;
}

.auto-item {
    padding:10px;
    cursor:pointer;
}

.auto-item:hover {
    background:#7c3aed;
}

/* =========================
   MODAL
========================= */
.modal {
    display:none;
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.8);
}

.modal-content {
    background:#1a003d;
    margin:10% auto;
    padding:20px;
    width:90%;
    max-width:500px;
    border-radius:10px;
}

.close-btn {
    float:right;
    cursor:pointer;
}
</style>
</head>

<body>

<div class="header">
    <h1>🎵 VibeSearch</h1>
</div>

<div class="search-section">
    <input id="artist" placeholder="Search artists...">
    <button class="search-btn" onclick="search()">Search</button>
    <button class="fav-btn-top" onclick="openFavoritesPage()">❤️</button>
</div>

<div id="results"></div>

<!-- MODAL -->
<div id="artist-modal" class="modal">
    <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h2 id="modal-name"></h2>
        <p id="modal-bio"></p>
    </div>
</div>

<script src="app.js"></script>
</body>
</html>
