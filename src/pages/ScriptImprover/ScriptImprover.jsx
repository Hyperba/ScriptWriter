"use client";

import { useState, useEffect, useRef } from "react";
import { Edit3, Copy, Check, Loader, AlertCircle, Tag } from "lucide-react";
import styles from "./ScriptImprover.module.css";
import WordCounter from "../../components/WordCounter/WordCounter";
import TypeWriter from "../../components/TypeWriter/TypeWriter";
import Modal from "../../components/Modal/Modal";
import Confetti from "../../components/Confetti/Confetti";

const ScriptImprover = () => {
	const [inputScript, setInputScript] = useState(() => {
		return localStorage.getItem("improverInput") || "";
	});
	const [conditions, setConditions] = useState(() => {
		return (
			localStorage.getItem("improverConditions") ||
			"Make it more concise and engaging"
		);
	});
	const [improvedScript, setImprovedScript] = useState(() => {
		return localStorage.getItem("improverOutput") || "";
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [isConditionsFocused, setIsConditionsFocused] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const resultRef = useRef(null);

	// Save to localStorage when values change
	useEffect(() => {
		localStorage.setItem("improverInput", inputScript);
	}, [inputScript]);

	useEffect(() => {
		localStorage.setItem("improverConditions", conditions);
	}, [conditions]);

	useEffect(() => {
		localStorage.setItem("improverOutput", improvedScript);
	}, [improvedScript]);

	const improveScript = async () => {
		if (!inputScript.trim()) return;

		setShowConfirmModal(false);
		setIsLoading(true);
		setError("");
		setImprovedScript("");

		try {
			// Get custom prompt from localStorage or use default
			const customPrompt = localStorage.getItem("improverPrompt");

			// Get custom API key if available
			const customApiKey = localStorage.getItem("customApiKey");

			const response = await fetch(
				"http://localhost:5000/api/improve-script",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(customApiKey && { "x-api-key": customApiKey }),
					},
					body: JSON.stringify({
						script: inputScript,
						conditions: conditions,
						customPrompt: customPrompt,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to improve script");
			}

			setImprovedScript(data.improvedScript);

			// Show confetti
			setShowConfetti(true);

			// Scroll to result
			setTimeout(() => {
				if (resultRef.current) {
					resultRef.current.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		} catch (error) {
			console.error("Script improvement error:", error);
			setError(
				"Error occurred during script improvement. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(improvedScript);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const suggestionTags = [
		"Make it more concise",
		"Make it more formal",
		"Make it more casual",
		"Improve grammar and flow",
		"Add more descriptive language",
		"Make it more engaging",
		"Add humor",
		"Make it more professional",
	];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Edit3 size={32} className={styles.headerIcon} />
				<h1>Script Improver</h1>
			</div>

			<div
				className={`${styles.card} ${
					isInputFocused ? styles.cardFocused : ""
				}`}
			>
				<div className={styles.inputSection}>
					<label htmlFor="input-script">Your Script:</label>
					<hr className="invDivider" />
					<textarea
						id="input-script"
						className={styles.textArea}
						value={inputScript}
						onChange={(e) => setInputScript(e.target.value)}
						placeholder="Paste your script here to improve..."
						rows={10}
						onFocus={() => setIsInputFocused(true)}
						onBlur={() => setIsInputFocused(false)}
					/>
					<WordCounter text={inputScript} />
				</div>
				<hr className="invDivider" />
				<hr className="invDivider" />

				<div
					className={`${styles.conditionsSection} ${
						isConditionsFocused ? styles.conditionsFocused : ""
					}`}
				>
					<label htmlFor="conditions" className={styles.label}>
						Improvement Conditions:
					</label>
					<hr className="invDivider" />
					<textarea
						id="conditions"
						className={styles.conditionsArea}
						value={conditions}
						onChange={(e) => setConditions(e.target.value)}
						placeholder="Specify how you want the script to be improved..."
						rows={3}
						onFocus={() => setIsConditionsFocused(true)}
						onBlur={() => setIsConditionsFocused(false)}
					/>
					<div className={styles.conditionsSuggestions}>
						<div className={styles.suggestionHeader}>
							<Tag size={16} />
							<p>Suggestions:</p>
						</div>
						<div className={styles.suggestionTags}>
							{suggestionTags.map((tag) => (
								<button
									id={styles.specifyBtn}
									key={tag}
									onClick={() => setConditions(tag)}
									className={
										conditions === tag
											? styles.activeTag
											: ""
									}
								>
									{tag}
								</button>
							))}
						</div>
					</div>
				</div>
				<hr className={styles.divider} />
				<button
					className={styles.improveButton}
					onClick={() => setShowConfirmModal(true)}
					disabled={isLoading || !inputScript.trim()}
				>
					{isLoading ? (
						<>
							Improving{" "}
							<Loader size={18} className={styles.spinnerIcon} />
						</>
					) : (
						<>Improve Script</>
					)}
				</button>
			</div>

			{error && (
				<div className={`${styles.card} ${styles.errorCard}`}>
					<div className={styles.errorContent}>
						<AlertCircle size={24} />
						<p className={styles.errorMessage}>{error}</p>
					</div>
				</div>
			)}

			{improvedScript && (
				<div
					className={`${styles.card} ${styles.resultCard}`}
					ref={resultRef}
				>
					<div className={styles.resultHeader}>
						<h2 className={styles.resultTitle}>Improved Script</h2>
						<button
							className={styles.copyButton}
							onClick={copyToClipboard}
							title="Copy to clipboard"
						>
							{copied ? <Check size={18} /> : <Copy size={18} />}
							<span>{copied ? "Copied!" : "Copy"}</span>
						</button>
					</div>
					<div className={styles.resultText}>
						<TypeWriter text={improvedScript} speed={10} />
					</div>
					<WordCounter text={improvedScript} />
				</div>
			)}

			{/* Confirmation Modal */}
			<Modal
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				title="Confirm Script Improvement"
				size="small"
			>
				<div className={styles.modalContent}>
					<p>
						You are about to improve a script with{" "}
						{inputScript.split(/\s+/).filter(Boolean).length} words.
					</p>
					<p>
						<strong>Conditions:</strong> {conditions}
					</p>
					<p>Do you want to proceed?</p>

					<div className={styles.modalButtons}>
						<button
							className={styles.cancelButton}
							onClick={() => setShowConfirmModal(false)}
						>
							Cancel
						</button>
						<button
							className={styles.confirmButton}
							onClick={improveScript}
						>
							Improve Now
						</button>
					</div>
				</div>
			</Modal>

			{/* Confetti effect */}
			{showConfetti && <Confetti duration={3000} />}
		</div>
	);
};

export default ScriptImprover;
