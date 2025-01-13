import { ReactNode } from 'react'

interface ChatLayoutProps {
  children: ReactNode
}

function ChatLayout({ children }: ChatLayoutProps) {
  return (
    
    <div>
      {children}
    </div>
  )
}

export default ChatLayout