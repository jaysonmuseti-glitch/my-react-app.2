import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import './App.css'
import portraitImage from '../my-photo.jpg/IMG_9738.jpg'

// Replace these with your real EmailJS credentials from https://www.emailjs.com/
// 1) Create an Email Service and copy the Service ID.
// 2) Create a template and copy the Template ID.
// 3) Open your EmailJS account settings and copy the Public Key.
const EMAILJS_SERVICE_ID = 'service_8x4vpg5'
const EMAILJS_TEMPLATE_ID = 'template_7sfp5uc'
const EMAILJS_PUBLIC_KEY = 'Rsd_jNVCOBVb61TIl'

const initialFormState = {
  name: '',
  email: '',
  message: ''
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const pillars = [
  {
    id: 'engineering-systems',
    title: 'Engineering & Systems Development',
    bullets: [
      'Computer Science Fundamentals & Software Architecture',
      'Information Systems Development (SDLC, Databases, CRUD)',
      'Networking & Distributed Systems (Microservices, APIs)'
    ]
  },
  {
    id: 'applied-ai-web',
    title: 'Applied AI & Modern Web Development',
    bullets: [
      'AI integrations, LLM workflows, prompt engineering',
      'Responsive UI/UX, HTML5, CSS3, modern JS frameworks',
      'Data-driven features and analytics pipelines'
    ]
  },
  {
    id: 'digital-strategy',
    title: 'Digital Strategy & Creative',
    bullets: [
      'SEO, performance marketing, analytics',
      'Growth & conversion optimization',
      'Brand identity and UI/UX visual systems'
    ]
  }
]

function App() {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const hasEmailJsConfig = [
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY
  ].every((value) => value && !value.startsWith('YOUR_'))

  useEffect(() => {
    if (hasEmailJsConfig) {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
    }
  }, [hasEmailJsConfig])

  const validateForm = (values) => {
    const nextErrors = {}

    if (!values.name.trim()) {
      nextErrors.name = 'Please enter your name.'
    } else if (values.name.trim().length < 2) {
      nextErrors.name = 'Your name must be at least 2 characters long.'
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!values.message.trim()) {
      nextErrors.message = 'Please enter a message.'
    } else if (values.message.trim().length < 10) {
      nextErrors.message = 'Your message should be at least 10 characters long.'
    }

    return nextErrors
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value
    }))

    setErrors((current) => ({
      ...current,
      [name]: ''
    }))

    if (status.type !== 'idle') {
      setStatus({ type: 'idle', message: '' })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateForm(formData)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus({
        type: 'error',
        message: 'Please fix the highlighted fields and try again.'
      })
      return
    }

    if (!hasEmailJsConfig) {
      setStatus({
        type: 'error',
        message: 'Add your EmailJS Service ID, Template ID, and Public Key in App.jsx before sending.'
      })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: 'idle', message: '' })

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          message: formData.message.trim()
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY
        }
      )

      setStatus({
        type: 'success',
        message: 'Your message was sent successfully. I will get back to you soon.'
      })
      setFormData(initialFormState)
      setErrors({})
    } catch (error) {
      console.error('EmailJS send failed:', error)
      setStatus({
        type: 'error',
        message: 'Something went wrong while sending your message. Please try again or email me directly.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-root">
      <header className="topbar" role="banner">
        <div className="brand" aria-label="Jayson Museti">
          <span className="brand-mark">JM</span>
          <span className="brand-name">Jayson Museti</span>
        </div>

        <nav className="main-nav" role="navigation" aria-label="Primary">
          <a href="#about">About</a>
          <a href="#expertise">Expertise</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="nav-cta" href="#contact" aria-label="Contact Jayson">Hire</a>
      </header>

      <main id="main" className="site-main">
        <section id="about" className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" />Computer Science Graduate</p>
            <h1 id="hero-heading">Computer Science Graduate | <span className="gradient-text">Digital Strategist &amp; Web Architect</span></h1>
            <p className="tagline">Building robust distributed systems, intelligent web platforms, and data-driven promotion strategies that scale.</p>

            <div className="hero-actions">
              <a className="primary-btn" href="#work">Start a project</a>
              <a className="secondary-btn" href="#contact">Schedule a call</a>
            </div>
            <p className="hero-note">Thoughtful engineering. Measurable momentum.</p>
          </div>

          <aside className="hero-visual" aria-label="Profile and career highlights">
            <div className="portrait-frame">
              <img
                className="portrait-image"
                src={portraitImage}
                alt="Portrait of Jayson Museti"
                fetchPriority="high"
              />
              <div className="portrait-caption">
                <span className="caption-kicker">JAYSON MUSETI</span>
                <span className="caption-role">Building what moves business forward.</span>
              </div>
            </div>
            <div className="stats-panel">
              <div className="stat">
                <div className="stat-value">5<span>+</span></div>
                <div className="stat-label">Years experience</div>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <div className="stat-value">30<span>+</span></div>
                <div className="stat-label">Projects</div>
              </div>
            </div>
          </aside>
        </section>

        <section id="expertise" className="expertise" aria-labelledby="expertise-heading">
          <h2 id="expertise-heading">Core expertise</h2>
          <p className="lead muted">Three pillars bridging engineering, AI, and digital strategy.</p>

          <div className="pillars" role="list">
            {pillars.map((p) => (
              <article key={p.id} className="pillar" role="listitem" aria-labelledby={`${p.id}-title`}>
                <h3 id={`${p.id}-title`}>{p.title}</h3>
                <ul>
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="work" aria-labelledby="work-heading">
          <h2 id="work-heading">How I help teams move faster</h2>
          <p className="lead muted">I bring together systems thinking, modern web execution, and practical communication so ideas become reliable products that people trust.</p>

          <div className="explain-grid">
            <article className="explain-panel">
              <div className="panel-graphic graphic-strategy" aria-hidden="true">
                <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
                  <circle className="accent-fill" cx="32" cy="28" r="14" />
                  <circle className="accent-fill" cx="80" cy="22" r="12" />
                  <circle className="accent-fill" cx="122" cy="38" r="11" />
                  <path d="M46 30 L67 25 M92 25 L111 34" />
                  <path d="M32 42 L32 58 M80 34 L80 58 M122 49 L122 58" />
                  <rect x="16" y="58" width="32" height="18" rx="6" />
                  <rect x="66" y="58" width="34" height="18" rx="6" />
                  <rect x="108" y="58" width="34" height="18" rx="6" />
                  <path d="M48 58 L48 66 M80 58 L80 66 M122 58 L122 66" />
                </svg>
              </div>
              <span className="panel-kicker">Strategy</span>
              <h3>Clear direction before the build</h3>
              <p>Every engagement starts with the business goal, the user journey, and the technical constraints. That means less wasted effort, fewer revisions, and stronger momentum from day one.</p>
              <ul className="benefit-list">
                <li>Business-first planning and scope clarity</li>
                <li>Technical architecture that scales with growth</li>
                <li>Design decisions grounded in user needs and data</li>
              </ul>
            </article>

            <article className="explain-panel highlight-panel">
              <div className="panel-graphic graphic-service" aria-hidden="true">
                <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
                  <rect x="22" y="22" width="90" height="52" rx="14" />
                  <path d="M38 42 H92 M38 54 H80 M38 66 H88" />
                  <path d="M112 28 L124 40 L138 24" />
                  <circle cx="122" cy="50" r="18" className="accent-fill" />
                  <path d="M116 50 L121 55 L130 44" />
                </svg>
              </div>
              <span className="panel-kicker">Service</span>
              <h3>Excellent customer service is part of the delivery</h3>
              <p>Clients do not just need code—they need clarity, responsiveness, and a partner who keeps them informed. I stay collaborative, proactive, and easy to work with throughout the entire process.</p>
              <div className="service-badges">
                <span>Responsive communication</span>
                <span>Transparent milestones</span>
                <span>Reliable follow-through</span>
              </div>
            </article>

            <article className="explain-panel">
              <div className="panel-graphic graphic-execution" aria-hidden="true">
                <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 74 L60 74 M60 74 L60 52 M92 74 L92 36 M124 74 L124 24 M140 74 L140 18" />
                  <rect className="accent-fill" x="18" y="58" width="18" height="16" rx="5" />
                  <rect className="accent-fill" x="50" y="44" width="18" height="30" rx="5" />
                  <rect className="accent-fill" x="82" y="30" width="18" height="44" rx="5" />
                  <rect className="accent-fill" x="114" y="18" width="18" height="56" rx="5" />
                  <path d="M12 18 H148" />
                </svg>
              </div>
              <span className="panel-kicker">Execution</span>
              <h3>Built for reliability and measurable impact</h3>
              <p>From backend systems to frontend experiences, I focus on performance, maintainability, and conversion-focused outcomes that support long-term business value.</p>
              <ul className="benefit-list">
                <li>High-performance interfaces and workflows</li>
                <li>Automation, AI, and analytics integrations</li>
                <li>Clean handoff, documentation, and support</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="contact" className="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading">Work with me</h2>
          <p className="lead muted">I take on a small number of strategic projects—let’s make something that scales.</p>

          <div className="contact-card">
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="field-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="field-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="field-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me a little about your project..."
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              {!hasEmailJsConfig && (
                <p className="config-note">
                  Replace the EmailJS placeholders in App.jsx with your own credentials before sending.
                </p>
              )}

              <button className="contact-btn form-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>

              {status.message && (
                <p className={`form-status ${status.type}`} aria-live="polite">
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer" role="contentinfo">© {new Date().getFullYear()} Jayson Museti</footer>
    </div>
  )
}

export default App
