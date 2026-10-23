import { Hero } from './components/sections/Hero'
import { UIKit } from './components/UIKit'

export default function App() {
  if (window.location.hash === '#ui-kit') return <UIKit />

  return (
    <main>
      <Hero />
    </main>
  )
}
