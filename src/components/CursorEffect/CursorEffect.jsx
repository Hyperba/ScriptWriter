"use client";

import { useState, useEffect } from "react";
import styles from "./CursorEffect.module.css";

const CursorEffect = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isPointer, setIsPointer] = useState(false);

	useEffect(() => {
		const updateCursorPosition = (e) => {
			setPosition({ x: e.clientX, y: e.clientY });
		};

		const updateCursorStyle = () => {
			const hoveredElement = document.elementFromPoint(
				position.x,
				position.y
			);
			if (hoveredElement) {
				const computedStyle = window.getComputedStyle(hoveredElement);
				setIsPointer(computedStyle.cursor === "pointer");
			}
		};

		window.addEventListener("mousemove", updateCursorPosition);
		window.addEventListener("mouseover", updateCursorStyle);

		return () => {
			window.removeEventListener("mousemove", updateCursorPosition);
			window.removeEventListener("mouseover", updateCursorStyle);
		};
	}, [position.x, position.y]);

	return (
		<>
			<div
				className={`${styles.cursor} ${
					isPointer ? styles.pointer : ""
				}`}
				style={{
					left: `${position.x}px`,
					top: `${position.y}px`,
				}}
			/>
			<div
				className={styles.cursorTrail}
				style={{
					left: `${position.x}px`,
					top: `${position.y}px`,
				}}
			/>
		</>
	);
};

export default CursorEffect;
