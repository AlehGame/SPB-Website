import { Activity } from './components/sections/Activity'
import { ArtistPrinter } from './components/sections/ArtistPrinter'
import { Calculator } from './components/sections/Calculator'
import { Header } from './components/sections/Header'
import { Hero } from './components/sections/Hero'
import { HowItWorks } from './components/sections/HowItWorks'
import { Numbers } from './components/sections/Numbers'
import { Portfolio } from './components/sections/Portfolio'
import { Reviews } from './components/sections/Reviews'
import { ScrollWords } from './components/sections/ScrollWords'
import { UIKit } from './components/UIKit'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  if (window.location.hash === '#ui-kit') return <UIKit />

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollWords />
        <Activity />
        <ArtistPrinter />
        <Calculator />
        <HowItWorks />
        <Numbers />
        <Portfolio />
        <Reviews />
      </main>
    </>
  )
}
