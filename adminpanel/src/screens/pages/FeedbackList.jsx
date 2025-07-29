import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    API.get("/admin/feedback").then((res) => setFeedback(res.data));
  }, []);

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4">User Feedback</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-sm rounded">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="py-2 px-4 border">User</th>
              <th className="py-2 px-4 border">Rating</th>
              <th className="py-2 px-4 border">Comments</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-center">
            {feedback.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="py-2 px-4 border">{f.user_name || "Anonymous"}</td>
                <td className="py-2 px-4 border">{f.rating}</td>
                <td className="py-2 px-4 border text-left">{f.comments}</td>
                <td className="py-2 px-4 border">
                  {new Date(f.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackList;
