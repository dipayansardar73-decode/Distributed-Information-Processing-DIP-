import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown, Camera, Check, CircleDot, Code2, ExternalLink, MapPin, Pause, Play,
  Radio, RotateCcw, ShieldCheck, TrainFront, Volume2,
} from 'lucide-react'

const detectionSteps = [
  { key: 'vision', icon: Camera, name: 'Vision checkpoint', status: 'Front marker read', value: 'ID 68021 · 96%', detail: 'The camera isolates the train marker and converts it into a machine-readable identity.' },
  { key: 'proximity', icon: Radio, name: 'Secure proximity ID', status: 'Identity authenticated', value: 'ID 68021 · MATCH', detail: 'A short-range onboard beacon confirms the same identity inside the station approach zone.' },
  { key: 'location', icon: MapPin, name: 'Route position', status: 'Direction confirmed', value: '1.8 KM · SOUTHBOUND', detail: 'Location verifies that the train is moving toward Jadavpur—not merely nearby.' },
]

const evidence = [
  { stat: '3,500+', title: 'untoward cases reported in 2024', source: 'Railway Protection Force', href: 'https://jrrpfa.indianrailways.gov.in/assets/resource/Rail%20Sainik%202024-%20English%20Version.pdf' },
  { stat: '261 / 60', title: 'PA systems vs train-display boards in one railway zone', source: 'Rajya Sabha answer, 2024', href: 'https://sansad.in/getFile/annex/263/AU938.pdf?source=pqars' },
  { stat: '1,416', title: 'lives saved by RPF on platforms, tracks and trains', source: 'Press Information Bureau', href: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1919805&lang=2&reg=48' },
]

const announcementText = 'Attention please. Namkhana Local from Sealdah is approaching Jadavpur station on platform number one. Please stand behind the safety line.'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const timersRef = useRef([])
  const cleared = activeStep === detectionSteps.length

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }
  const stopTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
  const runSimulation = () => {
    stopTimers(); window.speechSynthesis?.cancel(); setSpeaking(false); setActiveStep(0); setRunning(true)
    detectionSteps.forEach((_, index) => {
      timersRef.current.push(setTimeout(() => {
        setActiveStep(index + 1)
        if (index === detectionSteps.length - 1) setRunning(false)
      }, 850 * (index + 1)))
    })
  }
  const playAnnouncement = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(announcementText)
    utterance.rate = 0.88; utterance.pitch = 0.94; utterance.volume = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }
  const stopAnnouncement = () => { window.speechSynthesis?.cancel(); setSpeaking(false) }
  useEffect(() => () => { stopTimers(); window.speechSynthesis?.cancel() }, [])

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="RailBlazers home"><span className="brand-mark"><TrainFront size={20} /></span><span>RailBlazers</span></button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Menu</button>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Primary navigation">
          <button onClick={() => scrollTo('system')}>How it works</button><button onClick={() => scrollTo('demo')}>Live demo</button><button onClick={() => scrollTo('evidence')}>Evidence</button><button className="nav-cta" onClick={() => scrollTo('collaborate')}>Collaborate</button>
        </nav>
      </header>

      <section className="hero" id="top">
        <img className="hero-image" src="/concepts/ocr-approach.jpg" alt="Concept view of a trackside camera identifying an approaching suburban train" />
        <div className="hero-shade" />
        <div className="hero-copy"><span className="kicker"><i /> Resilient station intelligence</span><h1>Know the train.<br />Confirm the approach.<br /><em>Alert the platform.</em></h1><p>RailBlazers turns three independent observations into one trustworthy passenger announcement—designed for stations where timely information cannot be taken for granted.</p><div className="hero-actions"><button className="button primary" onClick={() => { scrollTo('demo'); setTimeout(runSimulation, 600) }}><Play size={17} fill="currentColor" /> Run the live sequence</button><button className="button ghost" onClick={() => scrollTo('system')}>Explore the system <ArrowDown size={17} /></button></div></div>
        <div className="hero-readout"><span className="live-dot" /><div><small>DEMO APPROACH</small><strong>SDAH → JDP</strong></div><div className="readout-rule" /><div><small>ESTIMATED ARRIVAL</small><strong>02:14</strong></div></div>
      </section>

      <section className="origin-section"><div className="origin-label">THE STARTING POINT</div><div><h2>At Jadavpur, a quiet platform revealed an information gap.</h2><p>When passengers do not know which train is approaching, they make decisions with incomplete information. RailBlazers began with a practical question: can a station recognize an incoming train, verify it twice, and speak before uncertainty becomes risk?</p></div><aside><ShieldCheck /><p>This is the project’s founding observation. The proposed system must still be validated through an authorised field pilot.</p></aside></section>

      <section className="system-section" id="system">
        <div className="section-intro"><span className="section-number">01</span><div><p className="eyebrow">HOW IT WORKS</p><h2>Three views of the same arrival.</h2></div><p className="intro-copy">No single sensor is trusted on its own. Local vision, a secure proximity identity and route position arrive separately—then meet at the station.</p></div>
        <article className="feature feature-wide"><div className="feature-image"><img src="/concepts/ocr-approach.jpg" alt="Concept camera reading the front marker of an approaching train" /><span>CONCEPT VISUAL · CAMERA + OCR</span></div><div className="feature-copy"><span className="step-pill">CHECK 01</span><Camera /><h3>Read what arrives.</h3><p>A weather-protected camera watches the approach. The vision model locates the front marker, extracts the identifier and compares it with the expected train list.</p><ul><li>Frame capture at the approach point</li><li>Train-marker isolation and OCR</li><li>Confidence score with audit frame</li></ul></div></article>
        <div className="feature-pair"><article className="feature compact"><div className="feature-image"><img src="/concepts/proximity-radio.jpg" alt="Concept showing a secure short-range identity link between train and station receiver" /><span>CONCEPT VISUAL · PROXIMITY ID</span></div><div className="feature-copy"><span className="step-pill">CHECK 02</span><Radio /><h3>Confirm identity nearby.</h3><p>An authenticated onboard beacon responds only within the approach zone. The station receives the train identity without depending on a public network.</p></div></article><article className="feature compact"><div className="feature-image"><img src="/concepts/gps-corridor.jpg" alt="Concept aerial view of a railway route with location verification" /><span>CONCEPT VISUAL · ROUTE POSITION</span></div><div className="feature-copy"><span className="step-pill">CHECK 03</span><MapPin /><h3>Verify direction and distance.</h3><p>Location acts as context and fallback. It answers the final operational question: is this train actually moving toward this platform now?</p></div></article></div>
        <div className="quorum-banner"><span>2 OF 3</span><div><h3>Agreement before announcement</h3><p>Two matching identities clear the public message. A conflict stays silent and asks for human verification.</p></div><ShieldCheck /></div>
      </section>

      <section className="demo-section" id="demo">
        <div className="demo-heading"><div><p className="eyebrow">INTERACTIVE PROTOTYPE</p><h2>Watch the station decide.</h2></div><p>Start the sequence to simulate live sensor events. When the checks agree, the sound console becomes available.</p></div>
        <div className="demo-shell"><div className="demo-topbar"><div><span className={running ? 'pulse-dot active' : 'pulse-dot'} /> JADAVPUR APPROACH NODE</div><span>SIMULATION · NOT LIVE RAILWAY DATA</span></div><div className="demo-layout">
          <div className="timeline-panel"><div className="train-summary"><span><TrainFront /> APPROACHING</span><strong>Namkhana Local</strong><small>Sealdah → Jadavpur → Namkhana</small></div><div className="step-list">{detectionSteps.map((step, index) => { const Icon = step.icon; const done = activeStep > index; const active = running && activeStep === index; return <div className={`demo-step ${done ? 'done' : ''} ${active ? 'scanning' : ''}`} key={step.key}><div className="step-icon">{done ? <Check /> : <Icon />}</div><div><small>{step.name}</small><strong>{done ? step.status : active ? 'Checking…' : 'Waiting'}</strong><p>{step.detail}</p></div><span className="step-value">{done ? step.value : '—'}</span></div> })}</div><button className="button run-button" onClick={runSimulation} disabled={running}>{running ? <><CircleDot /> Sequence running</> : cleared ? <><RotateCcw /> Run again</> : <><Play fill="currentColor" /> Start detection</>}</button></div>
          <div className="operations-panel"><div className="map-card"><img src="/concepts/gps-corridor.jpg" alt="Simulated route-position overview" /><div className="map-overlay"><span>ROUTE POSITION</span><strong>{activeStep >= 3 ? '1.8 km to Jadavpur' : 'Awaiting location'}</strong><div className="route-track"><i className={activeStep >= 3 ? 'located' : ''} /><span>SDAH</span><span>JDP</span></div></div></div><div className={`decision-card ${cleared ? 'cleared' : ''}`}><div className="decision-state"><span>{cleared ? <Check /> : activeStep}<b>/3</b></span><div><small>DECISION</small><strong>{cleared ? 'Announcement cleared' : running ? 'Gathering evidence' : 'Ready for sequence'}</strong></div></div><p>{cleared ? 'All three signals agree on identity, direction and approach window.' : 'The station will remain silent until at least two independent checks agree.'}</p></div><div className={`sound-console ${cleared ? 'enabled' : ''}`}><div className="speaker"><Volume2 /></div><div className="sound-copy"><small>PLATFORM ANNOUNCEMENT</small><p>“{announcementText}”</p><div className={speaking ? 'wave playing' : 'wave'}>{[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <i key={n} />)}</div></div><button aria-label={speaking ? 'Stop announcement' : 'Play announcement'} onClick={speaking ? stopAnnouncement : playAnnouncement} disabled={!cleared}>{speaking ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</button></div><p className="audio-note">Audio uses your browser’s speech engine. Wording, train and timing are illustrative.</p></div>
        </div></div>
      </section>

      <section className="evidence-section" id="evidence"><div className="section-intro evidence-intro"><span className="section-number">02</span><div><p className="eyebrow">PROBLEM VALIDATION</p><h2>The need is documented.<br />The solution needs a pilot.</h2></div><p className="intro-copy">Public sources establish a meaningful safety problem and show that the underlying identification and announcement technologies are credible. They do not replace field testing.</p></div><div className="evidence-grid">{evidence.map((item) => <a href={item.href} target="_blank" rel="noreferrer" key={item.stat}><strong>{item.stat}</strong><h3>{item.title}</h3><span>{item.source} <ExternalLink size={15} /></span></a>)}</div><div className="evidence-note"><ShieldCheck /><div><h3>What still has to be proven</h3><p>Night and rain accuracy, safe false-positive limits, radio retrofit economics, data governance, operator workflow and measurable passenger-safety impact.</p></div></div></section>

      <section className="roadmap-section"><div><p className="eyebrow">FROM WEBSITE TO FIELD MODEL</p><h2>A practical path to a working prototype.</h2></div><ol><li><span>01</span><div><h3>Observe</h3><p>Survey the station, crossing behaviour and current announcement flow.</p></div></li><li><span>02</span><div><h3>Detect</h3><p>Train the camera pipeline on authorised approach footage.</p></div></li><li><span>03</span><div><h3>Verify</h3><p>Add the second signal and test disagreement handling in shadow mode.</p></div></li><li><span>04</span><div><h3>Announce</h3><p>Run supervised messages and measure reliability and response.</p></div></li></ol></section>

      <section className="collaboration-section" id="collaborate"><div className="model-status"><span>PHYSICAL MODEL</span><strong>Under development</strong><p>The current release is a research-backed software simulation. Camera hardware, the proximity node and the station audio unit are being shaped for a controlled prototype.</p></div><div className="collaboration-copy"><p className="eyebrow">BUILD WITH US</p><h2>Rail safety needs engineering partners—not just an idea.</h2><p>We welcome collaboration on computer vision, embedded systems, railway operations, field research and responsible pilots.</p><div className="collaboration-actions"><a className="button primary" href="https://github.com/dipayansardar73-decode" target="_blank" rel="noreferrer"><Code2 /> Contact for collaboration</a><a className="button ghost-light" href="https://github.com/dipayansardar73-decode/Distributed-Information-Processing-DIP-" target="_blank" rel="noreferrer">Explore the code <ExternalLink /></a></div></div></section>

      <footer><div className="footer-brand"><span className="brand-mark"><TrainFront /></span><div><strong>RailBlazers</strong><small>Smart Railway Monitoring & Announcement System</small></div></div><div className="prepared"><small>CONCEPT & PROTOTYPE PREPARED BY</small><strong>Dipayan Sardar</strong></div><p>Early-stage engineering concept · Inspired by Jadavpur · Not affiliated with or endorsed by Indian Railways</p></footer>
    </main>
  )
}

export default App
