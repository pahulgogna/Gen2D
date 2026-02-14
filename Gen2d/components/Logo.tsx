import { SquarePlay } from 'lucide-react'

function Logo({className, size} : {className?: string, size?: number}) {
    return (
        <div className={"flex text-cyan-400 gap-1 justify-center min-h-max " + className}>
            <div className='flex flex-col justify-center'>
                <SquarePlay size={size || 20} />
            </div>
            Gen2D
        </div>
    )
}

export default Logo