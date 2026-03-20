import React from 'react';
import { useResumeStore } from '../../store/resumeStore';

import { Briefcase, Plus, Trash2, GripVertical } from 'lucide-react';

const ExperienceForm = () => {
  const experience = useResumeStore((s) => s.experience);
  const addExperience = useResumeStore((s) => s.addExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const updateBullet = useResumeStore((s) => s.updateBullet);
  const addBullet = useResumeStore((s) => s.addBullet);
  const removeBullet = useResumeStore((s) => s.removeBullet);

  return (
    <div className="form-section">
      <h2 className="form-section-title">
        <Briefcase size={22} />
        Work Experience
      </h2>
      <p className="form-section-desc">List your most recent roles.</p>

      {experience.map((exp, index) => (
        <div key={exp.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-grip">
              <GripVertical size={16} />
              <span>Experience {index + 1}</span>
            </div>
            {experience.length > 1 && (
              <button className="delete-entry-btn" onClick={() => removeExperience(exp.id)}>
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Job Title <span className="required">*</span></label>
              <input
                placeholder="Senior Software Engineer"
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Company <span className="required">*</span></label>
              <input
                placeholder="Google"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Location</label>
              <input
                placeholder="Mountain View, CA"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Start Date <span className="required">*</span></label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>End Date</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.isCurrent}
              />
            </div>
            <div className="form-field checkbox-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={exp.isCurrent}
                  onChange={(e) => updateExperience(exp.id, 'isCurrent', e.target.checked)}
                />
                Currently working here
              </label>
            </div>
          </div>

          <div className="bullets-section">
            <label>Achievement Bullets</label>
            {exp.bullets.map((bullet, bIndex) => (
              <div key={bIndex} className="bullet-row">
                <span className="bullet-number">{bIndex + 1}</span>
                <div className="bullet-input-group">
                  <input
                    className="bullet-input"
                    placeholder="Increased revenue by 25% by implementing a new pricing strategy..."
                    value={bullet}
                    onChange={(e) => updateBullet(exp.id, bIndex, e.target.value)}
                  />

                </div>
                {exp.bullets.length > 1 && (
                  <button className="remove-bullet-btn" onClick={() => removeBullet(exp.id, bIndex)}>
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            {exp.bullets.length < 6 && (
              <button className="add-bullet-btn" onClick={() => addBullet(exp.id)}>
                <Plus size={14} /> Add Bullet
              </button>
            )}
          </div>
        </div>
      ))}

      <button className="add-entry-btn" onClick={addExperience}>
        <Plus size={16} /> Add Experience
      </button>
    </div>
  );
};

export default ExperienceForm;
