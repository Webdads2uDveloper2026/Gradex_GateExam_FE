import React, { useState, useEffect } from "react";
import { getAdminResults, deleteStudent } from "../api";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users,
  Layout,
  Globe,
  ChevronRight,
  Download,
  Filter,
  Search,
  Trash2,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Admin = ({ onLogout }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    id: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/admin/login");
  };

  const fetchResults = async () => {
    try {
      const res = await getAdminResults();
      setResults(res.data);
    } catch (err) {
      console.error("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // const handleDeleteStudent = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this student record? This will also remove assessment results.')) {
  //     try {
  //       await deleteStudent(id);
  //       fetchResults();
  //     } catch (err) {
  //       alert('Failed to delete record');
  //     }
  //   }
  // };

  const handleDeleteStudent = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDeleteStudent = async () => {
    try {
      await deleteStudent(deleteConfirm.id);
      fetchResults();
    } catch (err) {
      alert("Failed to delete record");
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const cancelDeleteStudent = () => {
    setDeleteConfirm({ show: false, id: null });
  };

  const filtered = results.filter(
    (r) =>
      r.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.student_phone?.includes(searchTerm) ||
      r.student_email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen p-6 sm:p-12 max-w-7xl mx-auto">
      <AnimatePresence>
        {deleteConfirm.show && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900 p-6 rounded-xl border border-red-500/30 w-[90%] max-w-md text-center"
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                Are you sure?
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this student record? This will
                also remove assessment results.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelDeleteStudent}
                  className="px-8 py-2 cursor-pointer rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteStudent}
                  className="px-8 py-2 cursor-pointer rounded-lg bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
      >
        <div>
          <h1 className="md:text-4xl text-[20px] font-black mb-6 flex items-center">
            <Users className="mr-4 text-indigo-500" size={36} />
            Student Assessments
          </h1>
          <p className="text-gray-400 text-[20px]">
            Total {results.length} participants completed the evaluation.
          </p>
        </div>

        <div className="mt-8 md:mt-0 flex gap-4">
          <Link
            to="/admin/questions"
            className="md:px-4 px-2 bg-primary/10 hover::bg-indigo-600 py-3 bg-slate-800 rounded-xl transition flex items-center justify-center border border-glass-border font-bold text-sm no-underline text-white hover:bg-slate-700"
          >
            <Layout size={18} className="mr-2" />
            Manage Questions
          </Link>
          <button
            onClick={handleLogout}
            className="md:px-4 px-2 bg-primary/10 hover::bg-indigo-600 py-3 bg-slate-800 rounded-xl transition  flex items-center justify-center border border-glass-border font-bold text-sm no-underline text-white cursor-pointer hover:bg-slate-700"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </motion.div>

      <div className="mb-8 flex gap-4 items-center flex-row md:flex-row md:gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-2 md:left-4 top-10 -translate-y-1/2 text-gray-500"
            size={20}
          />
          <input
            className="input-field pl-12 h-14 placeholder:text-[12px] md:placeholder:text-[15px]"
            placeholder="Search by student details..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-4 bg-slate-800 text-[white] rounded-xl border border-glass-border hover:bg-slate-700 transition">
          <Filter size={20} className="text-white" />
        </button>
      </div>

      <div className="glass-card shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 text-center text-gray-400 font-bold">
            Loading dashboard insights...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-glass-border">
                  <th className="p-6 font-bold uppercase tracking-widest text-xs text-indigo-300">
                    Student Info
                  </th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs text-indigo-300">
                    Status
                  </th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs text-indigo-300">
                    Language
                  </th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs text-indigo-300">
                    Score
                  </th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs text-indigo-300">
                    Scholarship
                  </th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs text-indigo-300">
                    Date
                  </th>
                  <th className="p-6 font-bold uppercase tracking-widest text-xs text-indigo-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/30">
                {filtered.map((r) => (
                  <motion.tr
                    key={r._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-white/5 transition group ease-out"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-white mb-1 group-hover:text-indigo-400 transition">
                          {r.student_name}
                        </span>
                        <div className="flex items-center gap-4 mt-3">
                          <span
                            className={
                              r.student_category === "School"
                                ? "badge-school text-[13px]"
                                : "badge-college text-[13px]"
                            }
                          >
                            {r.student_category || "College"}
                          </span>
                          <span className="text-xs text-gray-500 font-bold">
                            {r.student_phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-[13px] font-black uppercase tracking-tighter ${r.status === "Completed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-500"}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-tighter">
                        <Globe size={14} className="mr-2 text-indigo-500" />
                        {r.language || "English"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${r.score_percentage}%` }}
                          />
                        </div>
                        <span className="font-black text-white">
                          {Math.round(r.score_percentage)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-6 font-black text-indigo-400">
                      {Math.round(r.scholarship_percentage)}%
                    </td>
                    <td className="p-6 text-sm text-gray-500 font-medium italic">
                      {new Date(r.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <div className="flex justify-between">
                        {/* <div className="px-2 py-2 rounded-full cursor-pointer  text-gray-500 hover:text-white transition">
                                <ChevronRight size={20} color="currentColor" />
                            </div> */}
                        {/* <div
                          role="button"
                          className="px-2 py-2 cursor-pointer text-gray-500 hover:text-white transition-colors duration-200"
                        >
                          <ChevronRight size={20} color="currentColor" />
                        </div> */}
                        <div
                          role="button"
                          onClick={() => handleDeleteStudent(r._id)}
                          className="p-2 cursor-pointer text-gray-500 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 size={20} color="currentColor" />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-20 text-center text-gray-600 font-medium">
                No records found matching your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
