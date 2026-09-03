// ---- أرشيف الأغاني ----
// لإضافة أغنية جديدة: حط الملف داخل assets/audio ثم أضف سطر هنا.
const songs = [
  { title: 'يا المدلل حلو رايق', sub: 'تراث البادية', file: 'assets/audio/song1.m4a' },
  { title: 'أغنية ٢', sub: 'الملف الأصلي: 16.mp4', file: 'assets/audio/song_02.mp4' },
  { title: 'أغنية ٣', sub: 'الملف الأصلي: song1.mp4', file: 'assets/audio/song_03.mp4' },
  { title: 'أغنية ٤', sub: 'الملف الأصلي: song2.mp4', file: 'assets/audio/song_04.mp4' },
  { title: 'أغنية ٥', sub: 'الملف الأصلي: song3.mp4', file: 'assets/audio/song_05.mp4' },
  { title: 'أغنية ٦', sub: 'الملف الأصلي: song8.mp4', file: 'assets/audio/song_06.mp4' },
  { title: 'أغنية ٧', sub: 'الملف الأصلي: song9.mp4', file: 'assets/audio/song_07.mp4' },
  { title: 'أغنية ٨', sub: 'الملف الأصلي: song10.mp4', file: 'assets/audio/song_08.mp4' },
  { title: 'أغنية ٩', sub: 'الملف الأصلي: song11.mp4', file: 'assets/audio/song_09.mp4' },
  { title: 'أغنية ١٠', sub: 'الملف الأصلي: song12.mp4', file: 'assets/audio/song_10.mp4' },
  { title: 'أغنية ١١', sub: 'الملف الأصلي: song13.mp4', file: 'assets/audio/song_11.mp4' },
  { title: 'أغنية ١٢', sub: 'الملف الأصلي: song14.mp4', file: 'assets/audio/song_12.mp4' },
  { title: 'أغنية ١٣', sub: 'الملف الأصلي: song15.mp4', file: 'assets/audio/song_13.mp4' },
  { title: 'أغنية ١٤', sub: 'الملف الأصلي: song17.mp4', file: 'assets/audio/song_14.mp4' },
  { title: 'أغنية ١٥', sub: 'الملف الأصلي: song18.mp4', file: 'assets/audio/song_15.mp4' },
  { title: 'أغنية ١٦', sub: 'الملف الأصلي: song20.mp4', file: 'assets/audio/song_16.mp4' },
  { title: 'أغنية ١٧', sub: 'الملف الأصلي: song23.mp4', file: 'assets/audio/song_17.mp4' },
];

// ---- Tabs ----
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ---- Audio player state ----
const audio = document.getElementById('audioPlayer');
const miniPlayer = document.getElementById('miniPlayer');
const mpPlayBtn = document.getElementById('mpPlayBtn');
const mpPlayIcon = document.getElementById('mpPlayIcon');
const mpPauseIcon = document.getElementById('mpPauseIcon');
const mpTitle = document.getElementById('mpTitle');
const mpBar = document.getElementById('mpBar');
const mpBarFill = document.getElementById('mpBarFill');
const mpCurrent = document.getElementById('mpCurrent');
const mpDuration = document.getElementById('mpDuration');
const songListEl = document.getElementById('songList');

let currentIndex = null;

function fmt(seconds){
  if (!isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

function renderSongs(){
  songListEl.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'song-item';
    item.id = `song-item-${index}`;
    item.innerHTML = `
      <span class="song-index">${index + 1}</span>
      <button class="song-play-btn" aria-label="تشغيل">
        <svg class="icon-play" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
        <svg class="icon-pause" viewBox="0 0 24 24" width="18" height="18" style="display:none"><path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
      </button>
      <div class="song-meta">
        <div class="song-title">${song.title}</div>
        <div class="song-sub">${song.sub}</div>
      </div>
    `;
    item.querySelector('.song-play-btn').addEventListener('click', () => playSong(index));
    songListEl.appendChild(item);
  });
}

function updateSongItemIcons(){
  songs.forEach((song, index) => {
    const item = document.getElementById(`song-item-${index}`);
    if (!item) return;
    const playIcon = item.querySelector('.icon-play');
    const pauseIcon = item.querySelector('.icon-pause');
    const isCurrent = index === currentIndex;
    item.classList.toggle('current', isCurrent);
    const playingThis = isCurrent && !audio.paused;
    playIcon.style.display = playingThis ? 'none' : 'block';
    pauseIcon.style.display = playingThis ? 'block' : 'none';
  });
}

function updateMiniPlayerIcon(){
  const playing = !audio.paused && currentIndex !== null;
  mpPlayIcon.style.display = playing ? 'none' : 'block';
  mpPauseIcon.style.display = playing ? 'block' : 'none';
}

function playSong(index){
  if (currentIndex !== index){
    currentIndex = index;
    audio.src = songs[index].file;
    audio.play();
    mpTitle.textContent = songs[index].title;
    miniPlayer.classList.add('visible');
  } else {
    if (audio.paused) audio.play(); else audio.pause();
  }
  updateSongItemIcons();
  updateMiniPlayerIcon();
}

mpPlayBtn.addEventListener('click', () => {
  if (currentIndex === null) return;
  if (audio.paused) audio.play(); else audio.pause();
});

audio.addEventListener('play', () => { updateSongItemIcons(); updateMiniPlayerIcon(); });
audio.addEventListener('pause', () => { updateSongItemIcons(); updateMiniPlayerIcon(); });

audio.addEventListener('timeupdate', () => {
  mpCurrent.textContent = fmt(audio.currentTime);
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  mpBarFill.style.width = `${pct}%`;
});

audio.addEventListener('loadedmetadata', () => {
  mpDuration.textContent = fmt(audio.duration);
});

audio.addEventListener('ended', () => {
  mpBarFill.style.width = '0%';
  mpCurrent.textContent = '0:00';
  updateSongItemIcons();
  updateMiniPlayerIcon();
});

mpBar.addEventListener('click', (e) => {
  if (!audio.duration) return;
  const rect = mpBar.getBoundingClientRect();
  // RTL: right edge = start
  const ratio = (rect.right - e.clientX) / rect.width;
  audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
});

renderSongs();
