import React, { useEffect, useRef } from 'react';

const SpiralBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: null, y: null };
        let animationFrameId;

        const config = {
            particleCount: 120, // Reduced for performance in React
            colors: ['#f59e0b', '#ffb34d', '#f6f2ea', '#d97706'],
            minRadius: 1,
            maxRadius: 3,
        };

        const resize = () => {
            if (!canvas) return;
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            init();
        };

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.angle = Math.random() * Math.PI * 2;
                this.distance = Math.random() * (Math.min(width, height) * 0.8);
                this.velocity = Math.random() * 0.01 + 0.005;
                this.speed = Math.random() * 2 + 1;
                this.radius = Math.random() * (config.maxRadius - config.minRadius) + config.minRadius;
                this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
                this.opacity = Math.random() * 0.4 + 0.1;
                this.ease = 0.05;
                
                this.x = width / 2 + Math.cos(this.angle) * this.distance;
                this.y = height / 2 + Math.sin(this.angle) * this.distance;
                this.baseX = this.x;
                this.baseY = this.y;
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                
                // Anime speed trail
                const trailLength = this.speed * 12;
                const tx = this.x - Math.cos(this.angle) * trailLength;
                const ty = this.y - Math.sin(this.angle) * trailLength;
                ctx.lineTo(tx, ty);
                
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.radius * 0.5;
                ctx.lineCap = 'round';
                ctx.globalAlpha = this.opacity * 0.3;
                
                // Glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.stroke();
                
                // Core
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#fff'; 
                ctx.globalAlpha = this.opacity;
                ctx.fill();
                ctx.restore();
            }

            update() {
                // Mouse interaction (Repulsion)
                if (mouse.x !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    let forceFactor = 150;
                    let force = (forceFactor - dist) / forceFactor;

                    if (dist < forceFactor) {
                        this.x -= dx * force * 0.15;
                        this.y -= dy * force * 0.15;
                    }
                }

                // Spiral movement
                this.angle += this.velocity * 0.6;
                this.distance += this.speed * 0.4;
                
                if (this.distance > Math.max(width, height) * 0.9) {
                    this.distance = 0;
                    this.angle = Math.random() * Math.PI * 2;
                }

                this.baseX = width / 2 + Math.cos(this.angle) * this.distance;
                this.baseY = height / 2 + Math.sin(this.angle) * this.distance;

                // Easing back to path
                this.x += (this.baseX - this.x) * this.ease;
                this.y += (this.baseY - this.y) * this.ease;

                this.draw();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < config.particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.fillStyle = 'rgba(11, 10, 8, 0.15)'; // Trail blend
            ctx.fillRect(0, 0, width, height);
            
            particles.forEach(p => p.update());
            animationFrameId = requestAnimationFrame(animate);
        };

        const resizeObserver = new ResizeObserver(() => {
            resize();
        });
        resizeObserver.observe(canvas);

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 1,
            }}
        />
    );
};

export default SpiralBackground;
