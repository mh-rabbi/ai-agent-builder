import { useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { cvData } from '../data/cvData';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface Props {
  onClose: () => void;
}

export default function DeveloperDossier({ onClose }: Props) {
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'projects' | 'achievements'>('experience');

  const tabStyle = (tab: typeof activeTab) => ({
    padding: isMobile ? '10px 16px' : '12px 24px',
    fontSize: isMobile ? '0.8rem' : '0.9rem',
    fontWeight: 600,
    color: activeTab === tab ? 'var(--accent-violet)' : 'var(--text-muted)',
    borderBottom: `2px solid ${activeTab === tab ? 'var(--accent-violet)' : 'transparent'}`,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 200ms',
    fontFamily: 'var(--font-heading)',
    whiteSpace: 'nowrap' as const,
  });

  const sidebarContent = (
    <>
      {/* Avatar & Basic Info */}
      <div style={{ textAlign: isDesktop ? 'center' : 'left', display: isDesktop ? 'block' : 'flex', alignItems: 'center', gap: '20px' }} className="animate-decrypt">
        <div style={{
          width: isDesktop ? '120px' : '80px',
          height: isDesktop ? '120px' : '80px',
          borderRadius: '50%',
          margin: isDesktop ? '0 auto 20px' : '0',
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          border: '4px solid var(--bg-surface-2)',
          boxShadow: '0 0 40px rgba(79, 70, 229, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: isDesktop ? '3rem' : '2rem',
          flexShrink: 0
        }}>
          👨‍💻
        </div>
        <div>
          <h2 style={{ fontSize: isDesktop ? '1.25rem' : '1.1rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
            {cvData.name}
          </h2>
          <p style={{ fontSize: isDesktop ? '0.9rem' : '0.8rem', color: 'var(--accent-violet)', fontWeight: 500, margin: 0 }}>
            {cvData.title}
          </p>
        </div>
      </div>

      {/* Detailed Summary */}
      <div className="animate-decrypt" style={{ animationDelay: '100ms' }}>
        <h3 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
          Objective
        </h3>
        <p style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {cvData.summary}
        </p>
      </div>

      {/* Contact Links */}
      <div className="animate-decrypt" style={{ animationDelay: '200ms' }}>
        <h3 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
          Connections
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { label: cvData.github, icon: '📂', url: cvData.github },
            { label: cvData.linkedin, icon: '🔗', url: cvData.linkedin },
            { label: cvData.website, icon: '🌐', url: cvData.website },
            { label: cvData.email, icon: '✉️', url: cvData.email }
          ].map((link, idx) => (
            <a 
              key={idx} 
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '0.8rem', color: 'var(--text-muted)',
                padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid transparent', cursor: 'pointer', transition: 'all 200ms',
                textDecoration: 'none'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <span>{link.icon}</span>
              <span style={{ 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              }}>
                {link.label.replace('https://', '').replace('mailto:', '')}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Action */}
      <div style={{ marginTop: isDesktop ? 'auto' : '0' }}>
        <Button
          variant="primary"
          style={{ width: isDesktop ? '100%' : 'auto', gap: '8px' }}
          onClick={() => window.open('/Md. Mahmudul Hasan Rabbi.pdf', '_blank')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </Button>
      </div>
    </>
  );

  return (
    <div className="dossier-overlay">
      <div className="dossier-grid" />
      <div className="scanner-line" />

      {/* Header */}
      <div style={{
        padding: isMobile ? '16px 20px' : '24px 40px',
        borderBottom: '1px solid var(--border-default)',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
          <div style={{
            width: isMobile ? '36px' : '48px',
            height: isMobile ? '36px' : '48px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-violet-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)',
          }}>
            <svg width={isMobile ? "18" : "24"} height={isMobile ? "18" : "24"} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.1rem' : '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Developer Dossier
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              System Architect v1.0.4
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-default)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 200ms',
            color: 'var(--text-muted)'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isDesktop ? 'row' : 'column' }}>
        {/* Sidebar */}
        {isDesktop && (
          <div style={{
            width: '320px',
            padding: '40px',
            borderRight: '1px solid var(--border-default)',
            background: 'rgba(10, 10, 15, 0.4)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}>
            {sidebarContent}
          </div>
        )}

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(5, 5, 10, 0.2)', padding: isMobile ? '24px 16px' : '40px' }}>

          {/* Mobile Profile Header */}
          {!isDesktop && (
            <div style={{
              padding: isMobile ? '16px' : '24px',
              background: 'rgba(124, 58, 237, 0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {sidebarContent}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="scrollbar-hide" style={{
            display: 'flex',
            gap: isMobile ? '16px' : '32px',
            borderBottom: '1px solid var(--border-default)',
            marginBottom: '32px',
            overflowX: 'auto',
            paddingBottom: '2px'
          }}>
            <button style={tabStyle('experience')} onClick={() => setActiveTab('experience')}>Experience</button>
            <button style={tabStyle('skills')} onClick={() => setActiveTab('skills')}>Skill Stack</button>
            <button style={tabStyle('projects')} onClick={() => setActiveTab('projects')}>Mission Logs</button>
            <button style={tabStyle('achievements')} onClick={() => setActiveTab('achievements')}>Intel</button>
          </div>

          {/* Tab Content */}
          <div className="animate-decrypt" key={activeTab}>
            {activeTab === 'experience' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {cvData.experience.map((exp, idx) => (
                  <div key={idx} className="dossier-card">
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', marginBottom: '16px', gap: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{exp.role}</h4>
                        <p style={{ color: 'var(--accent-violet)', fontWeight: 600, fontSize: isMobile ? '0.85rem' : '0.95rem' }}>{exp.company}</p>
                      </div>
                      <Badge variant="default" style={{ alignSelf: isMobile ? 'flex-start' : 'center' }}>{exp.period}</Badge>
                    </div>
                    <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                      {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                ))}

                {/* Education */}
                <div className="dossier-card" style={{ borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Formal Education</h4>
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{cvData.education.institution}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cvData.education.degree}</p>
                    </div>
                    <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                      <p style={{ fontWeight: 700, color: 'var(--accent-success)', fontSize: '0.9rem' }}>CGPA: {cvData.education.cgpa}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cvData.education.period}</p>
                    </div>
                  </div>
                </div>

                {/* Training */}
                {cvData.trainings && cvData.trainings.length > 0 && (
                  <div className="dossier-card" style={{ borderStyle: 'dashed', borderColor: 'rgba(124, 58, 237, 0.2)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Professional Training</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {cvData.trainings.map((t, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '4px' }}>{t.name}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.institution}</p>
                          </div>
                          {t.certificateLink && (
                            <a 
                              href={t.certificateLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--accent-violet)', 
                                textDecoration: 'none', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px',
                                padding: '6px 12px',
                                background: 'rgba(124, 58, 237, 0.1)',
                                borderRadius: '6px',
                                border: '1px solid rgba(124, 58, 237, 0.2)',
                                transition: 'all 200ms'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(124, 58, 237, 0.2)'; e.currentTarget.style.borderColor = 'var(--accent-violet)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)'; e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'; }}
                            >
                              View Certificate ↗
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skills' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {Object.entries(cvData.skills).map(([category, items]) => (
                  <div key={category} className="dossier-card">
                    <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                      {category.replace('_', ' ')}
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {items.map(skill => (
                        <Badge key={skill} variant="type" color="var(--accent-violet-light)">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'projects' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                {cvData.projects.map((proj, idx) => (
                  <div key={idx} className="dossier-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{proj.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proj.platform}</p>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', flex: 1 }}>{proj.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '20px' }}>
                      {proj.tech.map(t => <Badge key={t} variant="category" color="#444" style={{ fontSize: '0.65rem' }}>{t}</Badge>)}
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {proj.sourceCode && (
                        <a href={proj.sourceCode} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent-violet)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Source Code ↗
                        </a>
                      )}
                      {proj.liveDemo && (
                        <a href={proj.liveDemo} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent-success)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Stats Dashboard */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {[
                    { label: 'Problems Solved', value: cvData.problemSolving.total, color: 'var(--accent-violet)' },
                    { label: 'Codeforces', value: cvData.problemSolving.codeforces, color: '#1f51ff', small: true },
                    { label: 'Vjudge', value: cvData.problemSolving.vjudge, color: '#32cd32', small: true },
                    { label: 'LeetCode', value: cvData.problemSolving.leetcode, color: '#ffa500', small: true },
                  ].map((stat, i) => (
                    <div key={i} className="dossier-card" style={{ textAlign: 'center', borderBottom: `4px solid ${stat.color}` }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>{stat.label}</p>
                      <p style={{ fontSize: stat.small ? '1rem' : '2.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Achievement List */}
                <div className="dossier-card">
                  <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Major intel
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {cvData.achievements.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        <span style={{ fontSize: '1.25rem' }}>🏆</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
