// CSS
import styles from "./Home.module.css";

// hooks
import { useNavigate, Link } from "react-router-dom";
import { useLazyFetchDocuments } from "../../hooks/useLazyFetchDocuments";

// react
import { useState, useRef, useEffect, useLayoutEffect } from "react";

// components
import PostDetail from "../../components/PostDetail";

const Home = () => {
	const { documents: posts, loading, limitRef, setLimitRef} = useLazyFetchDocuments("posts");
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [cancelled, setCancelled] = useState(false)
	const postsRef = useRef(null)


	// TENTAR VERIFICAR SE O ELEMENTO PAI POSSUI SEUS ULTIMOS 100 PIXEIS VISIVEIS.
	// CASO SIM, PERMITIR O FETCH DE MAIS POSTS E REZAR PARA QUE OS ULTIMOS 100 PIXEIS DEIXEM DE SER VISIVEIS
	const observer = new IntersectionObserver((entries) => {

		const postsContainerElement = entries[0]
		console.log("postsContainerElement: ", postsContainerElement)

/* 		if (!lastElement.isIntersecting) return 

		setLimitRef((prev) => prev + 1)
		console.log("DEIXANDO DE OBSERVAR: ", lastElement)
		observer.unobserve(lastElement.target) 

		console.log("PASSANDO A OBSERVAR: ", parentElement.target.lastChild)
		//observer.observe(postsRef.current.lastChild)   */    
	}, {
		rootMargin: "100px",
	})

	useLayoutEffect(() => {
		if (postsRef.current && !cancelled) {
			if (postsRef.current.lastChild != null) {
				console.log("OBSERVANDO: ", postsRef.current)
				observer.observe(postsRef.current)
			} 
		}
		return () => setCancelled(true)
	}, [posts, cancelled])

	const handleSubmit = (e) => {
		e.preventDefault();
		if (query) {
		return navigate(`/search?q=${query}`);
		}
	};

	return (
		<div className={styles.home} >
			<h1>Veja os nossos posts mais recentes</h1>
			<form className={styles.search_form} onSubmit={handleSubmit}>
				<input
				type="text"
				placeholder="Ou busque por tags..."
				onChange={(e) => setQuery(e.target.value)}
				/>
				<button className="btn btn-dark">Pesquisar</button>
			</form>
			
			<div className="post-list" ref={postsRef}>
				{loading && <p>Carregando...</p>}
				{posts && posts.length === 0 && (
				<div className={styles.noposts}>
					<p>Não foram encontrados posts</p>
					<Link to="/posts/create" className="btn">
					Criar primeiro post
					</Link>
				</div>
				)}
				{posts && posts.map((post, index) => <PostDetail key={post.id} post={post} index={index}/>)}
			</div>
		</div>
	);
};

export default Home;