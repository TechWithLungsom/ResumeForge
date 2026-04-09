import React, { useState } from 'react';
import {
  Brain, ChevronDown, ChevronUp, Zap, Target,
  CheckCircle, XCircle, AlertCircle, TrendingUp,
  Lightbulb, RefreshCw, ArrowRight, Info, Award,
  BarChart3, FileSearch
} from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { analyzeResumeATS, analyzeJobMatch } from '../../services/geminiAI';

// ─── helpers ────────────────────────────────────────────────
const gradeColor = (grade = '') => {
  if (!grade) return 'var(--text-secondary)';
  const g = grade.toUpperCase();
  if (g.startsWith('A')) return 'var(--success)';
  if (g.startsWith('B')) return '#22d3ee';
  if (g.startsWith('C')) return 'var(--warning)';
  return 'var(--danger)';
};

const scoreColor = (score) => {
  if (score >= 80) return 'var(--success)';
  if (score >= 60) return '#22d3ee';
  if (score >= 40) return 'var(--warning)';
  return 'var(--danger)';
};

const priorityIcon = (p) => {
  if (p === 'high')   return <XCircle    size={13} color="var(--danger)"  />;
  if (p === 'medium') return <AlertCircle size={13} color="var(--warning)" />;
  return                      <Info        size={13} color="var(--info)"    />;
};

const circumference = 2 * Math.PI * 54; // r=54 in our SVG

function ScoreGauge({ score, grade }) {
  const offset = circumference - (score / 100) * circumference;
  const color  = scoreColor(score);
  return (
    <div className="score-gauge-container">
      <svg className="score-gauge" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          className="score-ring"
        />
        <text x="60" y="56" textAnchor="middle" dominantBaseline="middle"
          className="score-number" fill={color}>
          {score}
        </text>
        <text x="60" y="74" textAnchor="middle" dominantBaseline="middle"
          className="score-label" fill="var(--text-secondary)">
          / 100
        </text>
      </svg>
    </div>
  );
}

function BreakdownBars({ breakdown }) {
  const keys = Object.keys(breakdown);
  return (
    <div className="ats-breakdown">
      {keys.map((k) => {
        const { score, max } = breakdown[k];
        const pct = Math.round((score / max) * 100);
        return (
          <div className="breakdown-row" key={k}>
            <span className="breakdown-label">{k}</span>
            <div className="breakdown-bar">
              <div
                className="breakdown-fill"
                style={{ width: `${pct}%`, background: scoreColor(pct) }}
              />
            </div>
            <span className="breakdown-value" style={{ color: scoreColor(pct) }}>{score}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── ATS Audit Tab ────────────────────────────────────────
function AuditTab({ result, onReanalyze, loading }) {
  if (!result) return (
    <div className="ats-empty-state">
      <div className="ats-empty-icon"><Brain size={32} /></div>
      <p className="ats-empty-text">AI will analyze your resume for ATS compliance, keyword optimization, and structure quality.</p>
      <button className="analyze-btn" onClick={onReanalyze} disabled={loading} id="ats-analyze-btn">
        {loading ? <><RefreshCw size={16} className="spin" /> Analyzing…</> : <><Zap size={16} /> Analyze Resume</>}
      </button>
    </div>
  );

  return (
    <div className="ats-results">
      {/* Score + Grade */}
      <div className="ats-score-row">
        <ScoreGauge score={result.overallScore} grade={result.grade} />
        <div className="ats-grade-badge" style={{ background: gradeColor(result.grade) + '22', border: `1px solid ${gradeColor(result.grade)}44`, color: gradeColor(result.grade) }}>
          <Award size={14} /> Grade: <strong>{result.grade}</strong>
        </div>
      </div>

      {/* Breakdown */}
      {result.scoreBreakdown && (
        <div className="ats-section">
          <h4 className="ats-section-title"><BarChart3 size={14} /> Score Breakdown</h4>
          <BreakdownBars breakdown={result.scoreBreakdown} />
        </div>
      )}

      {/* Strengths */}
      {result.strengths?.length > 0 && (
        <div className="ats-section">
          <h4 className="ats-section-title" style={{ color: 'var(--success)' }}><CheckCircle size={14} /> Strengths</h4>
          <ul className="ats-check-list ats-success-list">
            {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {/* Critical Issues */}
      {result.criticalIssues?.length > 0 && (
        <div className="ats-section">
          <h4 className="ats-section-title" style={{ color: 'var(--danger)' }}><XCircle size={14} /> Critical Issues</h4>
          <ul className="ats-check-list ats-danger-list">
            {result.criticalIssues.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations?.length > 0 && (
        <div className="ats-section">
          <h4 className="ats-section-title"><Lightbulb size={14} /> Recommendations</h4>
          <div className="rec-list">
            {result.recommendations.map((r, i) => (
              <div className="rec-card" key={i}>
                <div className="rec-header">
                  {priorityIcon(r.priority)}
                  <span className="rec-category">{r.category}</span>
                  <span className={`rec-priority priority-${r.priority}`}>{r.priority}</span>
                </div>
                <p className="rec-issue">{r.issue}</p>
                <div className="rec-fix">
                  <ArrowRight size={12} />
                  <span>{r.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {(result.keywordsFoundInResume?.length > 0 || result.suggestedKeywords?.length > 0) && (
        <div className="ats-section">
          <h4 className="ats-section-title"><TrendingUp size={14} /> Keywords</h4>
          {result.keywordsFoundInResume?.length > 0 && (
            <>
              <p className="keyword-sublabel" style={{ color: 'var(--success)' }}>Found in resume</p>
              <div className="keyword-tags">
                {result.keywordsFoundInResume.map((k, i) => (
                  <span key={i} className="keyword-tag matched">{k}</span>
                ))}
              </div>
            </>
          )}
          {result.suggestedKeywords?.length > 0 && (
            <>
              <p className="keyword-sublabel" style={{ color: 'var(--accent-light)', marginTop: 10 }}>Suggested to add</p>
              <div className="keyword-tags">
                {result.suggestedKeywords.map((k, i) => (
                  <span key={i} className="keyword-tag suggested">{k}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <button className="reanalyze-btn" onClick={onReanalyze} disabled={loading} id="ats-reanalyze-btn">
        {loading ? <><RefreshCw size={14} className="spin" /> Re-analyzing…</> : <><RefreshCw size={14} /> Re-analyze</>}
      </button>
    </div>
  );
}

// ─── Job Match Tab ────────────────────────────────────────
function JobMatchTab({ result, loading, onAnalyze, jd, setJd }) {
  return (
    <div>
      <div className="jd-input-section">
        <label htmlFor="jd-textarea">Paste Job Description</label>
        <textarea
          id="jd-textarea"
          className="jd-textarea"
          placeholder="Paste the full job description here to get a tailored match score and keyword gap analysis…"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={5}
        />
        <button className="analyze-btn" onClick={onAnalyze} disabled={loading || !jd.trim()} id="jd-analyze-btn">
          {loading
            ? <><RefreshCw size={16} className="spin" /> Analyzing Match…</>
            : <><Target size={16} /> Analyze Job Match</>}
        </button>
      </div>

      {result && (
        <div className="ats-results" style={{ marginTop: 20 }}>
          {/* Match Score */}
          <div className="ats-score-row">
            <ScoreGauge score={result.matchScore} grade={result.matchGrade} />
            <div className="ats-grade-badge" style={{ background: gradeColor(result.matchGrade) + '22', border: `1px solid ${gradeColor(result.matchGrade)}44`, color: gradeColor(result.matchGrade) }}>
              <Target size={14} /> Match: <strong>{result.matchGrade}</strong>
            </div>
          </div>

          {/* Role Alignment */}
          {result.roleAlignment && (
            <div className="ats-section">
              <h4 className="ats-section-title"><FileSearch size={14} /> Role Alignment</h4>
              <div className="role-align-card">
                <p className="role-title">Best fit: <strong>{result.roleAlignment.title}</strong></p>
                <p className="role-summary">{result.roleAlignment.fitSummary}</p>
              </div>
            </div>
          )}

          {/* Keyword Match */}
          <div className="ats-section">
            <h4 className="ats-section-title"><TrendingUp size={14} /> Keyword Analysis</h4>
            <div className="keyword-breakdown">
              {result.matchedKeywords?.length > 0 && (
                <div className="keyword-section matched-keywords">
                  <h4><CheckCircle size={12} /> Matched ({result.matchedKeywords.length})</h4>
                  <div className="keyword-tags">
                    {result.matchedKeywords.map((k, i) => <span key={i} className="keyword-tag matched">{k}</span>)}
                  </div>
                </div>
              )}
              {result.missingKeywords?.length > 0 && (
                <div className="keyword-section missing-keywords">
                  <h4><XCircle size={12} /> Missing ({result.missingKeywords.length})</h4>
                  <div className="keyword-tags">
                    {result.missingKeywords.map((k, i) => <span key={i} className="keyword-tag missing">{k}</span>)}
                  </div>
                </div>
              )}
            </div>
            {result.partialMatches?.length > 0 && (
              <>
                <p className="keyword-sublabel" style={{ color: 'var(--warning)' }}>Partial matches</p>
                <div className="keyword-tags">
                  {result.partialMatches.map((k, i) => <span key={i} className="keyword-tag" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', border: '1px solid rgba(245,158,11,0.2)' }}>{k}</span>)}
                </div>
              </>
            )}
          </div>

          {/* Strengths for Role */}
          {result.strengthsForRole?.length > 0 && (
            <div className="ats-section">
              <h4 className="ats-section-title" style={{ color: 'var(--success)' }}><CheckCircle size={14} /> Your Strengths for This Role</h4>
              <ul className="ats-check-list ats-success-list">
                {result.strengthsForRole.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {/* Gap Analysis */}
          {result.gapAnalysis?.length > 0 && (
            <div className="ats-section">
              <h4 className="ats-section-title" style={{ color: 'var(--danger)' }}><XCircle size={14} /> Gap Analysis</h4>
              <div className="gap-list">
                {result.gapAnalysis.map((g, i) => (
                  <div className="gap-card" key={i}>
                    <div className="gap-header">
                      <span className="gap-name">{g.gap}</span>
                      <span className={`gap-importance gap-${g.importance?.replace('-','')}`}>{g.importance}</span>
                    </div>
                    <p className="gap-suggestion">{g.suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tailoring Advice */}
          {result.tailoringAdvice?.length > 0 && (
            <div className="ats-section">
              <h4 className="ats-section-title"><Lightbulb size={14} /> Tailoring Advice</h4>
              <ul className="ats-check-list">
                {result.tailoringAdvice.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Panel Component ─────────────────────────────────
export default function ATSScorePanel() {
  const getResumeData = useResumeStore((s) => s.getResumeData);

  const [isOpen,      setIsOpen]      = useState(true);
  const [activeTab,   setActiveTab]   = useState('audit');
  const [auditResult, setAuditResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [jobDesc,     setJobDesc]     = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);

  // Header badge: show current overall score
  const displayScore = activeTab === 'audit'
    ? auditResult?.overallScore
    : matchResult?.matchScore;

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeResumeATS(getResumeData());
      setAuditResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJobMatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeJobMatch(getResumeData(), jobDesc);
      setMatchResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const scoreLabel = displayScore != null
    ? displayScore >= 80 ? 'Excellent' : displayScore >= 60 ? 'Good' : displayScore >= 40 ? 'Fair' : 'Poor'
    : null;

  return (
    <div className="ats-panel" id="ats-score-panel">
      {/* Collapsible Header */}
      <div className="ats-panel-header" onClick={() => setIsOpen(!isOpen)} id="ats-panel-toggle">
        <div className="ats-panel-title">
          <Brain size={16} />
          <span>AI ATS Scorer</span>
          {displayScore != null && (
            <span
              className="ats-score-badge"
              style={{
                background: scoreColor(displayScore) + '22',
                color: scoreColor(displayScore),
                border: `1px solid ${scoreColor(displayScore)}44`
              }}
            >
              {displayScore}/100 • {scoreLabel}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={16} color="var(--text-tertiary)" /> : <ChevronDown size={16} color="var(--text-tertiary)" />}
      </div>

      {/* Panel Content */}
      {isOpen && (
        <div className="ats-panel-content">
          {/* Tabs */}
          <div className="ats-tabs">
            <button
              id="ats-tab-audit"
              className={`ats-tab ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              <Zap size={13} /> Resume Audit
            </button>
            <button
              id="ats-tab-match"
              className={`ats-tab ${activeTab === 'match' ? 'active' : ''}`}
              onClick={() => setActiveTab('match')}
            >
              <Target size={13} /> Job Match
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="ats-error" id="ats-error-banner">
              <XCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'audit' ? (
            <AuditTab
              result={auditResult}
              loading={loading}
              onReanalyze={handleAudit}
            />
          ) : (
            <JobMatchTab
              result={matchResult}
              loading={loading}
              onAnalyze={handleJobMatch}
              jd={jobDesc}
              setJd={setJobDesc}
            />
          )}
        </div>
      )}
    </div>
  );
}
