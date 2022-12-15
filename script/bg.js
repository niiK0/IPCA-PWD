let drops = []
let particles = []

let star_colors = []
$(document).ready(function() {
  api_get_weather()
});


//#region ParticleJS
setTimeout(()=>{
  particlesJS("particles-js", {
    particles: {
      number: { value: 100, density: { enable: false, value_area: 500 } },
      shape: {type: "star"}, //cirlce maybe?
      color: { value: ["#fff", star_colors[0], star_colors[1]] },
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
        color: star_colors[0]
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
        onclick: { enable: false},
        resize: false
      },
      modes: {
        grab: { distance: 100, line_linked: { opacity: 0.4} },
      }
    },
    retina_detect: true
  });
}, 500)
//#endregion

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