import { useState } from 'react'
import './App.css'

function App() {

  // Basic render to avoid empty JSX
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">FlexiWork Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Tailwind v4 and shadcn/ui are configured.
        </p>
      </div>
    </div>
  )
}

export default App
