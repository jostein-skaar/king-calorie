import Phaser, { GameObjects } from 'phaser';

export class MainScene extends Phaser.Scene {
  emitter!: GameObjects.Particles.ParticleEmitter;
  hero!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  foodGroup!: Phaser.Physics.Arcade.Group;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  speedX = 400;
  speedY = -300;
  foodSpeed = 100;
  score = 0;
  scoreText!: GameObjects.Text;
  kcalInfoText!: GameObjects.Text;
  kcalText!: GameObjects.Text;
  maxFoodObjects = 100;
  health = 1500;
  healthMin = 0;
  healthMax = 3000;
  healthBar!: GameObjects.Rectangle;
  healthBarMax = 360;

  foods: any = {
    apple: 60,
    banana: 100,
    'bread-egg': 180,
    'bread-salmon': 160,
    carrot: 36,
    chocolate: 1100,
    cola: 210,
    hamburger: 900,
    'ice-cream': 150,
    pringles: 206,
  };

  timeSinceStart = 0;
  timeSinceFoodLimit = 1000;
  timeSinceFood: number | undefined = undefined;

  constructor() {
    super('main-scene');
  }

  preload(): void {
    this.load.multiatlas('sprites', `/assets/sprites@1.json?v={VERSJON}`, '/assets');
  }

  create(): void {
    const healthBarContainer = this.add
      .rectangle(this.scale.width / 2, 26, 360, 30, 0xffffff)
      .setStrokeStyle(2, 0x000000)
      .setDepth(1);
    this.healthBar = this.add
      .rectangle(
        healthBarContainer.x - (healthBarContainer.width - healthBarContainer.lineWidth) / 2,
        healthBarContainer.y,
        healthBarContainer.width - healthBarContainer.lineWidth,
        healthBarContainer.height - healthBarContainer.lineWidth,
        0xff00ff
      )
      .setDepth(1)
      .setOrigin(0, 0.5);

    this.scoreText = this.add.text(16, 16, 'kcal: 0', { fontSize: '24px', color: '#000' }).setDepth(1);
    this.kcalInfoText = this.add
      .text(healthBarContainer.x + healthBarContainer.width / 2 + 16, 16, '', { fontSize: '24px', color: '#000' })
      .setDepth(1);
    this.kcalText = this.add.text(healthBarContainer.x, 16, '', { fontSize: '24px', color: '#000' }).setDepth(1).setOrigin(0.5, 0);

    this.cursors = this.input.keyboard.createCursorKeys();
    const groundHeight = 75;
    const ground = this.add.rectangle(this.scale.width / 2, this.scale.height - groundHeight / 2, this.scale.width, groundHeight, 0x9beb34);
    this.physics.add.existing(ground, true);

    this.hero = this.physics.add.sprite(0, 0, 'sprites', 'hero-001.png');
    this.hero.setPosition(this.scale.width / 2, this.scale.height - this.hero.height / 2 - groundHeight);
    this.hero.setBounce(0.2);
    this.hero.setCollideWorldBounds(true);
    this.createAnimations();

    this.foodGroup = this.physics.add.group({ allowGravity: false });

    this.physics.add.collider(this.hero, ground);
    // this.physics.add.collider(this.goodFoodGroup, ground);
    // this.physics.add.collider(this.badFoodGroup, ground);

    this.physics.add.overlap(this.hero, this.foodGroup, (_hero, food: any) => {
      this.collectFood(food);
    });

    this.emitter = this.add.particles('sprites', 'particle-star-001.png').createEmitter({
      scale: { start: 1, end: 0 },
      speed: { min: 0, max: 100 },
      active: false,
      lifespan: 500,
      quantity: 20,
    });
  }

  update(_time: number, delta: number): void {
    if (this.cursors.left.isDown) {
      this.hero.setVelocityX(-this.speedX);
      this.hero.anims.play('walk', true);
      this.hero.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.hero.setVelocityX(this.speedX);
      this.hero.anims.play('walk', true);
      this.hero.setFlipX(false);
    } else {
      this.hero.setVelocityX(0);
      this.hero.anims.play('stand', true);
      this.hero.setFlipX(false);
    }

    // if (this.cursors.up.isDown && this.hero.body.touching.down) {
    //   this.hero.setVelocityY(this.speedY);
    // }

    this.foodGroup.children.iterate((food: any) => {
      if (food.y > this.scale.height + food.height) {
        food.disableBody(true, true);
      }
    });

    if (this.timeSinceFood === undefined || this.timeSinceFood > this.timeSinceFoodLimit) {
      this.createFood();
      this.timeSinceFood = 0;
    } else {
      this.timeSinceFood += delta;
    }

    const newFoodSpeed = Math.floor(this.timeSinceStart / 5000);
    this.timeSinceFoodLimit = 1500 - newFoodSpeed * 100;
    if (this.timeSinceFoodLimit <= 0) {
      this.timeSinceFoodLimit = 250;
    }
    console.log(newFoodSpeed, this.timeSinceFoodLimit);

    this.health -= 2;

    this.timeSinceStart += delta;

    this.score = this.timeSinceStart / 1000;
    this.scoreText.setText(`time: ${this.score.toFixed(1)}`);

    this.kcalText.setText(`${this.health} kcal`);
    this.drawHealthBar();
  }

  private collectFood(food: any) {
    food.disableBody(true, true);

    const foodName = food.foodName;
    const addedeKcal = this.foods[foodName];
    this.health += addedeKcal;
    this.kcalInfoText.setText(`+${addedeKcal}`);

    const bounds = food.getBounds();
    this.emitter.setPosition(bounds.left, bounds.top);
    this.emitter.active = true;
    this.emitter.setEmitZone({
      source: new Phaser.Geom.Rectangle(0, 0, bounds.width, bounds.height),
      type: 'random',
      quantity: 1,
    });
    this.emitter.explode();
  }

  private createAnimations() {
    this.hero.anims.create({
      key: 'stand',
      frames: [{ key: 'sprites', frame: 'hero-001.png' }],
      frameRate: 6,
      repeat: -1,
    });
    this.hero.anims.create({
      key: 'walk',
      frames: [
        { key: 'sprites', frame: 'hero-002.png' },
        { key: 'sprites', frame: 'hero-003.png' },
      ],
      frameRate: 6,
      repeat: -1,
    });
  }

  private createFood() {
    let food: any = this.foodGroup.getFirstDead();

    const recycleExistingObject = food && this.maxFoodObjects <= this.foodGroup.getLength();

    if (recycleExistingObject) {
      food.enableBody(true, 0, 0, true, true);
    } else {
      const foodNames = Object.keys(this.foods);
      const foodName = foodNames[Phaser.Math.Between(0, foodNames.length - 1)];
      food = this.foodGroup.create(0, 0, 'sprites', `food-${foodName}.png`);
      food.foodName = foodName;
    }

    const x = Phaser.Math.Between(food.width / 2, this.scale.width - food.width / 2);
    const y = -food.height / 2;

    food.setPosition(x, y);
    food.setVelocityY(this.foodSpeed);
  }

  private drawHealthBar() {
    const percent = Math.max(Math.min(this.health / this.healthMax, 1), 0);
    this.healthBar.setScale(percent, 1);

    if (percent < 0.2 || percent > 0.8) {
      this.healthBar.setFillStyle(0xf21405);
    } else if (percent < 0.5 || percent > 0.7) {
      this.healthBar.setFillStyle(0xf2de05);
    } else {
      this.healthBar.setFillStyle(0x00fa00);
    }
  }
}
