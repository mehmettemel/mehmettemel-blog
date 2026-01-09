import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-primary font-semibold text-primary-foreground hover:bg-primary/90 active:bg-primary active:text-primary-foreground/70',
  secondary:
    'bg-secondary font-medium text-secondary-foreground hover:bg-secondary/80 active:bg-secondary active:text-secondary-foreground/60',
}

export function Button({ variant = 'primary', className, ...props }) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none disabled:opacity-50',
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
