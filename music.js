document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('music');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const timeNow = document.querySelector('.time_now');
    const timeFull = document.querySelector('.time_full');
    const elapsed = document.querySelector('.elapsed');
    const playerContainer = document.querySelector('.card');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeIcon = document.querySelector('.volume-icon');
    const volumeIconMuted = document.querySelector('.volume-icon-muted');

    volumeSlider.style.setProperty('--volume-percentage', '100%');

    // Inisialisasi awal
    timeNow.textContent = '0:00';
    elapsed.style.width = '0%';

    // Format waktu ke MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Fungsi untuk update progress
    function updateProgress(currentTime, duration) {
        const progress = (currentTime / duration) * 100;
        elapsed.style.width = `${progress}%`;
        timeNow.textContent = formatTime(currentTime);
        timeFull.textContent = formatTime(duration);
    }

    // Update progress bar dan waktu
    audio.addEventListener('loadedmetadata', function() {
        // Update progress segera setelah metadata dimuat
        updateProgress(lastTime, audio.duration);
        
        // Autoplay hanya untuk halaman pertama
        if (isFirstPage) {
            audio.play().then(() => {
                updateUIState(true);
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    });

    // Update saat timeupdate
    audio.addEventListener('timeupdate', function() {
        updateProgress(audio.currentTime, audio.duration);
    });

    // Tambahkan fungsi untuk update UI
    function updateUIState(isPlaying) {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playerContainer.classList.add('is-playing');
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playerContainer.classList.remove('is-playing');
        }
    }

    // Tambahkan event listener untuk 'playing'
    audio.addEventListener('playing', function() {
        updateUIState(true);
    });

    // Tambahkan event listener untuk 'pause'
    audio.addEventListener('pause', function() {
        updateUIState(false);
    });

    // Cek status awal audio
    if (!audio.paused) {
        updateUIState(true);
    }

    // Update event listener play/pause yang ada
    playPauseBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().then(() => {
                updateUIState(true);
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        } else {
            audio.pause();
            updateUIState(false);
        }
    });

    // Tambahkan juga untuk menangani kasus ketika lagu selesai
    audio.addEventListener('ended', function() {
        playerContainer.classList.remove('is-playing');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    });

    // Tambahkan ini di bagian awal event listener DOMContentLoaded
    audio.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    audio.addEventListener('play', function(e) {
        e.stopPropagation();
        e.preventDefault();
        audio.controls = false;
    });

    // Tambahkan ini setelah deklarasi variabel di awal
    audio.controls = false;

    // Tambahkan event listener baru
    audio.addEventListener('loadeddata', function() {
        audio.controls = false;
    });

    // Update volume slider
    volumeSlider.addEventListener('input', function() {
        const volume = this.value / 100;
        audio.volume = volume;
        
        // Update slider track color
        this.style.setProperty('--volume-percentage', `${this.value}%`);
        
        // Update icons
        if (volume === 0) {
            volumeIcon.style.display = 'none';
            volumeIconMuted.style.display = 'block';
        } else {
            volumeIcon.style.display = 'block';
            volumeIconMuted.style.display = 'none';
        }
    });

    // Toggle mute dengan icon
    volumeIcon.addEventListener('click', function() {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeSlider.value = 0;
            volumeSlider.style.setProperty('--volume-percentage', '0%');
            volumeIcon.style.display = 'none';
            volumeIconMuted.style.display = 'block';
        }
    });

    volumeIconMuted.addEventListener('click', function() {
        audio.volume = 1;
        volumeSlider.value = 100;
        volumeSlider.style.setProperty('--volume-percentage', '100%');
        volumeIcon.style.display = 'block';
        volumeIconMuted.style.display = 'none';
    });

    // Tambahkan ini setelah deklarasi variabel
    audio.addEventListener('autoplay', function() {
        updateUIState(true);
    });

    // Tambahkan event listener untuk error
    audio.addEventListener('error', function(e) {
        console.error('Error with audio:', e);
        updateUIState(false);
    });

    // Tambahkan event listener untuk menyimpan waktu saat akan meninggalkan halaman
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('musicCurrentTime', audio.currentTime);
        localStorage.setItem('musicIsPlaying', !audio.paused);
        localStorage.setItem('musicVolume', audio.volume);
        localStorage.setItem('musicDuration', audio.duration);
        localStorage.setItem('musicProgress', (audio.currentTime / audio.duration) * 100);
    });

    // Cek apakah ini halaman pertama (mesinketik.html)
    const isFirstPage = window.location.pathname.includes('mesinketik.html');
    
    // Ambil posisi waktu dan status terakhir
    const lastTime = isFirstPage ? 0 : (parseFloat(localStorage.getItem('musicCurrentTime')) || 0);
    const wasPlaying = isFirstPage ? true : (localStorage.getItem('musicIsPlaying') === 'true');
    const lastVolume = parseFloat(localStorage.getItem('musicVolume')) || 1;
    
    // Set volume
    audio.volume = lastVolume;
    volumeSlider.value = lastVolume * 100;
    volumeSlider.style.setProperty('--volume-percentage', `${lastVolume * 100}%`);
    
    // Update icon volume
    if (lastVolume === 0) {
        volumeIcon.style.display = 'none';
        volumeIconMuted.style.display = 'block';
    } else {
        volumeIcon.style.display = 'block';
        volumeIconMuted.style.display = 'none';
    }

    // Set waktu pemutaran
    audio.currentTime = lastTime;
    
    // Update progress bar dan waktu
    audio.addEventListener('loadedmetadata', function() {
        if (isFirstPage) {
            audio.play().then(() => {
                updateUIState(true);
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    });
    
    // Update UI sesuai status
    if (!isFirstPage) {
        if (wasPlaying) {
            audio.play().then(() => {
                updateUIState(true);
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        } else {
            updateUIState(false);
            audio.pause();
            // Update progress untuk status pause
            audio.addEventListener('loadedmetadata', function() {
                updateProgress(lastTime, audio.duration);
            }, { once: true });
        }
    }

    // Reset musik saat memulai dari awal (loading.html)
    if (document.referrer.includes('loading.html')) {
        localStorage.removeItem('musicCurrentTime');
        localStorage.removeItem('musicIsPlaying');
        audio.currentTime = 0;
        if (isFirstPage) {
            audio.play().then(() => {
                updateUIState(true);
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    }

    // Tambahkan event listener untuk tombol next
    document.querySelector('.next-button').addEventListener('click', function(e) {
        // Simpan status musik
        localStorage.setItem('musicCurrentTime', audio.currentTime);
        localStorage.setItem('musicIsPlaying', !audio.paused);
        localStorage.setItem('musicVolume', audio.volume);
        
        // Ganti halaman ke surat-page
        document.getElementById('mesinketik-page').classList.remove('active');
        document.getElementById('surat-page').classList.add('active');
    });

    // Di bagian awal DOMContentLoaded, tambahkan:
    const lastProgress = parseFloat(localStorage.getItem('musicProgress')) || 0;
    const lastDuration = parseFloat(localStorage.getItem('musicDuration')) || 0;

    // Update progress bar dan waktu segera
    elapsed.style.width = `${lastProgress}%`;
    timeNow.textContent = formatTime(lastTime);
    timeFull.textContent = formatTime(lastDuration);

    // Modifikasi bagian autoplay
    const isFirstLoad = !localStorage.getItem('musicCurrentTime');

    if (isFirstLoad) {
        audio.play().then(() => {
            updateUIState(true);
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    } else {
        const lastTime = parseFloat(localStorage.getItem('musicCurrentTime')) || 0;
        const wasPlaying = localStorage.getItem('musicIsPlaying') === 'true';
        
        audio.currentTime = lastTime;
        if (wasPlaying) {
            audio.play().then(() => {
                updateUIState(true);
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    }
});