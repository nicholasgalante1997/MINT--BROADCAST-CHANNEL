import Attack from './Attack.js';
import Option from '../lib/Option.js';

class Pokemon {
  /**
   * @type {string}
   */
  id;
  /**
   * @type {string}
   */
  name;
  /**
   * @type {string}
   */
  type;
  /**
   * @type {number}
   */
  level;
  attacks;
  images;
  max_health;
  current_health;
  trainer;

  constructor(id, name, type, level, attacks, images, max_health, current_health, trainer) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.level = level;
    this.attacks = attacks;
    this.images = images;
    this.maxHealth = max_health;
    this.currentHealth = current_health;
    this.trainer = trainer;
  }
}
