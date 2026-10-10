const songList = document.getElementById("songList");
const songCount = document.getElementById("songCount");
const searchSong = document.getElementById("searchSong");
const audioPlayer = document.getElementById("audioPlayer");
const songTitle = document.getElementById("songTitle");
const emptyMessage = document.getElementById("emptyMessage");
const prevSong = document.getElementById("prevSong");
const nextSong = document.getElementById("nextSong");
const playPauseSong = document.getElementById("playPauseSong");


let songs = [];
let currentSongIndex = -1;

function playSong(index) {
  if (!songs.length) return;

  // Bari jerin waƙoƙi ya zagaya daga farko zuwa ƙarshe.
  currentSongIndex = (index + songs.length) % songs.length;

  const song = songs[currentSongIndex];

  audioPlayer.src = "songs/" + encodeURIComponent(song);
  songTitle.textContent = song.replace(/\.[^.]+$/, "");

  audioPlayer.play().catch(error => {
    console.error("Ba a iya kunna waƙar ba:", error);
    songTitle.textContent =
      "Ba a iya kunna waƙar ba. Gwada sake dannawa.";
  });

  displaySongs(searchSong.value, false);
}

function displaySongs(filter = "", updateCount = true) {
  songList.innerHTML = "";

  const query = filter.trim().toLowerCase();

  const filteredSongs = songs.filter(song =>
    song.toLowerCase().includes(query)
  );

  if (updateCount) {
    songCount.textContent =
      `An samo waƙoƙi ${filteredSongs.length} cikin ${songs.length}`;
  }

  emptyMessage.hidden = filteredSongs.length !== 0;

  filteredSongs.forEach(song => {
    const li = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "song-button";
    button.textContent =
      (songs[currentSongIndex] === song ? "🔊 " : "▶ ") +
      song.replace(/\.[^.]+$/, "");

    button.addEventListener("click", () => {
      const index = songs.indexOf(song);
      playSong(index);
    });

    li.appendChild(button);
    songList.appendChild(li);
  });
}

async function loadSongs() {
  try {
    const response = await fetch("songs.json");

    if (!response.ok) {
      throw new Error("An kasa karanta jerin waƙoƙi");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Tsarin songs.json bai dace ba");
    }

    songs = data.filter(song => typeof song === "string");

    displaySongs(searchSong.value);

    if (!songs.length) {
      songCount.textContent = "Babu waƙoƙi a cikin jerin.";
    }
  } catch (error) {
    console.error(error);
    songCount.textContent = "An samu matsala wajen loda waƙoƙi.";
    emptyMessage.hidden = false;
    emptyMessage.textContent =
      "Tabbatar cewa fayil ɗin songs.json yana cikin www.";
  }
}

prevSong.addEventListener("click", () => {
  if (currentSongIndex === -1) {
    playSong(songs.length - 1);
  } else {
    playSong(currentSongIndex - 1);
  }
});

nextSong.addEventListener("click", () => {
  playSong(currentSongIndex + 1);
});


// Maɓallin Play/Pause
playPauseSong.addEventListener("click", () => {
  if (!songs.length) return;

  if (currentSongIndex === -1) {
    playSong(0);
  } else if (audioPlayer.paused) {
    audioPlayer.play().catch(error => {
      console.error("Ba a iya ci gaba da kunna waƙar ba:", error);
    });
  } else {
    audioPlayer.pause();
  }
});

// Idan waƙa ta ƙare, kunna waƙa ta gaba.
audioPlayer.addEventListener("ended", () => {
  if (songs.length) {
    playSong(currentSongIndex + 1);
  }
});

searchSong.addEventListener("input", () => {
  displaySongs(searchSong.value);
});

loadSongs();
