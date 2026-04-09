import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { FileText, Sparkles, RefreshCw, Check, X } from 'lucide-react';
import { generateSummary } from '../../services/geminiAI';

const SummaryForm = () => {
  const summary = useResumeStore((s) => s.summary);
  const updateSummary = useResumeStore((s) => s.updateSummary);
  const getResumeData = useResumeStore((s) => s.getResumeData);

  const [generating, setGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setSuggestion(null);
    try {
      const result = await generateSummary(getResumeData());
      setSuggestion(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleAccept = () => {
    updateSummary(suggestion);
    setSuggestion(null);
  };

  return (
    <div className="form-section">
      <h2 className="form-section-title">
        <FileText size={22} />
        Professional Summary
      </h2>
      <p className="form-section-desc">A brief 2-3 sentence pitch about your professional background.</p>

      <div className="form-field full-width">
        <div className="summary-header">
          <label>Summary</label>
          <button
            id="ai-generate-summary-btn"
            className="ai-generate-btn"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating
              ? <><RefreshCw size={14} className="spin" /> Generating…</>
              : <><Sparkles size={14} /> AI Generate</>}
          </button>
        </div>

        {error && <p className="ai-error">⚠ {error}</p>}

        {suggestion && (
          <div className="ai-suggestion">
            <p className="suggestion-label">✨ AI Suggestion</p>
            <p className="suggestion-text">{suggestion}</p>
            <div className="suggestion-actions">
              <button className="accept-btn" onClick={handleAccept} id="accept-summary-btn">
                <Check size={12} /> Use This
              </button>
              <button className="dismiss-btn" onClick={() => setSuggestion(null)} id="dismiss-summary-btn">
                <X size={12} /> Dismiss
              </button>
            </div>
          </div>
        )}

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
