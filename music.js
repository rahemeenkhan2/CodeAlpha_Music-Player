// ======================================
// MELODY MUSIC PLAYER
// ======================================

// Apni actual music aur image filenames yahan set karo.

const songs = [
    {
        title: "Night Changes",
        artist: "One Direction",
        album: "Chill Vibes",
        src: "song/night.mp3",
        cover: "images/images.webp"
    },
    {
        title: "Perfect",
        artist: "Ed Sheeran",
        album: "Love Songs",
        src: "song/perfect.mp3",
        cover: "images/ed.jpg"
    },
    {
        title: "Waka Waka",
        artist: "Shakira",
        album: "Feel Good",
        src: "song/waka.mp3",
        cover: "images/shakira.jpg"
    },
    {
        title: "Senorita",
        artist: "Shawn Mendes",
        album: "Chill Vibes",
        src: "song/senorita.mp3",
        cover: "images/sen.jpg"
    },
    {
        title: "Dreamers",
        artist: "Jung Kook",
        album: "Favorites",
        src: "song/dreamers.mp3",
        cover: "images/jk.jpg"
    }
];


// ======================================
// ELEMENTS
// ======================================

const audio = document.getElementById("audio");

const songList = document.getElementById("songList");
const songCount = document.getElementById("songCount");
const emptyMessage = document.getElementById("emptyMessage");

const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");

const bottomCover = document.getElementById("bottomCover");
const bottomTitle = document.getElementById("bottomTitle");
const bottomArtist = document.getElementById("bottomArtist");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const featuredPlay = document.getElementById("featuredPlay");
const featuredPlayIcon = document.getElementById("featuredPlayIcon");
const featuredPlayText = document.getElementById("featuredPlayText");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");

const playingStatus = document.getElementById("playingStatus");
const upNextList = document.getElementById("upNextList");

const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const favoriteBtn = document.getElementById("favoriteBtn");
const bottomFavorite = document.getElementById("bottomFavorite");


// ======================================
// PLAYER STATE
// ======================================

let currentIndex = 0;
let isShuffle = false;
let repeatMode = 0;
// Repeat modes: 0 = off, 1 = repeat playlist, 2 = repeat one

let isSeeking = false;
let favorites = new Set();


// ======================================
// HELPER FUNCTIONS
// ======================================

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${String(secs).padStart(2, "0")}`;
}


function setImage(img, src) {
    img.onerror = function () {
        this.onerror = null;
        this.src = "images/ed.jpg";
    };

    img.src = src || "images/ed.jpg";
}


// ======================================
// RENDER SONG LIST
// ======================================

function renderSongs() {
    songList.innerHTML = "";

    songCount.textContent =
        `${songs.length} ${songs.length === 1 ? "song" : "songs"}`;

    emptyMessage.hidden = songs.length > 0;

    songs.forEach((song, index) => {
        const row = document.createElement("div");

        row.className = "song-row";
        row.dataset.index = index;

        row.innerHTML = `
            <div>
                <span class="track-number">${String(index + 1).padStart(2, "0")}</span>
                <button class="row-play" aria-label="Play song">▶</button>
            </div>

            <div class="track-info">
                <img class="track-cover" alt="">
                <div class="track-text">
                    <h3></h3>
                    <p></p>
                </div>
            </div>

            <span class="track-album"></span>
            <span class="track-duration">--:--</span>

            <button class="row-favorite" aria-label="Favorite song">♡</button>
        `;

        const img = row.querySelector(".track-cover");
        setImage(img, song.cover);

        row.querySelector(".track-text h3").textContent = song.title;
        row.querySelector(".track-text p").textContent = song.artist;
        row.querySelector(".track-album").textContent = song.album;

        const playRow = row.querySelector(".row-play");
        playRow.addEventListener("click", () => playSong(index));

        row.querySelector(".track-info").addEventListener(
            "click",
            () => playSong(index)
        );

        const favButton = row.querySelector(".row-favorite");

        favButton.addEventListener("click", () => {
            toggleFavorite(index);
        });

        songList.appendChild(row);
    });

    updateSongRows();
    renderUpNext();
}


// ======================================
// UPDATE SONG HIGHLIGHT
// ======================================

function updateSongRows() {
    document.querySelectorAll(".song-row").forEach((row, index) => {
        const isCurrent = index === currentIndex;

        row.classList.toggle("current", isCurrent);

        const number = row.querySelector(".track-number");

        number.textContent = isCurrent
            ? "♫"
            : String(index + 1).padStart(2, "0");

        const fav = row.querySelector(".row-favorite");

        fav.classList.toggle("liked", favorites.has(index));
        fav.textContent = favorites.has(index) ? "♥" : "♡";
    });
}


// ======================================
// LOAD SONG
// ======================================

function loadSong(index) {
    if (!songs.length) return;

    currentIndex = (index + songs.length) % songs.length;

    const song = songs[currentIndex];

    audio.src = song.src;
    audio.load();

    title.textContent = song.title;
    artist.textContent = song.artist;

    bottomTitle.textContent = song.title;
    bottomArtist.textContent = song.artist;

    setImage(cover, song.cover);
    setImage(bottomCover, song.cover);

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    playingStatus.textContent = "READY TO PLAY";

    updateSongRows();
    updateFavoriteButtons();
    renderUpNext();
}


// ======================================
// PLAY / PAUSE
// ======================================

async function playSong(index = currentIndex) {
    if (!songs.length) return;

    if (index !== currentIndex) {
        loadSong(index);
    }

    try {
        await audio.play();
    } catch (error) {
        playingStatus.textContent = "UNABLE TO PLAY";
        console.error("Playback error:", error);

        alert(
            "Song play nahi ho saka. Music file ka path aur filename check karo."
        );
    }
}


function pauseSong() {
    audio.pause();
}


function togglePlay() {
    if (audio.paused) {
        playSong(currentIndex);
    } else {
        pauseSong();
    }
}


audio.addEventListener("play", () => {
    playBtn.textContent = "Ⅱ";
    playBtn.setAttribute("aria-label", "Pause");

    featuredPlayIcon.textContent = "Ⅱ";
    featuredPlayText.textContent = "Pause Music";

    playingStatus.textContent = "NOW PLAYING";

    document.body.classList.add("is-playing");
});


audio.addEventListener("pause", () => {
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play");

    featuredPlayIcon.textContent = "▶";
    featuredPlayText.textContent = "Play Music";

    document.body.classList.remove("is-playing");

    if (!audio.ended) {
        playingStatus.textContent = "PAUSED";
    }
});


// ======================================
// NEXT / PREVIOUS
// ======================================

function nextSong() {
    if (!songs.length) return;

    let nextIndex;

    if (isShuffle && songs.length > 1) {
        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === currentIndex);
    } else {
        nextIndex = (currentIndex + 1) % songs.length;
    }

    loadSong(nextIndex);
    playSong();
}


function prevSong() {
    if (!songs.length) return;

    // If the current song has played for over 3 seconds,
    // restart it instead of going to the previous track.
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    loadSong(currentIndex - 1);
    playSong();
}


playBtn.addEventListener("click", togglePlay);
featuredPlay.addEventListener("click", togglePlay);

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);


// ======================================
// PROGRESS BAR & DURATION
// ======================================

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});


audio.addEventListener("timeupdate", () => {
    if (!isSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }

    currentTime.textContent = formatTime(audio.currentTime);
});


progress.addEventListener("input", () => {
    isSeeking = true;

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        currentTime.textContent = formatTime(
            (Number(progress.value) / 100) * audio.duration
        );
    }
});


progress.addEventListener("change", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
            (Number(progress.value) / 100) * audio.duration;
    }

    isSeeking = false;
});


// ======================================
// AUTOPLAY NEXT SONG
// ======================================

audio.addEventListener("ended", () => {
    if (repeatMode === 2) {
        audio.currentTime = 0;
        playSong(currentIndex);
    } else if (repeatMode === 1 || currentIndex < songs.length - 1) {
        nextSong();
    } else {
        // Playlist finished: stop at the last song.
        progress.value = 100;
        playingStatus.textContent = "PLAYLIST FINISHED";
    }
});


// ======================================
// VOLUME
// ======================================

audio.volume = Number(volume.value);

volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
});


// ======================================
// SHUFFLE
// ======================================

shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;

    shuffleBtn.classList.toggle("selected", isShuffle);
    shuffleBtn.setAttribute("aria-pressed", String(isShuffle));
});


// ======================================
// REPEAT
// ======================================

repeatBtn.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;

    repeatBtn.classList.toggle("selected", repeatMode !== 0);

    repeatBtn.textContent = repeatMode === 2 ? "↻¹" : "↻";

    repeatBtn.title = [
        "Repeat off",
        "Repeat playlist",
        "Repeat current song"
    ][repeatMode];
});


// ======================================
// FAVORITES
// ======================================

function toggleFavorite(index) {
    if (favorites.has(index)) {
        favorites.delete(index);
    } else {
        favorites.add(index);
    }

    updateFavoriteButtons();
    updateSongRows();
}


function updateFavoriteButtons() {
    const liked = favorites.has(currentIndex);

    favoriteBtn.textContent = liked ? "♥" : "♡";
    bottomFavorite.textContent = liked ? "♥" : "♡";

    favoriteBtn.classList.toggle("liked", liked);
    bottomFavorite.classList.toggle("liked", liked);

    favoriteBtn.setAttribute("aria-pressed", String(liked));
}


favoriteBtn.addEventListener("click", () => {
    toggleFavorite(currentIndex);
});

bottomFavorite.addEventListener("click", () => {
    toggleFavorite(currentIndex);
});


// ======================================
// UP NEXT
// ======================================

function renderUpNext() {
    upNextList.innerHTML = "";

    if (!songs.length) return;

    for (let offset = 1; offset <= 2 && offset < songs.length; offset++) {
        const index = (currentIndex + offset) % songs.length;
        const song = songs[index];

        const item = document.createElement("div");
        item.className = "up-next-item";

        const img = document.createElement("img");
        img.alt = "";
        setImage(img, song.cover);

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = song.title;

        const singer = document.createElement("small");
        singer.textContent = song.artist;

        details.append(name, singer);

        const button = document.createElement("button");
        button.textContent = "▶";
        button.setAttribute("aria-label", `Play ${song.title}`);
        button.addEventListener("click", () => playSong(index));

        item.append(img, details, button);
        upNextList.appendChild(item);
    }
}


// ======================================
// AUDIO ERRORS
// ======================================

audio.addEventListener("error", () => {
    if (audio.currentSrc) {
        playingStatus.textContent = "AUDIO FILE ERROR";
        console.error("Could not load audio file:", audio.currentSrc);
    }
});


// ======================================
// INITIALIZE PLAYER
// ======================================

renderSongs();

if (songs.length > 0) {
    loadSong(0);
} else {
    title.textContent = "No songs found";
    artist.textContent = "Add songs to your playlist";
    emptyMessage.hidden = false;
}