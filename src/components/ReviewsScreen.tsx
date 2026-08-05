import React, { useState } from 'react';
import { Star, CheckCircle, Plus, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from "../context/LanguageContext";
import { useApp } from '../context/AppContext';

export const ReviewsScreen: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const { reviewsList, addReview } = useApp();
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [project, setProject] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment) return;

    addReview({
      author,
      role: role || t('customer'),
      company: company || t('private_customer'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating,
      comment,
      project: project || t('3d_visualization'),
      date: t('today'),
      verified: true
    });

    setShowForm(false);
    setAuthor('');
    setComment('');
  };

  return (
    <div
      className="space-y-6 pb-20 animate-in fade-in duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{t('customer_reviews')}</h2>
          <p className="text-xs text-zinc-400 mt-0.5">{t('evaluation_of_our_work_and_imp')}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('write')}</span>
        </button>
      </div>

      {/* Average Rating Stats Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#12121d] via-[#161426] to-[#0e0e16] border border-indigo-900/40 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">{t('average_rating')}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white">4.9</span>
            <div className="flex items-center text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
        </div>
        <div className="text-right text-xs text-zinc-400 font-mono">
          <span className="text-indigo-400 font-bold">{reviewsList.length}</span> {t('ratings')}</div>
      </div>

      {/* Write Review Form Collapsible */}
      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAddReview} 
            className="p-5 rounded-2xl bg-[#0f0f17] border border-indigo-500/40 space-y-4 overflow-hidden"
          >
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> {t('leave_feedback_on_cooperation')}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                required
                placeholder={t('your_name')}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder={t('position_for_example_lead_arch')}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder={t('company_studio')}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder={t('project_name')}
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400">{t('auto_0J7RhtC1')}</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`} />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              required
              placeholder={t('your_feedback_on_the_quality_o')}
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium active:scale-95 transition-transform"
              >
                {t('cancel')}</button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold active:scale-95 transition-transform"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('auto_0J7Qv9GD')}</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews Cards List */}
      <div className="space-y-3.5">
        {reviewsList.map((rev) => (
          <div
            key={rev.id}
            className="p-4 sm:p-5 rounded-2xl bg-[#0e0e14] border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {rev.author}
                    {rev.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400" title={t('verified_client')} />
                    )}
                  </h4>
                  <p className="text-[11px] text-zinc-400">{rev.role} • {rev.company}</p>
                </div>
              </div>

              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              "{rev.comment}"
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/60">
              <span>{t('auto_0JRgNC0L')}<strong className="text-zinc-400 font-sans">{rev.project}</strong></span>
              <span>{rev.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
