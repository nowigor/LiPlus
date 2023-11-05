import { React, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import '../Styles/HorizontalSlider.css'

export default function HorizontalSlider({options, setValue}) {
  const [progress, setProgress] = useState(0)
  options = Array.from({ length: 9 }, (_, i) => i + 1)
  setValue = a => { }

  const set = v => {
    setProgress(v)
    setValue(Math.floor(v))
  }

  const index = progress => {
    progress *= options.length - 1
    
    if (progress < 0) set(0)
    else if (progress >= options.length) set(options.length - 1)
    else set(progress)
  }

  const _gradient = i => {
    const d = Math.abs(progress - i)
    console.log(`gradient(${i + 1})=${d} | ${Math.floor(progress)}`)
    return d >= 1 ? -1 : d
  }

  const _color_gradient = d => {
    const base = {
      r: 0,
      g: 0,
      b: 0
    }

    if (d === -1) {
      return `rgb(${base.r}, ${base.g}, ${base.b})`
    } else {
      const r = 32 - (32 - base.r) * d
      const g = 124 - (124 - base.g) * d
      const b = 231 - (231 - base.b) * d
      return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
    }
  }

  return (
    <Swiper
      slidesPerView='auto'
      centeredSlides={true}
      onProgress={(e, p) => index(p)}
    >
      {
        options.map((e, i) => {
          return <SwiperSlide
            key={i}
            style={{
              opacity: 1 - 0.2 * Math.abs(progress - i),
              color: `${Math.floor(progress) === i ? 'rgb(32, 124, 231)' : 'black'}`,
              fontWeight: `${Math.floor(progress) === i ? 'bold' : 'normal'}`,
            }}
          >
            {e}
          </SwiperSlide>
        })
      }
    </Swiper>
  )
}

