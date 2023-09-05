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
	const limiterRef = useRef(null)
	const MAX_POST_ALLOWED_ON_SCREEN = 100;

	const observer = new IntersectionObserver((entries) => {
		const limiterElement = entries[0]
 		if (!limiterElement.isIntersecting) return 
 		setLimitRef((prev) => prev + 5)
	}, {
		rootMargin: "300px",
	})

	useEffect(() => {
		if (limitRef >= MAX_POST_ALLOWED_ON_SCREEN) {
			limiterRef.current.remove()
		}
	}, [limitRef])

	useLayoutEffect(() => {
		if (limiterRef.current) {
			if (limiterRef.current != null) {
				setTimeout(
					() => {if (limiterRef.current != null) observer.observe(limiterRef.current)},1000)
			} 
		}
	}, [])

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
			
			<div className="post-list">
				{loading && <p>Carregando...</p>}
				{posts && posts.length === 0 && (
				<div className={styles.noposts}>
					<p>Não foram encontrados posts</p>
					<Link to="/posts/create" className="btn">
					Criar primeiro post
					</Link>
				</div>
				)}
				{posts && posts.map((post) => <PostDetail key={post.id} post={post}/>)}
			</div>
			<div className="limiter" ref={limiterRef}></div>
		</div>
	);
};

export default Home;