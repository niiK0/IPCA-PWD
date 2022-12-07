let drops = []
let particles = []

const star_colors = ['white', 'yellow', 'orange']

//#region ParticleJS
particlesJS("particles-js", {
  particles: {
    number: { value: 100, density: { enable: false, value_area: 500 } },
    shape: {type: "star"}, //cirlce maybe?
    color: { value: ["#fff", "#FFA500", "#FFFF00"] },
    opacity: {
      value: 1,
      random: true,
      anim: { enable: true, speed: 0.5, opacity_min: 0, sync: false }
    },
    size: {
      value: 2,
      random: true
    },
    line_linked: {
      enable: false,
      color: "#FFA500"
    },
    move: {
      enable: true,
      speed: 0.15,
      direction: "bottom",
      random: false,
      straight: true,
      out_mode: "out",
      bounce: false,
      // attract: { enable: false, rotateX: 600, rotateY: 600 }
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      resize: false
    },
    modes: {
      grab: { distance: 100, line_linked: { opacity: 0.4} },
    }
  },
  retina_detect: true
});

//#endregion

class Particle{
  constructor({position, velocity, radius, color, fades}){
    this.position = position
    this.velocity = velocity

    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }

  draw(){
    c.beginPath()
    c.globalAlpha = this.opacity
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update(){
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    
    if(this.fades)
      this.opacity -= 0.01
  }
}

//#region RAIN
  function rain_setup() {
    for (let i = 0; i < 25; i++) {
      drops[i] = new Drop();
    }
  }
  
  function rain_draw() {
      for (let i = 0; i < drops.length; i++) {
        drops[i].fall();
        drops[i].show();
      }
    }
    
    function Drop() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -500;
      this.z = Math.random() * 20;
      this.len = map(this.z, 0, 20, 10, 20);
      this.yspeed = map(this.z, 0, 20, 1, 100);
    
      this.fall = function() {
        this.y = this.y + this.yspeed;
        var grav = map(this.z, 0, 20, 0, 0.2);
        this.yspeed = this.yspeed + grav;
    
        if (this.y > canvas.height) {
          this.y = Math.random() * -500;
          this.yspeed = map(this.z, 0, 20, 4, 10);
        }
      }
    
      this.show = function() {
        var thick = map(this.z, 0, 20, 1, 3);
        c.lineWidth = thick;
        c.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x, this.y + this.len);
        c.stroke();
      }
    }
    
    // This function maps a value from one range to another
    function map(value, start1, stop1, start2, stop2) {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    }
//#endregion

//#region SLOW STARS
  function stars_setup(){
    for(let i = 0; i < 100; i++){
      particles.push(
        new Particle({
          position: {
            x: Math.random() * canvas.width, //random
            y: Math.random() * canvas.height, //random
          },
          velocity: {
            x: 0,
            y: 0.07
          },
          radius: Math.random() * 2, //random
          color: star_colors[Math.floor(Math.random() * 3)], //random
          fades: false
        })
      )
    }
  }
//#endregion