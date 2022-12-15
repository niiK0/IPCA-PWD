const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("game-canvas")
);
const c = canvas.getContext("2d");

//#region IMAGES
const bg_image = new Image();
bg_image.src = "./img/background.jpg";

const enemy_image = new Image()
enemy_image.src = "./img/enemy.png"

const boss_image = new Image()
boss_image.src = "./img/boss.png"

const boss_ui = document.getElementById('ui-boss-container')
const boss_life_text = document.getElementById('ui-boss-life')

const enemy_projectile_image = new Image()
enemy_projectile_image.src = "./img/laser2.png"

const player_projectile_image = new Image()
player_projectile_image.src = "./img/laser.png"

const player_image = new Image()
player_image.src = "./img/player.png"

const meteor_image = [new Image(), new Image()]
meteor_image[0].src = "./img/meteor.png"
meteor_image[1].src = "./img/meteor1.png"
//#endregion

//#region SOUNDS
const shot_sound = new Audio('./sounds/Shot.mp3');
shot_sound.volume = 0.05

const enemy_hit_sound = new Audio("./sounds/EnemyHit.mp3");
enemy_hit_sound.volume = 0.05

const player_hit_sound = new Audio("./sounds/PlayerHit.mp3");
player_hit_sound.volume = 0.05

const explosion_sound = new Audio("./sounds/Explosion.mp3");
explosion_sound.volume = 0.01

const level_up_sound = new Audio("./sounds/LevelUp.mp3")
level_up_sound.volume = 0.05

const bg_music = new Audio("./sounds/BackgroundMusic.mp3")
bg_music.volume = 0.05
//#endregion

const time_text = document.getElementById('ui-time-text')

canvas.width = bg_image.width;
canvas.height = innerHeight;

let debug = true

//#region CLASSES
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;
    this.scale = powerups.player_size[powerups.player_size.current_level];
    this.image = player_image;
    this.height = this.image.height * this.scale;
    this.width = this.image.width * this.scale;
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height - this.height - 20,
    };
    this.player_level = 1
    this.player_exp = 0
    this.player_next_exp = 10
    this.max_hearts = powerups.health[powerups.health.current_level]
    this.current_hearts = this.max_hearts
    this.amount = powerups.multiple_attack[powerups.multiple_attack.current_level]
    this.fully_upgraded = [false, false, false, false, false, false, false]
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

    if(debug){
      c.beginPath()
      c.strokeStyle = "green",
      c.rect(this.position.x, this.position.y, this.width, this.height)
      c.stroke()
    }

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    //Restore canvas after rotation
    c.restore();

    for(let i = 0; i < this.current_hearts; i++){
      const hearts_scale = 0.5
      const hearts_width = this.image.width * hearts_scale
      const hearts_height = this.image.height * hearts_scale
      const hearts_position = {
        x: canvas.width - (hearts_width/2) * (i+1) -6,
        y: 40
      }
      c.drawImage(this.image, hearts_position.x, hearts_position.y, hearts_width /2, hearts_height/2)
    }

    if(this.current_hearts <= 0){
      setTimeout(() => {
        this.current_hearts = 3
        alert("You lost!")
        window.location.href = window.location.href;
      },0)
    }
  }

  level_up(){
    setTimeout(() =>{
      level_up_sound.currentTime = 0
      level_up_sound.play()
      this.player_level++
      const level_text = document.getElementById('ui-level-text')
      level_text.textContent = this.player_level
      this.player_next_exp = this.player_next_exp * 1.3
      this.player_exp = 0
    
      let upgraded = true
      let maxed_count = 0
      let random_upgrade = Math.floor(Math.random() * 7)

      this.fully_upgraded.forEach((powerup) =>{
        if(!powerup){
          upgraded = false
        }else{
          maxed_count++
        }
      })

      while(!upgraded){
        switch(random_upgrade){
          case 0:
            if(powerups.attack_speed.current_level >= Object.keys(powerups.attack_speed).length - 2){
              this.fully_upgraded[0] = true
              if(maxed_count >= 7)
                upgraded = true
              break
            }
            else{
              powerups.attack_speed.current_level++
              upgraded=true
            }
            break;
          case 1:
            if(powerups.attack_pierce.current_level >= Object.keys(powerups.attack_pierce).length - 2)
            {
              this.fully_upgraded[1] = true
              if(maxed_count >= 7)
                upgraded = true
              break
            }
            else{
              powerups.attack_pierce.current_level++
            }
            upgraded=true
            break;
          case 2:
            if(powerups.bullet_speed.current_level >= Object.keys(powerups.bullet_speed).length - 2){
              this.fully_upgraded[2] = true
              if(maxed_count >= 7)
                upgraded = true
              break
            }
            else{
              powerups.bullet_speed.current_level++
            }
            upgraded=true
            break;
          case 3:
            if(powerups.multiple_attack.current_level >= Object.keys(powerups.multiple_attack).length - 2){
              this.fully_upgraded[3] = true
              if(maxed_count >= 7)
                upgraded = true
              break
            }
            else{
              powerups.multiple_attack.current_level++
              this.amount = powerups.multiple_attack[powerups.multiple_attack.current_level]
            }
            upgraded=true
            break;
          case 4:
            if(powerups.health.current_level >= Object.keys(powerups.health).length - 2){
              this.fully_upgraded[4] = true
              if(maxed_count >= 7)
                upgraded = true
              break
            }
            else{
              powerups.health.current_level++
              this.max_hearts = powerups.health[powerups.health.current_level]
              this.current_hearts++
            }
            upgraded=true
            break;
          case 5:
            if(powerups.player_speed.current_level >= Object.keys(powerups.player_speed).length - 2){
              this.fully_upgraded[5] = true
              if(maxed_count >= 7)
                upgraded = true
              break
            }
            else{
              powerups.player_speed.current_level++
            }
            upgraded=true
            break;
          case 6:
            if(powerups.player_size.current_level >= Object.keys(powerups.player_size).length - 2){
              this.fully_upgraded[6] = true
              if(maxed_count >= 7)
                upgraded = true
              break
            }
            else{
              powerups.player_size.current_level++
              this.height = this.image.height * powerups.player_size[powerups.player_size.current_level];
              this.width = this.image.width * powerups.player_size[powerups.player_size.current_level];
            }
            upgraded=true
            break;
        }
        maxed_count = 0

        this.fully_upgraded.forEach((powerup, i) =>{
          if(powerup){
            maxed_count++
          }
        })

        random_upgrade = Math.floor(Math.random() * 7)
      }
  
      this.write_powerups()
    }, 0)
  }

  write_powerups(){
    const attack_speed_text = document.getElementById('ui-powerup-attack-speed')
    const attack_pierce_text = document.getElementById('ui-powerup-attack-pierce')
    const bullet_speed_text = document.getElementById('ui-powerup-bullet-speed')
    const multiple_attack_text = document.getElementById('ui-powerup-multiple-attack')
    const max_health_text = document.getElementById('ui-powerup-max-health')
    const player_speed_text = document.getElementById('ui-powerup-player-speed')
    const player_size_text = document.getElementById('ui-powerup-player-size')

    attack_speed_text.textContent = powerups.attack_speed.current_level
    attack_pierce_text.textContent = powerups.attack_pierce.current_level
    bullet_speed_text.textContent = powerups.bullet_speed.current_level
    multiple_attack_text.textContent = powerups.multiple_attack.current_level
    max_health_text.textContent = powerups.health.current_level
    player_speed_text.textContent = powerups.player_speed.current_level
    player_size_text.textContent = powerups.player_size.current_level
  }

  earn_exp(){
    this.player_exp++
    const exp_bar = document.getElementById('ui-exp-bar-fill')
    exp_bar.style.width = (this.player_exp*100)/this.player_next_exp + '%'
  }

  set_defaults(){
    //level
    const level_text = document.getElementById('ui-level-text')
    level_text.textContent = this.player_level

    //exp
    const exp_bar = document.getElementById('ui-exp-bar-fill')
    exp_bar.style.width = this.player_exp + '%'
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
    if(this.player_exp >= this.player_next_exp){
      this.level_up()
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
      const scale = 0.4;
      this.image = player_projectile_image;
      this.position = position;
      this.velocity = velocity;
      this.width = this.image.width * scale;
      this.height = this.image.height * scale;
      this.pierce_counter = powerups.attack_pierce[powerups.attack_pierce.current_level]
      shot_sound.currentTime = 0
      shot_sound.play()
  }

  draw() {
    if(debug){
      c.beginPath()
      c.strokeStyle = "red",
      c.rect(this.position.x, this.position.y, this.width, this.height)
      c.stroke()
    }

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity;
  }
}

class Meteor {
  constructor({position, velocity }) {
      const scale = 1
      this.image = meteor_image[Math.floor(Math.random() * 2)] //random
      this.velocity = velocity
      this.position = position
      this.width = this.image.width * scale
      this.height = this.image.height * scale
  }

  draw() {
    if(debug){
      c.beginPath()
      c.strokeStyle = "blue",
      c.rect(this.position.x, this.position.y, this.width, this.height)
      c.stroke()
    }

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;
  }
}

class EnemyProjectile {
  constructor({ position, velocity }) {
      const scale = 0.4;
      this.image = enemy_projectile_image;
      this.position = position;
      this.velocity = velocity;
      this.width = this.image.width * scale;
      this.height = this.image.height * scale;
  }

  draw() {
    if(debug){
      c.beginPath()
      c.strokeStyle = "red",
      c.rect(this.position.x, this.position.y, this.width, this.height)
      c.stroke()
    }
    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    this.position.y += this.velocity;
  }
}

class Enemy {
  constructor({position}) {
      const scale = 1;
      this.image = enemy_image;
      this.height = this.image.height * scale;
      this.width = this.image.width * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
  }

  draw() {
    if(debug){
      c.beginPath()
      c.strokeStyle = "red",
      c.rect(this.position.x, this.position.y, this.height, this.width)
      c.stroke()
    }
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

class Boss {
  constructor({position, velocity}) {
      const scale = 0.6;
      this.image = boss_image;
      this.height = this.image.height * scale;
      this.width = this.image.width * scale;
      this.position = position
      this.velocity = velocity
      this.backup_velocity_x = velocity.x
      this.hearts = 100
      this.arrived = false
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
    this.draw();
    this.position.x += this.velocity.x;

    if(minutes>=5 && this.position.y >= 60 && !this.arrived){
      this.velocity.y = 0
      this.velocity.x = this.backup_velocity_x
      this.arrived = true
    }

    if(minutes>=5 && this.position.y < 60){
      this.position.y += this.velocity.y
      this.velocity.x = 0
    }

    if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
      this.velocity.x = -this.velocity.x
    }

    if(this.hearts <= 0){
      setTimeout(() => {
        this.hearts = 100
        alert("You Won!")
        window.location.href = window.location.href;
      },0)
    }

    setTimeout(() => {
      boss_life_text.textContent = parseInt(this.hearts)
    },0)
    
  }

  shoot(enemy_projectiles){
    enemy_projectiles.push(new EnemyProjectile({
      position: {
        x: this.position.x + this.width / 4.5, //3 pixels to adjust the position
        y: this.position.y + this.height
      },
      velocity: 6
    }))
    enemy_projectiles.push(new EnemyProjectile({
      position: {
        x: this.position.x + this.width / 1.35, //3 pixels to adjust the position
        y: this.position.y + this.height
      },
      velocity: 6
    }))
  }
}

class Grid {
  constructor({col, row}) {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3,
      y: 0,
    };

    this.enemies = [];

    this.col = col
    this.row = row
    const columns = Math.floor(Math.random() * this.col.min + this.col.max); //random
    const rows = Math.floor(Math.random() * this.row.min + this.row.max); //random

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

  draw(){
    c.beginPath()
    c.strokeStyle = "red",
    c.rect(this.position.x, this.position.y, this.width, this.height)
    c.stroke()
  }

  update(){
    if(debug) this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    
    this.velocity.y = 0

    if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
      this.velocity.x = -this.velocity.x
      this.velocity.y = enemy_fake_height
    }
  }
}
//#endregion

//PLAYER VARS
let player = null

let player_shoot_frames = 0

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

const powerups = {
  attack_speed: {
    0: 50,
    1: 40,
    2: 30,
    current_level: 0
  },

  health: {
    0: 3,
    1: 4,
    2: 5,
    3: 6,
    4: 7,
    5: 8,
    current_level: 0
  },

  multiple_attack: {
    0: 1,
    1: 2,
    2: 3,
    current_level: 0
  },

  attack_pierce: {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    current_level: 0
  },

  bullet_speed: {
    0: 7,
    1: 9,
    2: 11,
    3: 13,
    4: 15,
    5: 17,
    current_level: 0
  },

  player_speed: {
    0: 4,
    1: 5,
    2: 6,
    3: 7,
    current_level: 0
  },

  player_size: {
    0: 0.5,
    1: 0.4,
    2: 0.35,
    3: 0.3,
    current_level: 0
  },
}

var score = 0;

//ENEMY VARS
const grids = []
let grid_frames = 0
let grid_spawn_interval = 1500
let grid_col = {min: 2, max: 5}
let grid_row = {min: 2, max: 3}

let enemy_shoot_frames = 0
let enemy_shoot_interval = 300;

let enemy_fake_width = 34
let enemy_fake_height = 28
const enemy_projectiles = [];

//BOSS VARS
let boss_shoot_frames = 0
let boss_shoot_interval = 100;

const boss = new Boss({
    position: {
      x: canvas.width/2 - boss_image.width * 0.1,
      y: -boss_image.height
    },
    velocity: {
      x: 6,
      y: 3
    }
  })

//METEOR VARS
const meteors = []
let meteor_frames = 0
let meteor_spawn_interval = 600

function animate() {
  requestAnimationFrame(animate);
  if(player){

//#region BACKGROUND STUFF
  //image
  c.drawImage(bg_image, 0, 0, canvas.width, canvas.height);

  //black bg to fade
  c.fillStyle = "rgba(0, 0, 0, 0.8)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  //draw the "rain" for stars effect
  rain_draw();

  score_text = document.getElementById('ui-score-text')
  score_text.textContent = score
  
  //slow particles
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
  //#endregion
  
 //meteors
 meteors.forEach((meteor, i) => {
    if (meteor.position.y >= canvas.height) {
      const meteor_found = meteors.find(meteor2 => meteor2 === meteor)
      if(meteor_found){
        setTimeout(() => {
          meteors.splice(i, 1);
        }, 0);
      }
    }

    if(meteor.position.y + meteor.height >= player.position.y
      && meteor.position.x + meteor.width >= player.position.x
      && meteor.position.x <= player.position.x + player.width
      ){
      //TAKE PLAYER LIVES
      const meteor_found = meteors.find(meteor2 => meteor2 === meteor)
      if(meteor_found){
        setTimeout(() => {
          meteors.splice(i, 1);
      }, 0);
        player.current_hearts--
        explosion_sound.currentTime = 0
        explosion_sound.play()
      }
    }

    meteor.update();
 
  });
  
  player.update();
  if(minutes>=5){
    boss.update()
    
    boss_ui.style.visibility = 'visible'

    if(boss_shoot_frames % boss_shoot_interval === 0){
      boss.shoot(enemy_projectiles)
      boss_shoot_frames = 0
    }
  }

  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.height <= 0) {
      setTimeout(() => {
          projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }

    if(
      projectile.position.y <= boss.position.y + boss.height
      && projectile.position.x + projectile.width >= boss.position.x
      && projectile.position.x <= boss.position.x + boss.width
      && projectile.position.y + projectile.width >= boss.position.y
    ){
      setTimeout(()=>{
        const projectile_found = projectiles.find(projectile2 => projectile2 === projectile)
        
        if(projectile_found){
          boss.hearts--
          projectiles.splice(index, 1)
          enemy_hit_sound.currentTime = 0
          enemy_hit_sound.play()

          //give exp per mob
          player.earn_exp()
          score+=100
        }
      }, 0)
    }
  });
  
  enemy_projectiles.forEach((enemy_projectile, enemy_projectile_index) => {
    if (enemy_projectile.position.y + enemy_projectile.height >= canvas.height) {
      setTimeout(() => {
          enemy_projectiles.splice(enemy_projectile_index, 1);
      }, 0);
    } else {
      enemy_projectile.update();
    }

    //PLAYER COLLISION
    if(enemy_projectile.position.y + enemy_projectile.height >= player.position.y
      && enemy_projectile.position.x + enemy_projectile.width >= player.position.x
      && enemy_projectile.position.x <= player.position.x + player.width
      ){
      
      
      //TAKE PLAYER LIVES
      const enemy_projectile_found = enemy_projectiles.find(enemy_projectile2 => enemy_projectile2 === enemy_projectile)
      if(enemy_projectile_found){
        setTimeout(() => {
          enemy_projectiles.splice(enemy_projectile_index, 1);
      }, 0);
        player.current_hearts--
        player_hit_sound.currentTime = 0
        player_hit_sound.play()
      }
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

      //COLLISION
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
              if(projectile.pierce_counter <= 0){
                projectiles.splice(j, 1)
              }else{
                projectile.pierce_counter--
              }
              enemy_hit_sound.currentTime = 0
              enemy_hit_sound.play()

              //give exp per mob
              player.earn_exp()
              score+=100

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

    if(grid.enemies[grid.enemies.length - 1].position.y + enemy_fake_height >= player.position.y - 10){
      grids.splice(grid_index, 1)
      player.current_hearts = 0
    }
  });

  if(grid_frames % grid_spawn_interval === 0){
    grids.push(new Grid({
      col: grid_col,
      row: grid_row
    }))
    grid_frames = 0
  }

  if(meteor_frames % meteor_spawn_interval === 0){
    meteors.push(
      new Meteor({
        position: {
          x: Math.random() * canvas.width, //random
          y: -80 * (Math.random() * 3),
        },
        velocity: {
          x: 0,
          y: 1
        }
      })
    )
    meteor_frames = 0
  }

  //#region KEYS MOVE/SHOOT
  if (keys.a.pressed && player.position.x >= 10) {
    player.velocity.x = -powerups.player_speed[powerups.player_speed.current_level];
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width - 10
  ) {
    player.velocity.x = powerups.player_speed[powerups.player_speed.current_level];
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }

  if (keys.space.pressed) {
    if (keys.space.can_shoot) {
      keys.space.can_shoot = false;
      if(player.amount === 1){
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2 - 3, //3 pixels to adjust the position
              y: player.position.y - player.height/2 + 13,
            },
            velocity: -powerups.bullet_speed[powerups.bullet_speed.current_level],
          })
        );
      }else if(player.amount === 2){
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 4, //3 pixels to adjust the position
              y: player.position.y - player.height/2 + 3,
            },
            velocity: -powerups.bullet_speed[powerups.bullet_speed.current_level],
          })
        );

        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 1.5, //3 pixels to adjust the position
              y: player.position.y - player.height/2 + 3,
            },
            velocity: -powerups.bullet_speed[powerups.bullet_speed.current_level],
          })
        );
      }else if(player.amount === 3){
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 4, //3 pixels to adjust the position
              y: player.position.y - player.height/2 + 3,
            },
            velocity: -powerups.bullet_speed[powerups.bullet_speed.current_level],
          })
        );

        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 1.5, //3 pixels to adjust the position
              y: player.position.y - player.height/2 + 3,
            },
            velocity: -powerups.bullet_speed[powerups.bullet_speed.current_level],
          })
        );
        
        projectiles.push(
          new Projectile({
            position: {
              x: player.position.x + player.width / 2 - 3, //3 pixels to adjust the position
              y: player.position.y - player.height/2 + 13,
            },
            velocity: -powerups.bullet_speed[powerups.bullet_speed.current_level],
          })
        );
      }
    }
  }
  //#endregion

  //#region PLAYER SHOOTING COOLDOWN
  if (player_shoot_frames % powerups.attack_speed[powerups.attack_speed.current_level] === 0) {
    if (!keys.space.can_shoot) {
      keys.space.can_shoot = true;
      player_shoot_frames = 0
    }
  }
  //#endregion

  //increment frames for update values
  meteor_frames++
  grid_frames++
  player_shoot_frames++
  enemy_shoot_frames++
  boss_shoot_frames++
}
}

var start = Date.now();
var minutes = 0

game_start_btn = document.getElementById('ui-start-game-btn')

game_start_btn.onclick = function(){
  // console.log(api_random_num(1, 5))

  bg_music.currentTime = 0
  bg_music.play()

  player = new Player()
  player.set_defaults()
  
  animate();

  //#region BACKGROUND PARTICLES SETUP
  //RAINDROP
  rain_setup();

  //#endregion

  setInterval(function() {
    var delta = Date.now() - start; // milliseconds elapsed since start
    seconds = parseInt(delta/1000)
    minutes = parseInt(seconds/60)
    time_text.textContent = seconds

    switch(minutes){
      case 1:
        grid_col = {min: 3, max: 6}
        grid_row = {min: 3, max: 4}
        grid_spawn_interval = 1200
        enemy_shoot_interval = 500
        meteor_spawn_interval = 500
        if(player.current_hearts < player.max_hearts){
          player.current_hearts++
        }
        break;
      case 2:
        grid_col = {min: 4, max: 7}
        grid_row = {min: 3, max: 4}
        grid_spawn_interval = 1100
        enemy_shoot_interval = 450
        meteor_spawn_interval = 450
        if(player.current_hearts < player.max_hearts){
          player.current_hearts++
        }
        break;
      case 3:
        grid_col = {min: 5, max: 8}
        grid_row = {min: 4, max: 6}
        grid_spawn_interval = 1000
        enemy_shoot_interval = 400
        meteor_spawn_interval = 400
        if(player.current_hearts < player.max_hearts){
          player.current_hearts++
        }
        break;
      case 4:
        grid_col = {min: 6, max: 9}
        grid_row = {min: 5, max: 7}
        grid_spawn_interval = 900
        enemy_shoot_interval = 300
        meteor_spawn_interval = 300
        if(player.current_hearts < player.max_hearts){
          player.current_hearts++
        }
        break;
      case 5:
        grid_spawn_interval = 0
        enemy_shoot_interval = 0
        meteor_spawn_interval = 200
        if(player.current_hearts < player.max_hearts){
          player.current_hearts++
        }
        //SPAWN BOSS
        break;
    }

  }, 1000); // update about every second

  document.getElementById('ui-start-game-container').style.display = "none"
  document.getElementById('ui-div').style.visibility = "visible"
  canvas.style.visibility = "visible"
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
    case 'l':
      minutes++
      console.log(minutes)
      break
  }
});
//#endregion
