import React from 'react'

import styles  from "./Footer.module.css"

const Footer = () => {
	return (
		<div>
			<footer className={styles.footer}>
				<h3>Escreva sobre o que você tem interesse!</h3>
				<p>Mini blog &copy; 2023</p>
			</footer>
		</div>
	)
}

export default Footer