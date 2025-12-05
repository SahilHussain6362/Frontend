import clsx from 'clsx'
import { motion } from 'framer-motion'
import audioService from '../../services/audioService'

export default function Button({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false, ...props }) {
    const base = 'font-display font-bold rounded-lg transition-all duration-200 cursor-pointer'
    const variants = {
        primary: 'bg-neon-purple text-white hover:shadow-lg neon-glow',
        secondary: 'bg-dark-surface border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-dark-bg',
        ghost: 'text-neon-cyan border border-neon-cyan hover:bg-neon-cyan/10'
    }
    const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-6 py-2.5 text-base', lg: 'px-8 py-3 text-lg' }

    const handleClick = (e) => { if (!disabled) { audioService.play('click'); onClick?.(e) } }

    return (
        <motion.button whileHover={{ scale: disabled ? 1 : 1.03 }} whileTap={{ scale: disabled ? 1 : 0.97 }}
            className={clsx(base, variants[variant], sizes[size], disabled && 'opacity-50 cursor-not-allowed', className)}
            onClick={handleClick} disabled={disabled} {...props}
        >
            {children}
        </motion.button>
    )
}
