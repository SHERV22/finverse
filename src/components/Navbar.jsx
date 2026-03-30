function Navbar({ title, onOpenMenu }) {
  return (
    <header className="command-bar">
      <div className="command-left">
        <button type="button" className="menu-button" onClick={onOpenMenu} aria-label="Open navigation menu">
          Menu
        </button>
        <div className="command-title">
          <p className="eyebrow">Finverse Ledger Desk</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="command-meta">
        <p className="meta-label">Live Session</p>
        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
      </div>
    </header>
  )
}

export default Navbar
