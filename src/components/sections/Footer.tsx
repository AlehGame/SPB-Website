import { ChevronUp, Phone } from 'lucide'
import brand from '../../assets/icons/brand.svg'
import { scrollToTop } from '../../hooks/useSmoothScroll'
import { Icon } from '../ui/Icon'

const PHONE = '+79213633647'

const socials = [
  { label: 'WhatsApp', href: `https://wa.me/${PHONE.slice(1)}` },
  { label: 'Telegram', href: 'https://t.me/paveeel_TyT' },
  { label: 'MAX', href: 'https://max.ru/u/f9LHodD0cOLF38emmcaQMGwXQ_AUTZwawdojh7I9Ti9Beb8DtxnuUTXUcXs' },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/pavel_cool_print?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw==',
  },
  { label: 'Вк', href: 'https://vk.ru/coolprintspb' },
]

const pill =
  'flex w-full items-center justify-center gap-2.5 rounded-[20px] border border-white p-2 text-sm leading-5 whitespace-nowrap text-white transition-colors hover:bg-white hover:text-black sm:inline-flex sm:w-auto sm:rounded-full sm:px-2 sm:py-1'

export function Footer() {
  return (
    <footer className="w-full bg-black py-8 text-white md:py-4">
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-page">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-gap">
          <a href={`tel:${PHONE}`} className={pill}>
            <Icon icon={Phone} className="size-4" />
            +7 9213633647
          </a>
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {socials.map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className={pill}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <img src={brand} alt="Cool Print" width={1200} height={150} className="aspect-[8/1] w-full" />

        <div className="flex flex-col items-center justify-between gap-6 border-t border-field pt-4 sm:flex-row sm:gap-gap">
          <p className="text-sm leading-5">© Cool Print, печать на стенах · Санкт-Петербург</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex cursor-pointer items-center gap-2 text-sm leading-5 transition-opacity hover:opacity-70"
          >
            <Icon icon={ChevronUp} className="size-6" />
            Наверх
          </button>
        </div>
      </div>
    </footer>
  )
}
