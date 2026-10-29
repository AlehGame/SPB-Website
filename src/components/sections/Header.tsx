import { useCallback, useState } from 'react'
import { Menu, Phone } from 'lucide'
import logo from '../../assets/icons/logo.svg'
import { useActiveSection } from '../../hooks/useActiveSection'
import { buttonClass } from '../ui/buttonClass'
import { Icon } from '../ui/Icon'
import { MenuLink } from '../ui/MenuLink'
import { MobileMenu } from './MobileMenu'

const links = [
  { label: 'Для кого', href: '#audience' },
  { label: 'Кейсы', href: '#cases' },
  { label: 'Как это делается', href: '#how-it-works' },
  { label: 'Цены', href: '#prices' },
  { label: 'Контакты', href: '#contacts' },
]

const sectionIds = links.map(({ href }) => href.slice(1))

// Фиксированный header на всю ширину окна (без max-width)
export function Header() {
  const activeId = useActiveSection(sectionIds)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header className="fixed inset-x-page top-3.25 z-50 flex items-center justify-between gap-gap rounded-full border border-line bg-bg-1/80 py-2 pr-2 pl-5.5 backdrop-blur-[10px] md:top-4">
        <a href="#" aria-label="Cool Print — на главную" className="shrink-0">
          <img src={logo} alt="Cool Print" width={51} height={30} className="h-7.5 w-12.75" />
        </a>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map(({ label, href }) => (
            <MenuLink key={href} href={href} active={href === `#${activeId}`}>
              {label}
            </MenuLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-2">
          <a href="#prices" className={buttonClass()}>
            Рассчитать
          </a>
          <a href="tel:+79213633647" className={`${buttonClass('outline')} max-md:hidden`}>
            <Icon icon={Phone} />
            +7 921 363 36 47
          </a>
          <button
            type="button"
            aria-label="Открыть меню"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-black text-black md:hidden"
          >
            <Icon icon={Menu} className="size-6" />
          </button>
        </div>
      </header>
      {/* Вне header: у него backdrop-filter, из-за которого fixed-потомок прилип бы к нему */}
      <MobileMenu open={menuOpen} links={links} onClose={closeMenu} />
    </>
  )
}
