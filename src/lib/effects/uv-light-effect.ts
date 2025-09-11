// UV Light Effect System for Whispers in the Library
// Simulates UV light revealing hidden fluorescent elements

import React from 'react';

export interface UVLightConfig {
  intensity: number;
  color: string;
  revealSpeed: number;
  flickerRate?: number;
}

export class UVLightEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isActive: boolean = false;
  private animationId: number | null = null;
  private config: UVLightConfig;
  private hiddenElements: UVElement[] = [];
  private revealedElements: UVElement[] = [];

  constructor(canvas: HTMLCanvasElement, config: UVLightConfig = {
    intensity: 0.8,
    color: '#8A2BE2', // Blue violet
    revealSpeed: 0.02,
    flickerRate: 0.1
  }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;
    this.setupCanvas();
  }

  private setupCanvas(): void {
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '10';
    this.canvas.style.mixBlendMode = 'screen';
  }

  public addHiddenElement(element: UVElement): void {
    this.hiddenElements.push(element);
  }

  public removeHiddenElement(id: string): void {
    this.hiddenElements = this.hiddenElements.filter(el => el.id !== id);
  }

  public toggleUVLight(): void {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.startUVEffect();
    } else {
      this.stopUVEffect();
    }
  }

  public setUVLight(active: boolean): void {
    this.isActive = active;
    
    if (active) {
      this.startUVEffect();
    } else {
      this.stopUVEffect();
    }
  }

  private startUVEffect(): void {
    this.animate();
  }

  private stopUVEffect(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.clearCanvas();
  }

  private animate(): void {
    this.clearCanvas();
    this.drawUVOverlay();
    this.revealElements();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawUVOverlay(): void {
    const { width, height } = this.canvas;
    
    // Create UV light gradient
    const gradient = this.ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    
    gradient.addColorStop(0, `rgba(138, 43, 226, ${this.config.intensity * 0.3})`);
    gradient.addColorStop(0.5, `rgba(138, 43, 226, ${this.config.intensity * 0.1})`);
    gradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);
    
    // Add flicker effect
    if (this.config.flickerRate && Math.random() < this.config.flickerRate) {
      this.ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
      this.ctx.fillRect(0, 0, width, height);
    }
  }

  private revealElements(): void {
    this.hiddenElements.forEach(element => {
      if (!element.isRevealed) {
        element.revealProgress += this.config.revealSpeed;
        
        if (element.revealProgress >= 1) {
          element.isRevealed = true;
          element.revealProgress = 1;
          this.revealedElements.push(element);
        }
        
        this.drawElement(element);
      }
    });
  }

  private drawElement(element: UVElement): void {
    const { x, y, width, height, content, type } = element;
    const alpha = element.revealProgress * 0.9;
    
    this.ctx.save();
    this.ctx.globalAlpha = alpha;
    
    if (type === 'text') {
      this.ctx.fillStyle = '#00FF00'; // Bright green for UV text
      this.ctx.font = 'bold 16px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(content, x + width / 2, y + height / 2);
    } else if (type === 'letter') {
      this.ctx.fillStyle = '#00FF00';
      this.ctx.font = 'bold 24px serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(content, x + width / 2, y + height / 2);
    } else if (type === 'symbol') {
      this.ctx.strokeStyle = '#00FF00';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(x, y, width, height);
    }
    
    this.ctx.restore();
  }

  public updateConfig(newConfig: Partial<UVLightConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getRevealedElements(): UVElement[] {
    return this.revealedElements;
  }

  public reset(): void {
    this.hiddenElements.forEach(element => {
      element.isRevealed = false;
      element.revealProgress = 0;
    });
    this.revealedElements = [];
    this.stopUVEffect();
  }

  public destroy(): void {
    this.stopUVEffect();
    this.hiddenElements = [];
    this.revealedElements = [];
  }
}

export interface UVElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  type: 'text' | 'letter' | 'symbol';
  isRevealed: boolean;
  revealProgress: number;
}

// Utility function to create UV elements for the library puzzle
export function createLibraryUVElements(): UVElement[] {
  const elements: UVElement[] = [];
  const letters = ['E', 'L', 'S', 'E', 'Ñ', 'O', 'R', 'C', 'I', 'P', 'R', 'E'];
  
  letters.forEach((letter, index) => {
    elements.push({
      id: `book-${index + 1}`,
      x: 50 + (index % 6) * 80,
      y: 100 + Math.floor(index / 6) * 100,
      width: 60,
      height: 80,
      content: letter,
      type: 'letter',
      isRevealed: false,
      revealProgress: 0
    });
  });
  
  return elements;
}

// Hook for React components
export function useUVLightEffect(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [uvEffect, setUVEffect] = React.useState<UVLightEffect | null>(null);
  const [isUVActive, setIsUVActive] = React.useState(false);

  React.useEffect(() => {
    if (canvasRef.current) {
      const effect = new UVLightEffect(canvasRef.current);
      setUVEffect(effect);
      
      return () => {
        effect.destroy();
      };
    }
  }, [canvasRef]);

  const toggleUV = React.useCallback(() => {
    if (uvEffect) {
      uvEffect.toggleUVLight();
      setIsUVActive(!isUVActive);
    }
  }, [uvEffect, isUVActive]);

  const setUV = React.useCallback((active: boolean) => {
    if (uvEffect) {
      uvEffect.setUVLight(active);
      setIsUVActive(active);
    }
  }, [uvEffect]);

  return {
    uvEffect,
    isUVActive,
    toggleUV,
    setUV
  };
}

export default UVLightEffect;
