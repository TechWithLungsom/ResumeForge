import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { FileText } from 'lucide-react';

const SummaryForm = () => {
  const summary = useResumeStore((s) => s.summary);
  const updateSummary = useResumeStore((s) => s.updateSummary);

  return (
    <div className="form-section">
      <h2 className="form-section-title">
        <FileText size={22} />
        Professional Summary
      </h2>
      <p className="form-section-desc">A brief 2-3 sentence pitch about your professional background.</p>

      <div className="form-field full-width">
        <label>Summary</label>
        <textarea
          className="summary-textarea"
          rows={4}
          placeholder="Experienced software engineer with 5+ years of expertise in..."
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          maxLength={500}
        />
        <div className="char-count">{summary.length}/500</div>
      </div>
    </div>
  );
};

export default SummaryForm;
