class PointerParticle {
  constructor(spread, speed, component) {
    const { ctx, pointer, hue } = component;

    this.ctx = ctx;
    this.x = pointer.x;
    this.y = pointer.y;
    this.mx = pointer.mx * 0.1;
    this.my = pointer.my * 0.1;
    this.size = Math.random() + 1;
    this.decay = 0.01;
    this.speed = speed * 0.08;
    this.spread = spread * this.speed;
    this.spreadX = (Math.random() - 0.5) * this.spread - this.mx;
    this.spreadY = (Math.random() - 0.5) * this.spread - this.my;
    this.color = `hsl(${hue}deg 90% 60%)`;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  collapse() {
    this.size -= this.decay;
  }

  trail() {
    this.x += this.spreadX * this.size;
    this.y += this.spreadY * this.size;
  }

  update() {
    this.draw();
    this.trail();
    this.collapse();
  }
}

// Inisialisasi komponen saat dokumen dimuat
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const pointer = {
    x: 0,
    y: 0,
    mx: 0,
    my: 0
  };
  let hue = 0;

  function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  setCanvasDimensions();

  function createParticles(event, count, speed, spread) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.mx = event.movementX || 0;
    pointer.my = event.movementY || 0;

    for (let i = 0; i < count; i++) {
      particles.push(new PointerParticle(spread, speed, {
        ctx,
        pointer,
        hue
      }));
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hue = hue > 360 ? 0 : hue + 3;

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      if (particles[i].size <= 0.1) {
        particles.splice(i, 1);
        i--;
      }
    }
  }

  // Event listeners
  window.addEventListener('resize', setCanvasDimensions);
  
  document.addEventListener('mousemove', (e) => {
    // Mengubah jumlah partikel saat mouse bergerak
    // Parameter: (event, count, speed, spread)
    createParticles(e, 35, 1, 5);
  });

  document.addEventListener('click', (e) => {
    // Membuat multiple createParticles dengan hue yang berbeda
    for (let i = 0; i < 360; i += 72) { // Membagi 360 derajat menjadi 5 warna
      setTimeout(() => {
        hue = i; // Mengubah hue untuk setiap batch partikel
        // Mengubah jumlah partikel saat mouse diklik
        // Parameter: (event, count, speed, spread)
        createParticles(e, 150, Math.random() + 2, Math.random() + 30);
      }, i * 2); // Memberikan delay kecil untuk efek berurutan
    }
  });

  animate();
}); 