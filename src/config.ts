import { HomeScene } from './home-scene';
import { LoseScene } from './lose-scene';
import { MainScene } from './main-scene';
import { PreloadScene } from './preload-scene';

export function createGameConfig(
  width: number,
  height: number,
  // scalingModePhaser: Phaser.Scale.ScaleModes,
  // centerModePhaser: Phaser.Scale.Center,
  isDebug: boolean
  
): Phaser.Types.Core.GameConfig {
  const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    // type: Phaser.CANVAS,
    scene: [PreloadScene, HomeScene, MainScene, LoseScene],
    width,
    height,
    backgroundColor: 0x87ceeb,
    autoFocus: true,
    parent: 'game',
    fps: { limit: 60 },
    render: {
      antialias: true,
      // antialias: true, // Using this to prevent flickering presents when moving (at least on iPhone with pixelRatio 3).
      // antialias: false, er default, giving a crisper appearance.
      // antialias: true, // giving a smooth appearance.
      // roundPixels: true, round pixel values to whole integers? Prevent sub-pixel aliasing. (false er default)
      // pixelArt: true, // gir antialias=false og roundPixels=true
    },

    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: isDebug,        
      },
      
    },

    scale: {
      // Vi har denne som FIT først, for da vil canvas.style.width og .height settes automatisk.
      // Må fjernes etterpå, ellers vil rare ting skje i forbindelse med resize.
      // mode: scalingModePhaser,
      // autoCenter: centerModePhaser,
      // mode: Phaser.Scale.ScaleModes.NONE,
      autoCenter: Phaser.Scale.Center.CENTER_BOTH,
      // mode: Phaser.Scale.ScaleModes.NONE,
      mode: Phaser.Scale.ScaleModes.FIT,
      // autoCenter: Phaser.Scale.Center.CENTER_BOTH,
      // autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY,
      // autoCenter: Phaser.Scale.Center.CENTER_VERTICALLY,
      // expandParent: true,
      // autoRound: true,
    },
  };

  return gameConfig;
}
