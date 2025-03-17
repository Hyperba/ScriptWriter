"use client";

import { useState, useEffect, useRef } from "react";
import {
	Video,
	Copy,
	Check,
	Download,
	Loader,
	AlertCircle,
} from "lucide-react";
import styles from "./ScriptGenerator.module.css";
import WordCounter from "../../components/WordCounter/WordCounter";
import TypeWriter from "../../components/TypeWriter/TypeWriter";
import Modal from "../../components/Modal/Modal";
import Confetti from "../../components/Confetti/Confetti";

const ScriptGenerator = () => {
	const [dialog, setDialog] = useState(() => {
		return localStorage.getItem("generatorDialog") || "";
	});
	const [plot, setPlot] = useState(() => {
		return localStorage.getItem("generatorPlot") || "";
	});
	const [generatedScript, setGeneratedScript] = useState(() => {
		return localStorage.getItem("generatorOutput") || "";
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);
	const [genre, setGenre] = useState(() => {
		return localStorage.getItem("generatorGenre") || "Drama";
	});
	const [isDialogFocused, setIsDialogFocused] = useState(false);
	const [isPlotFocused, setIsPlotFocused] = useState(false);
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const resultRef = useRef(null);

	const genres = [
		"Drama",
		"Comedy",
		"Action",
		"Thriller",
		"Horror",
		"Romance",
		"Sci-Fi",
		"Fantasy",
		"Documentary",
		"Animation",
	];

	// Save to localStorage when values change
	useEffect(() => {
		localStorage.setItem("generatorDialog", dialog);
	}, [dialog]);

	useEffect(() => {
		localStorage.setItem("generatorPlot", plot);
	}, [plot]);

	useEffect(() => {
		localStorage.setItem("generatorOutput", generatedScript);
	}, [generatedScript]);

	useEffect(() => {
		localStorage.setItem("generatorGenre", genre);
	}, [genre]);

	const generateScript = async () => {
		if (!dialog.trim() || !plot.trim()) return;

		setShowConfirmModal(false);
		setIsLoading(true);
		setError("");
		setGeneratedScript("");

		try {
			// Get custom prompt from localStorage or use default
			const customPrompt = localStorage.getItem("generatorPrompt");

			// Get custom API key if available
			const customApiKey = localStorage.getItem("customApiKey");

			const response = await fetch(
				"https://backend-scriptwriter.railway.app/api/generate-script",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(customApiKey && { "x-api-key": customApiKey }),
					},
					body: JSON.stringify({
						dialog: dialog,
						plot: plot,
						genre: genre,
						customPrompt: customPrompt,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to generate script");
			}

			setGeneratedScript(data.generatedScript);

			// Show confetti
			setShowConfetti(true);

			// Scroll to result
			setTimeout(() => {
				if (resultRef.current) {
					resultRef.current.scrollIntoView({ behavior: "smooth" });
				}
			}, 100);
		} catch (error) {
			console.error("Script generation error:", error);
			setError(
				"Error occurred during script generation. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const clearForm = () => {
		setDialog("");
		setPlot("");
		setGeneratedScript("");
		setError("");
	};

	const copyToClipboard = () => {
		navigator.clipboard.writeText(generatedScript);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const downloadAsText = () => {
		const element = document.createElement("a");
		const file = new Blob([generatedScript], { type: "text/plain" });
		element.href = URL.createObjectURL(file);
		element.download = `generated-script-${new Date()
			.toISOString()
			.slice(0, 10)}.txt`;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Video size={32} className={styles.headerIcon} />
				<h1>Script Generator</h1>
			</div>

			<div className={styles.card}>
				<div className={styles.inputGrid}>
					<div
						className={`${styles.inputSection} ${
							isDialogFocused ? styles.inputFocused : ""
						}`}
					>
						<label htmlFor="dialog">Sample Dialog:</label>
						<textarea
							id="dialog"
							className={styles.textArea}
							value={dialog}
							onChange={(e) => setDialog(e.target.value)}
							placeholder="Paste sample dialog from a series or movie..."
							rows={6}
							onFocus={() => setIsDialogFocused(true)}
							onBlur={() => setIsDialogFocused(false)}
						/>
						<WordCounter text={dialog} />
					</div>

					<div
						className={`${styles.inputSection} ${
							isPlotFocused ? styles.inputFocused : ""
						}`}
					>
						<label htmlFor="plot">Plot Summary:</label>
						<textarea
							id="plot"
							className={styles.textArea}
							value={plot}
							onChange={(e) => setPlot(e.target.value)}
							placeholder="Describe the plot or provide a movie recap..."
							rows={6}
							onFocus={() => setIsPlotFocused(true)}
							onBlur={() => setIsPlotFocused(false)}
						/>
						<WordCounter text={plot} />
					</div>
				</div>

				<div className={styles.controls}>
					<div className={styles.genreSelector}>
						<label htmlFor="genre">Genre:</label>
						<select
							id="genre"
							value={genre}
							onChange={(e) => setGenre(e.target.value)}
							className={styles.select}
						>
							{genres.map((g) => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>
					</div>

					<div className={styles.buttonGroup}>
						<button
							className={styles.clearButton}
							onClick={clearForm}
							disabled={
								isLoading || (!dialog.trim() && !plot.trim())
							}
						>
							Clear
						</button>
						<button
							className={styles.generateButton}
							onClick={() => setShowConfirmModal(true)}
							disabled={
								isLoading || !dialog.trim() || !plot.trim()
							}
						>
							{isLoading ? (
								<>
									Generating{" "}
									<Loader
										size={18}
										className={styles.spinnerIcon}
									/>
								</>
							) : (
								<>Generate Script</>
							)}
						</button>
					</div>
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

			{generatedScript && (
				<div
					className={`${styles.card} ${styles.resultCard}`}
					ref={resultRef}
				>
					<div className={styles.resultHeader}>
						<h2 className={styles.resultTitle}>Generated Script</h2>
						<div className={styles.actionButtons}>
							<button
								className={styles.downloadButton}
								onClick={downloadAsText}
								title="Download as text file"
							>
								<Download size={18} />
								<span>Download</span>
							</button>
							<button
								className={styles.copyButton}
								onClick={copyToClipboard}
								title="Copy to clipboard"
							>
								{copied ? (
									<Check size={18} />
								) : (
									<Copy size={18} />
								)}
								<span>{copied ? "Copied!" : "Copy"}</span>
							</button>
						</div>
					</div>
					<div className={styles.resultText}>
						<TypeWriter text={generatedScript} speed={10} />
					</div>
					<WordCounter text={generatedScript} />
				</div>
			)}

			{/* Confirmation Modal */}
			<Modal
				isOpen={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				title="Confirm Script Generation"
				size="small"
			>
				<div className={styles.modalContent}>
					<p>
						You are about to generate a {genre} script based on your
						inputs.
					</p>
					<p>
						Dialog: {dialog.split(/\s+/).filter(Boolean).length}{" "}
						words
					</p>
					<p>
						Plot: {plot.split(/\s+/).filter(Boolean).length} words
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
							onClick={generateScript}
						>
							Generate Now
						</button>
					</div>
				</div>
			</Modal>

			{/* Confetti effect */}
			{showConfetti && <Confetti duration={3000} />}
		</div>
	);
};

export default ScriptGenerator;
