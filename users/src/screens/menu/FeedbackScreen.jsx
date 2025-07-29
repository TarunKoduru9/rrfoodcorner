import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const FeedbackForm = () => {
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState("5");
  const [comments, setComments] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleSubmit = async () => {
    if (!user) {
      alert("User not logged in");
      return;
    }

    try {
      await API.post("/auth/feedback", {
        name: user.name,
        rating,
        comments,
      });
      alert("Thank you! Your feedback has been submitted.");
      setRating("5");
      setComments("");
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert("Error submitting feedback.");
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-2 bg-gradient-to-br from-slate-100 to-gray-100 pb-32">
      <header className="flex justify-between items-center px-2 py-4 bg-white shadow-md sticky top-0 left-0 z-20">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-300 transition cursor-pointer"
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800 truncate">Feedback</h1>
      </header>
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-xl p-6 mt-2 shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Leave Feedback
        </h2>

        <label className="block mb-2 font-medium text-gray-700">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium text-gray-700">Comments</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          placeholder="Write your feedback here"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-[#16203bd5] text-white font-semibold py-3 rounded hover:bg-[#16203b]"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm;
