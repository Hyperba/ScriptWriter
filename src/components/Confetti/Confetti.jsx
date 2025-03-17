import { useEffect, useRef } from "react";
import styles from "./Confetti.module.css";

const Confetti = ({ duration = 4000 }) => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		let animationFrameId;
		let particles = [];

		// Set canvas dimensions
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Confetti colors
		const colors = [
			"#6366f1", // primary
			"#4f46e5", // primary-hover
			"#a5b4fc", // primary-light
			"#4338ca", // primary-dark
			"#ec4899", // pink
			"#10b981", // green
			"#f59e0b", // yellow
			"#06b6d4", // cyan
			"#8b5cf6", // purple
		];

		// Confetti shapes
		const shapes = ["circle", "square", "triangle", "line"];

		// Create confetti particles
		for (let i = 0; i < 250; i++) {
			const shape = shapes[Math.floor(Math.random() * shapes.length)];
			const color = colors[Math.floor(Math.random() * colors.length)];
			const size = Math.random() * 15 + 5;

			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height - canvas.height,
				size: size,
				color: color,
				shape: shape,
				rotation: Math.random() * 360,
				speed: Math.random() * 5 + 2,
				rotationSpeed: Math.random() * 4 - 2,
				oscillationSpeed: Math.random() * 2 + 1,
				oscillationDistance: Math.random() * 5 + 5,
				initialX: 0,
				gravity: 0.1 + Math.random() * 0.1,
				opacity: 1,
				life: Math.random() * 50 + 50,
			});
		}

		// Animation loop
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach((p, index) => {
				// Save the initial x position if not set
				if (p.initialX === 0) {
					p.initialX = p.x;
				}

				// Update position
				p.y += p.speed;
				p.rotation += p.rotationSpeed;
				p.x =
					p.initialX +
					Math.sin(p.y * 0.01 * p.oscillationSpeed) *
						p.oscillationDistance;
				p.speed += p.gravity;
				p.life--;

				if (p.life <= 20) {
					p.opacity = p.life / 20;
				}

				// Draw confetti
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate((p.rotation * Math.PI) / 180);
				ctx.globalAlpha = p.opacity;

				// Draw different shapes
				ctx.fillStyle = p.color;

				switch (p.shape) {
					case "circle":
						ctx.beginPath();
						ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
						ctx.fill();
						break;

					case "square":
						ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
						break;

					case "triangle":
						ctx.beginPath();
						ctx.moveTo(-p.size / 2, p.size / 2);
						ctx.lineTo(p.size / 2, p.size / 2);
						ctx.lineTo(0, -p.size / 2);
						ctx.closePath();
						ctx.fill();
						break;

					case "line":
						ctx.strokeStyle = p.color;
						ctx.lineWidth = p.size / 8;
						ctx.beginPath();
						ctx.moveTo(-p.size, 0);
						ctx.lineTo(p.size, 0);
						ctx.stroke();
						break;
				}

				ctx.restore();

				// Remove dead particles
				if (p.life <= 0 || p.y > canvas.height) {
					particles.splice(index, 1);
				}
			});

			// Add new particles if needed
			if (
				particles.length < 10 &&
				Date.now() < startTime + duration - 1000
			) {
				for (let i = 0; i < 5; i++) {
					const shape =
						shapes[Math.floor(Math.random() * shapes.length)];
					const color =
						colors[Math.floor(Math.random() * colors.length)];
					const size = Math.random() * 15 + 5;

					particles.push({
						x: Math.random() * canvas.width,
						y: -20,
						size: size,
						color: color,
						shape: shape,
						rotation: Math.random() * 360,
						speed: Math.random() * 5 + 2,
						rotationSpeed: Math.random() * 4 - 2,
						oscillationSpeed: Math.random() * 2 + 1,
						oscillationDistance: Math.random() * 5 + 5,
						initialX: 0,
						gravity: 0.1 + Math.random() * 0.1,
						opacity: 1,
						life: Math.random() * 50 + 50,
					});
				}
			}

			if (particles.length > 0 || Date.now() < startTime + duration) {
				animationFrameId = requestAnimationFrame(animate);
			} else {
				// Fade out
				canvas.style.opacity = 0;
				setTimeout(() => {
					canvas.remove();
				}, 500);
			}
		};

		const startTime = Date.now();
		animate();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [duration]);

	return <canvas ref={canvasRef} className={styles.confettiCanvas} />;
};

export default Confetti;
