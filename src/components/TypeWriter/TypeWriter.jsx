"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./TypeWriter.module.css";

const TypeWriter = ({ text, speed = 30, onComplete }) => {
	const [displayText, setDisplayText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const containerRef = useRef(null);
	const timeoutRef = useRef(null);

	useEffect(() => {
		// Reset when text changes
		setDisplayText("");
		setCurrentIndex(0);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
	}, [text]);

	useEffect(() => {
		if (!text || currentIndex >= text.length) {
			if (currentIndex >= text.length && onComplete) onComplete();
			return;
		}

		// Vary speed slightly for natural effect (range: 80% - 120% of base speed)
		const variableSpeed = speed * (0.8 + Math.random() * 0.4);

		timeoutRef.current = setTimeout(() => {
			setDisplayText((prev) => prev + text[currentIndex]);
			setCurrentIndex((prev) => prev + 1);

			// Smooth scrolling to the bottom
			requestAnimationFrame(() => {
				if (containerRef.current) {
					containerRef.current.scrollTop =
						containerRef.current.scrollHeight;
				}
			});
		}, variableSpeed);

		return () => clearTimeout(timeoutRef.current);
	}, [text, currentIndex, speed, onComplete]);

	// Split text into paragraphs for better styling
	const paragraphs = displayText.split("\n\n");

	return (
		<div ref={containerRef} className={styles.typewriterContainer}>
			{paragraphs.map((paragraph, index) => (
				<p key={index} className={styles.paragraph}>
					{paragraph}
					{/* Show blinking cursor only while typing */}
					{index === paragraphs.length - 1 &&
						currentIndex < text.length && (
							<span className={styles.cursor}></span>
						)}
				</p>
			))}
		</div>
	);
};

export default TypeWriter;
