import React from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

const PersonalInfoForm = () => {
  const personalInfo = useResumeStore((s) => s.personalInfo);
  const update = useResumeStore((s) => s.updatePersonalInfo);

  const fields = [
    { key: 'fullName', label: 'Full Name', icon: User, placeholder: 'John Doe', required: true },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'john@example.com', type: 'email', required: true },
    { key: 'phone', label: 'Phone', icon: Phone, placeholder: '+1 (555) 123-4567', type: 'tel', required: true },
    { key: 'location', label: 'Location', icon: MapPin, placeholder: 'San Francisco, CA' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'linkedin.com/in/johndoe' },
    { key: 'portfolio', label: 'Portfolio', icon: Globe, placeholder: 'johndoe.com' },
    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'github.com/johndoe' },
  ];

  return (
    <div className="form-section">
      <h2 className="form-section-title">
        <User size={22} />
        Personal Information
      </h2>
      <p className="form-section-desc">Your contact details — these appear at the top of your resume.</p>

      <div className="form-grid">
        {fields.map(({ key, label, icon: Icon, placeholder, type, required }) => (
          <div key={key} className={`form-field ${key === 'fullName' ? 'full-width' : ''}`}>
            <label>
              {label} {required && <span className="required">*</span>}
            </label>
            <div className="input-with-icon">
              <Icon size={16} className="input-icon" />
              <input
                type={type || 'text'}
                placeholder={placeholder}
                value={personalInfo[key]}
                onChange={(e) => update(key, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfoForm;
