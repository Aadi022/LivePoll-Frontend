import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Leaderboard.css";

let apiUrl = "http://backend-livepoll-env.eba-hwcps2xx.us-east-1.elasticbeanstalk.com";

const Leaderboard = ({ teacherUsername, isVisible, onClose }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible && teacherUsername) {
      fetchLeaderboard();
    }
  }, [isVisible, teacherUsername]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/leaderboard/${teacherUsername}`);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${index + 1}.`;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-danger";
  };

  if (!isVisible) return null;

  return (
    <div className="leaderboard-overlay">
      <div className="leaderboard-modal">
        <div className="leaderboard-header">
          <h4 className="mb-0">🏆 Leaderboard</h4>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>
        
        <div className="leaderboard-content">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No scores yet. Start asking questions to see the leaderboard!
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((student, index) => (
                <div key={student._id} className="leaderboard-item">
                  <div className="rank-icon">
                    {getRankIcon(index)}
                  </div>
                  <div className="student-info">
                    <div className="student-name">{student.studentName}</div>
                    <div className="student-stats">
                      {student.correctAnswers}/{student.totalQuestions} correct
                    </div>
                  </div>
                  <div className={`score ${getScoreColor(student.score)}`}>
                    {Math.round(student.score)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
