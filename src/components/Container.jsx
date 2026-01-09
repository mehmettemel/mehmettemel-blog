import { forwardRef } from 'react'
import clsx from 'clsx'

// Simple container like Rishi's - just horizontal padding and centering
export const Container = forwardRef(function Container(
  { className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx('mx-auto w-full px-6 sm:px-8', className)}
      {...props}
    >
      {children}
    </div>
  )
})

// Legacy exports for backwards compatibility
export const ContainerOuter = Container
export const ContainerInner = forwardRef(function InnerContainer(
  { children, ...props },
  ref,
) {
  return <div ref={ref} {...props}>{children}</div>
})
