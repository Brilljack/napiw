$( document ).ready(function() {
    
    var envelope = $('#envelope');
    var btn_open = $("#open");
    var btn_reset = $("#reset");
    
    
    envelope.click( function() {
        open();
    });
    btn_open.click( function() {
        open();
    });
    btn_reset.click( function() {
        close();
    });
    
    // Tambahkan event handler untuk tombol dalam surat
    $('.cute-button').click(function() {
        goToBirthdayPage();
    });

    function open() {
        envelope.addClass("open")
           .removeClass("close");
    }
    function close() {
        envelope.addClass("close")
           .removeClass("open");
    }
   
});

function goToBirthdayPage() {
    // Simpan status musik
    const audio = document.getElementById('music');
    localStorage.setItem('musicCurrentTime', audio.currentTime);
    localStorage.setItem('musicIsPlaying', !audio.paused);
    localStorage.setItem('musicVolume', audio.volume);
    
    // Ganti halaman
    document.getElementById('surat-page').classList.remove('active');
    document.getElementById('birthday-page').classList.add('active');
    
    // Mulai animasi birthday
    window.isAnimating = true;
    window.letters = []; // Reset letters array
    
    // Inisialisasi ulang letters
    for (let i = 0; i < opts.strings.length; ++i) {
        for (var j = 0; j < opts.strings[i].length; ++j) {
            window.letters.push(
                new Letter(
                    opts.strings[i][j],
                    j * opts.charSpacing +
                        opts.charSpacing / 2 -
                        (opts.strings[i].length * opts.charSize) / 2,
                    i * opts.lineHeight +
                        opts.lineHeight / 2 -
                        (opts.strings.length * opts.lineHeight) / 2
                )
            );
        }
    }
    
    // Mulai animasi
    anim();
    
    // Mulai hitung delay untuk next-btn
    setTimeout(() => {
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.style.display = 'flex';
        nextBtn.style.animation = 'fadeIn 1s ease forwards';
    }, 11000);
}