const canvas = /** @type {HTMLCanvasElement} */ (
  document.querySelector("canvas")
);
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const bg_image = new Image();
bg_image.src = "./img/background.jpg";

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
    //Background
    c.drawImage(bg_image, 0, 0, canvas.width, canvas.height);

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

    //Player
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

const player = new Player();
var player_shoot_interval = 100

const projectiles = [];

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
  player.update();
  projectiles.forEach((projectile, index) => {
    if(projectile.position.y + projectile.height <= 0){
        setTimeout(() =>{
            projectiles.splice(index, 1)
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
                y: player.position.y - 10
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
