import React, { useState } from 'react';
import { useResumeStore } from './store/resumeStore';
import { generatePDF } from './services/pdfExport.jsx';
import PersonalInfoForm from './components/form/PersonalInfoForm';
import SummaryForm from './components/form/SummaryForm';
import ExperienceForm from './components/form/ExperienceForm';
import EducationForm from './components/form/EducationForm';
import SkillsForm from './components/form/SkillsForm';
import ProjectsForm from './components/form/ProjectsForm';
import ResumePreview from './components/preview/ResumePreview';

import HomePage from './components/HomePage';
import {
  User, FileText, Briefcase, GraduationCap, Wrench,
  FolderOpen, Download, Settings, X, ChevronLeft,
  ChevronRight, Zap, RotateCcw, Eye, EyeOff, Home
} from 'lucide-react';

const steps = [
  { id: 'personal', label: 'Personal', icon: User, component: PersonalInfoForm },
  { id: 'summary', label: 'Summary', icon: FileText, component: SummaryForm },
  { id: 'experience', label: 'Experience', icon: Briefcase, component: ExperienceForm },
  { id: 'education', label: 'Education', icon: GraduationCap, component: EducationForm },
  { id: 'skills', label: 'Skills', icon: Wrench, component: SkillsForm },
  { id: 'projects', label: 'Projects', icon: FolderOpen, component: ProjectsForm },
];

function App() {
  const activeStep = useResumeStore((s) => s.activeStep);
  const setActiveStep = useResumeStore((s) => s.setActiveStep);
  const getResumeData = useResumeStore((s) => s.getResumeData);
  const resetResume = useResumeStore((s) => s.resetResume);

  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const CurrentForm = steps[activeStep].component;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await generatePDF(getResumeData());
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // ── Home Page ──
  if (currentPage === 'home') {
    return <HomePage onGetStarted={() => setCurrentPage('builder')} />;
  }

  // ── Builder Page ──
  return (
    <div className="app">
      {/* Top Navigation */}
      <header className="app-header">
        <div className="header-left">
          <button className="icon-btn home-btn" onClick={() => setCurrentPage('home')} title="Home">
            <Home size={18} />
          </button>
          <div className="logo">
            <Zap size={22} />
            <span>ResumeForge</span>
          </div>
        </div>
        <div className="header-center">
          <nav className="step-nav">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <button
                  key={step.id}
                  className={`step-btn ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <Icon size={16} />
                  <span className="step-label">{step.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="header-right">
          <button
            className="icon-btn preview-toggle"
            onClick={() => setShowPreview(!showPreview)}
            title={showPreview ? 'Hide Preview' : 'Show Preview'}
          >
            {showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button
            className="icon-btn"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            className="export-btn"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download size={16} />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`app-main ${showPreview ? 'with-preview' : 'full-width'}`}>
        {/* Form Panel */}
        <div className="form-panel">
          <div className="form-scroll-area">
            {/* Active Form */}
            <CurrentForm />

            {/* Step Navigation */}
            <div className="step-navigation">
              <button
                className="nav-btn prev"
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
              >
                <ChevronLeft size={18} /> Previous
              </button>
              <span className="step-counter">
                {activeStep + 1} / {steps.length}
              </span>
              <button
                className="nav-btn next"
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                disabled={activeStep === steps.length - 1}
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="preview-panel">
            <div className="preview-panel-header">
              <h3>📄 Live Preview</h3>
              <div className="preview-actions">
                <button className="icon-btn small" onClick={handleExport} title="Download PDF">
                  <Download size={16} />
                </button>
              </div>
            </div>
            <ResumePreview />
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Settings size={20} /> Settings</h2>
              <button className="modal-close" onClick={() => setShowSettings(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <h3><RotateCcw size={16} /> Reset Resume</h3>
                <p className="settings-desc">Clear all resume data and start fresh.</p>
                <button className="danger-btn" onClick={() => { resetResume(); setShowSettings(false); }}>
                  <RotateCcw size={14} /> Reset All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
