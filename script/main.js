const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("canvas")
);
const c = canvas.getContext("2d");

const bg_image = new Image();
bg_image.src = "./img/background.jpg";

canvas.width = bg_image.width;
// canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;

    const image = new Image();
    image.src = "./img/player.png";
    image.onload = () => {
      const scale = 0.5;
      this.image = image;
      this.height = image.height * scale;
      this.width = image.width * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    //Save canvas for rotation
    c.save();
    c.translate(
      player.position.x + player.width / 2,
      player.position.y + player.height / 2
    );
    c.rotate(this.rotation);

    c.translate(
      -player.position.x - player.width / 2,
      -player.position.y - player.height / 2
    );

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    //Restore canvas after rotation
    c.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    const image = new Image();
    image.src = "./img/laser.png";
    image.onload = () => {
      const scale = 0.4;
      this.image = image;
      this.position = position;
      this.velocity = velocity;
      this.width = image.width * scale;
      this.height = image.height * scale;
    };
  }

  draw() {
    c.beginPath();
    c.rect(this.position.x, this.position.y, this.width, this.height);
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    c.closePath();
  }

  update() {
    this.draw();
    this.position.y += this.velocity;
  }
}

class Enemy {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./img/enemy.png";
    image.onload = () => {
      const scale = 0.25;
      this.image = image;
      this.height = image.height * scale;
      this.width = image.width * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: this.width,
      };
    };
  }

  draw() {
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y


    }
  }
}

const player = new Player();
const enemies = [new Enemy()];
const enemy = new Enemy()
var player_shoot_interval = 500
var enemy_shoot_interval = 500

const projectiles = [];
const enemy_projectiles = [];

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
    can_shoot: true,
  },
};

function animate() {
  requestAnimationFrame(animate);
  
  //Background
  c.drawImage(bg_image, 0, 0, canvas.width, canvas.height);

  //black bg to fade
  c.fillStyle = 'rgba(0, 0, 0, 0.8)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  
  //draw the "rain" for stars effect
  rain_draw()

  player.update();
  enemy.update();

  projectiles.forEach((projectile, index) => {
    if(projectile.position.y + projectile.height <= 0){
        setTimeout(() =>{
            projectiles.splice(index, 1)
        }, 0)
    }else{
        projectile.update();
    }
  });

  enemy_projectiles.forEach((projectile, index) => {
    if(projectile.position.y + projectile.height >= canvas.height){
        setTimeout(() =>{
          enemy_projectiles.splice(index, 1)
        }, 0)
    }else{
        projectile.update();
    }
  });

  if (keys.a.pressed && player.position.x >= 10) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width - 10
  ) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  if(keys.space.pressed){
    if(keys.space.can_shoot){
        keys.space.can_shoot = false
        projectiles.push(new Projectile({
            position: {
                x: player.position.x + player.width / 7,
                y: player.position.y + player.height
            },
            velocity: -10
        }))
    }
  }
}

function shotCooldown(){
  setInterval(() => {
      if(!keys.space.can_shoot){
          keys.space.can_shoot = true
      }
    }, player_shoot_interval)
}

function enemyShotCooldown(){
  setInterval(() => {
    enemies.forEach((enemy) =>{
      enemy_projectiles.push(new Projectile({
        position: {
            x: enemy.position.x + enemy.width / 7,
            y: enemy.position.y - 10
        },
        velocity: 10
      }))
    })
    }, enemy_shoot_interval)
}
enemyShotCooldown()
shotCooldown()

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = true;
      break;
    case "d":
      keys.d.pressed = true;
      break;
    case " ":
      keys.space.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case " ":
      keys.space.pressed = false;
      break;
  }
});

animate();

//Raindrop
rain_setup();
