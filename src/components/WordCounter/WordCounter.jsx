"use client";

import { useState, useEffect } from "react";
import styles from "./WordCounter.module.css";

const WordCounter = ({ text, limit }) => {
	const [wordCount, setWordCount] = useState(0);
	const [charCount, setCharCount] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (!text) {
			setWordCount(0);
			setCharCount(0);
			return;
		}

		const words = text
			.trim()
			.split(/\s+/)
			.filter((word) => word !== "");
		const newWordCount = words.length;
		const newCharCount = text.length;

		// Animate if counts change significantly
		if (
			Math.abs(newWordCount - wordCount) > 5 ||
			Math.abs(newCharCount - charCount) > 20
		) {
			setIsAnimating(true);
			setTimeout(() => setIsAnimating(false), 500);
		}

		setWordCount(newWordCount);
		setCharCount(newCharCount);
	}, [text, wordCount, charCount]);

	return (
		<div
			className={`${styles.counter} ${isAnimating ? styles.animate : ""}`}
		>
			<span className={styles.count}>
				{wordCount} {wordCount === 1 ? "word" : "words"}
			</span>
			<span className={styles.divider}>•</span>
			<span className={styles.count}>
				{charCount} {charCount === 1 ? "character" : "characters"}
			</span>
			{limit && (
				<>
					<span className={styles.divider}>•</span>
					<span
						className={`${styles.count} ${
							charCount > limit ? styles.exceeded : ""
						}`}
					>
						{limit - charCount} remaining
					</span>
				</>
			)}
		</div>
	);
};

export default WordCounter;
