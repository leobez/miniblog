import React from 'react'

import styles from "./Register.module.css"

import {useState, useEffect} from "react"
import { useAuthentication } from '../../hooks/useAuthentication'
import { useFetchDocuments } from '../../hooks/useFetchDocuments'

const Register = () => {

	const [displayName, setDisplayName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [error, setError] = useState("")

	const {createUser, error: authError, loading} = useAuthentication();

	const {documents} = useFetchDocuments("users", null, null)

	const handleSubmit = async (e) => {

		e.preventDefault()
		setError("")

		// Limite máximo de usuários: 5
		if (documents.length >= 5) {
			setError("Numero maximo de usuário atingidos.")			
			return;
		}

		const user = {
			displayName: displayName,
			email: email,
			password: password,
		}

		if (password != confirmPassword) {
			setError("As senhas precisam ser iguais!")
			return;
		}

		await createUser(user)
	} 

	useEffect(() => {
		if (authError) {
			setError(authError)
		}
	}, [authError])

	return (

		<div className={styles.register}>
			<h1>Cadastre-se para postar</h1>
			<p>Crie seu usuário e compartilhe suas histórias</p>
			<form onSubmit={handleSubmit}>
				<label>
					<span>Nome: </span>
					<input 
					type="text" 
					name='displayName' 
					required 
					placeholder='Nome do usuário' 
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
					/>
				</label>
				<label>
					<span>E-mail: </span>
					<input 
					type="email" 
					name='email' 
					required 
					placeholder='E-mail do usuário' 
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					/>
				</label>
				<label>
					<span>Senha: </span>
					<input 
					type="password" 
					name='password' 
					required 
					placeholder='Senha do usuário' 
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					/>
				</label>
				<label>
					<span>Confirmação Senha: </span>
					<input 
					type="password" 
					name='confirmPassword' 
					required 
					placeholder='Confirme sua senha' 
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</label>
				
				{!loading && <button className='btn'>Cadastrar</button>}
				{loading && <button className='btn' disabled>Aguarde...</button>}
				{error && <p className='error'>{error}</p>}
			</form>
		</div>
	)
}

export default Register