import React, { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { FolderOpen, Plus, Trash2, GripVertical, X } from 'lucide-react';

const ProjectsForm = () => {
  const projects = useResumeStore((s) => s.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const removeProject = useResumeStore((s) => s.removeProject);
  const updateProject = useResumeStore((s) => s.updateProject);

  const [techInputs, setTechInputs] = useState({});

  const handleAddTech = (projectId, e) => {
    if (e.key === 'Enter' && techInputs[projectId]?.trim()) {
      const project = projects.find((p) => p.id === projectId);
      updateProject(projectId, 'technologies', [...(project.technologies || []), techInputs[projectId].trim()]);
      setTechInputs({ ...techInputs, [projectId]: '' });
    }
  };

  const handleRemoveTech = (projectId, index) => {
    const project = projects.find((p) => p.id === projectId);
    const techs = project.technologies.filter((_, i) => i !== index);
    updateProject(projectId, 'technologies', techs);
  };

  return (
    <div className="form-section">
      <h2 className="form-section-title">
        <FolderOpen size={22} />
        Projects
      </h2>
      <p className="form-section-desc">Showcase notable projects. Include technologies to boost ATS keyword matching.</p>

      {projects.map((proj, index) => (
        <div key={proj.id} className="entry-card">
          <div className="entry-card-header">
            <div className="entry-card-grip">
              <GripVertical size={16} />
              <span>Project {index + 1}</span>
            </div>
            <button className="delete-entry-btn" onClick={() => removeProject(proj.id)}>
              <Trash2 size={14} /> Remove
            </button>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label>Project Name <span className="required">*</span></label>
              <input
                placeholder="E-commerce Platform"
                value={proj.name}
                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Link</label>
              <input
                placeholder="github.com/user/project"
                value={proj.link}
                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Start Date</label>
              <input
                type="month"
                value={proj.startDate}
                onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>End Date</label>
              <input
                type="month"
                value={proj.endDate}
                onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)}
              />
            </div>
            <div className="form-field full-width">
              <label>Description <span className="required">*</span></label>
              <textarea
                rows={2}
                placeholder="Built a full-stack e-commerce platform handling 10K+ daily transactions..."
                value={proj.description}
                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
              />
            </div>
          </div>

          <div className="form-field full-width" style={{ marginTop: '8px' }}>
            <label>Technologies (press Enter to add)</label>
            <div className="skill-tags-container">
              {proj.technologies?.map((tech, i) => (
                <span key={i} className="skill-tag">
                  {tech}
                  <button onClick={() => handleRemoveTech(proj.id, i)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                className="skill-input-inline"
                placeholder="React, Node.js, PostgreSQL..."
                value={techInputs[proj.id] || ''}
                onChange={(e) => setTechInputs({ ...techInputs, [proj.id]: e.target.value })}
                onKeyDown={(e) => handleAddTech(proj.id, e)}
              />
            </div>
          </div>
        </div>
      ))}

      <button className="add-entry-btn" onClick={addProject}>
        <Plus size={16} /> Add Project
      </button>
    </div>
  );
};

export default ProjectsForm;
