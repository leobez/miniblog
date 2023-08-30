 import React from 'react'
 
import styles from "./CreatePost.module.css"

import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import { useAuthValue } from '../../context/AuthContext'

import { useInsertDocument } from '../../hooks/useInsertDocument'

import { useFetchDocuments } from "../../hooks/useFetchDocuments"

const CreatePost = () => {

	const [title, setTitle] = useState("")
	const [image, setImage] = useState("")
	const [body, setBody] = useState("")
	const [tags, setTags] = useState([])
	const [formError, setFormError] = useState("")

	const {user} = useAuthValue()
	const {insertDocument, response} = useInsertDocument("posts", user.uid)
	const {documents} = useFetchDocuments("posts", null, user.uid)

	const navigate = useNavigate()

	const handleSubmit = (e) => {
		e.preventDefault()
		setFormError("")

		// Limite máximo de posts por usuário: 5
		if (documents.length >= 5) {
			setFormError("Numero maximo de posts atingido!")			
			return;
		}

		// Validate image URL
		try {	
			new URL(image)
		} catch (error) {
			setFormError("A imagem precisa ser uma URL.")
			return;
		}

		// Criar array de tags
		const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase())

		// Checar todos os valores
		if(!title || !image || !tags || !body) {
			setFormError("Por favor, preencha todos os campos!")
			return;
		}

		// checar tamanho dos campos
		if (title.length > 50 || image.length > 200 || body.length > 100 || tags.length > 100) {
			setFormError("Por favor, envie textos com no máximo 100 caracteres!")
			return;	
		}

		insertDocument({
			title,
			image,
			body,
			tagsArray,
			uid: user.uid,
			createdBy: user.displayName
		})

		// redirect to home page
		navigate("/")

	}

	return (
		<div className={styles.create_post}>
			<h2>Create Post</h2>
			<p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>

			<form onSubmit={handleSubmit}>
				<label>
					<span>Título:</span>
					<input
						type="text"
						name="text"
						required
						placeholder="Pense num bom título..."
						onChange={(e) => setTitle(e.target.value)}
						value={title}
					/>
				</label>
				<label>
					<span>URL da imagem:</span>
					<input
						type="text"
						name="image"
						required
						placeholder="Insira uma imagem que representa seu post"
						onChange={(e) => setImage(e.target.value)}
						value={image}
					/>
				</label>
				<label>
					<span>Conteúdo:</span>
					<textarea
						name="body"
						required
						placeholder="Insira o conteúdo do post"
						onChange={(e) => setBody(e.target.value)}
						value={body}
					></textarea>
				</label>
				<label>
					<span>Tags:</span>
					<input
						type="text"
						name="tags"
						required
						placeholder="Insira as tags separadas por vírgula"
						onChange={(e) => setTags(e.target.value)}
						value={tags}
					/>
				</label>

				{!response.loading && <button className='btn'>Enviar</button>}
				
				{response.loading && <button className='btn' disabled>Aguarde...</button>}

				{response.error && <p className='error'>{response.error}</p>}
				{formError && <p className='error'>{formError}</p>}

			</form>
		</div>
	)
 }
 
 export default CreatePost