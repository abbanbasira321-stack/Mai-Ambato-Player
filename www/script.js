const songList = document.getElementById("songList");
const songCount = document.getElementById("songCount");
const searchSong = document.getElementById("searchSong");
const audioPlayer = document.getElementById("audioPlayer");
const songTitle = document.getElementById("songTitle");
const emptyMessage = document.getElementById("emptyMessage");

let songs = [];

function displaySongs(filter = "") {
  songList.innerHTML = "";

  const query = filter.trim().toLowerCase();

  const filteredSongs = songs.filter(song =>
    song.toLowerCase().includes(query)
  );

  songCount.textContent =
    `An samo waƙoƙi ${filteredSongs.length} cikin ${songs.length}`;

  emptyMessage.hidden = filteredSongs.length !== 0;

  filteredSongs.forEach(song => {
    const li = document.createElement("li");
    const button = document.createElement("button");

    button.type = "button";
    button.className = "song-button";
    button.textContent = "▶ " + song.replace(/\.[^.]+$/, "");

    button.addEventListener("click", () => {
      audioPlayer.src = "songs/" + encodeURIComponent(song);
      songTitle.textContent = song.replace(/\.[^.]+$/, "");

      audioPlayer.play().catch(error => {
        console.error("Ba a iya kunna waƙar ba:", error);
        songTitle.textContent = "Ba a iya kunna waƙar ba. Sake gwadawa.";
      });
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

    songs = await response.json();
    displaySongs();
  } catch (error) {
    console.error(error);
    songCount.textContent = "An samu matsala wajen loda waƙoƙi.";
    emptyMessage.hidden = false;
    emptyMessage.textContent =
      "Tabbatar cewa fayil ɗin songs.json yana cikin www.";
  }
}

searchSong.addEventListener("input", () => {
  displaySongs(searchSong.value);
});

loadSongs();
