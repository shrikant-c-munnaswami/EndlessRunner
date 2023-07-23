class Particle {
    constructor(game){
        this.game = game;
        this.markForDeletion = false;
    }
    update(){
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        this.size *= 0.97;
        if(this.size < 0.5) this.markForDeletion = true;
    }
}

export class Dust extends Particle{
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 8 + 8;
        this.x = x;
        this.y = y;
        this.speedX = Math.random();
        this.speedY = Math.random();
        this.color = 'rgba(196, 192, 237, 0.5)';
    }
    draw(context){
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }
}
export class Splash extends Particle{
    constructor(game, x, y){
        super(game);
        this.size = Math.random() * 100 + 100;
        this.x = x - this.size * 0.8;
        this.y = y - this.size * 0.7; 
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 2 + 2;
        this.gravity = 0;
        this.image = fire;
    }
    update(){
        super.update();
        this.gravity += 0.1;
        this.y += this.gravity;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.size, this.size);
    }
}
export class Fire extends Particle{
    constructor(game, x, y){
        super(game);
        this.image = fire;
        this.size = Math.random() * 100 + 50;
        this.x = x;
        this.y = y;
        this.speedX = 1;
        this.speedY = 1;   
        this.angle = 0;
        this.va = Math.random() * 0.3 - 0.1;        
    }
    update(){
       super.update();
       this.angle += this.va;
       this.x  += Math.sin(this.angle * 5);
    }
    draw(context){
        context.save();
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        context.drawImage(this.image, -this.size * 0.5, -this.size * 0.5, this.size, this.size);
        context.restore();
    }
}
