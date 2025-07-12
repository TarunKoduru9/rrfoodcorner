import React, { useEffect, useState } from "react";
import API from "../../utils/api";
import styles from "../pages/Styles/FeedbackList.module.css";

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    API.get("/admin/feedback").then((res) => setFeedback(res.data));
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>User Feedback</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Rating</th>
            <th>Comments</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((f) => (
            <tr key={f.id}>
              <td>{f.user_name || "Anonymous"}</td>
              <td>{f.rating}</td>
              <td>{f.comments}</td>
              <td>{new Date(f.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackList;
