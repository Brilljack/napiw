document.addEventListener('DOMContentLoaded', function() {
  const nextBtn = document.getElementById('nextBtn');
  
  // Sembunyikan tombol next di awal
  nextBtn.style.display = 'none';
  
  const photoContainer = document.createElement('div');
  photoContainer.className = 'photo-balloon hide';
  
  const balloonsContainer = document.createElement('div');
  balloonsContainer.className = 'balloons-container';
  
  // Warna-warna balon yang cerah
  const balloonColors = [
    { primary: '#FF6B6B', secondary: '#FF92A5' },
    { primary: '#4ECDC4', secondary: '#45B7AF' },
    { primary: '#FFD93D', secondary: '#FFC107' },
    { primary: '#FF8EDC', secondary: '#FF5CAD' },
    { primary: '#6C63FF', secondary: '#574AE2' }
  ];
  
  // Buat 5 balon dengan properti yang berbeda
  for(let i = 0; i < 5; i++) {
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    
    // Tambahkan style untuk gradient dan animasi yang unik
    balloon.style.background = `linear-gradient(135deg, ${balloonColors[i].primary}, ${balloonColors[i].secondary})`;
    balloon.style.animation = `floatBalloon${i+1} ${5.5 + (Math.random() * 1)}s ease-in-out infinite ${Math.random() * 1.5}s`;
    
    // Tambahkan transformasi awal yang random
    balloon.style.transform = `rotate(${(Math.random() - 0.5) * 5}deg)`;
    
    balloonsContainer.appendChild(balloon);
  }
  
  const photoFrame = document.createElement('div');
  photoFrame.className = 'photo-frame';
  
  const photo = document.createElement('img');
  photo.src = "Foto.jpg";
  photo.alt = "Special Photo";
  
  const caption = document.createElement('div');
  caption.className = 'photo-caption';
  caption.textContent = '💕 The one I’ll never replace 💕'; // Ubah teks caption sesuai keinginan
  
  // Buat tombol next baru untuk ke flower.html
  const flowerNextBtn = document.createElement('button');
  flowerNextBtn.className = 'flower-next-btn';
  flowerNextBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
    </svg>
    <span>Next</span>
  `;
  
  // Style untuk tombol flower next
  flowerNextBtn.style.cssText = `
    position: fixed;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: linear-gradient(135deg, #FF6B9D, #C44B9F);
    border: none;
    border-radius: 50px;
    padding: 15px 25px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: none;
    align-items: center;
    gap: 8px;
    box-shadow: 0 8px 25px rgba(255, 107, 157, 0.4);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 1000;
    font-family: 'Arial', sans-serif;
    opacity: 0;
  `;
  
  // Hover effects untuk tombol flower next
  flowerNextBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-3px) scale(1.05)';
    this.style.boxShadow = '0 12px 35px rgba(255, 107, 157, 0.6)';
  });
  
  flowerNextBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '0 8px 25px rgba(255, 107, 157, 0.4)';
  });
  
  // Event listener untuk navigasi ke flower.html
  flowerNextBtn.addEventListener('click', function() {
    // Tambahkan efek transisi sebelum pindah halaman
    document.body.style.transition = 'opacity 0.5s ease-out';
    document.body.style.opacity = '0';
    
    setTimeout(() => {
      window.location.href = 'flower.html';
    }, 500);
  });
  
  photoFrame.appendChild(photo);
  photoContainer.appendChild(balloonsContainer);
  photoContainer.appendChild(photoFrame);
  photoContainer.appendChild(caption);
  document.body.appendChild(photoContainer);
  document.body.appendChild(flowerNextBtn); // Tambahkan tombol flower next ke body, bukan container

  let isShowingBalloon = false;
  nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';

  nextBtn.addEventListener('click', function() {
    if (!isShowingBalloon) {
      window.isAnimating = false;
      const ctx = document.getElementById('c').getContext('2d');
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      
      photoContainer.classList.remove('hide');
      photoContainer.classList.add('show');
      
      // Tampilkan tombol flower next dengan delay 5 detik dan animasi ease in
      flowerNextBtn.style.display = 'flex';
      
      setTimeout(() => {
        flowerNextBtn.style.opacity = '1';
        flowerNextBtn.style.transform = 'translateX(-50%) translateY(0)';
      }, 5000); // Delay 5 detik
      
      nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';
    } else {
      photoContainer.classList.remove('show');
      photoContainer.classList.add('hide');
      
      // Sembunyikan dan reset tombol flower next
      flowerNextBtn.style.display = 'none';
      flowerNextBtn.style.opacity = '0';
      flowerNextBtn.style.transform = 'translateX(-50%) translateY(100px)';
      
      setTimeout(() => {
        window.isAnimating = true;
        window.letters.forEach(letter => letter.reset());
        anim();
      }, 1000);
      
      nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';
    }
    isShowingBalloon = !isShowingBalloon;
  });
});