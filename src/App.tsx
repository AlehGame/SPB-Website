import { Activity } from './components/sections/Activity'
import { Header } from './components/sections/Header'
import { Hero } from './components/sections/Hero'
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
      </main>
    </>
  )
}
