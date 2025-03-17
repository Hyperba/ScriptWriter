import { useEffect, useRef } from "react";
import styles from "./BackgroundAnimation.module.css";

const BackgroundAnimation = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		let animationFrameId;

		// Set canvas dimensions
		const setCanvasDimensions = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		setCanvasDimensions();
		window.addEventListener("resize", setCanvasDimensions);

		// Particle class
		class Particle {
			constructor() {
				this.x = Math.random() * canvas.width;
				this.y = Math.random() * canvas.height;
				this.size = Math.random() * 5 + 1;
				this.baseSize = this.size;
				this.speedX = Math.random() * 1 - 0.5;
				this.speedY = Math.random() * 1 - 0.5;

				// Create a gradient color
				const hue = Math.random() * 60 + 210; // Blue to purple range
				this.color = `hsla(${hue}, 70%, 60%, ${
					Math.random() * 0.3 + 0.1
				})`;

				// Add pulsing effect
				this.angle = Math.random() * 360;
				this.angleSpeed = Math.random() * 0.2 + 0.1;
				this.pulseSize = Math.random() * 0.5 + 0.5;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				// Pulsing effect
				this.angle += this.angleSpeed;
				this.size =
					this.baseSize + Math.sin(this.angle) * this.pulseSize;

				// Bounce off edges with slight randomization
				if (this.x < 0 || this.x > canvas.width) {
					this.speedX *= -1;
					this.speedX += Math.random() * 0.2 - 0.1; // Add some randomness
				}
				if (this.y < 0 || this.y > canvas.height) {
					this.speedY *= -1;
					this.speedY += Math.random() * 0.2 - 0.1; // Add some randomness
				}

				// Keep speed in check
				if (Math.abs(this.speedX) > 1.5)
					this.speedX = 1.5 * Math.sign(this.speedX);
				if (Math.abs(this.speedY) > 1.5)
					this.speedY = 1.5 * Math.sign(this.speedY);
			}

			draw() {
				// Create a radial gradient for each particle
				const gradient = ctx.createRadialGradient(
					this.x,
					this.y,
					0,
					this.x,
					this.y,
					this.size
				);
				gradient.addColorStop(0, this.color);
				gradient.addColorStop(1, "transparent");

				ctx.fillStyle = gradient;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// Create particle array
		const particleArray = [];
		const particleCount = Math.min(70, Math.floor(window.innerWidth / 25));

		for (let i = 0; i < particleCount; i++) {
			particleArray.push(new Particle());
		}

		// Mouse interaction
		let mouse = {
			x: undefined,
			y: undefined,
			radius: 150,
		};

		window.addEventListener("mousemove", (event) => {
			mouse.x = event.x;
			mouse.y = event.y;
		});

		// Animation loop
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Add a subtle gradient background
			const bgGradient = ctx.createLinearGradient(
				0,
				0,
				canvas.width,
				canvas.height
			);
			bgGradient.addColorStop(0, "rgba(248, 250, 252, 0)");
			bgGradient.addColorStop(1, "rgba(99, 102, 241, 0.03)");
			ctx.fillStyle = bgGradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < particleArray.length; i++) {
				particleArray[i].update();
				particleArray[i].draw();
			}

			// Connect particles with lines if they're close enough
			connectParticles();

			// Mouse interaction
			if (mouse.x !== undefined && mouse.y !== undefined) {
				createMouseEffect();
			}

			animationFrameId = requestAnimationFrame(animate);
		};

		const connectParticles = () => {
			for (let a = 0; a < particleArray.length; a++) {
				for (let b = a; b < particleArray.length; b++) {
					const dx = particleArray[a].x - particleArray[b].x;
					const dy = particleArray[a].y - particleArray[b].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 120) {
						// Calculate opacity based on distance
						const opacity = 1 - distance / 120;

						// Create gradient line
						const gradient = ctx.createLinearGradient(
							particleArray[a].x,
							particleArray[a].y,
							particleArray[b].x,
							particleArray[b].y
						);
						gradient.addColorStop(
							0,
							`rgba(99, 102, 241, ${opacity * 0.15})`
						);
						gradient.addColorStop(
							1,
							`rgba(165, 180, 252, ${opacity * 0.15})`
						);

						ctx.beginPath();
						ctx.strokeStyle = gradient;
						ctx.lineWidth = 0.8;
						ctx.moveTo(particleArray[a].x, particleArray[a].y);
						ctx.lineTo(particleArray[b].x, particleArray[b].y);
						ctx.stroke();
					}
				}
			}
		};

		const createMouseEffect = () => {
			for (let i = 0; i < particleArray.length; i++) {
				// Calculate distance between mouse and particle
				const dx = mouse.x - particleArray[i].x;
				const dy = mouse.y - particleArray[i].y;
				const distance = Math.sqrt(dx * dx + dy * dy);

				if (distance < mouse.radius) {
					// Create repulsion effect
					const force = (mouse.radius - distance) / mouse.radius;
					const directionX = dx / distance || 0;
					const directionY = dy / distance || 0;

					particleArray[i].x -= directionX * force * 2;
					particleArray[i].y -= directionY * force * 2;
				}
			}
		};

		animate();

		return () => {
			window.removeEventListener("resize", setCanvasDimensions);
			window.removeEventListener("mousemove", () => {});
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <canvas ref={canvasRef} className={styles.backgroundCanvas} />;
};

export default BackgroundAnimation;
