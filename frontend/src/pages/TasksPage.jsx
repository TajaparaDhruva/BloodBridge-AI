import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiLayers, FiPlus, FiTrash2, FiCheckCircle, FiSearch, 
  FiAlertCircle, FiCalendar, FiClock, FiCheckSquare, FiAlertTriangle 
} from 'react-icons/fi';

const TasksPage = ({ tasks, onAddTask, onToggleTask, onDeleteTask }) => {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('normal');
  const [newDue, setNewDue] = useState('Today');

  // Stats Calculations
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const critical = tasks.filter(t => !t.completed && t.priority === 'critical').length;
    return { total, pending, completed, critical };
  }, [tasks]);

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchStatus = statusFilter === 'All' || 
        (statusFilter === 'Completed' ? t.completed : !t.completed);
      return matchSearch && matchPriority && matchStatus;
    });
  }, [tasks, search, priorityFilter, statusFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      due: newDue,
    });
    setNewTitle('');
    setNewPriority('normal');
    setNewDue('Today');
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-6 text-left">
      {/* Title block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-extrabold text-gray-950 dark:text-white text-[24px] tracking-tight leading-none">
            Operations <span className="text-[#E11D48]">Tasks</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-[13px] font-semibold mt-1">
            Create, prioritize, and manage vital logistics and supply line tasks
          </p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-3.5 my-1 lg:my-0">
          {/* Total Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px]">
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-[#6366F1] flex items-center justify-center flex-shrink-0">
              <FiLayers className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{stats.total}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Total</span>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px]">
            <div className="w-8.5 h-8.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center flex-shrink-0">
              <FiClock className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{stats.pending}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Pending</span>
            </div>
          </div>

          {/* Critical Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px]">
            <div className="w-8.5 h-8.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center flex-shrink-0">
              <FiAlertCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{stats.critical}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Critical</span>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-2xl p-2.5 px-4 flex items-center gap-3 shadow-sm min-w-[124px]">
            <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 flex items-center justify-center flex-shrink-0">
              <FiCheckSquare className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-[17px] font-black text-gray-900 dark:text-white leading-none block">{stats.completed}</span>
              <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 block leading-none">Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left List, Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Tasks view and filters */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Filters Bar Card */}
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-rose-100/50 dark:border-rose-950/30 rounded-2xl text-[13px] text-gray-805 dark:text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
              {/* Priority filters */}
              <div className="flex gap-1.5 flex-wrap">
                {['All', 'critical', 'urgent', 'normal'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriorityFilter(p)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer border uppercase tracking-wider ${
                      priorityFilter === p
                        ? p === 'critical'
                          ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-sm'
                          : p === 'urgent'
                          ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                          : p === 'normal'
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                          : 'bg-[#6366F1] border-[#6366F1] text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:border-rose-200'
                    }`}
                  >
                    {p === 'All' ? 'All Priorities' : p}
                  </button>
                ))}
              </div>

              {/* Status filter dropdown / button list */}
              <div className="flex gap-1.5">
                {['All', 'Pending', 'Completed'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all cursor-pointer ${
                      statusFilter === s
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-gray-400 hover:border-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tasks list */}
          <div className="space-y-3.5">
            <AnimatePresence mode="popLayout">
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-3xl p-12 text-center text-gray-400 font-bold"
                >
                  <p className="text-4xl mb-3">✓</p>
                  <p className="text-gray-700 dark:text-white text-base">No tasks found matching your filters</p>
                  <p className="text-xs mt-1 font-semibold">Great job keeping up with operations!</p>
                </motion.div>
              ) : (
                filteredTasks.map((task, i) => {
                  let priorityColor = 'border-l-[#10B981]';
                  let badgeStyle = 'bg-emerald-50 text-emerald-600 border border-emerald-100/20 dark:bg-emerald-950/20 dark:text-emerald-400';
                  if (task.priority === 'critical') {
                    priorityColor = 'border-l-[#E11D48]';
                    badgeStyle = 'bg-rose-50 text-[#E11D48] border border-rose-100/20 dark:bg-rose-950/20 dark:text-rose-400';
                  } else if (task.priority === 'urgent' || task.priority === 'warning') {
                    priorityColor = 'border-l-[#F59E0B]';
                    badgeStyle = 'bg-amber-50 text-amber-600 border border-amber-100/20 dark:bg-amber-950/20 dark:text-amber-455';
                  }

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 border-l-[5px] ${priorityColor} rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all`}
                    >
                      {/* Completion check */}
                      <div 
                        onClick={() => onToggleTask(task.id)}
                        className="w-6 h-6 flex items-center justify-center flex-shrink-0 cursor-pointer"
                      >
                        {task.completed ? (
                          <FiCheckCircle className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <div className="w-5.5 h-5.5 rounded-md border-2 border-gray-200 dark:border-slate-700 hover:border-[#E11D48] transition-colors" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 text-left">
                        <p className={`font-extrabold text-[14px] leading-tight ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Due {task.due}</span>
                        </div>
                      </div>

                      {/* Right actions/badges */}
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${badgeStyle}`}>
                          {task.priority}
                        </span>

                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-2 text-gray-400 hover:text-[#E11D48] hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-all cursor-pointer"
                          title="Delete task"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Create Task Form */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 border border-[#F3F4F6] dark:border-slate-800 rounded-3xl p-6 shadow-sm sticky top-24 space-y-5">
            <div className="flex items-center gap-2.5 text-gray-900 dark:text-white pb-3 border-b border-[#F3F4F6] dark:border-slate-800/80">
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[#E11D48] flex items-center justify-center">
                <FiPlus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h2 className="font-extrabold text-[15px] leading-tight">Create Operations Task</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Task Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., Verify O- blood bag label serials"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-[13px] text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#E11D48] focus:ring-1 focus:ring-[#E11D48] transition-all"
                />
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Urgency / Priority</label>
                <div className="flex gap-2">
                  {['normal', 'urgent', 'critical'].map(level => {
                    const active = newPriority === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setNewPriority(level)}
                        className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer uppercase tracking-wider select-none ${
                          active
                            ? level === 'critical'
                              ? 'bg-rose-50 border-[#E11D48] text-[#E11D48]'
                              : level === 'urgent'
                              ? 'bg-amber-50 border-amber-500 text-amber-600'
                              : 'bg-emerald-50 border-emerald-500 text-emerald-600'
                            : 'bg-transparent border-gray-200 dark:border-slate-800 text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Due timeline */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Timeline / Due By</label>
                <select
                  value={newDue}
                  onChange={e => setNewDue(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-[13px] text-gray-750 dark:text-white focus:outline-none focus:border-[#E11D48] cursor-pointer"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="48 hours">48 Hours</option>
                  <option value="This week">This Week</option>
                  <option value="End of month">End of Month</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-[#E11D48] hover:bg-rose-600 text-white font-extrabold text-[12px] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider"
              >
                Publish Task
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TasksPage;
