  "use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../components/MovieList.css"

function AdminPage() {
  const [movies, setMovies] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "Action",
    year: "",
    poster: "",
    videoUrl: "",
  })

  useEffect(() => {
  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/movies")
      const data = await res.json()
      setMovies(data)
    } catch (err) {
      console.error("Lỗi lấy danh sách phim:", err)
    }
  }

  fetchMovies()
}, [])

  const categories = ["All", "Hành động", "Tâm lý", "Kinh dị", "Khoa học viễn tưởng", "Tình cảm", "Hoạt hình"]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingMovie) {
      // Update existing movie
      setMovies(
        movies.map((movie) =>
          movie.id === editingMovie.id
            ? { ...formData, id: editingMovie.id, year: Number.parseInt(formData.year) }
            : movie,
        ),
      )
    } else {
      // Add new movie
      const newMovie = {
        ...formData,
        id: Date.now(),
        year: Number.parseInt(formData.year),
      }
      setMovies([...movies, newMovie])
    }

    // Reset form
    setFormData({
      title: "",
      category: "Action",
      year: "",
      poster: "",
      videoUrl: "",
    })
    setShowForm(false)
    setEditingMovie(null)
  }

  const handleEdit = (movie) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      category: movie.category,
      // year: movie.year.toString(),
      poster: movie.poster,
      videoUrl: movie.videoUrl,
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      setMovies(movies.filter((movie) => movie.id !== id))
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingMovie(null)
    setFormData({
      title: "",
      category: "Action",
      year: "",
      poster: "",
      videoUrl: "",
    })
  }

  return (
    <div className="movie-website-container">
      <div className="admin-page">
        <div className="admin-header">
          <Link to="/" className="back-btn">
            ← Back to Home
          </Link>
          <div className="admin-logo">
            <img src="/images/mobifone-logo.png" alt="MobiFone" className="logo-image" />
          </div>
          <button className="add-movie-btn" onClick={() => setShowForm(true)}>
            + Add New Movie
          </button>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="movie-form-modal">
              <h2>{editingMovie ? "Edit Movie" : "Add New Movie"}</h2>
              <form onSubmit={handleSubmit} className="movie-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="title">Movie Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter movie title"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="year">Year</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      placeholder="2024"
                      min="1900"
                      max="2030"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="poster">Poster URL</label>
                  <input
                    type="url"
                    id="poster"
                    name="poster"
                    value={formData.poster}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="videoUrl">Video URL</label>
                  <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={cancelForm} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    {editingMovie ? "Update Movie" : "Add Movie"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="movies-table-container">
          <h2>Manage Movies ({movies.length} total)</h2>
          <div className="movies-table">
            <div className="table-header">
              <div className="table-cell">Poster</div>
              <div className="table-cell">Title</div>
              <div className="table-cell">Category</div>
              <div className="table-cell">Year</div>
              <div className="table-cell">Actions</div>
            </div>

            {movies.map((movie) => (
              <div key={movie.id} className="table-row">
                <div className="table-cell">
                  <img src={`http://localhost:3001/public/images/${movie.image_url}`} alt={movie.title} className="table-poster" />
                </div>
                <div className="table-cell">{movie.title}</div>
                <div className="table-cell">
                  <span className="category-badge">{movie.genre}</span>
                </div>
                <div className="table-cell">{movie.year}</div>
                <div className="table-cell">
                  <button onClick={() => handleEdit(movie)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(movie.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
