import { useState } from 'react'
import Papa from 'papaparse'
import '../styles/file-uploader.css'

export default function FileUploader({ onParticipantsLoaded }) {
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileName(file.name)
    setError('')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const participants = parseParticipants(results.data)
          if (participants.length === 0) {
            setError('Aucun participant trouvé dans le fichier')
            return
          }
          onParticipantsLoaded(participants)
        } catch (err) {
          setError(err.message)
        }
      },
      error: (error) => {
        setError(`Erreur lors de la lecture du fichier: ${error.message}`)
      }
    })
  }

  const parseParticipants = (data) => {
    // Chercher les colonnes pertinentes (flexible pour différents formats Lydia)
    const participants = []
    const amountColumns = ['Montant', 'Amount', 'montant', 'amount']
    const nameColumns = ['Nom', 'Name', 'nom', 'name', 'Payeur', 'payeur']
    
    let amountColName = null
    let nameColName = null

    if (data.length === 0) return participants

    const firstRow = data[0]
    const headers = Object.keys(firstRow)

    // Trouver les bonnes colonnes
    amountColName = headers.find(h => amountColumns.includes(h))
    nameColName = headers.find(h => nameColumns.includes(h))

    if (!amountColName || !nameColName) {
      throw new Error('Format de fichier non reconnu. Assurez-vous que le fichier CSV contient les colonnes "Montant" et "Nom".')
    }

    // Parser les participants
    data.forEach((row) => {
      const name = row[nameColName]?.trim()
      const amountStr = row[amountColName]?.toString().trim()

      if (name && amountStr) {
        // Extraire le nombre de tickets (assumer 1€ = 1 ticket)
        const amount = parseFloat(amountStr.replace(',', '.'))
        const tickets = Math.max(1, Math.round(amount))

        participants.push({
          id: participants.length,
          name,
          amount,
          tickets
        })
      }
    })

    return participants
  }

  return (
    <div className="uploader-container">
      <div className="uploader-card">
        <h2>📊 Importer les Participants</h2>
        <p className="description">
          Téléchargez un fichier CSV exporté de Lydia contenant les participants et leurs paiements.
        </p>

        <div className="upload-area">
          <label htmlFor="file-input" className="upload-label">
            <div className="upload-icon">📁</div>
            <div className="upload-text">
              <strong>Cliquez ou déposez votre fichier CSV</strong>
              <p>Format: CSV avec colonnes "Nom" et "Montant"</p>
            </div>
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="file-input"
            />
          </label>
        </div>

        {fileName && (
          <div className="upload-success">
            ✓ Fichier chargé: <strong>{fileName}</strong>
          </div>
        )}

        {error && (
          <div className="upload-error">
            ✗ Erreur: {error}
          </div>
        )}

        <div className="format-help">
          <h3>Format attendu:</h3>
          <p>Votre fichier CSV doit contenir au minimum les colonnes:</p>
          <ul>
            <li><strong>Nom</strong> (ou Name): Nom du participant</li>
            <li><strong>Montant</strong> (ou Amount): Somme payée en euros</li>
          </ul>
          <p className="note">Note: Le montant sera converti en nombre de tickets (1€ = 1 ticket)</p>
        </div>
      </div>
    </div>
  )
}
