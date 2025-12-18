import { useState, useEffect } from 'react'
import ResultsSummary from './ResultsSummary'
import '../styles/drawing-interface.css'

export default function DrawingInterface({ participants, prizes, onReset }) {
  const [remainingPrizes, setRemainingPrizes] = useState(prizes)
  const [winnings, setWinnings] = useState([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentWinner, setCurrentWinner] = useState(null)
  const [currentPrize, setCurrentPrize] = useState(null)
  const [showResultsSummary, setShowResultsSummary] = useState(false)

  // Créer un pool de lots (duplicates les lots selon leur quantity)
  const createPrizePool = () => {
    const pool = []
    prizes.forEach(prize => {
      const quantity = prize.quantity || 1
      for (let i = 0; i < quantity; i++) {
        pool.push(prize)
      }
    })
    return pool
  }

  const [prizePool, setPrizePool] = useState([])
  const totalPrizes = prizes.reduce((sum, p) => sum + (p.quantity || 1), 0)
  const remainingCount = prizePool.length

  // Calculer le nombre de tickets restants pour le gagnant actuel
  const getCurrentWinnerTickets = () => {
    if (!currentWinner) return 0
    return ticketPool.filter(t => t.id === currentWinner.id).length
  }

  useEffect(() => {
    setPrizePool(createPrizePool())
  }, [prizes])

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
    if (prizePool.length === 0) {
      alert('Tous les lots ont été attribués!')
      return
    }

    if (ticketPool.length === 0) {
      alert('Pas de tickets restants!')
      return
    }

    setIsDrawing(true)

    // Animation du tirage
    let iterations = 0
    const interval = setInterval(() => {
      iterations++
      
      // Afficher un participant aléatoire pendant l'animation
      if (ticketPool.length > 0) {
        const randomWinner = ticketPool[Math.floor(Math.random() * ticketPool.length)]
        const randomPrize = prizePool[Math.floor(Math.random() * prizePool.length)]
        
        setCurrentWinner(randomWinner)
        setCurrentPrize(randomPrize)
      }

      if (iterations > 30) {
        clearInterval(interval)
        
        // Tirage final réel (basé sur les tickets)
        if (ticketPool.length === 0) {
          alert('Pas de tickets restants!')
          setIsDrawing(false)
          return
        }

        const winnerIndex = Math.floor(Math.random() * ticketPool.length)
        const winner = ticketPool[winnerIndex]
        const prizeIndex = Math.floor(Math.random() * prizePool.length)
        const prize = prizePool[prizeIndex]

        setCurrentWinner(winner)
        setCurrentPrize(prize)

        // Ajouter au palmarès avec le nombre de tickets actuel
        const remainingTickets = ticketPool.filter(t => t.id === winner.id).length
        setWinnings([...winnings, { 
          winner: { ...winner, remainingTickets }, 
          prize 
        }])

        // Retirer un ticket du gagnant
        const newTicketPool = ticketPool.filter((_, idx) => idx !== winnerIndex)
        setTicketPool(newTicketPool)

        // Retirer le lot des restants
        const newRemaining = prizePool.filter((_, idx) => idx !== prizeIndex)
        setPrizePool(newRemaining)

        setIsDrawing(false)
      }
    }, 50)
  }

  const handleCompleteDrawing = async () => {
    if (prizePool.length === 0) {
      alert('Tous les lots ont été attribués!')
      return
    }

    if (ticketPool.length === 0) {
      alert('Pas de tickets restants!')
      return
    }

    setIsDrawing(true)

    const newWinnings = [...winnings]
    let remainingTickets = [...ticketPool]
    let remaining = [...prizePool]
    let delay = 0

    // Tirer tous les lots avec délai
    for (let i = 0; i < prizePool.length; i++) {
      if (remainingTickets.length === 0) break

      await new Promise(resolve => {
        setTimeout(() => {
          const winnerIndex = Math.floor(Math.random() * remainingTickets.length)
          const winner = remainingTickets[winnerIndex]
          const prizeIndex = Math.floor(Math.random() * remaining.length)
          const prize = remaining[prizeIndex]

          setCurrentWinner(winner)
          setCurrentPrize(prize)

          newWinnings.push({ 
            winner: { ...winner, remainingTickets: remainingTickets.filter(t => t.id === winner.id).length }, 
            prize 
          })
          setWinnings(newWinnings)

          // Retirer un ticket du gagnant
          remainingTickets = remainingTickets.filter((_, idx) => idx !== winnerIndex)
          setTicketPool(remainingTickets)

          // Retirer le lot
          remaining = remaining.filter((_, idx) => idx !== prizeIndex)
          setPrizePool(remaining)

          resolve()
        }, 80 + delay)
      })
      delay += 80
    }

    setIsDrawing(false)
  }

  const handleUndo = () => {
    if (winnings.length === 0) return

    const lastWinning = winnings[winnings.length - 1]
    setWinnings(winnings.slice(0, -1))
    
    // Remettre le ticket du gagnant dans le pool
    setTicketPool([...ticketPool, lastWinning.winner])
    
    // Remettre le lot
    setPrizePool([...prizePool, lastWinning.prize])
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
                <p className="winner-tickets">({getCurrentWinnerTickets()} ticket{getCurrentWinnerTickets() > 1 ? 's' : ''} restant{getCurrentWinnerTickets() > 1 ? 's' : ''})</p>
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
          <div className="button-group">
            <button
              onClick={handleDraw}
              disabled={isDrawing || prizePool.length === 0}
              className="btn-draw"
            >
              {isDrawing ? '⏳ Tirage en cours...' : '🎲 Faire un tirage'}
            </button>
            <button
              onClick={handleCompleteDrawing}
              disabled={isDrawing || prizePool.length === 0}
              className="btn-draw-all"
            >
              {isDrawing ? '⏳ Tirage en cours...' : '⚡ Tirage Complet'}
            </button>
          </div>

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
            <p className="stat-item">📊 <strong>{winnings.length}</strong> / {totalPrizes} lots attribués</p>
            <p className="stat-item">🎁 <strong>{remainingCount}</strong> lot(s) restant(s)</p>
          </div>
        </div>
      </div>

      <div className="results-sidebar">
        <div className="results-header">
          <h3>📋 Résultats</h3>
          {winnings.length > 0 && (
            <button onClick={() => setShowResultsSummary(true)} className="btn-view-all">
              👁️ Voir tous
            </button>
          )}
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

      {showResultsSummary && (
        <ResultsSummary 
          winnings={winnings}
          participants={participants}
          onClose={() => setShowResultsSummary(false)}
        />
      )}
    </div>
  )
}
