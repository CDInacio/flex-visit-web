import { useState, useEffect } from 'react'
import { Progress } from './progress'

export function GlobalProgressBar({ isLoading }: { isLoading: boolean }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setProgress(30)
      const timer = setTimeout(() => setProgress(100), 800)
      return () => clearTimeout(timer)
    } else {
      setProgress(0)
    }
  }, [isLoading])

  return (
    <div
      className={`fixed top-0 left-0 w-full h-10 bg-red-500 z-50 ${isLoading ? 'block' : 'hidden'}`}
    >
      <Progress value={10} className="w-full h-10 bg-primary" />
    </div>
  )
}
