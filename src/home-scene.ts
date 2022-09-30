export class HomeScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'home-scene' });
  }

  create() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    const groundHeight = 75;
    this.add.rectangle(this.scale.width / 2, this.scale.height - groundHeight / 2, this.scale.width, groundHeight, 0x9beb34);

    const hero = this.add.image(0, 0, 'sprites', 'hero-001.png');
    hero.setPosition(this.scale.width / 2, this.scale.height - hero.height / 2 - groundHeight);

    this.add
      .text(this.scale.width / 2, 200, "Help me to stay alive. And let's not eat to much, please!\n\nHit SPACE or click to begin", {
        fontFamily: 'arial',
        fontSize: '20px',
        color: '#000',
        align: 'center',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .once('pointerdown', () => this.startNewGame());

    this.input.keyboard!.once('keydown-' + 'SPACE', () => this.startNewGame());

    this.input.once('pointerdown', () => this.startNewGame());

    // const versjonTekst = this.add
    //   .text(0, 225, 'Versjon {VERSJON}', { fontFamily: 'arial', fontSize: '14px', fill: '#000', align: 'center' })
    //   .setOrigin(0.5, 0.5);
  }

  private startNewGame() {
    this.scene.sleep();
    this.scene.start('main-scene');
  }
}
