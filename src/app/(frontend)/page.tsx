import HeroClient from './HeroClient'
import HomePage from './home/page'

export const metadata = {
  title: 'Neo-One | Uncensored Art Hub',
  description: 'The uncensored hub of Neo-One art and drops.',
}

// Rendiamo la pagina root il nodo che ospita ENTRAMBI gli strati
export default async function IndexPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* HomePage caricata sotto (Layer 0) */}
      <HomePage />
      
      {/* HeroPage sovrapposta (Layer 1) - svanirà al click */}
      <div className="absolute inset-0 z-50 pointer-events-auto">
         <HeroClient />
      </div>
    </div>
  )
}
