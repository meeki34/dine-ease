import { useEffect, useRef, useState, useCallback } from 'react';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';
import '../styles/PretextHero.css';

const WORDS = ['Efficiency', 'Profitability', 'Excellence', 'Control'];
const CYCLE_MS = 3200;
const CHAR_STAGGER = 35;
const BASE_FONT = '72px Inter, sans-serif';
const SUB_FONT = '20px Inter, sans-serif';
const SUBTITLE_TEXT = 'The definitive restaurant management operating system built for the world\'s most prestigious dining establishments.';

// Ambient particle system
class Particle {
  constructor(canvas) {
    this.reset(canvas, true);
  }
  reset(canvas, initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
    this.size = 14 + Math.random() * 18;
    this.speed = 0.3 + Math.random() * 0.6;
    this.opacity = 0.08 + Math.random() * 0.15;
    this.wobble = Math.random() * Math.PI * 2;
    this.wobbleSpeed = 0.005 + Math.random() * 0.01;
    this.emoji = ['🍽️', '🍷', '🥘', '⭐', '✨', '🔥', '🍴'][Math.floor(Math.random() * 7)];
  }
  update(canvas) {
    this.y -= this.speed;
    this.wobble += this.wobbleSpeed;
    this.x += Math.sin(this.wobble) * 0.4;
    if (this.y < -30) this.reset(canvas);
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.font = `${this.size}px serif`;
    ctx.fillText(this.emoji, this.x, this.y);
    ctx.restore();
  }
}

const PretextHero = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    wordIdx: 0,
    nextWordIdx: 1,
    transitionProgress: 0,
    phase: 'showing', // 'showing' | 'transitioning'
    phaseStart: 0,
    particles: [],
    charPositions: [],
    nextCharPositions: [],
  });

  const getCanvasSize = useCallback(() => {
    const container = canvasRef.current?.parentElement;
    if (!container) return { w: 600, h: 340 };
    return { w: container.clientWidth, h: 340 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const { w, h } = getCanvasSize();
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const state = stateRef.current;
    state.particles = Array.from({ length: 12 }, () => new Particle(canvas));
    state.phaseStart = performance.now();

    // Precompute character layout for a word
    const computeChars = (word, canvasW) => {
      const fullText = `Elevate ${word}`;
      try {
        const prepared = prepareWithSegments(fullText, BASE_FONT);
        const { lines } = layoutWithLines(prepared, canvasW - 60, 82);

        const chars = [];
        let y = 0;
        for (const line of lines) {
          // Measure each character in the line
          let x = 30; // left padding
          for (let i = 0; i < line.text.length; i++) {
            const ch = line.text[i];
            ctx.font = BASE_FONT;
            const charW = ctx.measureText(ch).width;
            const isHighlight = fullText.indexOf(word) <= (chars.length + i)
              && (chars.length + i) < fullText.indexOf(word) + word.length;
            chars.push({ ch, x, y: y + 80, w: charW, highlight: isHighlight });
            x += charW;
          }
          y += 82;
        }
        return chars;
      } catch {
        // Fallback if Pretext fails
        const chars = [];
        let x = 30;
        ctx.font = BASE_FONT;
        for (let i = 0; i < fullText.length; i++) {
          const ch = fullText[i];
          const charW = ctx.measureText(ch).width;
          const isHighlight = i >= fullText.indexOf(word) && i < fullText.indexOf(word) + word.length;
          chars.push({ ch, x, y: 80, w: charW, highlight: isHighlight });
          x += charW;
        }
        return chars;
      }
    };

    // Subtitle layout with Pretext
    const computeSubtitle = (canvasW) => {
      try {
        const prepared = prepareWithSegments(SUBTITLE_TEXT, SUB_FONT);
        const { lines } = layoutWithLines(prepared, canvasW - 60, 30);
        return lines;
      } catch {
        return [{ text: SUBTITLE_TEXT }];
      }
    };

    // Easing
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // Animation loop
    const animate = (now) => {
      const { w, h } = getCanvasSize();
      ctx.clearRect(0, 0, w, h);

      // Draw particles
      for (const p of state.particles) {
        p.update(canvas);
        p.draw(ctx);
      }

      const elapsed = now - state.phaseStart;

      if (state.phase === 'showing') {
        // Show current word with stagger reveal
        state.charPositions = computeChars(WORDS[state.wordIdx], w);
        const chars = state.charPositions;

        for (let i = 0; i < chars.length; i++) {
          const delay = i * CHAR_STAGGER;
          const t = Math.min(Math.max((elapsed - delay) / 400, 0), 1);
          const ease = easeInOutCubic(t);

          ctx.save();
          ctx.globalAlpha = ease;
          ctx.font = BASE_FONT;

          if (chars[i].highlight) {
            // Amber gradient for the cycling word
            const gradient = ctx.createLinearGradient(chars[i].x, chars[i].y - 60, chars[i].x + chars[i].w, chars[i].y);
            gradient.addColorStop(0, '#f48c25');
            gradient.addColorStop(1, '#ff6b35');
            ctx.fillStyle = gradient;

            // Glow effect
            ctx.shadowColor = 'rgba(244, 140, 37, 0.4)';
            ctx.shadowBlur = 20 * ease;
          } else {
            ctx.fillStyle = '#ffffff';
          }

          const offsetY = (1 - ease) * 20;
          ctx.fillText(chars[i].ch, chars[i].x, chars[i].y + offsetY);
          ctx.restore();
        }

        // Transition after CYCLE_MS
        if (elapsed > CYCLE_MS) {
          state.phase = 'transitioning';
          state.phaseStart = now;
          state.nextWordIdx = (state.wordIdx + 1) % WORDS.length;
          state.nextCharPositions = computeChars(WORDS[state.nextWordIdx], w);
        }
      } else {
        // Transitioning between words
        const duration = 600;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);

        const currentChars = computeChars(WORDS[state.wordIdx], w);
        const nextChars = computeChars(WORDS[state.nextWordIdx], w);

        // Fade out current
        for (let i = 0; i < currentChars.length; i++) {
          ctx.save();
          ctx.font = BASE_FONT;
          ctx.globalAlpha = 1 - ease;

          if (currentChars[i].highlight) {
            const gradient = ctx.createLinearGradient(currentChars[i].x, currentChars[i].y - 60, currentChars[i].x + currentChars[i].w, currentChars[i].y);
            gradient.addColorStop(0, '#f48c25');
            gradient.addColorStop(1, '#ff6b35');
            ctx.fillStyle = gradient;
          } else {
            ctx.fillStyle = '#ffffff';
          }

          ctx.fillText(currentChars[i].ch, currentChars[i].x, currentChars[i].y - ease * 15);
          ctx.restore();
        }

        // Fade in next
        for (let i = 0; i < nextChars.length; i++) {
          ctx.save();
          ctx.font = BASE_FONT;
          ctx.globalAlpha = ease;

          if (nextChars[i].highlight) {
            const gradient = ctx.createLinearGradient(nextChars[i].x, nextChars[i].y - 60, nextChars[i].x + nextChars[i].w, nextChars[i].y);
            gradient.addColorStop(0, '#f48c25');
            gradient.addColorStop(1, '#ff6b35');
            ctx.fillStyle = gradient;

            ctx.shadowColor = 'rgba(244, 140, 37, 0.4)';
            ctx.shadowBlur = 20 * ease;
          } else {
            ctx.fillStyle = '#ffffff';
          }

          ctx.fillText(nextChars[i].ch, nextChars[i].x, nextChars[i].y + (1 - ease) * 15);
          ctx.restore();
        }

        if (progress >= 1) {
          state.wordIdx = state.nextWordIdx;
          state.phase = 'showing';
          state.phaseStart = now;
        }
      }

      // Draw subtitle with Pretext layout
      const subLines = computeSubtitle(w);
      const subStartY = 200;
      ctx.font = SUB_FONT;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      for (let i = 0; i < subLines.length; i++) {
        ctx.fillText(subLines[i].text, 30, subStartY + i * 30);
      }

      // "Powered by Pretext" subtle watermark
      ctx.save();
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillText('text layout: @chenglou/pretext', w - 200, h - 10);
      ctx.restore();

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [getCanvasSize]);

  return (
    <div className="pretext-hero-wrapper">
      <canvas ref={canvasRef} className="pretext-hero-canvas" />
    </div>
  );
};

export default PretextHero;
