import styles from "../../assets/styles/squaresLoader.module.css";

export default function SquaresLoader() {
	return (
		<div className={`${styles.loader}`}>
			<div className="bg-secondary-50" />
			<div className="bg-secondary-50" />
			<div className="bg-secondary-50" />
			<div className="bg-secondary-50" />
			<div className="bg-secondary-50" />
			<div className="bg-secondary-50" />
			<div className="bg-secondary-50" />
			<div className="bg-secondary-50" />
			<div className="bg-secondary-50" />
		</div>
	);
}
