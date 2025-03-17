"use client";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import {
	Home,
	Languages,
	Edit3,
	Video,
	Settings,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

const Sidebar = ({ activePage, setActivePage, isExpanded, setIsExpanded }) => {
	const [isHovering, setIsHovering] = useState(false);

	// Auto-expand sidebar on hover (only if not on mobile)
	useEffect(() => {
		if (isHovering && !isExpanded && window.innerWidth > 768) {
			const timer = setTimeout(() => {
				setIsExpanded(true);
			}, 60);
			return () => clearTimeout(timer);
		}
	}, [isHovering, isExpanded, setIsExpanded]);

	// Auto-collapse sidebar when mouse leaves (only if expanded due to hover)
	useEffect(() => {
		if (!isHovering && isExpanded && window.innerWidth > 768) {
			const timer = setTimeout(() => {
				if (!isHovering) {
					setIsExpanded(false);
				}
			}, 20);
			return () => clearTimeout(timer);
		}
	}, [isHovering, isExpanded, setIsExpanded]);

	const menuItems = [
		{ id: "home", label: "Home", icon: <Home size={20} /> },
		{
			id: "translation",
			label: "Translation",
			icon: <Languages size={20} />,
		},
		{ id: "improver", label: "Script Improver", icon: <Edit3 size={20} /> },
		{
			id: "generator",
			label: "Script Generator",
			icon: <Video size={20} />,
		},
	];

	const settingsItem = {
		id: "settings",
		label: "Settings",
		icon: <Settings size={20} />,
	};

	return (
		<aside
			className={`${styles.sidebar} ${
				isExpanded ? styles.expanded : styles.collapsed
			}`}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			<div className={styles.logo}>
				<div className={styles.logoIcon}>YT</div>
				<h2 className={styles.logoText}>Scriptwriter</h2>
			</div>

			<nav className={styles.nav}>
				<ul>
					{menuItems.map((item) => (
						<li key={item.id} className={styles.navItemContainer}>
							<button
								className={`${styles.navItem} ${
									activePage === item.id ? styles.active : ""
								}`}
								onClick={() => setActivePage(item.id)}
								title={item.label}
							>
								<span className={styles.icon}>{item.icon}</span>
								<span className={styles.label}>
									{item.label}
								</span>
							</button>
							{activePage === item.id && (
								<div className={styles.activeIndicator} />
							)}
						</li>
					))}
				</ul>
			</nav>

			<div className={styles.footer}>
				<div className={styles.settingsContainer}>
					<button
						className={`${styles.navItem} ${
							activePage === settingsItem.id ? styles.active : ""
						}`}
						onClick={() => setActivePage(settingsItem.id)}
						title={settingsItem.label}
					>
						<span className={styles.icon}>{settingsItem.icon}</span>
						<span className={styles.label}>
							{settingsItem.label}
						</span>
					</button>
					{activePage === settingsItem.id && (
						<div className={styles.activeIndicator} />
					)}
				</div>

				<button
					className={styles.toggleButton}
					onClick={() => setIsExpanded(!isExpanded)}
					aria-label={
						isExpanded ? "Collapse sidebar" : "Expand sidebar"
					}
				>
					{isExpanded ? (
						<ChevronLeft size={18} />
					) : (
						<ChevronRight size={18} />
					)}
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
