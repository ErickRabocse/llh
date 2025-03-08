import gsap from 'gsap'
import { useEffect } from 'react'
import './MorphingBackground.css' // Ensure the CSS file exists

const MorphingBackground = () => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'
    script.async = true
    script.onload = () => {
      gsap.to('.morphing-bg', {
        duration: 10,
        background:
          'linear-gradient(270deg, #ff6b6b,rgb(103, 166, 233), #4ecdc4)',
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      })
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return <div className="morphing-bg"></div>
}

export default MorphingBackground
