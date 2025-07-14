"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./MovieList.css"

const MovieList = () => {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/movies")
      const data = await res.json()
      setMovies(data)
    } catch (err) {
      console.error("Lỗi lấy danh sách phim:", err)
    } finally {
      setIsLoading(false)
    }
  }

    fetchMovies()
  }, [])

  const categories = ["All", "Hành động", "Tâm lý", "Kinh dị", "Khoa học viễn tưởng", "Tình cảm", "Hoạt hình"]

  const moviesPerPage = 8

  const filteredMovies = selectedCategory === "All"
  ? movies
  : movies.filter((movie) => movie.genre === selectedCategory)

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const currentMovies = filteredMovies.slice(startIndex, startIndex + moviesPerPage)

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  if (isLoading) return <div>Đang tải danh sách phim...</div>

  return (
    <div className="movie-website-container">
      <div className="movie-website">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="logo">
              <img src="/images/mobifone-logo.png" alt="MobiFone" className="logo-image" />
            </div>
            <nav className="nav">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`nav-item ${selectedCategory === category ? "active" : ""}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </nav>
            <div className="auth-buttons">
              <Link to="/login" className="auth-btn">
                Login
              </Link>
              <Link to="/register" className="auth-btn">
                Register
              </Link>
              <Link to="/admin" className="auth-btn admin-btn">
                Admin
              </Link>
            </div>
          </div>
        </header>

        {/* Banner */}
        <section className="banner">
          <div className="banner-content">
            <h2>Discover Amazing Movies</h2>
            <p>Watch the latest and greatest films from around the world</p>
            <button className="banner-btn">Explore Now</button>
          </div>
          <div className="banner-overlay"></div>
        </section>

        {/* Movies Grid */}
        <section className="movies-section">
          <div className="container">
            <div className="section-header">
              <h3>
                {selectedCategory === "All" ? "All Movies" : `${selectedCategory} Movies`}
                <span className="movie-count"> ({filteredMovies.length} movies)</span>
              </h3>
            </div>

            <div className="movies-grid">
              {currentMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-poster">
                  <img src={`http://localhost:3001/public/images/${movie.image_url}`} alt={movie.title} />
                    <div className="movie-overlay">
                      <Link to={`/movie/${movie._id}`} className="play-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                        Play
                      </Link>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h4 className="movie-title">{movie.title}</h4>
                    <p className="movie-year">{movie.genre}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default MovieList
