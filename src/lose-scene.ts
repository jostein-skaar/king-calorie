export class LoseScene extends Phaser.Scene {
  lastScore!: number;
  dyingHealth!: number;

  constructor() {
    super({ key: 'lose-scene' });
  }

  init(data: any) {
    this.lastScore = data.score;
    this.dyingHealth = data.health;
  }

  create() {
    const text = `You survived for ${this.lastScore.toFixed(2)} seconds\nHit SPACE or click to try again`;
    this.add
      .text(this.scale.width / 2, this.scale.height / 2, text, {
        fontFamily: 'arial',
        fontSize: '20px',
        color: '#000',
        align: 'center',
        backgroundColor: '#87ceeb',
        padding: { x: 5, y: 5 },
      })
      .setOrigin(0.5, 0.5);

    const goToHomeSceneTimeout = setTimeout(() => {
      this.scene.setVisible(false, 'main-scene');
      this.scene.start('home-scene');
    }, 15000);

    setTimeout(() => {
      this.input.once('pointerdown', () => {
        clearTimeout(goToHomeSceneTimeout);
        this.scene.start('main-scene');
      });
    }, 500);

    this.input.keyboard!.once('keydown-' + 'SPACE', () => {
      clearTimeout(goToHomeSceneTimeout);
      this.scene.start('main-scene');
    });
  }
}
