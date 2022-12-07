// const canvas = /** @type {HTMLCanvasElement} */ (
//   document.querySelector("canvas")
// );
const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("game-canvas")
);
const c = canvas.getContext("2d");

const bg_image = new Image();
bg_image.src = "./img/background.jpg";

const enemy_image = new Image()
enemy_image.src = "./img/enemy.png"

const enemy_projectile_image = new Image()
enemy_projectile_image.src = "./img/laser2.png"

const player_projectile_image = new Image()
player_projectile_image.src = "./img/laser.png"

canvas.width = bg_image.width;
// canvas.width = innerWidth;
canvas.height = innerHeight;

//#region CLASSES
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
    // const image = new Image();
    // image.src = "./img/laser.png";
    // image.onload = () => {
      const scale = 0.4;
      this.image = player_projectile_image;
      this.position = position;
      this.velocity = velocity;
      this.width = this.image.width * scale;
      this.height = this.image.height * scale;
    // };
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

class EnemyProjectile {
  constructor({ position, velocity }) {
    // const image = new Image();
    // image.src = "./img/laser2.png";
    // image.onload = () => {
      const scale = 0.4;
      this.image = enemy_projectile_image;
      this.position = position;
      this.velocity = velocity;
      this.width = this.image.width * scale;
      this.height = this.image.height * scale;
    // };
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
  constructor({position}) {
    // const image = new Image();
    // image.src = "./img/enemy.png";
    // image.onload = () => {
      const scale = 1;
      this.image = enemy_image;
      this.height = this.image.height * scale;
      this.width = this.image.width * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    // };
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

  update({velocity}) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(enemy_projectiles){
    enemy_projectiles.push(new EnemyProjectile({
      position: {
        x: this.position.x + this.width / 2 - 3, //3 pixels to adjust the position
        y: this.position.y + this.height
      },
      velocity: 5
    }))
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3,
      y: 0,
    };

    this.enemies = [];

    const columns = Math.floor(Math.random() * 5 + 5); //random
    const rows = Math.floor(Math.random() * 5 + 2); //random

    this.width = columns * enemy_fake_width
    this.height = rows * enemy_fake_height

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.enemies.push(
          new Enemy({
            position: {
              x: x * enemy_fake_width,
              y: y * enemy_fake_height
            },
          })
        )

      }
    }
  }

  update(){
    this.position.x += this.velocity.x
    this.position.y += this.position.x

    this.velocity.y = 0

    if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
      this.velocity.x = -this.velocity.x
      this.velocity.y = enemy_fake_height
    }
  }
}
//#endregion


//PLAYER VARS
const player = new Player()

let player_shoot_frames = 1
let player_shoot_interval = 50;

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

//ENEMY VARS
const grids = []
let grid_frames = 0
let grid_spawn_interval = Math.floor(Math.random() * 1000 + 1000)

let enemy_shoot_frames = 1
let enemy_shoot_interval = 200;

let enemy_fake_width = 34
let enemy_fake_height = 28

const enemy_projectiles = [];

let debug = true

function animate() {
  requestAnimationFrame(animate);

  //Background
  c.drawImage(bg_image, 0, 0, canvas.width, canvas.height);

  //black bg to fade
  c.fillStyle = "rgba(0, 0, 0, 0.8)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  
  //draw the "rain" for stars effect
  rain_draw();
  
  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width; //random
      particle.position.y = -particle.radius;
    }
    
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });
  
  player.update();

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.height <= 0) {
      setTimeout(() => {
        const projectile_found = projectiles.find(projectile2 => projectile2 === projectile)
        if(projectile_found){
          projectiles.splice(index, 1);
        }
      }, 0);
    } else {
      projectile.update();
    }
  });
  
  enemy_projectiles.forEach((enemy_projectile, enemy_projectile_index) => {
    if (enemy_projectile.position.y + enemy_projectile.height >= canvas.height) {
      setTimeout(() => {
        const enemy_projectile_found = enemy_projectiles.find(enemy_projectile2 => enemy_projectile2 === enemy_projectile)
        if(enemy_projectile_found){
          enemy_projectiles.splice(enemy_projectile_index, 1);
        }
      }, 0);
    } else {
      enemy_projectile.update();
    }

    // //PLAYER COLLISION
    if(enemy_projectile.position.y + enemy_projectile.height >= player.position.y
      && enemy_projectile.position.x + enemy_projectile.width >= player.position.x
      && enemy_projectile.position.x <= player.position.x + player.width
      ){
      //TAKE PLAYER LIVES
      console.log("you died")
    }
  });

  grids.forEach((grid, grid_index) => {
    grid.update();

    if(enemy_shoot_frames % enemy_shoot_interval === 0 && grid.enemies.length > 0){
      grid.enemies[Math.floor(Math.random() * grid.enemies.length)].shoot(enemy_projectiles) //random
      enemy_shoot_frames = 0
    }

    grid.enemies.forEach((enemy, i) => {
      enemy.update({velocity: grid.velocity})

      projectiles.forEach((projectile, j) =>{
        if(projectile.position.y <= enemy.position.y + enemy_fake_height
          && projectile.position.x + projectile.width >= enemy.position.x
          && projectile.position.x <= enemy.position.x + enemy_fake_width
          && projectile.position.y + projectile.width >= enemy.position.y
          ){
          setTimeout(()=>{
            const enemy_found = grid.enemies.find(enemy2 => enemy2 === enemy)
            const projectile_found = projectiles.find(projectile2 => projectile2 === projectile)
            
            if(enemy_found && projectile_found){
              grid.enemies.splice(i, 1)
              projectiles.splice(j, 1)

              if(grid.enemies.length > 0){
                const first_enemy = grid.enemies[0]
                const last_enemy = grid.enemies[grid.enemies.length - 1]

                grid.width = last_enemy.position.x - first_enemy.position.x + last_enemy.width
                grid.position.x = first_enemy.position.x
              }else{
                grids.splice(grid_index,1)
              }
            }
          }, 0)
        }
      })
    });
  });

  if(grid_frames % grid_spawn_interval === 0){
    grids.push(new Grid())
    grid_spawn_interval = Math.floor(Math.random() * 1000 + 1000)
    grid_frames = 0
  }

  //FUN GLITCH LOL
  // enemy_projectiles.forEach((projectile, index) => {
  //   if (projectile.position.y + projectile.height >= canvas.height) {
  //     setTimeout(() => {
  //       enemy_projectiles.splice(index, 1);
  //     }, 0);
  //   } else {
  //     projectile.update();
  //   }
  // });

  //#region KEYS MOVE/SHOOT
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

  if (keys.space.pressed) {
    if (keys.space.can_shoot) {
      keys.space.can_shoot = false;
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2 - 3, //3 pixels to adjust the position
            y: player.position.y,
          },
          velocity: -10,
        })
      );
    }
  }
  //#endregion

  //#region PLAYER SHOOTING COOLDOWN
  if (player_shoot_frames % player_shoot_interval === 0) {
    if (!keys.space.can_shoot) {
      keys.space.can_shoot = true;
      player_shoot_frames = 1
    }
  }
  //#endregion

  //increment frames for update values
  grid_frames++
  player_shoot_frames++;
  enemy_shoot_frames++;
}

//#region KEY LISTENERS
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
//#endregion

animate();

//#region BACKGROUND PARTICLES SETUP
//RAINDROP
rain_setup();

//STARS
stars_setup();
//#endregion
