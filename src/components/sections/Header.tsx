import { Phone } from 'lucide'
import logo from '../../assets/icons/logo.svg'
import { Button } from '../ui/Button'
import { buttonClass } from '../ui/buttonClass'
import { Icon } from '../ui/Icon'
import { MenuLink } from '../ui/MenuLink'

const links = [
  { label: 'Для кого', href: '#audience' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'Как это делается', href: '#how-it-works' },
  { label: 'Цены', href: '#prices' },
  { label: 'Контакты', href: '#contacts' },
]

// Фиксированный header на всю ширину окна (без max-width)
export function Header() {
  return (
    <header className="fixed inset-x-page top-4 z-50 flex items-center justify-between gap-gap rounded-[88px] border border-line bg-bg-1/80 py-2 pr-2 pl-[22px] backdrop-blur-[10px]">
      <a href="#" aria-label="Cool Print — на главную" className="shrink-0">
        <img src={logo} alt="Cool Print" width={51} height={30} className="h-[30px] w-[51px]" />
      </a>

      <nav className="hidden items-center gap-2 lg:flex">
        {links.map(({ label, href }) => (
          <MenuLink key={href} href={href}>
            {label}
          </MenuLink>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button>Рассчитать</Button>
        <a href="tel:+79213633647" aria-label="+7 921 363 36 47" className={buttonClass('outline')}>
          <Icon icon={Phone} />
          <span className="hidden sm:inline">+7 921 363 36 47</span>
        </a>
      </div>
    </header>
  )
}
