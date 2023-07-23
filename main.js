import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { flyingEnemy, groundEnemy, climbingEnemy } from './enemis.js';
import { UI } from './UI.js';

window.addEventListener('load', function(){
    const canvas = canvas1;
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.groundMargin = 40;
            this.speed = 0;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 500;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';
            this.player.currntState = this.player.states[0];
            this.player.currntState.enter();
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 5;
        }
        update(deltaTime) {
            //if(this.player.currntState != this.player.states[0]){
                this.time += deltaTime;
            //}
            if (this.time > this.maxTime) {
                this.gameOver = true;
            }
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            //handling enemies
            if( this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            }else {
                this.enemyTimer += deltaTime;
            }            
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            //handle floating messages
            this.floatingMessages.forEach(message => {
                message.update();
            });
            //handle Particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if(this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }
            //handle collision animation
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
            });
            //handle marked for deletion
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);            
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            //handle floating messages
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);
        }
        addEnemy() {
            if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new groundEnemy(this));
            else if(this.speed > 0 ) this.enemies.push(new climbingEnemy(this));
            this.enemies.push(new flyingEnemy(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);    
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // console.log(deltaTime);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver)requestAnimationFrame(animate);
    }
    animate(0);
})