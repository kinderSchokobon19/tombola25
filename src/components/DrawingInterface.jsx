import { useState, useEffect } from 'react'
import '../styles/drawing-interface.css'

export default function DrawingInterface({ participants, prizes, onReset }) {
  const [remainingPrizes, setRemainingPrizes] = useState(prizes)
  const [winnings, setWinnings] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentWinner, setCurrentWinner] = useState(null)
  const [currentPrize, setCurrentPrize] = useState(null)
  const [stats, setStats] = useState({ drawn: 0, total: prizes.length })

  // Créer un pool de tickets
  const createTicketPool = () => {
    const pool = []
    participants.forEach(participant => {
      for (let i = 0; i < participant.tickets; i++) {
        pool.push(participant)
      }
    })
    return pool
  }

  const [ticketPool, setTicketPool] = useState([])

  useEffect(() => {
    setTicketPool(createTicketPool())
  }, [participants])

  const handleDraw = () => {
    if (remainingPrizes.length === 0) {
      alert('Tous les lots ont été attribués!')
      return
    }

    setIsDrawing(true)

    // Animation du tirage
    let iterations = 0
    const interval = setInterval(() => {
      iterations++
      
      // Afficher un participant aléatoire pendant l'animation
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)]
      const randomPrize = remainingPrizes[Math.floor(Math.random() * remainingPrizes.length)]
      
      setCurrentWinner(randomParticipant)
      setCurrentPrize(randomPrize)

      if (iterations > 30) {
        clearInterval(interval)
        
        // Tirage final réel (basé sur les tickets)
        const pool = createTicketPool()
        const winner = pool[Math.floor(Math.random() * pool.length)]
        const prizeIndex = Math.floor(Math.random() * remainingPrizes.length)
        const prize = remainingPrizes[prizeIndex]

        setCurrentWinner(winner)
        setCurrentPrize(prize)

        // Ajouter au palmarès
        setWinnings([...winnings, { winner, prize }])

        // Retirer le lot des restants
        const newRemaining = remainingPrizes.filter((_, idx) => idx !== prizeIndex)
        setRemainingPrizes(newRemaining)
        setStats({ drawn: winnings.length + 1, total: prizes.length })

        setIsDrawing(false)
      }
    }, 50)
  }

  const handleUndo = () => {
    if (winnings.length === 0) return

    const lastWinning = winnings[winnings.length - 1]
    setWinnings(winnings.slice(0, -1))
    setRemainingPrizes([...remainingPrizes, lastWinning.prize])
    setStats({ drawn: winnings.length - 1, total: prizes.length })
  }

  const handleExport = () => {
    const csv = [
      ['Participant', 'Lot', 'Description'],
      ...winnings.map(w => [w.winner.name, w.prize.name, w.prize.value])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tombola-resultats-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="drawing-container">
      <div className="drawing-main">
        <div className="drawing-display">
          {currentWinner && currentPrize ? (
            <>
              <div className={`winner-card ${!isDrawing ? 'revealed' : ''}`}>
                <p className="winner-label">🎉 Gagnant 🎉</p>
                <h2>{currentWinner.name}</h2>
                <p className="winner-tickets">({currentWinner.tickets} ticket{currentWinner.tickets > 1 ? 's' : ''})</p>
              </div>

              <div className="arrow">→</div>

              <div className={`prize-card ${!isDrawing ? 'revealed' : ''}`}>
                <p className="prize-emoji">{currentPrize.icon}</p>
                <h3>{currentPrize.name}</h3>
                <p className="prize-value">{currentPrize.value}</p>
              </div>
            </>
          ) : (
            <div className="waiting-card">
              <p>Cliquez sur "Faire un tirage" pour commencer 🎲</p>
            </div>
          )}
        </div>

        <div className="drawing-controls">
          <button
            onClick={handleDraw}
            disabled={isDrawing || remainingPrizes.length === 0}
            className="btn-draw"
          >
            {isDrawing ? '⏳ Tirage en cours...' : '🎲 Faire un tirage'}
          </button>

          <div className="control-buttons">
            <button
              onClick={handleUndo}
              disabled={winnings.length === 0 || isDrawing}
              className="btn-secondary"
            >
              ↶ Annuler dernier
            </button>
            <button
              onClick={handleExport}
              disabled={winnings.length === 0}
              className="btn-secondary"
            >
              ⬇ Exporter CSV
            </button>
          </div>

          <div className="stats">
            <p className="stat-item">📊 <strong>{stats.drawn}</strong> / {stats.total} lots attribués</p>
            <p className="stat-item">🎁 <strong>{remainingPrizes.length}</strong> lot(s) restant(s)</p>
          </div>
        </div>
      </div>

      <div className="results-sidebar">
        <div className="results-header">
          <h3>📋 Résultats</h3>
          {winnings.length > 0 && (
            <button onClick={onReset} className="btn-restart">
              🔄 Nouvelle tombola
            </button>
          )}
        </div>

        <div className="results-list">
          {winnings.length === 0 ? (
            <p className="empty-results">Aucun résultat encore...</p>
          ) : (
            winnings.map((winning, index) => (
              <div key={index} className="result-item">
                <span className="result-number">{index + 1}.</span>
                <div className="result-content">
                  <p className="result-winner">{winning.winner.name}</p>
                  <p className="result-prize">
                    {winning.prize.icon} {winning.prize.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
