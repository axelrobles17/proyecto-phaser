import Phaser from "phaser";

class Escena extends Phaser.Scene {

    platforms = null;
    player = null;
    cursors = null;
    stars = null;
    score = 0;
    bomb = null;

    preload() {

        // carga cada imagen
        this.load.image('sky', 'img/sky.png');
        this.load.image('ground', 'img/platform.png');
        this.load.image('star', 'img/star.png');
        this.load.image('bomb', 'img/bomb.png');
        this.load.spritesheet('dude',
            'img/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create() {

        // crea el fondo de la pantalla
        this.add.image(400, 300, 'sky'); 
        
        // crea las plataformas y se le asigna un comportamiento estatico en grupo
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        
        // agrega al player y se le asigna un sprite "dude"
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);      
        
        // se crean los movimientos
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });     
        
        // agrega las estrellas a la pantalla
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        // generra un efecto de rebote en grupo
        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        // causa que el player no traspase las plataformas
        this.physics.add.collider(this.player, this.platforms);
        
        // causa que las estrellas no traspasen las plataformas
        this.physics.add.collider(this.stars, this.platforms);
        
        // crea el objeto "cursors" con 4 propiedades
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // colision entre las estrellas con el player
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // agraga el texto para la puntuación
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    }
    update() {
        
        // movimientos segun la tecla
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160); 
            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }   
 
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }
}

export default Escena;