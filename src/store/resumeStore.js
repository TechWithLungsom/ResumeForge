import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () => crypto.randomUUID();

const emptyExperience = () => ({
  id: generateId(),
  company: '',
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  bullets: [''],
});

const emptyEducation = () => ({
  id: generateId(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: '',
  honors: '',
});

const emptyProject = () => ({
  id: generateId(),
  name: '',
  description: '',
  technologies: [],
  link: '',
  startDate: '',
  endDate: '',
});

const emptySkillCategory = () => ({
  category: '',
  items: [],
});

const emptyCertification = () => ({
  name: '',
  issuer: '',
  date: '',
  credentialId: '',
});

const initialState = {
  // Resume data (follows ResumeSchema.json)
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
  },
  summary: '',
  experience: [emptyExperience()],
  education: [emptyEducation()],
  skills: [{ category: 'Technical Skills', items: [] }],
  projects: [],
  certifications: [],

  // App state
  activeStep: 0,
};

export const useResumeStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // ─── Personal Info ───
      updatePersonalInfo: (field, value) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, [field]: value },
        })),

      // ─── Summary ───
      updateSummary: (value) => set({ summary: value }),

      // ─── Experience ───
      addExperience: () =>
        set((state) => ({
          experience: [...state.experience, emptyExperience()],
        })),
      removeExperience: (id) =>
        set((state) => ({
          experience: state.experience.filter((e) => e.id !== id),
        })),
      updateExperience: (id, field, value) =>
        set((state) => ({
          experience: state.experience.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        })),
      updateBullet: (expId, bulletIndex, value) =>
        set((state) => ({
          experience: state.experience.map((e) => {
            if (e.id !== expId) return e;
            const bullets = [...e.bullets];
            bullets[bulletIndex] = value;
            return { ...e, bullets };
          }),
        })),
      addBullet: (expId) =>
        set((state) => ({
          experience: state.experience.map((e) =>
            e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e
          ),
        })),
      removeBullet: (expId, bulletIndex) =>
        set((state) => ({
          experience: state.experience.map((e) => {
            if (e.id !== expId) return e;
            const bullets = e.bullets.filter((_, i) => i !== bulletIndex);
            return { ...e, bullets: bullets.length ? bullets : [''] };
          }),
        })),

      // ─── Education ───
      addEducation: () =>
        set((state) => ({
          education: [...state.education, emptyEducation()],
        })),
      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        })),
      updateEducation: (id, field, value) =>
        set((state) => ({
          education: state.education.map((e) =>
            e.id === id ? { ...e, [field]: value } : e
          ),
        })),

      // ─── Skills ───
      addSkillCategory: () =>
        set((state) => ({
          skills: [...state.skills, emptySkillCategory()],
        })),
      removeSkillCategory: (index) =>
        set((state) => ({
          skills: state.skills.filter((_, i) => i !== index),
        })),
      updateSkillCategory: (index, category) =>
        set((state) => ({
          skills: state.skills.map((s, i) =>
            i === index ? { ...s, category } : s
          ),
        })),
      updateSkillItems: (index, items) =>
        set((state) => ({
          skills: state.skills.map((s, i) =>
            i === index ? { ...s, items } : s
          ),
        })),

      // ─── Projects ───
      addProject: () =>
        set((state) => ({
          projects: [...state.projects, emptyProject()],
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      updateProject: (id, field, value) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, [field]: value } : p
          ),
        })),

      // ─── Certifications ───
      addCertification: () =>
        set((state) => ({
          certifications: [...state.certifications, emptyCertification()],
        })),
      removeCertification: (index) =>
        set((state) => ({
          certifications: state.certifications.filter((_, i) => i !== index),
        })),
      updateCertification: (index, field, value) =>
        set((state) => ({
          certifications: state.certifications.map((c, i) =>
            i === index ? { ...c, [field]: value } : c
          ),
        })),

      // ─── App State ───
      setActiveStep: (step) => set({ activeStep: step }),

      // ─── Utilities ───
      getResumeData: () => {
        const state = get();
        return {
          personalInfo: state.personalInfo,
          summary: state.summary,
          experience: state.experience,
          education: state.education,
          skills: state.skills,
          projects: state.projects,
          certifications: state.certifications,
        };
      },
      resetResume: () => set({ ...initialState }),
    }),
    {
      name: 'resumeforge-storage',
      partialize: (state) => ({
        personalInfo: state.personalInfo,
        summary: state.summary,
        experience: state.experience,
        education: state.education,
        skills: state.skills,
        projects: state.projects,
        certifications: state.certifications,
      }),
    }
  )
);
