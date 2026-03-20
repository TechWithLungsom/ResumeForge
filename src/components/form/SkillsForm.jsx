import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Wrench, Plus, Trash2, X } from 'lucide-react';

const SkillsForm = () => {
  const skills = useResumeStore((s) => s.skills);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const removeSkillCategory = useResumeStore((s) => s.removeSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);
  const updateSkillItems = useResumeStore((s) => s.updateSkillItems);

  const [inputValues, setInputValues] = useState({});

  const handleAddSkill = (index, e) => {
    if (e.key === 'Enter' && inputValues[index]?.trim()) {
      const newItems = [...skills[index].items, inputValues[index].trim()];
      updateSkillItems(index, newItems);
      setInputValues({ ...inputValues, [index]: '' });
    }
  };

  const handleRemoveSkill = (catIndex, skillIndex) => {
    const newItems = skills[catIndex].items.filter((_, i) => i !== skillIndex);
    updateSkillItems(catIndex, newItems);
  };



  return (
    <div className="form-section">
      <h2 className="form-section-title">
        <Wrench size={22} />
        Skills
      </h2>
      <p className="form-section-desc">Categorize your skills. Press Enter to add each skill. ATS systems match these exactly.</p>



      {skills.map((category, catIndex) => (
        <div key={catIndex} className="entry-card">
          <div className="entry-card-header">
            <input
              className="category-input"
              placeholder="Category (e.g., Programming Languages)"
              value={category.category}
              onChange={(e) => updateSkillCategory(catIndex, e.target.value)}
            />
            {skills.length > 1 && (
              <button className="delete-entry-btn" onClick={() => removeSkillCategory(catIndex)}>
                <Trash2 size={14} />
              </button>
            )}
          </div>

          <div className="skill-tags-container">
            {category.items.map((skill, skillIndex) => (
              <span key={skillIndex} className="skill-tag">
                {skill}
                <button onClick={() => handleRemoveSkill(catIndex, skillIndex)}>
                  <X size={12} />
                </button>
              </span>
            ))}
            <input
              className="skill-input-inline"
              placeholder="Type a skill and press Enter..."
              value={inputValues[catIndex] || ''}
              onChange={(e) => setInputValues({ ...inputValues, [catIndex]: e.target.value })}
              onKeyDown={(e) => handleAddSkill(catIndex, e)}
            />
          </div>
        </div>
      ))}

      <button className="add-entry-btn" onClick={addSkillCategory}>
        <Plus size={16} /> Add Skill Category
      </button>
    </div>
  );
};

export default SkillsForm;
