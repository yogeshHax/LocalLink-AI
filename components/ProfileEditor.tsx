import React, { useState } from 'react';
import { User, Skill, SkillCategory } from '../types';
import { Save, Plus, Trash2, X } from 'lucide-react';

interface ProfileEditorProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<User>({ ...user });
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '',
    category: SkillCategory.MANUAL_LABOR,
    description: '',
    hourlyRate: 0,
    creditValue: 1
  });
  const [showAddSkill, setShowAddSkill] = useState(false);

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRemoveSkill = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s.id !== skillId)
    }));
  };

  const handleAddSkill = () => {
    if (!newSkill.name || !newSkill.description) return;
    
    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill.name!,
      category: newSkill.category as SkillCategory,
      description: newSkill.description!,
      hourlyRate: Number(newSkill.hourlyRate),
      creditValue: Number(newSkill.creditValue)
    };

    setFormData(prev => ({
      ...prev,
      skillsOffered: [...prev.skillsOffered, skill]
    }));
    
    setNewSkill({
       name: '',
       category: SkillCategory.MANUAL_LABOR,
       description: '',
       hourlyRate: 0,
       creditValue: 1
    });
    setShowAddSkill(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto my-8">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
               <input 
                type="text" 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
               <textarea 
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                rows={3}
                value={formData.bio || ''}
                placeholder="Tell your neighbors about yourself..."
                onChange={(e) => handleInputChange('bio', e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Skills Offered */}
        <section className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
             <h3 className="text-lg font-semibold text-gray-900">Skills You Offer</h3>
             <button 
                onClick={() => setShowAddSkill(true)}
                className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium hover:bg-indigo-100 flex items-center"
             >
               <Plus className="w-4 h-4 mr-1" /> Add Skill
             </button>
          </div>

          {/* Add Skill Form */}
          {showAddSkill && (
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 animate-[fadeIn_0.2s]">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <input 
                        placeholder="Skill Name (e.g. Piano Lessons)"
                        className="p-2 rounded border border-gray-200"
                        value={newSkill.name}
                        onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                    />
                    <select 
                        className="p-2 rounded border border-gray-200"
                        value={newSkill.category}
                        onChange={e => setNewSkill({...newSkill, category: e.target.value as SkillCategory})}
                    >
                        {Object.values(SkillCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="md:col-span-2">
                        <input 
                            placeholder="Description"
                            className="w-full p-2 rounded border border-gray-200"
                            value={newSkill.description}
                            onChange={e => setNewSkill({...newSkill, description: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Rate ($)</label>
                            <input type="number" className="w-full p-2 rounded" value={newSkill.hourlyRate} onChange={e => setNewSkill({...newSkill, hourlyRate: Number(e.target.value)})} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500">Credits</label>
                            <input type="number" className="w-full p-2 rounded" value={newSkill.creditValue} onChange={e => setNewSkill({...newSkill, creditValue: Number(e.target.value)})} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowAddSkill(false)} className="px-3 py-1 text-sm text-gray-500">Cancel</button>
                    <button onClick={handleAddSkill} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded">Save Skill</button>
                </div>
            </div>
          )}

          {/* List Skills */}
          <div className="grid gap-3">
            {formData.skillsOffered.map(skill => (
              <div key={skill.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div>
                   <p className="font-semibold text-gray-900">{skill.name}</p>
                   <p className="text-xs text-gray-500">{skill.category} • ${skill.hourlyRate}/hr • {skill.creditValue} Credits</p>
                </div>
                <button onClick={() => handleRemoveSkill(skill.id)} className="text-red-400 hover:text-red-600 p-2">
                   <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button 
             onClick={onCancel}
             className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
             onClick={() => onSave(formData)}
             className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" /> Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
