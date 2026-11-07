const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

let particles = [];
let bursts = [];
let pointer = { x: null, y: null, radius: 100 };

window.addEventListener('mousemove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; });
window.addEventListener('touchmove', (e) => { pointer.x = e.touches[0].clientX; pointer.y = e.touches[0].clientY; });
window.addEventListener('mouseout', () => { pointer.x = null; pointer.y = null; });
window.addEventListener('touchend', () => { pointer.x = null; pointer.y = null; });

// Ambient Fireflies
class Firefly {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.size = this.baseSize;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.color = Math.random() > 0.4 ? '255, 215, 0' : '255, 255, 255'; 
        this.glowAlpha = Math.random();
        this.glowDir = Math.random() > 0.5 ? 0.015 : -0.015;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.glowAlpha += this.glowDir;
        if(this.glowAlpha > 1 || this.glowAlpha < 0.1) this.glowDir *= -1;

        if(pointer.x != null) {
            let dx = pointer.x - this.x; let dy = pointer.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < pointer.radius) {
                const force = (pointer.radius - distance) / pointer.radius;
                this.x -= (dx / distance) * force * 3;
                this.y -= (dy / distance) * force * 3;
                this.glowAlpha = 1; 
            }
        }
        if(this.x < 0) this.x = w; if(this.x > w) this.x = 0;
        if(this.y < 0) this.y = h; if(this.y > h) this.y = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.glowAlpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${this.color}, 0.9)`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Magic Burst Particle
class MagicBurst {
    constructor(x, y) {
        this.x = x; this.y = y;
        this.size = Math.random() * 2.5 + 0.5;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1; // Faster explosion
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.015;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += 0.04; 
        this.vx *= 0.92; this.vy *= 0.92;
        this.life -= this.decay;
    }
    draw() {
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = '#ffea99'; 
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
    }
}

// Init Fireflies
const fireflyCount = w < 600 ? 50 : 120;
for(let i=0; i < fireflyCount; i++) particles.push(new Firefly());

function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    for(let i = bursts.length - 1; i >= 0; i--) {
        bursts[i].update(); bursts[i].draw();
        if(bursts[i].life <= 0) bursts.splice(i, 1);
    }
    requestAnimationFrame(animate);
}
animate();

// --- BURST TRIGGERS ---

// Trigger Burst Function (variable amount of particles)
function triggerBurst(x, y, amount) {
    for(let i=0; i<amount; i++) bursts.push(new MagicBurst(x, y));
}

// 1. Single Click Burst (Manual)
window.addEventListener('click', (e) => {
    triggerBurst(e.clientX, e.clientY, 40);
});

// 2. Mobile Single Touch Burst (Manual)
window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    triggerBurst(touch.clientX, touch.clientY, 30);
});

// 3. Auto-Burst every 0.8 seconds (Automatic Background Magic)
setInterval(() => {
    // Random position on screen
    const randomX = Math.random() * w;
    const randomY = Math.random() * h;
    triggerBurst(randomX, randomY, 25); // Smaller burst for background
}, 800);

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});