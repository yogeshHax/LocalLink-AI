import React, { useState } from 'react';
import { X, Plus, DollarSign, Clock, Image as ImageIcon } from 'lucide-react';
import { SkillCategory, Skill } from '../types';

interface AddListingModalProps {
  onClose: () => void;
  onAdd: (listing: any) => void;
}

const AddListingModal: React.FC<AddListingModalProps> = ({ onClose, onAdd }) => {
  const [type, setType] = useState<'OFFER' | 'REQUEST'>('OFFER');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SkillCategory>(SkillCategory.MANUAL_LABOR);
  const [rate, setRate] = useState('');
  const [credits, setCredits] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newSkill: Partial<Skill> = {
      id: Date.now().toString(),
      name: title,
      category,
      description,
      hourlyRate: Number(rate) || 0,
      creditValue: Number(credits) || 1,
    };

    onAdd({ type, skill: newSkill });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Post to Neighborhood</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Toggle Type */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('OFFER')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                type === 'OFFER' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I'm Offering a Skill
            </button>
            <button
              type="button"
              onClick={() => setType('REQUEST')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                type === 'REQUEST' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              I Need Help
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              placeholder={type === 'OFFER' ? "e.g., Weekend Gardening" : "e.g., Need Lawn Mowed"}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
            <select
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value as SkillCategory)}
            >
              {Object.values(SkillCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="Describe what you are offering or looking for..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                <DollarSign className="w-3 h-3" /> Rate (USD)
              </label>
              <input
                type="number"
                placeholder="40"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Credits
              </label>
              <input
                type="number"
                placeholder="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post {type === 'OFFER' ? 'Service' : 'Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListingModal;