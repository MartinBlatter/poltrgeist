import { useEffect, createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { poltrgeist } from 'poltrgeist'
import type { HauntOptions } from 'poltrgeist'

const PoltrgeistContext = createContext<typeof poltrgeist | null>(null)

export function usePoltrgeistContext(): typeof poltrgeist {
  const ctx = useContext(PoltrgeistContext)
  if (!ctx) throw new Error('usePoltrgeistContext must be used inside <PoltrgeistProvider>')
  return ctx
}

interface Props {
  children: ReactNode
  options?: HauntOptions
}

export function PoltrgeistProvider({ children, options }: Props) {
  useEffect(() => {
    poltrgeist.haunt(options)
    return () => poltrgeist.release()
  }, [])

  return (
    <PoltrgeistContext.Provider value={poltrgeist}>
      {children}
    </PoltrgeistContext.Provider>
  )
}
