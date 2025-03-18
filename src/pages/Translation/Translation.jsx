"use client";

import { useState, useEffect, useRef } from "react";
import {
	Languages,
	Copy,
	Check,
	Loader,
	AlertCircle,
	MessageSquare,
} from "lucide-react";
import styles from "./Translation.module.css";
import WordCounter from "../../components/WordCounter/WordCounter";
import TypeWriter from "../../components/TypeWriter/TypeWriter";
import Modal from "../../components/Modal/Modal";
import Confetti from "../../components/Confetti/Confetti";

const Translation = () => {
	const [inputText, setInputText] = useState(() => {
		return localStorage.getItem("translationInput") || "";
	});
	const [outputText, setOutputText] = useState(() => {
		return localStorage.getItem("translationOutput") || "";
	});
	const [displayedOutput, setDisplayedOutput] = useState("");
	const [sourceLanguage, setSourceLanguage] = useState(() => {
		return (
			localStorage.getItem("translationSourceLanguage") || "Auto-detect"
		);
	});
	const [additionalNotes, setAdditionalNotes] = useState(() => {
		return localStorage.getItem("translationNotes") || "";
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [isNotesFocused, setIsNotesFocused] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const resultRef = useRef(null);

	const languages = [
		"Auto-detect",
		"Spanish",
		"French",
		"German",
		"Italian",
		"Portuguese",
		"Russian",
		"Japanese",
		"Chinese",
		"Korean",
		"Arabic",
	];

	// Save to localStorage when values change
	useEffect(() => {
		localStorage.setItem("translationInput", inputText);
	}, [inputText]);

	useEffect(() => {
		localStorage.setItem("translationOutput", outputText);
	}, [outputText]);

	useEffect(() => {
		localStorage.setItem("translationSourceLanguage", sourceLanguage);
	}, [sourceLanguage]);

	useEffect(() => {
		localStorage.setItem("translationNotes", additionalNotes);
	}, [additionalNotes]);

	const translateText = async () => {
	if (!inputText.trim()) return;

	setShowConfirmModal(false);
	setIsLoading(true);
	setError("");
	setOutputText("");
	setDisplayedOutput(""); // Reset before new translation

	try {
		const customPrompt = localStorage.getItem("translationPrompt");
		const customApiKey = localStorage.getItem("customApiKey");

		const response = await fetch(
			"https://backend-scriptwriter-production.up.railway.app/api/translate",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...(customApiKey && { "x-api-key": customApiKey }),
				},
				body: JSON.stringify({
					content: inputText,
					sourceLanguage:
						sourceLanguage === "Auto-detect"
							? ""
							: sourceLanguage,
					targetLanguage: "English",
					additionalNotes: additionalNotes,
					toEnglish: true,
					customPrompt: customPrompt,
				}),
			}
		);

		// Check if the response body is empty
		const responseText = await response.text();
		if (!responseText) {
			throw new Error("Empty response from server");
		}

		const data = JSON.parse(responseText);
		console.log("API Response:", data);

		if (!response.ok) {
			throw new Error(data.error || "Failed to translate text");
		}

		setOutputText(data.translatedText);
		setShowConfetti(true);

		setTimeout(() => {
			if (resultRef.current) {
				resultRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}, 100);
	} catch (error) {
		console.error("Translation error:", error);
		setError("Error occurred during translation. Please try again.");
	} finally {
		setIsLoading(false);
	}
};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(outputText);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Languages size={32} className={styles.headerIcon} />
				<h1>Foreign Script Translation</h1>
			</div>

			<div
				className={`${styles.card} ${
					isInputFocused ? styles.cardFocused : ""
				}`}
			>
				<div className={styles.inputSection}>
					<label htmlFor="input-text">Foreign Language Script:</label>
					<textarea
						id="input-text"
						className={styles.textArea}
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Paste your foreign language script here to translate to English..."
						rows={8}
						onFocus={() => setIsInputFocused(true)}
						onBlur={() => setIsInputFocused(false)}
					/>
					<WordCounter text={inputText} />
				</div>

				<div
					className={`${styles.notesSection} ${
						isNotesFocused ? styles.notesFocused : ""
					}`}
				>
					<label htmlFor="additional-notes">
						<MessageSquare size={16} className={styles.labelIcon} />
						Additional Notes (Optional):
					</label>
					<textarea
						id="additional-notes"
						className={styles.notesArea}
						value={additionalNotes}
						onChange={(e) => setAdditionalNotes(e.target.value)}
						placeholder="E.g., 'Preserve technical terms', 'This is a medical text', 'Maintain formal tone'..."
						rows={3}
						onFocus={() => setIsNotesFocused(true)}
						onBlur={() => setIsNotesFocused(false)}
					/>
				</div>

				<div className={styles.controls}>
					<div className={styles.languageSelector}>
						<label htmlFor="source-language">
							Source Language:
						</label>
						<select
							id="source-language"
							value={sourceLanguage}
							onChange={(e) => setSourceLanguage(e.target.value)}
							className={styles.select}
						>
							{languages.map((lang) => (
								<option key={lang} value={lang}>
									{lang}
								</option>
							))}
						</select>
					</div>

					<button
						className={styles.translateButton}
						onClick={() => setShowConfirmModal(true)}
						disabled={isLoading || !inputText.trim()}
					>
						{isLoading ? (
							<>
								Translating{" "}
								<Loader
									size={18}
									className={styles.spinnerIcon}
								/>
							</>
						) : (
							<>Translate to English</>
						)}
					</button>
				</div>
			</div>

			{error && (
				<div className={`${styles.card} ${styles.errorCard}`}>
					<div className={styles.errorContent}>
						<AlertCircle size={24} />
						<p className={styles.errorMessage}>{error}</p>
					</div>
				</div>
			)}

			{outputText && (
				<div
					className={`${styles.card} ${styles.resultCard}`}
					ref={resultRef}
				>
					<div className={styles.resultHeader}>
						<h2 className={styles.resultTitle}>
							English Translation
						</h2>
						<button
							className={styles.copyButton}
							onClick={copyToClipboard}
							title="Copy to clipboard"
						>
							{copied ? <Check size={18} /> : <Copy size={18} />}
							<span>{copied ? "Copied!" : "Copy"}</span>
						</button>
					</div>
					<div className={styles.resultText}>{outputText}</div>
					<WordCounter text={outputText} />
				</div>
			)}

			{/* Confirmation Modal */}
			<Modal
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				title="Confirm Translation"
				size="small"
			>
				<div className={styles.modalContent}>
					<p>
						You are about to translate{" "}
						{inputText.split(/\s+/).filter(Boolean).length} words
						from{" "}
						{sourceLanguage === "Auto-detect"
							? "a foreign language"
							: sourceLanguage}{" "}
						to English.
					</p>
					{additionalNotes && (
						<p>
							<strong>With notes:</strong> {additionalNotes}
						</p>
					)}
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
							onClick={translateText}
						>
							Translate Now
						</button>
					</div>
				</div>
			</Modal>

			{/* Confetti effect */}
			{showConfetti && <Confetti duration={3000} />}
		</div>
	);
};

export default Translation;
