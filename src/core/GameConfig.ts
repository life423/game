/**
 * A class to encapsulate game configuration, avoiding mutation of global constants
 * and providing clean access to game settings based on platform.
 * Now with TypeScript support.
 */
import { 
  GAME,
  PLAYER,
  OBSTACLE,
  STATE,
  DESKTOP_SETTINGS,
  KEYS
} from '../js/shared/constants/gameConstants.js';
import { GameConfig as GameConfigInterface } from '../types';

interface GameSettings {
  WINNING_LINE: number;
  BASE_SPEED: number;
  PLAYER_SIZE_RATIO: number;
  MIN_STEP: number;
  OBSTACLE_MIN_WIDTH_RATIO: number;
  OBSTACLE_MAX_WIDTH_RATIO: number;
  MAX_CARS: number;
  DIFFICULTY_INCREASE_RATE: number;
}

interface DebugSettings {
  enabled: boolean;
  showCollisions: boolean;
  showFPS: boolean;
}

export default class GameConfig implements GameConfigInterface {
  private settings: GameSettings;
  private debug: DebugSettings;
  private isDesktop: boolean;
  
  // Game state constants - use the standardized ones from constants
  STATE: {
    WAITING: string;
    STARTING: string;
    PLAYING: string;
    PAUSED: string;
    GAME_OVER: string;
  };
  
  // Optional properties added by performance optimization
  deviceTier?: string;
  targetFPS?: number;
  
  /**
   * Creates a new GameConfig instance
   * @param options - Configuration options
   */
  constructor({ isDesktop = false } = {}) {
    // Create a local copy of settings to avoid mutating the original
    this.settings = {
      WINNING_LINE: GAME.WINNING_LINE,
      BASE_SPEED: OBSTACLE.BASE_SPEED,
      PLAYER_SIZE_RATIO: PLAYER.SIZE_RATIO,
      MIN_STEP: PLAYER.MIN_STEP,
      OBSTACLE_MIN_WIDTH_RATIO: OBSTACLE.MIN_WIDTH_RATIO,
      OBSTACLE_MAX_WIDTH_RATIO: OBSTACLE.MAX_WIDTH_RATIO,
      MAX_CARS: GAME.MAX_OBSTACLES,
      DIFFICULTY_INCREASE_RATE: GAME.DIFFICULTY_INCREASE_RATE
    };
    
    // Apply platform-specific settings if on desktop
    if (isDesktop) {
      this.settings = { ...this.settings, ...DESKTOP_SETTINGS };
    }
    
    // Save platform information
    this.isDesktop = isDesktop;
    
    // Debug settings based on URL parameters
    this.debug = {
      enabled: new URLSearchParams(window.location.search).get('debug') === 'true',
      showCollisions: new URLSearchParams(window.location.search).get('debug') === 'true',
      showFPS: new URLSearchParams(window.location.search).get('debug') === 'true'
    };
    
    // Game state constants
    this.STATE = STATE;
  }
  
  /**
   * Update desktop mode setting
   * @param isDesktop - Whether the game is running on desktop
   */
  setDesktopMode(isDesktop: boolean): void {
    this.isDesktop = isDesktop;
    
    // Create a base set of settings
    const baseSettings: GameSettings = {
      WINNING_LINE: GAME.WINNING_LINE,
      BASE_SPEED: OBSTACLE.BASE_SPEED,
      PLAYER_SIZE_RATIO: PLAYER.SIZE_RATIO,
      MIN_STEP: PLAYER.MIN_STEP,
      OBSTACLE_MIN_WIDTH_RATIO: OBSTACLE.MIN_WIDTH_RATIO,
      OBSTACLE_MAX_WIDTH_RATIO: OBSTACLE.MAX_WIDTH_RATIO,
      MAX_CARS: GAME.MAX_OBSTACLES,
      DIFFICULTY_INCREASE_RATE: GAME.DIFFICULTY_INCREASE_RATE
    };
    
    // Update settings based on platform
    if (isDesktop) {
      this.settings = { ...baseSettings, ...DESKTOP_SETTINGS };
    } else {
      this.settings = { ...baseSettings };
    }
  }
  
  /**
   * Get the winning line position, scaled by the canvas height ratio if needed
   * @param canvasHeight - Current canvas height (optional)
   * @param baseCanvasHeight - Base canvas height (optional)
   * @returns The winning line position
   */
  getWinningLine(canvasHeight?: number, baseCanvasHeight?: number): number {
    const winningLine = this.settings.WINNING_LINE;
    
    // If canvas dimensions are provided, scale the winning line
    if (canvasHeight && baseCanvasHeight) {
      return winningLine * (canvasHeight / baseCanvasHeight);
    }
    
    return winningLine;
  }
  
  /**
   * Get the base movement speed for obstacles
   * @returns The base movement speed
   */
  getBaseSpeed(): number {
    return this.settings.BASE_SPEED;
  }
  
  /**
   * Get the minimum step size for player movement
   * @returns The minimum step size
   */
  getMinStep(): number {
    return this.settings.MIN_STEP;
  }
  
  /**
   * Get the player size ratio relative to canvas
   * @returns The player size ratio
   */
  getPlayerSizeRatio(): number {
    return this.settings.PLAYER_SIZE_RATIO;
  }
  
  /**
   * Get the minimum obstacle width ratio
   * @returns The minimum obstacle width ratio
   */
  getObstacleMinWidthRatio(): number {
    return this.settings.OBSTACLE_MIN_WIDTH_RATIO;
  }
  
  /**
   * Get the maximum obstacle width ratio
   * @returns The maximum obstacle width ratio
   */
  getObstacleMaxWidthRatio(): number {
    return this.settings.OBSTACLE_MAX_WIDTH_RATIO;
  }
  
  /**
   * Get the maximum number of obstacles/cars
   * @returns The maximum number of cars
   */
  getMaxCars(): number {
    return this.settings.MAX_CARS;
  }

  /**
   * Get minimum number of obstacles that should be maintained
   * Added for obstacle pooling optimization
   * @returns The minimum number of obstacles
   */
  getMinObstacles(): number {
    return Math.floor(this.settings.MAX_CARS / 2);
  }
  
  /**
   * Get the difficulty increase rate
   * @returns The difficulty increase rate
   */
  getDifficultyIncreaseRate(): number {
    return this.settings.DIFFICULTY_INCREASE_RATE;
  }
  
  /**
   * Check if debug mode is enabled
   * @returns Whether debug mode is enabled
   */
  isDebugEnabled(): boolean {
    return this.debug.enabled;
  }
  
  /**
   * Check if collision debugging is enabled
   * @returns Whether collision debugging is enabled
   */
  showCollisions(): boolean {
    return this.debug.showCollisions;
  }
  
  /**
   * Get the key mappings
   * @returns The key mappings
   */
  getKeys(): Record<string, string[]> {
    return KEYS;
  }
}
