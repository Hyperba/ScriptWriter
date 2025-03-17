"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Youtube, Edit, Sparkles, Languages } from "lucide-react";
import { Link } from "lucide-react";
import styles from "./HomePage.module.css";

const HomePage = () => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<div className={styles.container}>
			<div
				className={`${styles.hero} ${isVisible ? styles.visible : ""}`}
			>
				<div className={styles.heroContent}>
					<h1 className={styles.title}>
						<span className={styles.highlight}>
							YouTube ScriptWriter
						</span>
						<br />
						Your AI-Powered Script Assistant
					</h1>
					<p className={styles.subtitle}>
						Create, translate, and improve your YouTube scripts with
						the power of AI
					</p>
					<div className={styles.stats}>
						<div className={styles.statItem}>
							<span className={styles.statNumber}>3</span>
							<span className={styles.statLabel}>AI Tools</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statNumber}>100%</span>
							<span className={styles.statLabel}>Free</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statNumber}>24/7</span>
							<span className={styles.statLabel}>Available</span>
						</div>
					</div>
				</div>
				<div className={styles.heroImage}>
					<div className={styles.blob}></div>
					<div className={styles.blobSmall}></div>
					<Youtube size={120} className={styles.youtubeIcon} />
				</div>
			</div>

			<h2 className={styles.sectionTitle}>ScriptWriter's Features</h2>

			<div className={styles.features}>
				<div
					className={`${styles.featureCard} ${
						isVisible ? styles.visible : ""
					}`}
					style={{ transitionDelay: "0.1s" }}
				>
					<div className={styles.featureIcon}>
						<Languages size={32} />
					</div>
					<h3>Translation</h3>
					<p>
						Translate your scripts to multiple languages to reach a
						global audience.
					</p>
					<button className={styles.featureButton}>
						Try Translation <ArrowRight size={16} />
					</button>
				</div>

				<div
					className={`${styles.featureCard} ${
						isVisible ? styles.visible : ""
					}`}
					style={{ transitionDelay: "0.2s" }}
				>
					<div className={styles.featureIcon}>
						<Edit size={32} />
					</div>
					<h3>Script Improver</h3>
					<p>
						Enhance your scripts with better wording, structure, and
						engagement.
					</p>
					<button className={styles.featureButton}>
						Improve Scripts <ArrowRight size={16} />
					</button>
				</div>

				<div
					className={`${styles.featureCard} ${
						isVisible ? styles.visible : ""
					}`}
					style={{ transitionDelay: "0.3s" }}
				>
					<div className={styles.featureIcon}>
						<Sparkles size={32} />
					</div>
					<h3>Script Generator</h3>
					<p>
						Generate complete scripts based on your ideas, plots,
						and sample dialogues.
					</p>
					<button className={styles.featureButton}>
						Generate Scripts <ArrowRight size={16} />
					</button>
				</div>
			</div>

			<div
				className={`${styles.testimonial} ${
					isVisible ? styles.visible : ""
				}`}
			>
				<div className={styles.testimonialContent}>
					<h2>Why Use YT Scriptwriter?</h2>
					<p>
						Our AI-powered tools help content creators save time,
						overcome writer's block, and produce high-quality
						scripts that engage viewers. Whether you're a seasoned
						YouTuber or just starting out, YT Scriptwriter can help
						you create better content faster.
					</p>
					<ul className={styles.benefitsList}>
						<li>Save hours of writing and editing time</li>
						<li>Overcome creative blocks with AI assistance</li>
						<li>Improve engagement with better scripts</li>
						<li>Reach global audiences with translations</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
