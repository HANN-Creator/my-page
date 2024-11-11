// JavaScript Code for Fireworks Logo Animation
let particles = [];
let explode = false;
let canvas;
let logoImage;

function preload() {
  logoImage = loadImage('logo.png'); // Load the logo image
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('logo-canvas');
  setTimeout(() => {
    document.getElementById('logo-image').style.display = 'none';
    document.getElementById('logo-canvas').style.display = 'block';
    createParticlesFromLogo(); // Automatically start particle creation after logo hide
  }, 1000); // Wait for 1 second before starting the particle animation
  adjustRideLogoSizes();
  window.addEventListener('resize', adjustRideLogoSizes); // Adjust logo sizes on window resize
}

function draw() {
  background(0);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  if (particles.length === 0 && explode) {
    showMainPage(); // Automatically show main page after particles are finished
  }
}

function createParticlesFromLogo() {
  logoImage.resize(logoImage.width / 3, logoImage.height / 3); // Further reduce logo size
  logoImage.loadPixels();
  for (let y = 0; y < logoImage.height; y += 10) {
    for (let x = 0; x < logoImage.width; x += 10) {
      let index = (x + y * logoImage.width) * 4;
      let r = logoImage.pixels[index];
      let g = logoImage.pixels[index + 1];
      let b = logoImage.pixels[index + 2];
      let a = logoImage.pixels[index + 3];
      if (a > 0) {
        let posX = map(x, 0, logoImage.width, width / 2 - logoImage.width / 2, width / 2 + logoImage.width / 2);
        let posY = map(y, 0, logoImage.height, height / 2 - logoImage.height / 2, height / 2 + logoImage.height / 2);
        particles.push(new Particle(posX, posY, color(r, g, b)));
      }
    }
  }
  explode = true; // Automatically trigger explosion after creating particles
}

class Particle {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1)); // Further reduce speed for smoother animation
    this.lifespan = 255;
    this.color = col;
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 1; // Slow down fading for a longer animation
  }

  show() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.lifespan);
    ellipse(this.pos.x, this.pos.y, 8);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}

function showMainPage() {
  document.getElementById('logo-canvas').style.display = 'none';
  document.getElementById('main-page').style.display = 'block';
}

// JavaScript to handle ride logo navigation
const rideLogos = document.querySelectorAll('.ride-logo');
rideLogos.forEach(logo => {
  logo.addEventListener('click', (e) => {
    const link = e.target.dataset.link;
    const page = e.target.dataset.page;
    if (link) {
      window.location.href = link;
    } else if (page) {
      window.location.href = page + '.html';
    }
  });
});

// Function to adjust ride logo sizes for responsiveness
function adjustRideLogoSizes() {
    rideLogos.forEach(logo => {
      const width = parseFloat(logo.dataset.width) || 10; // Default to 10% if not specified
      const height = parseFloat(logo.dataset.height) || 'auto';
      logo.style.width = `${(width / 100) * window.innerWidth}px`;
      if (height !== 'auto') {
        logo.style.height = `${(height / 100) * window.innerHeight}px`;
      } else {
        logo.style.height = 'auto'; // Maintain aspect ratio if height is not specified
      }
    });
}
