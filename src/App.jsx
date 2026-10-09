import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, Camera, Check, ExternalLink, Gauge, MapPin, Pause, Radio, ShieldCheck, TrainFront, Volume2, Wifi, X } from 'lucide-react'
import * as THREE from 'three'

const scenarios = {
  confirmed: {
    label: 'Confirmed approach',
    caption: 'OCR and radio agree. GPS corroborates.',
    signals: [
      { id: 'ocr', label: 'OCR camera', value: '68021', detail: '96% confidence', state: 'match' },
      { id: 'radio', label: 'Radio ID', value: '68021', detail: 'Authenticated', state: 'match' },
      { id: 'gps', label: 'GPS fallback', value: '68021', detail: '1.8 km away', state: 'match' },
    ],
  },
  obscured: {
    label: 'Camera obscured',
    caption: 'Radio and GPS agree. Announcement is still safe to issue.',
    signals: [
      { id: 'ocr', label: 'OCR camera', value: '—', detail: 'Low visibility', state: 'miss' },
      { id: 'radio', label: 'Radio ID', value: '68021', detail: 'Authenticated', state: 'match' },
      { id: 'gps', label: 'GPS fallback', value: '68021', detail: '1.8 km away', state: 'match' },
    ],
  },
  conflict: {
    label: 'Conflicting signal',
    caption: 'No two sources agree. The system holds the announcement.',
    signals: [
      { id: 'ocr', label: 'OCR camera', value: '68021', detail: '83% confidence', state: 'warn' },
      { id: 'radio', label: 'Radio ID', value: '68012', detail: 'Authenticated', state: 'warn' },
      { id: 'gps', label: 'GPS fallback', value: '68047', detail: '3.4 km away', state: 'warn' },
    ],
  },
}

const sources = [
  {
    number: '01',
    stat: '3,500+',
    title: 'untoward cases reported in 2024',
    copy: 'The Railway Protection Force annual edition describes deaths and injuries linked to trespass and other untoward incidents as a continuing safety challenge.',
    link: 'https://jrrpfa.indianrailways.gov.in/assets/resource/Rail%20Sainik%202024-%20English%20Version.pdf',
    source: 'Rail Sainik 2024 · RPF',
  },
  {
    number: '02',
    stat: '261 / 60',
    title: 'PA vs train-display coverage',
    copy: 'A 2024 Parliamentary answer for South Western Railway listed PA systems at 261 stations, but train display boards at only 60—evidence of uneven passenger-information infrastructure.',
    link: 'https://sansad.in/getFile/annex/263/AU938.pdf?source=pqars',
    source: 'Rajya Sabha AU 938 · 2024',
  },
  {
    number: '03',
    stat: '1,416',
    title: 'lives saved by RPF in one year',
    copy: 'Under Operation Jeevan Raksha, RPF reported saving 873 men and 543 women on platforms, tracks and trains during FY 2022–23.',
    link: 'https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1919805&lang=2&reg=48',
    source: 'Press Information Bureau · 2023',
  },
]

function TrackScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 4.2, 8)
    camera.lookAt(0, 0, -3)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const amber = new THREE.LineBasicMaterial({ color: 0xffb000 })
    const muted = new THREE.LineBasicMaterial({ color: 0x45505a, transparent: true, opacity: 0.75 })
    const makeLine = (points, material) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)))
      const line = new THREE.Line(geometry, material)
      scene.add(line)
      return line
    }
    makeLine([[-1.7, 0, 3], [-0.55, 0, -11]], amber)
    makeLine([[1.7, 0, 3], [0.55, 0, -11]], amber)
    for (let z = 2.8; z > -11; z -= 0.72) {
      const width = 1.68 - (2.8 - z) * 0.08
      makeLine([[-Math.max(width, .58), 0, z], [Math.max(width, .58), 0, z]], muted)
    }
    const beaconGeo = new THREE.SphereGeometry(0.09, 16, 16)
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffb000 })
    const beacon = new THREE.Mesh(beaconGeo, beaconMat)
    beacon.position.set(0, 0.12, -2)
    scene.add(beacon)

    let frame
    const resize = () => {
      const { clientWidth, clientHeight } = mount
      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }
    const animate = (time) => {
      beacon.position.z = 1.8 - ((time * 0.0014) % 1) * 9.8
      const scale = 0.8 + Math.sin(time * 0.006) * 0.25
      beacon.scale.setScalar(scale)
      renderer.render(scene, camera)
      frame = requestAnimationFrame(animate)
    }
    resize()
    animate(0)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="track-scene" aria-hidden="true" />
}

function App() {
  const [scenario, setScenario] = useState('confirmed')
  const [menuOpen, setMenuOpen] = useState(false)
  const current = scenarios[scenario]
  const matches = current.signals.filter((signal) => signal.state === 'match').length
  const approved = matches >= 2
  const confidence = useMemo(() => (scenario === 'confirmed' ? 98 : scenario === 'obscured' ? 91 : 38), [scenario])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <main>
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo('top')} aria-label="RailBlazers home">
          <span className="brand-mark"><TrainFront size={18} /></span>
          <span>RAILBLAZERS</span>
        </button>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Menu</button>
        <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Primary navigation">
          <button onClick={() => scrollTo('system')}>The system</button>
          <button onClick={() => scrollTo('evidence')}>Evidence</button>
          <button onClick={() => scrollTo('roadmap')}>Roadmap</button>
          <a className="repo-link" href="https://github.com/dipayansardar73-decode/Distributed-Information-Processing-DIP-" target="_blank" rel="noreferrer">View source <ExternalLink size={14} /></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <TrackScene />
        <div className="hero-copy">
          <div className="eyebrow"><span /> A resilient station-safety concept</div>
          <h1>See the train.<br />Verify the signal.<br /><em>Warn the station.</em></h1>
          <p className="hero-lede">A low-cost approach to automatic train announcements for stations where silence, delayed information and track crossing can turn an ordinary journey into a risk.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => scrollTo('demo')}>Run the signal demo</button>
            <button className="text-button" onClick={() => scrollTo('story')}>Read the origin story <ArrowDown size={16} /></button>
          </div>
        </div>
        <div className="hero-status" aria-label="System status preview">
          <div className="status-kicker">APPROACHING · SIMULATION</div>
          <div className="train-number">68021</div>
          <div className="route-line"><span>KGP</span><i /><span>JGM</span></div>
          <div className="arrival"><span>ARRIVAL WINDOW</span><strong>02:14</strong></div>
          <div className="verified"><ShieldCheck size={17} /> 3 / 3 signals aligned</div>
        </div>
      </section>

      <div className="signal-strip" aria-label="System promise">
        <span>CAMERA</span><i /> <span>RADIO ID</span><i /> <span>GPS</span><b>→</b><strong>AUTOMATIC ANNOUNCEMENT</strong>
      </div>

      <section className="story-section" id="story">
        <div className="section-label">01 / THE OBSERVATION</div>
        <div className="story-grid">
          <div>
            <p className="quote-mark">“</p>
            <h2>At a small station near Jhargram, the absence of a dependable announcement became impossible to ignore.</h2>
          </div>
          <div className="story-body">
            <p>Passengers were making decisions without knowing what was approaching. Some crossed the tracks. The insight was simple: a station should not need a full control room to deliver one timely, trustworthy warning.</p>
            <p className="note">This observation is the project’s origin story, not a claim that every station in the area lacks passenger information today.</p>
          </div>
        </div>
      </section>

      <section className="system-section" id="system">
        <div className="section-heading">
          <div className="section-label">02 / THE SYSTEM</div>
          <h2>Three signals. One decision.</h2>
          <p>Each input can fail differently. The station announces only when at least two independent sources agree on the same train identity.</p>
        </div>
        <div className="system-grid">
          <article className="system-card camera-card">
            <span className="card-index">01</span><Camera />
            <h3>Trackside vision</h3>
            <p>A rugged camera captures the locomotive or coach identifier. Computer vision isolates the number; OCR turns it into a train ID.</p>
            <div className="card-meta">PRIMARY · NO TRAIN MODIFICATION</div>
          </article>
          <article className="system-card radio-card">
            <span className="card-index">02</span><Wifi />
            <h3>Short-range radio</h3>
            <p>An authenticated onboard tag announces its identity to the station receiver only after entering a defined approach zone.</p>
            <div className="card-meta">PRIMARY · PROXIMITY CONFIRMATION</div>
          </article>
          <article className="system-card gps-card">
            <span className="card-index">03</span><MapPin />
            <h3>Location fallback</h3>
            <p>GPS or an operations feed checks route, direction and proximity when one local signal is unavailable or uncertain.</p>
            <div className="card-meta">FALLBACK · CONTEXT SIGNAL</div>
          </article>
          <article className="decision-card">
            <div className="decision-symbol">2<span>/3</span></div>
            <div><h3>Quorum before voice</h3><p>Match train ID, direction and time window—then trigger a multilingual, pre-recorded station announcement.</p></div>
          </article>
        </div>
      </section>

      <section className="demo-section" id="demo">
        <div className="section-heading light">
          <div className="section-label">03 / LIVE LOGIC DEMO</div>
          <h2>What should the station say?</h2>
          <p>Switch conditions to see how the same 2-of-3 decision rule behaves when a signal is lost or conflicts.</p>
        </div>
        <div className="scenario-tabs" role="tablist" aria-label="Detection scenarios">
          {Object.entries(scenarios).map(([key, value]) => (
            <button key={key} className={scenario === key ? 'active' : ''} onClick={() => setScenario(key)} role="tab" aria-selected={scenario === key}>{value.label}</button>
          ))}
        </div>
        <div className="console">
          <div className="console-topbar"><span>JHARGRAM APPROACH NODE · EASTBOUND</span><span>SIMULATION / 14:32:08</span></div>
          <div className="console-body">
            <div className="signal-list">
              {current.signals.map((signal) => {
                const Icon = signal.id === 'ocr' ? Camera : signal.id === 'radio' ? Radio : MapPin
                return (
                  <div className={`signal-row ${signal.state}`} key={signal.id}>
                    <div className="signal-icon"><Icon size={20} /></div>
                    <div><span>{signal.label}</span><strong>{signal.value}</strong></div>
                    <small>{signal.detail}</small>
                    <div className="signal-state">{signal.state === 'match' ? <Check size={18} /> : signal.state === 'miss' ? <X size={18} /> : <Gauge size={18} />}</div>
                  </div>
                )
              })}
            </div>
            <div className={`decision-panel ${approved ? 'go' : 'hold'}`}>
              <div className="decision-ring"><strong>{confidence}</strong><span>%</span></div>
              <span className="decision-label">DECISION CONFIDENCE</span>
              <h3>{approved ? 'ANNOUNCEMENT CLEARED' : 'ANNOUNCEMENT HELD'}</h3>
              <p>{current.caption}</p>
              <div className="announcement-box">
                {approved ? <Volume2 size={21} /> : <Pause size={21} />}
                <span>{approved ? '“Attention please. Train 68021 to Jhargram is approaching platform one.”' : 'No public message. Notify the station operator for verification.'}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="demo-disclaimer">Illustrative interface only. Train number, confidence and arrival time are simulated—not live railway data.</p>
      </section>

      <section className="evidence-section" id="evidence">
        <div className="section-heading">
          <div className="section-label">04 / PROBLEM VALIDATION</div>
          <h2>The need is real.<br />The exact gap needs a pilot.</h2>
          <p>Public evidence validates the safety problem and the component technologies. It does not yet prove that this exact three-signal system is the right operational answer at every station.</p>
        </div>
        <div className="evidence-grid">
          {sources.map((item) => (
            <a className="evidence-card" href={item.link} target="_blank" rel="noreferrer" key={item.number}>
              <div className="evidence-number">{item.number}</div>
              <strong className="big-stat">{item.stat}</strong>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span>{item.source} <ExternalLink size={14} /></span>
            </a>
          ))}
        </div>
        <div className="validation-row">
          <div><Check /><h3>Validated</h3><p>Trespass and platform/track incidents are material safety problems. PA infrastructure exists, but station information coverage is uneven.</p></div>
          <div><Check /><h3>Technically plausible</h3><p>Indian Railways already specifies networked passenger-information systems and uses fixed RFID readers to identify passing rolling stock.</p></div>
          <div><Gauge /><h3>Still to prove</h3><p>OCR accuracy in rain, dust, night and speed; radio-tag retrofit economics; false-alarm rate; and the real effect on unsafe crossing behaviour.</p></div>
        </div>
      </section>

      <section className="feasibility-section">
        <div className="section-label">05 / WHY THIS CAN FIT</div>
        <div className="feasibility-grid">
          <div className="sticky-copy"><h2>Build beside the railway—not against it.</h2><p>The strongest route is not a parallel railway network. It is an edge layer that produces a verified event for systems stations already understand: announcements and displays.</p></div>
          <div className="feasibility-list">
            <a href="https://rdso.indianrailways.gov.in/uploads/2025-02-27-RDSO_SPN_TC_108_2025%20Ver-2d0.pdf" target="_blank" rel="noreferrer"><span>01</span><div><h3>Compatible output</h3><p>RDSO’s IP-based passenger-information specification already combines central control, remote monitoring, displays and PC-based announcements.</p></div><ExternalLink /></a>
            <a href="https://rfid.indianrailways.gov.in/" target="_blank" rel="noreferrer"><span>02</span><div><h3>Proven identification pattern</h3><p>Indian Railways’ RFID portal describes fixed readers beside tracks receiving identity and location information from passing tags.</p></div><ExternalLink /></a>
            <a href="https://doi.org/10.1057/jit.2009.9" target="_blank" rel="noreferrer"><span>03</span><div><h3>Multiple sensing options</h3><p>A CRIS-linked case study evaluated RFID, GPS and OCR as alternative railcar-tracking technologies—the same diversity this concept turns into redundancy.</p></div><ExternalLink /></a>
          </div>
        </div>
      </section>

      <section className="roadmap-section" id="roadmap">
        <div className="section-heading light">
          <div className="section-label">06 / PILOT ROADMAP</div>
          <h2>Start with evidence,<br />not infrastructure.</h2>
        </div>
        <div className="roadmap-grid">
          <article><span>PHASE 01 · 4 WEEKS</span><h3>Observe</h3><p>Map crossing behaviour, announcement gaps, train speeds, visibility and current station workflows. Establish a safety baseline.</p><b>OUTPUT</b><small>Site survey + risk map</small></article>
          <article><span>PHASE 02 · 8 WEEKS</span><h3>Detect</h3><p>Run a shadow-mode camera node. Compare detected train IDs and arrival windows against authorised operational records.</p><b>OUTPUT</b><small>Accuracy + failure dataset</small></article>
          <article><span>PHASE 03 · 12 WEEKS</span><h3>Verify</h3><p>Add a second independent signal. Test quorum logic without public announcements and log every disagreement.</p><b>OUTPUT</b><small>Safety case + operator review</small></article>
          <article><span>PHASE 04 · CONTROLLED</span><h3>Announce</h3><p>Enable supervised, multilingual messages during selected windows. Measure alert timeliness, false alarms and passenger response.</p><b>OUTPUT</b><small>Pilot decision memo</small></article>
        </div>
      </section>

      <section className="principles-section">
        <div className="section-label">DESIGN PRINCIPLES</div>
        <div className="principles-grid"><span>Local-first processing</span><span>Fail silent, never guess</span><span>Privacy by design</span><span>Human override always</span><span>Audit every decision</span><span>Multilingual by default</span></div>
      </section>

      <footer>
        <div><span className="footer-mark"><TrainFront /></span><h2>A safer platform starts<br />before the train arrives.</h2></div>
        <div className="footer-meta"><p>RailBlazers is an early-stage engineering concept for resilient station announcements. It is not affiliated with or endorsed by Indian Railways.</p><a href="https://github.com/dipayansardar73-decode/Distributed-Information-Processing-DIP-" target="_blank" rel="noreferrer">Explore the repository <ExternalLink size={15} /></a><span>Concept initiated in Delhi · Inspired by Jhargram</span></div>
      </footer>
    </main>
  )
}

export default App
