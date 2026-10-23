import { Header } from './components/sections/Header'
import { Hero } from './components/sections/Hero'
import { ScrollWords } from './components/sections/ScrollWords'
import { UIKit } from './components/UIKit'

export default function App() {
  if (window.location.hash === '#ui-kit') return <UIKit />

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ScrollWords />
      </main>
    </>
  )
}
