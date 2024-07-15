class FightScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FightScene' });
        this.originalPosition = {};
        this.activeCollider = null;
        this.enemyZones = [
            { x: 450, y: 80 }, { x: 580, y: 80 }, { x: 710, y: 80 },
            { x: 450, y: 190 }, { x: 580, y: 190 }, { x: 710, y: 190 },
            { x: 450, y: 300 }, { x: 580, y: 300 }, { x: 710, y: 300 },
            { x: 450, y: 410 }, { x: 580, y: 410 }, { x: 710, y: 410 },
            { x: 450, y: 520 }, { x: 580, y: 520 }, { x: 710, y: 520 }
        ]; 
        this.friendlyZones = [
            { x: 80, y: 70 }, { x: 80, y: 180 }, { x: 80, y: 300 }, { x: 80, y: 420 }, { x: 80, y: 530 },
            { x: 200, y: 70 }, { x: 200, y: 180 }, { x: 200, y: 420 }, { x: 200, y: 530 }
        ];
    }

    preload() {
        this.load.image('token1', 'media/images/fight-player.webp');
        this.load.image('token2', 'media/images/fight-enemy.webp');
        this.load.image('token3', 'media/images/fight-follower.webp');
        this.load.image('background', 'media/images/riverine_forest.jpg');
        this.load.audio('collisionSound', 'media/soundfx/headslam.wav');
        this.load.spritesheet('animations', 'media/vfx/anisheet.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        const bg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        const scaleX = this.cameras.main.width / bg.width;
        const scaleY = this.cameras.main.height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);

        this.token1 = this.physics.add.sprite(200, 300, 'token1');
        this.token1.name = 'token1';
        this.originalPosition = { x: this.token1.x, y: this.token1.y };

        const numberOfFriendlies = Phaser.Math.Between(0,9);
        console.log(numberOfFriendlies + " friendlies!");

        Phaser.Utils.Array.Shuffle(this.friendlyZones);

        const numberOfEnemies = Phaser.Math.Between(1,15);
        console.log(numberOfEnemies + " enemies!");
        this.tokens = [this.token1];

        Phaser.Utils.Array.Shuffle(this.enemyZones);

        for (let i = 0; i < numberOfFriendlies; i++) {
            const zone = this.friendlyZones[i];
            const token = this.physics.add.sprite(zone.x, zone.y, 'token3');
            token.name = `fToken${i + 2}`;
            token.originalX = zone.x;
            token.originalY = zone.y;
            this.tokens.push(token)
        }

        for (let i = 0; i < numberOfEnemies; i++) {
            const zone = this.enemyZones[i];
            const token = this.physics.add.sprite(zone.x, zone.y, 'token2');
            token.name = `eToken${i + 2}`;
            token.originalX = zone.x;
            token.originalY = zone.y;
            this.tokens.push(token);
        }

        this.tokens.forEach(token => {
            token.setInteractive();
            token.on('pointerdown', () => this.markToken(token));
        });

        this.collisionSound = this.sound.add('collisionSound');

        const attackButton = this.add.text(100, 620, 'Attack', { fill: '#0f0' })
            .setInteractive()
            .on('pointerdown', () => this.attack());

        this.markedToken = null;

        this.anims.create({
            key: 'hit',
            frames: this.anims.generateFrameNumbers('animations', { start: 10, end: 19 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'moveForward',
            frames: this.anims.generateFrameNumbers('animations', { start: 20, end: 29 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: 'collision',
            frames: this.anims.generateFrameNumbers('animations', { start: 30, end: 38 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'preBack',
            frames: this.anims.generateFrameNumbers('animations', { start: 39, end: 47 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'backward',
            frames: this.anims.generateFrameNumbers('animations', { start: 48, end: 56 }),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: 'return',
            frames: this.anims.generateFrameNumbers('animations', { start: 57, end: 66 }),
            frameRate: 10,
            repeat: 0
        });

        this.animSprite = this.add.sprite(0, 0, 'animations').setVisible(false);
        this.animSprite.setScale(3); 
        this.animSprite2 = this.add.sprite(0, 0, 'animations').setVisible(false);
        this.animSprite2.setScale(3); 
    }

    update() {
        if (this.animSprite.visible) {
            this.animSprite.setPosition(this.token1.x, this.token1.y);
        }
    }

    markToken(clickedToken) {
        if (this.markedToken === clickedToken) {
            this.unmarkToken();
        } else {
            this.unmarkToken();

            clickedToken.setTint(0xff0000);
            this.markedToken = clickedToken;

            this.activeCollider = this.physics.add.collider(this.token1, clickedToken, this.handleCollision, null, this);
        }
    }

    unmarkToken() {
        if (this.markedToken) {
            this.markedToken.clearTint();
            this.markedToken = null;
        }
        if (this.activeCollider) {
            this.physics.world.removeCollider(this.activeCollider);
            this.activeCollider = null;
        }
    }

    attack() {
        if (!this.markedToken) {
            console.log('No target selected');
            return;
        }

        const angle = Phaser.Math.Angle.Between(
            this.token1.x, this.token1.y,
            this.markedToken.x, this.markedToken.y
        );

        const speed = 1500;
        const distance = 100; 

        const velocityX = Math.cos(angle);
        const velocityY = Math.sin(angle);

        this.animSprite.setPosition(this.token1.x, this.token1.y).setVisible(true);
        this.animSprite.play('preBack');

        this.tweens.add({
            targets: this.token1,
            x: this.token1.x - velocityX * distance,
            y: this.token1.y - velocityY * distance,
            duration: 200,
            onStart: () => {
                this.animSprite.play('backward');
            },
            onUpdate: () => {
                this.animSprite.setPosition(this.token1.x, this.token1.y);
            },
            onComplete: () => {
                this.moveForward(velocityX, velocityY, speed);
            }
        });
    }

    moveForward(velocityX, velocityY, speed) {
        this.animSprite.play('moveForward');
        this.token1.setVelocity(velocityX * speed, velocityY * speed);
    }

    handleCollision(attack_token, target_token) {
        attack_token.setVelocity(0, 0);
        target_token.setVelocity(0, 0);
    
        this.collisionSound.play();
    
        this.animSprite2.setVisible(true);
        this.animSprite.setPosition(attack_token.x, attack_token.y).play('collision');
        this.animSprite2.setPosition(target_token.x, target_token.y).play('hit');

        this.cameras.main.shake(250, 0.01);
    
        this.tweens.add({
            targets: [attack_token, target_token],
            scale: '*=0.5',
            duration: 200,
            yoyo: true,
            onComplete: () => {
                attack_token.setScale(1);
                target_token.setScale(1);
                target_token.clearTint();
    
                this.time.delayedCall(500, () => {
                    this.tweens.add({
                        targets: [attack_token, target_token],
                        x: (target) => target === attack_token ? this.originalPosition.x : target.originalX,
                        y: (target) => target === attack_token ? this.originalPosition.y : target.originalY,
                        duration: 500,
                        onStart: () => {
                            this.animSprite.play('return');
                            this.animSprite2.setVisible(false);
                        },
                        onUpdate: () => {
                            this.animSprite.setPosition(attack_token.x, attack_token.y);
                        },
                        onComplete: () => {
                            attack_token.setVelocity(0, 0);
                            target_token.setVelocity(0, 0);
                            this.animSprite.setVisible(false);
                            this.markedToken = null;
                        }
                    });
                });
            }
        });
    
        this.physics.world.removeCollider(this.activeCollider);
        this.activeCollider = null;
    }
    
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: FightScene
};

const game = new Phaser.Game(config);
