import { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary' }

export default function Button({ className='', variant='primary', ...rest }: Props){
  const base = variant==='primary'
    ? 'bg-black text-white hover:bg-gray-900'
    : 'bg-white text-black border hover:bg-gray-50'
  return <button {...rest} className={`rounded px-4 py-2 ${base} ${className}`} />
}


