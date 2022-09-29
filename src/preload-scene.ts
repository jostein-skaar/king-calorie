export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload-scene');
  }

  preload(): void {
    this.load.multiatlas('sprites', `/assets/sprites@1.json?v={VERSJON}`, '/assets');
  }

  create(): void {
    this.scene.start('home-scene');
  }
}
