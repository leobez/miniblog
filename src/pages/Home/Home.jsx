// CSS
import styles from "./Home.module.css";

// hooks
import { useNavigate, Link } from "react-router-dom";
import { useLazyFetchDocuments } from "../../hooks/useLazyFetchDocuments";

// react
import { useState } from "react";

// components
import PostDetail from "../../components/PostDetail";

const Home = () => {
	const { documents: posts, loading, limitRef, setLimitRef} = useLazyFetchDocuments("posts");
	const navigate = useNavigate();
	const [query, setQuery] = useState("");

	// Instead of scroll, try to check if last element is visible with observer i guess
	window.addEventListener('scroll', () => {	
		// Verify if user is getting closer to end of screen
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 150) {
			if (limitRef >= 100) return setLimitRef(100)
			setLimitRef((prev) => prev + 1)
		}
		
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      return navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className={styles.home}>
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
        {posts && posts.map((post) => <PostDetail key={post.id} post={post} className="post" />)}
      </div>
    </div>
  );
};

export default Home;