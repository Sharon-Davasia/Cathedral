import { forwardRef } from 'react'
import { cn } from '../utils/cn'

const Select = forwardRef(({ className, error, children, ...props }, ref) => {
  return (
    <div className="space-y-1">
      <select
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm appearance-none cursor-pointer transition-all duration-200 custom-select',
          'hover:border-gray-400',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          className
        )}
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1em 1em',
          paddingRight: '2.5rem'
        }}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select

