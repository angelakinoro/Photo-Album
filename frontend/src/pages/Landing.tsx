import { Button } from '../components/ui/button'
import { ArrowRight, Images} from 'lucide-react'
import camera from '../assets/camera.jpg'

const Landing = () => {
  return (
    <div className='relative min-h-screen bg-cover bg-center'
        style={{ backgroundImage: `url(${camera})`}}
    >
        <div className='absolute inset-0 bg-black/55'></div>

        {/*Header*/}
        <header className='relative container mx-auto px-4 py-6'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2 ml-10'>
                    <Images className='h-8 w-8 text-slate-50'/>
                    <span className='text-2xl font-bold text-slate-50'>PhotoAlbums</span>
                </div>
            </div>
        </header>
        
        {/* Hero Section */}
        <main className='relative container mx-auto px-4'>
            <div className='flex flex-col items-center justify-center text-center min-h-screen max-w-4xl mx-auto'>
                <div className='mb-8'>
                    <h1 className='text-5xl md:text-6xl font-bold text-slate-50 mb-6 leading-tight'>Your Photos,{' '}
                        <span className='bg-gradient-to-r from-blue-500 to-purple-300 bg-clip-text text-transparent'>Beautifully Organized</span>
                    </h1>
                    <p className='text-xl text-slate-50 max-w-2xl mx-auto leading-relaxed'>
                    Browse users, explore their photo albums, and share amazing memories.
                    A seamless experience for managing and viewing photo collections
                    </p>
                </div>

                {/*CTA Button*/}
                <div className='mb-16'>
                    <Button size="lg" className='px-8 py-4 text-lg rounded-lg bg-blue-600 hover:bg-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl group' >
                        <a href="/login" className='flex items-center space-x-2'>
                            <span>Get Started</span>
                            <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform'/>
                        </a>
                    </Button>

                </div>
            </div>    
        </main>
    </div>
  )
}

export default Landing