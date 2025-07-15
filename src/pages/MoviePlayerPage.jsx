import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "../components/MovieList.css"

function MoviePlayerPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [userRating, setUserRating] = useState(null)
  const [averageRating, setAverageRating] = useState(null)
  const [newRating, setNewRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentUserId = "user123"

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/movies/${id}`)
        if (!res.ok) throw new Error("Không tìm thấy phim")
        const data = await res.json()
        setMovie(data)

        if (data.ratings && data.ratings.length > 0) {
          const avg = data.ratings.reduce((sum, r) => sum + r.rating, 0) / data.ratings.length
          setAverageRating(avg.toFixed(1))

          const yourRating = data.ratings.find((r) => r.user_id === currentUserId)
          if (yourRating) {
            setUserRating(yourRating.rating)
            setNewRating(yourRating.rating)
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy phim:", err)
        setMovie(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const handleSubmitRating = async () => {
    try {
      setIsSubmitting(true)
      const res = await fetch(`http://localhost:3001/api/movies/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, rating: newRating })
      })

      if (!res.ok) throw new Error("Gửi đánh giá thất bại")

      const updated = await res.json()
      setMovie(updated)

      const yourRating = updated.ratings.find((r) => r.user_id === currentUserId)
      if (yourRating) {
        setUserRating(yourRating.rating)
      }

      const avg = updated.ratings.reduce((sum, r) => sum + r.rating, 0) / updated.ratings.length
      setAverageRating(avg.toFixed(1))

      alert("✅ Đánh giá đã được gửi!")
    } catch (err) {
      alert("❌ Gửi đánh giá thất bại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="movie-website-container">
        <div className="loading-page">
          <div className="loading-spinner"></div>
          <p>Đang tải phim...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="movie-website-container">
        <div className="error-page">
          <h2>Không tìm thấy phim</h2>
          <p>Phim bạn tìm không tồn tại hoặc đã bị xoá.</p>
          <Link to="/" className="back-home-btn">← Về trang chủ</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-website-container">
      <div className="movie-player-page">

        <div className="player-header">
          <Link to="/" className="back-btn">← Về danh sách phim</Link>
          <div className="player-logo">
            <img src="/images/mobifone-logo.png" alt="MobiFone" className="logo-image" />
          </div>
        </div>

        <div className="video-container">
          <video controls autoPlay className="movie-video" poster={`http://localhost:3001/public/images/${movie.image_url}`}>
            <source src={`http://localhost:3001/public/images/${movie.video_url}`} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        </div>

        <div className="movie-details">
          <div className="movie-details-container">
            <div className="movie-poster-large">
              <img src={`http://localhost:3001/public/images/${movie.image_url}`} alt={movie.title} />
            </div>

            <div className="movie-info-content">
              <h1 className="movie-title-large">{movie.title}</h1>

              <div className="movie-meta">
                <span className="movie-category">{movie.genre}</span>
              </div>

              <p className="movie-description">{movie.description}</p>


              <div className="movie-rating-section">
                <h4>⭐ Đánh giá phim</h4>

                <p>Trung bình: <strong>{averageRating || "Chưa có"}</strong></p>
                <p>
                  Đánh giá của bạn:{" "}
                  {userRating !== null
                    ? <strong>{userRating} ⭐</strong>
                    : <em>Bạn chưa đánh giá</em>}
                </p>

                <div className="rating-input">
                  <label htmlFor="rating">Chọn sao: </label>
                  <select
                    id="rating"
                    value={newRating}
                    onChange={(e) => setNewRating(parseFloat(e.target.value))}
                  >
                    {[...Array(11)].map((_, i) => {
                      const value = (i * 0.5).toFixed(1)
                      return (
                        <option key={value} value={value}>{value} ⭐</option>
                      )
                    })}
                  </select>

                  <button onClick={handleSubmitRating} disabled={isSubmitting}>
                    {userRating ? "Cập nhật" : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default MoviePlayerPage
