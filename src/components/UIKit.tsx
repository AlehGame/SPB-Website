import { ChevronDown, Phone, Send, Upload } from 'lucide'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'
import { InputField } from './ui/InputField'
import { MenuLink } from './ui/MenuLink'

// Витрина UI-компонентов: открывается по адресу /#ui-kit
export function UIKit() {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-page py-12">
      {(['fill', 'outline'] as const).map((variant) => (
        <section key={variant} className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">{variant === 'fill' ? 'Fill buttons' : 'Outline buttons'}</h2>
          <p className="text-sm text-body">Наведите курсор — hover, зажмите — pressed.</p>
          {(['sm', 'lg'] as const).map((size) => (
            <div key={size} className="flex flex-wrap items-center gap-6">
              <Button variant={variant} size={size} leftIcon={<Icon icon={Phone} />} rightIcon={<Icon icon={Send} />}>
                Button
              </Button>
              <Button variant={variant} size={size}>
                Без иконок
              </Button>
              <Button variant={variant} size={size} disabled leftIcon={<Icon icon={Phone} />} rightIcon={<Icon icon={Send} />}>
                Disabled
              </Button>
            </div>
          ))}
        </section>
      ))}

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Nav menu</h2>
        <div className="flex gap-6">
          <MenuLink href="#ui-kit">Для кого</MenuLink>
          <MenuLink href="#ui-kit" active>
            Для кого
          </MenuLink>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-card bg-black p-card">
        <h2 className="text-xl font-bold text-white">Input field</h2>
        <div className="grid max-w-[28rem] gap-4">
          <InputField label="Label" placeholder="Placeholder" helper="Helper text" leftIcon={<Icon icon={Upload} />} rightIcon={<Icon icon={ChevronDown} />} />
          <InputField label="Error" placeholder="Placeholder" helper="Helper text" error leftIcon={<Icon icon={Upload} />} rightIcon={<Icon icon={ChevronDown} />} />
          <InputField label="Disabled" placeholder="Placeholder" helper="Helper text" disabled leftIcon={<Icon icon={Upload} />} rightIcon={<Icon icon={ChevronDown} />} />
        </div>
      </section>
    </div>
  )
}
