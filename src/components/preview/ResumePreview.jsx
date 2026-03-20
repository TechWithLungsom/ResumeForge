import React from 'react';
import { useResumeStore } from '../../store/resumeStore';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
};

const ResumePreview = () => {
  const personalInfo = useResumeStore((s) => s.personalInfo);
  const summary = useResumeStore((s) => s.summary);
  const experience = useResumeStore((s) => s.experience);
  const education = useResumeStore((s) => s.education);
  const skills = useResumeStore((s) => s.skills);
  const projects = useResumeStore((s) => s.projects);
  const certifications = useResumeStore((s) => s.certifications);

  const hasContent = personalInfo.fullName || personalInfo.email;
  const contactItems = [personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.portfolio, personalInfo.github].filter(Boolean);

  return (
    <div className="resume-preview-container">
      <div className="resume-paper">
        {!hasContent ? (
          <div className="preview-empty">
            <div className="preview-empty-icon">📄</div>
            <h3>Your Resume Preview</h3>
            <p>Start filling in the form to see a live preview of your ATS-optimized resume here.</p>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="preview-header">
              <h1 className="preview-name">{personalInfo.fullName || 'Your Name'}</h1>
              {contactItems.length > 0 && (
                <div className="preview-contact">
                  {contactItems.map((item, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="preview-pipe">|</span>}
                      <span className="preview-contact-item">{item}</span>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* ── Summary ── */}
            {summary && (
              <div className="preview-section">
                <h2 className="preview-section-title">PROFESSIONAL SUMMARY</h2>
                <p className="preview-summary-text">{summary}</p>
              </div>
            )}

            {/* ── Experience ── */}
            {experience.some((e) => e.company || e.title) && (
              <div className="preview-section">
                <h2 className="preview-section-title">WORK EXPERIENCE</h2>
                {experience.filter((e) => e.company || e.title).map((exp, i) => (
                  <div key={i} className="preview-entry">
                    <div className="preview-entry-row">
                      <div className="preview-entry-left">
                        <div className="preview-entry-title">{exp.title}</div>
                        <div className="preview-entry-subtitle">
                          {exp.company}{exp.location ? `, ${exp.location}` : ''}
                        </div>
                      </div>
                      <div className="preview-entry-date">
                        {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.bullets.filter(Boolean).length > 0 && (
                      <ul className="preview-bullets">
                        {exp.bullets.filter(Boolean).map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Education ── */}
            {education.some((e) => e.institution) && (
              <div className="preview-section">
                <h2 className="preview-section-title">EDUCATION</h2>
                {education.filter((e) => e.institution).map((edu, i) => (
                  <div key={i} className="preview-entry">
                    <div className="preview-entry-row">
                      <div className="preview-entry-left">
                        <div className="preview-entry-title">
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </div>
                        <div className="preview-entry-subtitle">{edu.institution}</div>
                      </div>
                      <div className="preview-entry-date">
                        {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                      </div>
                    </div>
                    {(edu.gpa || edu.honors) && (
                      <ul className="preview-bullets">
                        {edu.gpa && <li>GPA: {edu.gpa}</li>}
                        {edu.honors && <li>{edu.honors}</li>}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Skills ── */}
            {skills.some((s) => s.items?.length > 0) && (
              <div className="preview-section">
                <h2 className="preview-section-title">SKILLS</h2>
                {skills.filter((s) => s.items?.length > 0).map((skill, i) => (
                  <div key={i} className="preview-skill-line">
                    <strong>{skill.category}:</strong> {skill.items.join('  •  ')}
                  </div>
                ))}
              </div>
            )}

            {/* ── Projects ── */}
            {projects.some((p) => p.name) && (
              <div className="preview-section">
                <h2 className="preview-section-title">PROJECTS</h2>
                {projects.filter((p) => p.name).map((proj, i) => (
                  <div key={i} className="preview-entry">
                    <div className="preview-entry-row">
                      <div className="preview-entry-left">
                        <div className="preview-entry-title">{proj.name}</div>
                      </div>
                      {(proj.startDate || proj.endDate) && (
                        <div className="preview-entry-date">
                          {formatDate(proj.startDate)} — {formatDate(proj.endDate)}
                        </div>
                      )}
                    </div>
                    {proj.description && <p className="preview-project-desc">{proj.description}</p>}
                    {proj.technologies?.length > 0 && (
                      <p className="preview-tech-line"><em>Tech: {proj.technologies.join(', ')}</em></p>
                    )}
                    {proj.link && <p className="preview-tech-line">{proj.link}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* ── Certifications ── */}
            {certifications.some((c) => c.name) && (
              <div className="preview-section">
                <h2 className="preview-section-title">CERTIFICATIONS</h2>
                <ul className="preview-bullets">
                  {certifications.filter((c) => c.name).map((cert, i) => (
                    <li key={i}>
                      {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ''}{cert.date ? ` (${formatDate(cert.date)})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
