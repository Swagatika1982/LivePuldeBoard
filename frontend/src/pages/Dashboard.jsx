import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/api";

function Dashboard() {
  const [polls, setPolls] = useState([]);

  const fetchPolls = async () => {
    try {
      const response = await api.get("/polls/my-polls");

      setPolls(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch polls");
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

 
    const deletePoll = async (pollId) => {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this poll?"
      );

      if (!confirmDelete) return;

      try {
        await api.delete(`/polls/${pollId}`);

        toast.success("Poll deleted successfully!");

        fetchPolls();
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    };
 

  const totalResponses = polls.reduce(
    (sum, poll) => sum + (poll.responseCount || 0),
    0
  );

  const activePolls = polls.filter((poll) => !poll.isExpired);

  return (
    <div className="px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500 mt-1">
              Manage your polls, responses, and final results.
            </p>
          </div>

          <Link
            to="/create-poll"
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-indigo-700 text-center"
          >
            + Create Poll
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white rounded-xl shadow p-5 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-slate-500 text-sm">Total Polls</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {polls.length}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-5 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-slate-500 text-sm">Total Responses</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {totalResponses}
            </h3>
          </div>

          <div className="bg-white rounded-xl shadow p-5 transition hover:-translate-y-1 hover:shadow-lg">
            <p className="text-slate-500 text-sm">Active Polls</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-2">
              {activePolls.length}
            </h3>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow overflow-hidden">
          <div className="p-5 border-b">
            <h3 className="text-xl font-bold text-slate-800">My Polls</h3>
          </div>

          {polls.length === 0 ? (
            <div className="p-6 text-slate-500">
              No polls created yet. Create your first poll.
            </div>
          ) : (
            <div className="divide-y">
              {polls.map((poll) => (
                <div
                  key={poll._id}
                  className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {poll.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {poll.responseCount || 0} responses
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${poll.isExpired
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                        }`}
                    >
                      {poll.isExpired ? "Expired" : "Active"}
                    </span>
                        {" "}
                    {poll.isPublished && (
                      <span className="px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700">
                        Published
                      </span>
                    )}
                    <br />
                    <Link
                      to={`/poll/${poll._id}`}
                      className="text-indigo-600 font-medium"
                    >
                      Open Poll
                    </Link>
                    {" "}
                    <button
                      onClick={() => {
                        const pollLink = `${window.location.origin}/poll/${poll._id}`;
                        navigator.clipboard.writeText(pollLink);
                        toast.success("Poll link copied!");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-3 rounded-4g"
                    >
                      Copy Link
                    </button>
                      {" "}
                    <Link
                      to={`/analytics/${poll._id}`}
                      className="text-slate-700 font-medium"
                    >
                      Analytics
                    </Link>
                      {" "}
                    <Link
                      to={`/results/${poll._id}`}
                      className="text-slate-700 font-medium"
                    >
                      Results
                    </Link>
                      {" "}
                    <button
                      onClick={() => deletePoll(poll._id)}
                      className="text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;