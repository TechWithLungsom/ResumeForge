import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { GraduationCap, Plus, Trash2, GripVertical } from 'lucide-react';

const EducationForm = () => {
  const education = useResumeStore((s) => s.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);

  return (
    <div className="form-section">
      <h2 className="form-section-title">
        <GraduationCap size={22} />
        Education
      </h2>
      <p className="form-section-desc">Add your degrees and relevant coursework.</p>

      {education.map((edu, index) => (
        <div key={edu.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-grip">
              <GripVertical size={16} />
              <span>Education {index + 1}</span>
            </div>
            {education.length > 1 && (
              <button className="delete-entry-btn" onClick={() => removeEducation(edu.id)}>
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Institution <span className="required">*</span></label>
              <input
                placeholder="Stanford University"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Degree <span className="required">*</span></label>
              <input
                placeholder="Bachelor of Science"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Field of Study <span className="required">*</span></label>
              <input
                placeholder="Computer Science"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Start Date</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>End Date</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>GPA</label>
              <input
                placeholder="3.8/4.0"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
              />
            </div>
            <div className="form-field full-width">
              <label>Honors / Awards</label>
              <input
                placeholder="Dean's List, Magna Cum Laude"
                value={edu.honors}
                onChange={(e) => updateEducation(edu.id, 'honors', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button className="add-entry-btn" onClick={addEducation}>
        <Plus size={16} /> Add Education
      </button>
    </div>
  );
};

export default EducationForm;
