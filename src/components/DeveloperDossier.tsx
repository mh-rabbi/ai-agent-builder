import { useState } from 'react';
import { cvData } from '../data/cvData';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface Props {
  onClose: () => void;
}

export default function DeveloperDossier({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'experience' | 'skills' | 'projects' | 'achievements'>('experience');

  const tabStyle = (tab: typeof activeTab) => ({
    padding: '12px 24px',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: activeTab === tab ? 'var(--accent-violet)' : 'var(--text-muted)',
    borderBottom: `2px solid ${activeTab === tab ? 'var(--accent-violet)' : 'transparent'}`,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 200ms',
    fontFamily: 'var(--font-heading)',
  });

  return (
    <div className="dossier-overlay">
      <div className="dossier-grid" />
      <div className="scanner-line" />

      {/* Header */}
      <div style={{
        padding: '24px 40px',
        borderBottom: '1px solid var(--border-default)',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-violet-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Developer Dossier
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
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
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
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
          {/* Avatar & Basic Info */}
          <div style={{ textAlign: 'center' }} className="animate-decrypt">
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
              border: '4px solid var(--bg-surface-2)',
              boxShadow: '0 0 40px rgba(79, 70, 229, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              👨‍💻
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
              {cvData.name}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--accent-violet)', fontWeight: 500, margin: 0 }}>
              {cvData.title}
            </p>
          </div>

          {/* Detailed Summary */}
          <div className="animate-decrypt" style={{ animationDelay: '100ms' }}>
            <h3 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              Objective
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {cvData.summary}
            </p>
          </div>

          {/* Contact Links */}
          <div className="animate-decrypt" style={{ animationDelay: '200ms' }}>
            <h3 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
              Connections
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: cvData.github, icon: '📂' },
                { label: cvData.linkedin, icon: '🔗' },
                { label: cvData.website, icon: '🌐' },
                { label: cvData.email, icon: '✉️' }
              ].map((link, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px', 
                  fontSize: '0.8rem', color: 'var(--text-muted)', 
                  padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)',
                  border: '1px solid transparent', cursor: 'pointer', transition: 'all 200ms'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <span>{link.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action */}
          <div style={{ marginTop: 'auto' }}>
            <Button 
              variant="primary" 
              style={{ width: '100%', gap: '8px' }}
              onClick={() => window.open('/Md. Mahmudul Hasan Rabbi.pdf', '_blank')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(5, 5, 10, 0.2)', padding: '40px' }}>
          {/* Tabs Navigation */}
          <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--border-default)', marginBottom: '32px' }}>
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{exp.role}</h4>
                        <p style={{ color: 'var(--accent-violet)', fontWeight: 600, fontSize: '0.95rem' }}>{exp.company}</p>
                      </div>
                      <Badge variant="default">{exp.period}</Badge>
                    </div>
                    <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.8 }}>
                      {exp.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                ))}
                
                {/* Education */}
                <div className="dossier-card" style={{ borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Formal Training</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{cvData.education.institution}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cvData.education.degree}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, color: 'var(--accent-success)', fontSize: '0.9rem' }}>CGPA: {cvData.education.cgpa}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{cvData.education.period}</p>
                    </div>
                  </div>
                </div>
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
