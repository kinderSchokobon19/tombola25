import { useState, useEffect } from 'react'
import '../styles/prize-manager.css'

export default function PrizeManager({ onPrizesLoaded, participants }) {
  const [prizes, setPrizes] = useState([
    { id: 1, name: '', value: '', icon: '🎁', quantity: 1 },
  ])

  // Charger les lots depuis le fichier prizes.json
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'prizes.json')
      .then(res => res.json())
      .then(data => setPrizes(data))
      .catch(err => console.log('Pas de fichier prizes.json trouvé'))
  }, [])
  const [showPreview, setShowPreview] = useState(false)

  const handlePrizeChange = (id, field, value) => {
    setPrizes(prizes.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const handleAddPrize = () => {
    const newId = Math.max(...prizes.map(p => p.id), 0) + 1
    setPrizes([...prizes, { id: newId, name: '', value: '', icon: '🎁', quantity: 1 }])
  }

  const handleRemovePrize = (id) => {
    if (prizes.length > 1) {
      setPrizes(prizes.filter(p => p.id !== id))
    }
  }

  const handleValidate = () => {
    const validPrizes = prizes.filter(p => p.name.trim() && p.value.trim())
    
    if (validPrizes.length === 0) {
      alert('Ajoutez au moins un lot avec un nom et une description')
      return
    }

    onPrizesLoaded(validPrizes)
  }

  return (
    <div className="prizes-container">
      <div className="prizes-card">
        <h2>🎁 Ajouter les Lots</h2>
        <p className="description">
          Entrez la liste de tous les lots à gagner.
        </p>

        <div className="prizes-form">
          {prizes.map((prize, index) => (
            <div key={prize.id} className="prize-input-group">
              <div className="prize-row">
                <input
                  type="text"
                  placeholder="Icône (emoji)"
                  maxLength="2"
                  value={prize.icon}
                  onChange={(e) => handlePrizeChange(prize.id, 'icon', e.target.value)}
                  className="prize-icon-input"
                />
                <input
                  type="text"
                  placeholder={`Nom du lot ${index + 1}`}
                  value={prize.name}
                  onChange={(e) => handlePrizeChange(prize.id, 'name', e.target.value)}
                  className="prize-name-input"
                />
                <input
                  type="text"
                  placeholder="Description/Valeur"
                  value={prize.value}
                  onChange={(e) => handlePrizeChange(prize.id, 'value', e.target.value)}
                  className="prize-value-input"
                />
                <input
                  type="number"
                  placeholder="Nbre gagnants"
                  min="1"
                  value={prize.quantity || 1}
                  onChange={(e) => handlePrizeChange(prize.id, 'quantity', parseInt(e.target.value))}
                  className="prize-quantity-input"
                />
                <button
                  onClick={() => handleRemovePrize(prize.id)}
                  disabled={prizes.length === 1}
                  className="btn-remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleAddPrize} className="btn-add-prize">
          + Ajouter un lot
        </button>

        <div className="preview-section">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="btn-preview"
          >
            {showPreview ? '▼ Masquer aperçu' : '▶ Voir aperçu'}
          </button>

          {showPreview && (
            <div className="prizes-preview">
              <h3>Aperçu des lots ({prizes.filter(p => p.name).length})</h3>
              <div className="prizes-grid">
                {prizes.filter(p => p.name).map(prize => (
                  <div key={prize.id} className="prize-card">
                    <span className="prize-emoji">{prize.icon}</span>
                    <h4>{prize.name}</h4>
                    <p>{prize.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="actions">
          <p className="participants-info">
            👥 <strong>{participants.length}</strong> participant(s) chargé(s)
          </p>
          <button onClick={handleValidate} className="btn-validate">
            Continuer au tirage →
          </button>
        </div>
      </div>
    </div>
  )
}
