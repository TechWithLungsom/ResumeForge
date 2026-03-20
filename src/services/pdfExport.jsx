import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Link } from '@react-pdf/renderer';

/**
 * Agent "Parser" — ATS-Compliant PDF Export
 * Single-column, system-font, clean alignment, no tables, no graphics
 */

const colors = {
  black: '#111111',
  dark: '#2d2d2d',
  medium: '#555555',
  light: '#888888',
  rule: '#cccccc',
  accent: '#1a1a1a',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: colors.dark,
    lineHeight: 1.35,
  },

  /* ── Header ── */
  header: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.accent,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 9,
    color: colors.medium,
  },
  contactItem: {
    marginHorizontal: 6,
  },
  contactSep: {
    marginHorizontal: 2,
    color: colors.light,
  },

  /* ── Section ── */
  section: {
    marginTop: 10,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: colors.black,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingBottom: 2,
    borderBottomWidth: 0.75,
    borderBottomColor: colors.rule,
    marginBottom: 6,
  },

  /* ── Summary ── */
  summaryText: {
    fontSize: 9.5,
    color: colors.dark,
    lineHeight: 1.5,
  },

  /* ── Entry (Experience, Education, Project) ── */
  entry: {
    marginBottom: 7,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  entryLeft: {
    flex: 1,
    paddingRight: 10,
  },
  entryTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: colors.black,
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: colors.medium,
    marginTop: 0.5,
  },
  entryDate: {
    fontSize: 9,
    color: colors.light,
    textAlign: 'right',
    minWidth: 105,
    flexShrink: 0,
    marginTop: 1,
  },

  /* ── Bullets ── */
  bulletList: {
    marginTop: 2,
    paddingLeft: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 1.5,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 9.5,
    color: colors.dark,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: colors.dark,
    lineHeight: 1.4,
  },

  /* ── Skills ── */
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  skillCategory: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: colors.black,
    minWidth: 80,
  },
  skillItems: {
    flex: 1,
    fontSize: 9.5,
    color: colors.dark,
  },

  /* ── Project extras ── */
  projectDesc: {
    fontSize: 9,
    color: colors.dark,
    marginTop: 1,
    lineHeight: 1.4,
  },
  techLine: {
    fontSize: 8.5,
    color: colors.medium,
    fontStyle: 'italic',
    marginTop: 1,
  },
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
};

const Bullet = ({ children }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletDot}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ContactSep = () => <Text style={styles.contactSep}>|</Text>;

const ResumeDocument = ({ data }) => {
  const contactItems = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.portfolio,
    data.personalInfo.github,
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ──── HEADER ──── */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          {contactItems.length > 0 && (
            <View style={styles.contactRow}>
              {contactItems.map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ContactSep />}
                  <Text style={styles.contactItem}>{item}</Text>
                </React.Fragment>
              ))}
            </View>
          )}
        </View>

        {/* ──── PROFESSIONAL SUMMARY ──── */}
        {data.summary && (
          <Section title="Professional Summary">
            <Text style={styles.summaryText}>{data.summary}</Text>
          </Section>
        )}

        {/* ──── WORK EXPERIENCE ──── */}
        {data.experience?.length > 0 && data.experience.some(e => e.company || e.title) && (
          <Section title="Work Experience">
            {data.experience.filter(e => e.company || e.title).map((exp, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryRow}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.entryTitle}>{exp.title}</Text>
                    <Text style={styles.entrySubtitle}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {formatDate(exp.startDate)} — {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                  </Text>
                </View>
                {exp.bullets?.filter(Boolean).length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.filter(Boolean).map((bullet, j) => (
                      <Bullet key={j}>{bullet}</Bullet>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* ──── EDUCATION ──── */}
        {data.education?.length > 0 && data.education.some(e => e.institution) && (
          <Section title="Education">
            {data.education.filter(e => e.institution).map((edu, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryRow}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.entryTitle}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </Text>
                    <Text style={styles.entrySubtitle}>{edu.institution}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </Text>
                </View>
                {(edu.gpa || edu.honors) && (
                  <View style={styles.bulletList}>
                    {edu.gpa && <Bullet>GPA: {edu.gpa}</Bullet>}
                    {edu.honors && <Bullet>{edu.honors}</Bullet>}
                  </View>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* ──── SKILLS ──── */}
        {data.skills?.length > 0 && data.skills.some(s => s.items?.length > 0) && (
          <Section title="Skills">
            {data.skills.filter(s => s.items?.length > 0).map((skill, i) => (
              <View key={i} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{skill.category}: </Text>
                <Text style={styles.skillItems}>{skill.items.join('  •  ')}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* ──── PROJECTS ──── */}
        {data.projects?.length > 0 && data.projects.some(p => p.name) && (
          <Section title="Projects">
            {data.projects.filter(p => p.name).map((proj, i) => (
              <View key={i} style={styles.entry}>
                <View style={styles.entryRow}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.entryTitle}>{proj.name}</Text>
                  </View>
                  {(proj.startDate || proj.endDate) && (
                    <Text style={styles.entryDate}>
                      {formatDate(proj.startDate)} — {formatDate(proj.endDate)}
                    </Text>
                  )}
                </View>
                {proj.description && <Text style={styles.projectDesc}>{proj.description}</Text>}
                {proj.technologies?.length > 0 && (
                  <Text style={styles.techLine}>Tech: {proj.technologies.join(', ')}</Text>
                )}
                {proj.link && <Text style={styles.techLine}>{proj.link}</Text>}
              </View>
            ))}
          </Section>
        )}

        {/* ──── CERTIFICATIONS ──── */}
        {data.certifications?.length > 0 && data.certifications.some(c => c.name) && (
          <Section title="Certifications">
            <View style={styles.bulletList}>
              {data.certifications.filter(c => c.name).map((cert, i) => (
                <Bullet key={i}>
                  {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ''}{cert.date ? ` (${formatDate(cert.date)})` : ''}
                </Bullet>
              ))}
            </View>
          </Section>
        )}
      </Page>
    </Document>
  );
};

export const generatePDF = async (resumeData) => {
  const blob = await pdf(<ResumeDocument data={resumeData} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const name = resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume';
  link.download = `${name}_Resume.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export { ResumeDocument };
