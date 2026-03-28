import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Globe,
  Layout,
  LogOut,
  Upload,
  Download,
  RefreshCcw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAdminQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addBulkQuestions,
} from "../api";
import * as XLSX from "xlsx";

const AdminQuestions = ({ onLogout }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    id: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");

  const [popup, setPopup] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    text: "",
    options: ["", "", "", ""],
    correct_option: 0,
    language: "English",
    category: "Both",
  });

  const handleLogout = () => {
    onLogout();
    navigate("/admin/login");
  };

  const showPopup = (type, title, message) => {
    setPopup({
      show: true,
      type,
      title,
      message,
    });

    setTimeout(() => {
      setPopup((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const downloadSampleExcel = () => {
    const data = [
      [
        "Question",
        "Option A",
        "Option B",
        "Option C",
        "Option D",
        "Correct (1-4)",
        "Language",
        "Category",
      ],
      [
        "What is the capital of France?",
        "London",
        "Paris",
        "Berlin",
        "Madrid",
        2,
        "English",
        "Both",
      ],
      ["2 + 2 = ?", "3", "4", "5", "6", 2, "English", "School"],
      [
        "HTML-ல் ஒரு ஹைப்பர்லிங்கை உருவாக்க எந்த டேக் பயன்படுத்தப்படுகிறது?",
        "<link>",
        "<a>",
        "<div>",
        "<img>",
        2,
        "Tamil",
        "Both",
      ],
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    const wscols = [
      { wch: 40 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
    ];
    ws["!cols"] = wscols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SampleQuestions");
    XLSX.writeFile(wb, "SkillAssessment_Template.xlsx");
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        console.log("Parsed Raw Excel Data:", rawData);

        const formattedQuestions = rawData
          .slice(1)
          .map((row, index) => {
            if (!row[0] || row[0].toString().trim() === "") return null;

            const correctIdx = parseInt(row[5]);
            if (isNaN(correctIdx) || correctIdx < 1 || correctIdx > 4) {
              console.warn(
                `Row ${index + 2}: Invalid correct option index: ${row[5]}`,
              );
              return null;
            }

            return {
              text: row[0].toString(),
              options: [
                row[1]?.toString() || "",
                row[2]?.toString() || "",
                row[3]?.toString() || "",
                row[4]?.toString() || "",
              ],
              correct_option: correctIdx - 1,
              language: row[6]?.toString() || "English",
              category: row[7]?.toString() || "Both",
            };
          })
          .filter((q) => q !== null);

        console.log("Formatted Questions for Import:", formattedQuestions);

        if (formattedQuestions.length > 0) {
          await addBulkQuestions(formattedQuestions);
          fetchQuestions();
          setIsBulkModalOpen(false);
          showPopup(
            "success",
            "Import Successful",
            `Imported ${formattedQuestions.length} questions`,
          );
        } else {
          showPopup(
            "error",
            "Import Failed",
            "No valid questions found in Excel",
          );
        }
      } catch (err) {
        console.error("Excel parse error:", err);
        showPopup("error", "File Error", "Invalid Excel format");
      }
    };
    reader.readAsBinaryString(file);
  };

  const fetchQuestions = async () => {
    try {
      const res = await getAdminQuestions();
      setQuestions(res.data);
    } catch (err) {
      console.error("Failed to fetch questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenModal = (q = null) => {
    if (q) {
      setFormData({
        text: q.text,
        options: q.options,
        correct_option: q.correct_option,
        language: q.language || "English",
        category: q.category || "Both",
      });
      setEditingId(q._id);
    } else {
      setFormData({
        text: "",
        options: ["", "", "", ""],
        correct_option: 0,
        language: "English",
        category: "Both",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || q.category === categoryFilter;
    const matchesLanguage =
      languageFilter === "All" || q.language === languageFilter;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateQuestion(editingId, formData);
        showPopup("success", "Updated", "Question updated successfully");
      } else {
        await addQuestion(formData);
        showPopup("success", "Created", "Question added successfully");
      }

      setIsModalOpen(false);
      fetchQuestions();
    } catch (err) {
      showPopup("error", "Save Failed", "Unable to save question");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteQuestion(deleteConfirm.id);
      fetchQuestions();
      setDeleteConfirm({ show: false, id: null });
      showPopup("success", "Deleted", "Question deleted successfully");
    } catch (err) {
      showPopup("error", "Delete Failed", "Unable to delete question");
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-12 max-w-7xl mx-auto">
      <AnimatePresence>
        {popup.show && (
          <motion.div
            className="fixed inset-0 z-[200px] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 40 }}
              transition={{ duration: 0.3 }}
              className={`relative flex items-center w-[80%] md:w-[30%] h-[15%] px-10 gap-4  py-5 rounded-xl shadow-xl text-white font-bold
          ${popup.type === "success" ? "bg-indigo-500/10 text-white" : "bg-red-600"}`}
            >
              <button
                onClick={() => setPopup((prev) => ({ ...prev, show: false }))}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/20 transition"
              >
                <X size={18} />
              </button>

              {/* LOGO */}
              <img src="/gradexfavicon.png" alt="logo" className="w-8 h-8" />

              {/* TEXT */}
              <div>
                <h4 className="text-sm mb-1">{popup.title}</h4>
                <p className="text-xs opacity-80">{popup.message}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="bg-slate-900 p-8 rounded-2xl border border-red-500/30 w-[400px] text-center"
            >
              <h3 className="text-xl font-bold mb-4 text-white">
                Confirm Delete
              </h3>

              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this question?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setDeleteConfirm({ show: false, id: null })}
                  className="px-8 py-2 cursor-pointer rounded-xl bg-slate-700 px-4 hover:bg-slate-600 text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="px-8 cursor-pointer py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card max-w-2xl w-full h-[100dvh] flex flex-col border-indigo-500/30 overflow-hidden"
            >
              {/* Sticky Header */}
              <div className="p-4 flex justify-between border rounded-t-xl border-indigo-500/30 mt-6 items-center border-b border-white/5 bg-slate-900/40 backdrop-blur-md">
                <h2 className="text-3xl font-black text-white">
                  {editingId ? "Edit Question" : "Add New Question"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-4 cursor-pointer hover:bg-white/10 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8 border border-indigo-500/30 mb-20 rounded-b-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="text-sm font-bold mb-3 text-gray-400 uppercase tracking-tighter mb-4">
                        Assessment Language
                      </label>
                      <select
                        className="input-field h-14"
                        value={formData.language}
                        onChange={(e) =>
                          setFormData({ ...formData, language: e.target.value })
                        }
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-bold mb-4 text-gray-400 uppercase tracking-tighter">
                        Target Category
                      </label>
                      <select
                        className="input-field h-14"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <option value="School">School Students</option>
                        <option value="College">College Students</option>
                        <option value="Both">Both (General)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-bold mb-3 text-gray-400 uppercase tracking-tighter mt-8 mb-4">
                      Question Statement
                    </label>
                    <textarea
                      required
                      className="input-field min-h-[140px] text-lg py-5 leading-relaxed"
                      placeholder="Enter the assessment question here..."
                      value={formData.text}
                      onChange={(e) =>
                        setFormData({ ...formData, text: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-4">
                    {formData.options.map((opt, idx) => (
                      <div key={idx} className="flex flex-col group">
                        <label className="text-sm font-bold mb-4 text-gray-400 flex justify-between items-center">
                          <span className="group-hover:text-indigo-400 transition">
                            Option {String.fromCharCode(65 + idx)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] opacity-0 group-hover:opacity-100 transition mr-2 uppercase border border-indigo-500/30 px-2 py-2 rounded-xl tracking-widest text-indigo-400">
                              Mark Correct
                            </span>
                            <input
                              type="radio"
                              name="correct"
                              className="w-5 h-5 accent-indigo-500 cursor-pointer"
                              checked={formData.correct_option === idx}
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  correct_option: idx,
                                })
                              }
                            />
                          </div>
                        </label>
                        <input
                          required
                          className="input-field h-14 group-hover:border-indigo-500/30 transition"
                          placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...formData.options];
                            newOpts[idx] = e.target.value;
                            setFormData({ ...formData, options: newOpts });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="md:flex text-center">
                    <button
                      type="submit"
                      className="btn-primary cursor-pointer flex-1 py-2 text-xl font-black shadow-2xl"
                    >
                      Publish Question
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className=" border px-8 py-2 rounded-xl border-glass-border font-bold text-sm no-underline cursor-pointer text-white hover:bg-slate-700 transition ms-4"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBulkModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card max-w-4xl w-full max-h-[90vh] flex flex-col rounded-xl border-purple-500/30 border border-glass-border overflow-hidden"
            >
              <div className="py-4 px-4 flex justify-between items-center border border-bottom--purple-500/30 bg-slate-900/40 backdrop-blur-md">
                <h2 className="md:text-3xl font-medium  text-white text-center">
                  Bulk Question Import
                </h2>
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 cursor-pointer hover:bg-white/10  rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-12 flex flex-col items-center flex-1 justify-center max-w-2xl mx-auto w-full text-center">
                <div className="w-20 cursor-pointer h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-8 text-indigo-400 border border-indigo-500/20">
                  <Upload size={30} />
                </div>
                <h3 className="md:text-28px font-medium  mb-4">
                  Excel/CSV Bulk Upload
                </h3>
                <p className="text-gray-400 mb-10 leading-relaxed md:text-[16px] font-medium">
                  To import questions in bulk, please use our standardized Excel
                  template. Ensure your file includes columns for the{" "}
                  <strong>
                    Question, 4 Options, Correct Index (1-4), Language, and
                    Category.
                  </strong>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
                  <button
                    onClick={downloadSampleExcel}
                    className="px-8 cursor-pointer py-3 bg-slate-800 rounded-2xl border border-glass-border font-bold hover:bg-slate-700 transition flex items-center justify-center space-x-3"
                  >
                    <Download size={26} className="pe-2" />
                    <span>Download Template</span>
                  </button>
                  <label className="btn-primary flex items-center justify-center cursor-pointer py-5 text-lg font-black shadow-lg">
                    <Plus size={20} className="mr-2" />
                    Select Excel File
                    <input
                      type="file"
                      className="hidden"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleExcelUpload}
                    />
                  </label>
                </div>

                <div className="hidden md:block mt-12 p-8 bg-slate-950/50 rounded-3xl border border-glass-border w-full text-left">
                  <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">
                    Template Requirements
                  </h4>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 text-green-500" />{" "}
                      Correct column must be a number 1-4
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 text-green-500" />{" "}
                      Categories supported: School, College, Both
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 text-green-500" />{" "}
                      Languages supported: English, Tamil
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="p-8 py-6 border-t border-white/5 bg-slate-900/80 backdrop-blur-md flex justify-center">
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-12 py-4 bg-slate-800 rounded-2xl font-black text-white hover:bg-slate-700 transition border border-glass-border"
                >
                  Close Import Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
        <div>
          <h1 className="md:text-3xl font-medium font-black mb-4 flex items-center">
            <Layout className="mr-4 text-indigo-500" size={36} />
            Question Bank Management
          </h1>
          <div className="flex gap-6 mt-4">
            <p className="text-white text-[16px] ">
              Total {questions.length} questions across all target categories.
            </p>
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setLoading(true);
                fetchQuestions();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setLoading(true);
                  fetchQuestions();
                }
              }}
              className="p-1.5 m cursor-pointer text-indigo-400 hover:text-white transition-colors duration-200"
              title="Refresh Questions List"
            >
              <RefreshCcw
                size={24}
                color="currentColor"
                className={loading ? "animate-spin" : ""}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 mt-8 md:mt-0">
          <Link
            to="/admin"
            className=" px-8 py-2 bg-slate-800 rounded-xl border border-glass-border font-bold text-sm no-underline text-white hover:bg-slate-700 transition flex items-center"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="py-2 px-8 bg-red-500/10 text-red-500 cursor-pointer rounded-xl hover:bg-red-500 hover:text-white transition flex items-center border border-red-500/20 font-bold text-sm"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="cursor-pointer px-8 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl hover:bg-indigo-600 hover:text-white transition flex items-center border border-indigo-500/20 font-bold text-sm"
          >
            <Upload size={18} className="mr-2" />
            Bulk Add
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="cursor-pointer btn-primary py-3 px-8 flex items-center font-bold"
          >
            <Plus size={18} className="mr-2" />
            Add Question
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-slate-900/30 p-8 rounded-3xl border border-glass-border backdrop-blur-sm">
        <div className="flex flex-col">
          <label className="text-[10px] font-medium font-black uppercase tracking-widest text-indigo-400 mb-4 ml-1">
            Search Keywords
          </label>
          <input
            type="text"
            placeholder="Search questions..."
            className="input-field h-14"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-black uppercase tracking-widest font-medium text-indigo-400 mb-4 ml-1">
            Category Filter
          </label>
          <select
            className="input-field h-14 "
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="School">School Students</option>
            <option value="College">College Students</option>
            <option value="Both">General (Both)</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 font-medium mb-4 ml-1">
            Language Filter
          </label>
          <select
            className="input-field h-14"
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
          >
            <option value="All">All Languages</option>
            <option value="English">English</option>
            <option value="Tamil">Tamil</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {filteredQuestions.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-card border-dashed">
            <Globe size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-500">
              No questions match your current filters.
            </h3>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
                setLanguageFilter("All");
              }}
              className="mt-4 text-indigo-400 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <motion.div
              layout
              key={q._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 flex flex-col justify-between hover:border-indigo-500/50 transition group"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-6">
                    <span
                      className={
                        q.language === "English"
                          ? "badge-college"
                          : "badge-school"
                      }
                    >
                      {q.language}
                    </span>
                    <span className="px-8 py-3 rounded-xl bg-slate-800 text-[10px] text-gray-400  font-black uppercase tracking-tighter ring-1 ring-glass-border">
                      {q.category || "Both"}
                    </span>
                  </div>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition ms-4 md:ms-0">
                    <button
                      onClick={() => handleOpenModal(q)}
                      className="px-4 cursor-pointer py-2 bg-slate-800/50 hover:bg-indigo-600 rounded-xl text-gray-400 hover:text-white transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ show: true, id: q._id })
                      }
                      className="px-4 cursor-pointer py-2 bg-slate-800/50 hover:bg-red-600 rounded-xl text-gray-400 hover:text-white transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h4 className="md:text-xl text-[16px] font-medium mb-6 leading-snug group-hover:text-indigo-300 transition md:h-[50px]">
                  {q.text}
                </h4>
                <ul
                  className="mb-4 text-sm"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {q.options.map((opt, idx) => (
                    <li
                      key={idx}
                      className={`py-2 px-4 rounded-xl flex items-center border ${idx === q.correct_option ? "bg-green-500/10 border-green-500/30 text-green-400 font-bold" : "bg-slate-900/40 border-glass-border text-gray-400"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-lg me-4 flex items-center justify-center text-xs font-black ${idx === q.correct_option ? "bg-green-500 text-white" : "bg-slate-800"}`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      {opt}
                      {idx === q.correct_option && (
                        <Check size={16} className="ml-auto" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminQuestions;
