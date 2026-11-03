import { lazy, Suspense } from 'react'
import { Activity } from './components/sections/Activity'
import { Additional } from './components/sections/Additional'
import { ArtistPrinter } from './components/sections/ArtistPrinter'
import { Calculator } from './components/sections/Calculator'
import { Contact } from './components/sections/Contact'
import { Faqs } from './components/sections/Faqs'
import { Footer } from './components/sections/Footer'
import { Header } from './components/sections/Header'
import { Hero } from './components/sections/Hero'
import { HowItWorks } from './components/sections/HowItWorks'
import { Location } from './components/sections/Location'
import { Numbers } from './components/sections/Numbers'
import { Portfolio } from './components/sections/Portfolio'
import { Reviews } from './components/sections/Reviews'
import { ScrollWords } from './components/sections/ScrollWords'
import { useSmoothScroll } from './hooks/useSmoothScroll'

// Витрина UI-компонентов (/#ui-kit) доступна только в dev и не попадает в продакшен-сборку
const UIKit = import.meta.env.DEV
  ? lazy(() => import('./components/UIKit').then(({ UIKit }) => ({ default: UIKit })))
  : null

export default function App() {
  useSmoothScroll()

  if (UIKit && window.location.hash === '#ui-kit') {
    return (
      <Suspense>
        <UIKit />
      </Suspense>
    )
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Additional />
        <ScrollWords />
        <Activity />
        <ArtistPrinter />
        <Calculator />
        <HowItWorks />
        <Numbers />
        <Portfolio />
        <Reviews />
        <Faqs />
        <Location />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
