"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Translation from "./pages/Translation/Translation";
import ScriptImprover from "./pages/ScriptImprover/ScriptImprover";
import ScriptGenerator from "./pages/ScriptGenerator/ScriptGenerator";
import HomePage from "./pages/Home/HomePage";
import Settings from "./pages/Settings/Settings";
import CursorEffect from "./components/CursorEffect/CursorEffect";
import BackgroundAnimation from "./components/BackgroundAnimation/BackgroundAnimation";
import "./App.css";

function App() {
	const [activePage, setActivePage] = useState(() => {
		// Get saved active page from localStorage or default to "home"
		return localStorage.getItem("activePage") || "home";
	});
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
		// Get saved sidebar state from localStorage or default to true
		return localStorage.getItem("sidebarExpanded") !== "false";
	});

	// Save active page to localStorage when it changes
	useEffect(() => {
		localStorage.setItem("activePage", activePage);
	}, [activePage]);

	// Save sidebar state to localStorage when it changes
	useEffect(() => {
		localStorage.setItem("sidebarExpanded", isSidebarExpanded);
	}, [isSidebarExpanded]);

	const renderPage = () => {
		switch (activePage) {
			case "home":
				return <HomePage />;
			case "translation":
				return <Translation />;
			case "improver":
				return <ScriptImprover />;
			case "generator":
				return <ScriptGenerator />;
			case "settings":
				return <Settings />;
			default:
				return <HomePage />;
		}
	};

	return (
		<div className="app-container">
			<CursorEffect />
			<BackgroundAnimation />
			<Sidebar
				activePage={activePage}
				setActivePage={setActivePage}
				isExpanded={isSidebarExpanded}
				setIsExpanded={setIsSidebarExpanded}
			/>
			<main
				className={`content ${
					isSidebarExpanded ? "content-expanded" : "content-collapsed"
				}`}
			>
				<div className="page-container">{renderPage()}</div>
			</main>
		</div>
	);
}

export default App;
