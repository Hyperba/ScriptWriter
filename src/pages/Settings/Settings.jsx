import { useState, useEffect } from "react";
import {
	SettingsIcon,
	Save,
	RefreshCw,
	Key,
	MessageSquare,
	AlertCircle,
} from "lucide-react";
import styles from "./Settings.module.css";
import Modal from "../../components/Modal/Modal";
import Confetti from "../../components/Confetti/Confetti";

const Settings = () => {
	// Get stored values from localStorage or use defaults
	const [apiKey, setApiKey] = useState(() => {
		return localStorage.getItem("customApiKey") || "";
	});

	const [translationPrompt, setTranslationPrompt] = useState(() => {
		return (
			localStorage.getItem("translationPrompt") ||
			"Translate the following {sourceLanguage} text to English:\n\n{additionalNotes}\n\nText to translate:\n{text}"
		);
	});

	const [improverPrompt, setImproverPrompt] = useState(() => {
		return (
			localStorage.getItem("improverPrompt") ||
			"Improve the following script based on these conditions: {conditions}:\n\n{script}"
		);
	});

	const [generatorPrompt, setGeneratorPrompt] = useState(() => {
		return (
			localStorage.getItem("generatorPrompt") ||
			"Generate a {genre} script based on the following dialog and plot:\n\nDialog:\n{dialog}\n\nPlot:\n{plot}\n\nPlease format it as a proper screenplay."
		);
	});

	const [isResetModalOpen, setIsResetModalOpen] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [activeTab, setActiveTab] = useState("api");

	// Default prompts for reset functionality
	const defaultPrompts = {
		translation:
			"Translate the following {sourceLanguage} text to English:\n\n{additionalNotes}\n\nText to translate:\n{text}",
		improver:
			"Improve the following script based on these conditions: {conditions}:\n\n{script}",
		generator:
			"Generate a {genre} script based on the following dialog and plot:\n\nDialog:\n{dialog}\n\nPlot:\n{plot}\n\nPlease format it as a proper screenplay.",
	};

	const saveSettings = () => {
		// Save API key
		if (apiKey.trim()) {
			localStorage.setItem("customApiKey", apiKey.trim());
		} else {
			localStorage.removeItem("customApiKey");
		}

		// Save prompts
		localStorage.setItem("translationPrompt", translationPrompt);
		localStorage.setItem("improverPrompt", improverPrompt);
		localStorage.setItem("generatorPrompt", generatorPrompt);

		// Show saved confirmation
		setIsSaved(true);
		setShowConfetti(true);
		setTimeout(() => setIsSaved(false), 3000);
	};

	const resetToDefaults = () => {
		setApiKey("");
		setTranslationPrompt(defaultPrompts.translation);
		setImproverPrompt(defaultPrompts.improver);
		setGeneratorPrompt(defaultPrompts.generator);

		localStorage.removeItem("customApiKey");
		localStorage.setItem("translationPrompt", defaultPrompts.translation);
		localStorage.setItem("improverPrompt", defaultPrompts.improver);
		localStorage.setItem("generatorPrompt", defaultPrompts.generator);

		setIsResetModalOpen(false);

		// Show saved confirmation
		setIsSaved(true);
		setTimeout(() => setIsSaved(false), 3000);
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<SettingsIcon size={32} className={styles.headerIcon} />
				<h1>Settings</h1>
			</div>

			{/* Tabs Navigation */}
			<div className={styles.tabs}>
				<button
					id={styles.tab1}
					className={`${styles.tabButton} ${
						activeTab === "api" ? styles.activeTab : ""
					}`}
					onClick={() => setActiveTab("api")}
				>
					<Key size={16} />
					API Configuration
				</button>
				<button
					id={styles.tab2}
					className={`${styles.tabButton} ${
						activeTab === "prompts" ? styles.activeTab : ""
					}`}
					onClick={() => setActiveTab("prompts")}
				>
					<MessageSquare size={16} />
					Custom Prompts
				</button>
			</div>

			{/* API Configuration Tab */}
			{activeTab === "api" && (
				<div className={styles.card}>
					<h2 className={styles.sectionTitle}>API Configuration</h2>

					<div className={styles.formGroup}>
						<label htmlFor="api-key">
							<Key size={18} />
							<span>Custom Groq API Key</span>
						</label>
						<input
							id="api-key"
							type="password"
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							placeholder="Enter your Groq API key (optional)"
							className={styles.input}
						/>
						<p className={styles.helperText}>
							If not provided, the default API key will be used.
						</p>
					</div>

					<div className={styles.warningBox}>
						<AlertCircle size={18} />
						<p>
							Important: Your API key is stored locally in your
							browser and is never sent to our servers except when
							making API calls.
						</p>
					</div>
				</div>
			)}

			{/* Custom Prompts Tab */}
			{activeTab === "prompts" && (
				<div className={styles.card}>
					<h2 className={styles.sectionTitle}>Custom Prompts</h2>

					<div className={styles.promptInfo}>
						<p>
							Customize the AI prompts used for each service. Use
							the variables in curly braces (e.g., {"{text}"}) to
							insert user input.
						</p>
					</div>
					<hr className="invDivider" />
					<hr className="invDivider" />

					<div className={styles.formGroup}>
						<label htmlFor="translation-prompt">
							<MessageSquare size={18} />
							<span>Translation Prompt</span>
						</label>
						<textarea
							id="translation-prompt"
							value={translationPrompt}
							onChange={(e) =>
								setTranslationPrompt(e.target.value)
							}
							className={styles.textarea}
							rows={5}
						/>
						<p className={styles.helperText}>
							Available variables: {"{text}"},{" "}
							{"{sourceLanguage}"}, {"{additionalNotes}"}
						</p>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="improver-prompt">
							<MessageSquare size={18} />
							<span>Script Improver Prompt</span>
						</label>
						<textarea
							id="improver-prompt"
							value={improverPrompt}
							onChange={(e) => setImproverPrompt(e.target.value)}
							className={styles.textarea}
							rows={5}
						/>
						<p className={styles.helperText}>
							Available variables: {"{script}"}, {"{conditions}"}
						</p>
					</div>

					<div className={styles.formGroup}>
						<label htmlFor="generator-prompt">
							<MessageSquare size={18} />
							<span>Script Generator Prompt</span>
						</label>
						<textarea
							id="generator-prompt"
							value={generatorPrompt}
							onChange={(e) => setGeneratorPrompt(e.target.value)}
							className={styles.textarea}
							rows={5}
						/>
						<p className={styles.helperText}>
							Available variables: {"{dialog}"}, {"{plot}"},{" "}
							{"{genre}"}
						</p>
					</div>
				</div>
			)}

			<div className={styles.actionButtons}>
				<button
					className={styles.resetButton}
					onClick={() => setIsResetModalOpen(true)}
				>
					<RefreshCw size={18} />
					Reset to Defaults
				</button>

				<button className={styles.saveButton} onClick={saveSettings}>
					<Save size={18} />
					{isSaved ? "Saved!" : "Save Settings"}
				</button>
			</div>

			<Modal
				isOpen={isResetModalOpen}
				onClose={() => setIsResetModalOpen(false)}
				title="Reset Settings"
				size="small"
			>
				<div className={styles.modalContent}>
					<p>
						Are you sure you want to reset all settings to their
						default values?
					</p>
					<p>This action cannot be undone.</p>

					<div className={styles.modalButtons}>
						<button
							className={styles.cancelButton}
							onClick={() => setIsResetModalOpen(false)}
						>
							Cancel
						</button>
						<button
							className={styles.confirmButton}
							onClick={resetToDefaults}
						>
							Reset All Settings
						</button>
					</div>
				</div>
			</Modal>

			{/* Confetti effect */}
			{showConfetti && <Confetti duration={3000} />}
		</div>
	);
};

export default Settings;
