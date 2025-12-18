import { useState } from 'react'
import FileUploader from './components/FileUploader'
import PrizeManager from './components/PrizeManager'
import DrawingInterface from './components/DrawingInterface'
import './App.css'

export default function App() {
  const [participants, setParticipants] = useState([])
  const [prizes, setPrizes] = useState([])
  const [currentStep, setCurrentStep] = useState('upload') // upload, prizes, draw

  const handleParticipantsLoaded = (data) => {
    setParticipants(data)
    setCurrentStep('prizes')
  }

  const handlePrizesLoaded = (data) => {
    setPrizes(data)
    setCurrentStep('draw')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎄 Tombola - Marché de Noël 🎁</h1>
      </header>

      <main className="app-main">
        {currentStep === 'upload' && (
          <FileUploader onParticipantsLoaded={handleParticipantsLoaded} />
        )}

        {currentStep === 'prizes' && (
          <PrizeManager 
            onPrizesLoaded={handlePrizesLoaded}
            participants={participants}
          />
        )}

        {currentStep === 'draw' && (
          <DrawingInterface 
            participants={participants}
            prizes={prizes}
            onReset={() => {
              setCurrentStep('upload')
              setParticipants([])
              setPrizes([])
            }}
          />
        )}
      </main>
    </div>
  )
}
