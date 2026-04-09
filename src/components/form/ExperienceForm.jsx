import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Briefcase, Plus, Trash2, GripVertical, Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { improveBullet } from '../../services/geminiAI';

// ─── AI Bullet Improver sub-component ───
function BulletRow({ expId, bIndex, bullet, title, company, onUpdate, onRemove, showRemove }) {
  const [improving, setImproving] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState(null);

  const handleImprove = async () => {
    if (!bullet.trim()) return;
    setImproving(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await improveBullet(bullet, title, company);
      setSuggestion(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setImproving(false);
    }
  };

  return (
    <div className="bullet-row">
      <span className="bullet-number">{bIndex + 1}</span>
      <div className="bullet-input-group">
        <input
          className="bullet-input"
          placeholder="Increased revenue by 25% by implementing a new pricing strategy..."
          value={bullet}
          onChange={(e) => onUpdate(e.target.value)}
          id={`bullet-${expId}-${bIndex}`}
        />
        <div className="ai-writer-container">
          <button
            className="ai-improve-btn"
            onClick={handleImprove}
            disabled={improving || !bullet.trim()}
            id={`improve-bullet-${expId}-${bIndex}`}
          >
            {improving
              ? <><RefreshCw size={11} className="spin" /> Improving…</>
              : <><Sparkles size={11} /> AI Improve</>}
          </button>
          {error && <span className="ai-error">{error}</span>}
          {suggestion && (
            <div className="ai-suggestion">
              <p className="suggestion-label">✨ AI Suggestion</p>
              <p className="suggestion-text">{suggestion}</p>
              <div className="suggestion-actions">
                <button className="accept-btn" onClick={() => { onUpdate(suggestion); setSuggestion(null); }}>
                  <Check size={11} /> Use This
                </button>
                <button className="dismiss-btn" onClick={() => setSuggestion(null)}>
                  <X size={11} /> Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showRemove && (
        <button className="remove-bullet-btn" onClick={onRemove}>
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}

const ExperienceForm = () => {
  const experience     = useResumeStore((s) => s.experience);
  const addExperience  = useResumeStore((s) => s.addExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const updateBullet   = useResumeStore((s) => s.updateBullet);
  const addBullet      = useResumeStore((s) => s.addBullet);
  const removeBullet   = useResumeStore((s) => s.removeBullet);

  return (
    <div className="form-section">
      <h2 className="form-section-title">
        <Briefcase size={22} />
        Work Experience
      </h2>
      <p className="form-section-desc">List your most recent roles. Use the ✨ AI Improve button to enhance each bullet point.</p>

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
              <BulletRow
                key={bIndex}
                expId={exp.id}
                bIndex={bIndex}
                bullet={bullet}
                title={exp.title}
                company={exp.company}
                onUpdate={(val) => updateBullet(exp.id, bIndex, val)}
                onRemove={() => removeBullet(exp.id, bIndex)}
                showRemove={exp.bullets.length > 1}
              />
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
