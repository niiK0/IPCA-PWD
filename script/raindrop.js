let drops = [];

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