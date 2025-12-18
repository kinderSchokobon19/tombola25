import '../styles/results-summary.css'

export default function ResultsSummary({ winnings, participants, onClose }) {
  const handlePrint = () => {
    window.print()
  }

  const handleCopy = () => {
    const text = winnings
      .map((w, i) => `${i + 1}. ${w.winner.name} → ${w.prize.icon} ${w.prize.name}`)
      .join('\n')
    navigator.clipboard.writeText(text)
    alert('Résultats copiés dans le presse-papiers!')
  }

  return (
    <div className="results-summary-overlay">
      <div className="results-summary-modal">
        <div className="modal-header">
          <h2>🏆 Résultats de la Tombola</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="modal-content">
          <div className="results-table">
            <div className="table-header">
              <div className="col-rank">#</div>
              <div className="col-winner">Gagnant</div>
              <div className="col-prize">Lot</div>
            </div>

            <div className="table-body">
              {winnings.map((winning, index) => (
                <div key={index} className="table-row">
                  <div className="col-rank">
                    <span className="rank-badge">{index + 1}</span>
                  </div>
                  <div className="col-winner">
                    <div className="winner-name">{winning.winner.name}</div>
                    <div className="winner-tickets">
                      {winning.winner.remainingTickets !== undefined 
                        ? `${winning.winner.remainingTickets} ticket${winning.winner.remainingTickets > 1 ? 's' : ''} restant${winning.winner.remainingTickets > 1 ? 's' : ''}`
                        : `${winning.winner.tickets} ticket${winning.winner.tickets > 1 ? 's' : ''}`
                      }
                    </div>
                  </div>
                  <div className="col-prize">
                    <div className="prize-info">
                      <span className="prize-emoji">{winning.prize.icon}</span>
                      <div>
                        <div className="prize-name">{winning.prize.name}</div>
                        <div className="prize-detail">{winning.prize.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="results-stats">
            <div className="stat">
              <span className="stat-label">👥 Participants gagnants</span>
              <span className="stat-value">{new Set(winnings.map(w => w.winner.id)).size}</span>
            </div>
            <div className="stat">
              <span className="stat-label">🎁 Lots attribués</span>
              <span className="stat-value">{winnings.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">🎫 Tickets total</span>
              <span className="stat-value">{participants.reduce((sum, p) => sum + p.tickets, 0)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleCopy} className="btn-action btn-copy">
            📋 Copier
          </button>
          <button onClick={handlePrint} className="btn-action btn-print">
            🖨️ Imprimer
          </button>
          <button onClick={onClose} className="btn-action btn-close-modal">
            Fermer
          </button>
        </div>
      </div>
    </div>
  )
}
