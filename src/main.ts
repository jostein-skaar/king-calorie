import './style.css';

import Phaser from 'phaser';
import { createGameConfig } from './config';

let isDebug = true;

if (import.meta.env.PROD) {
  isDebug = false;
}

const width = 800;
const height = 600;

console.log('window.inner:', window.innerWidth, 'x', window.innerHeight);
console.table({ width, height });

const gameConfig = createGameConfig(width, height, isDebug);
new Phaser.Game(gameConfig);

window.onload = () => {
  const loader = document.querySelector<HTMLDivElement>('#loader')!;
  const game = document.querySelector<HTMLDivElement>('#game')!;

  loader.style.display = 'none';
  game.style.display = 'block';
};
