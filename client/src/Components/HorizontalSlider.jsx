import {useState, React} from "react";
import { Swiper, SwiperSlide, } from 'swiper/react';
import { Virtual } from 'swiper/modules';
import "../Styles/HorizontalSlider.css"
import 'swiper/css';

const HorizontalSlider = () =>
{
    const [centeredSlide, setCenteredSlide] = useState(0);
    const slides = Array.from({ length: 10}).map(
      (el, index) => `${index + 1}`
    );
    const handleSlideChange = (swiper) => {
        setCenteredSlide(swiper.realIndex +1);
        // console.log(centeredSlide);
        console.log(swiper)
        // Add your custom logic here for the centered slide
      };
  return (
    <Swiper modules={[Virtual]} spaceBetween={50} slidesPerView={3} virtual onSlideChange={handleSlideChange} scrollbar={{ draggable: true }} className="horizontal-slider-wrapper">
      {slides.map((slideContent, index) => (
        <SwiperSlide key={slideContent} virtualIndex={index}>
        <div className={`slider-item ${centeredSlide === index  ? 'selected' : ''}`} >
        {slideContent}
        </div>
          
        </SwiperSlide>
      ))}
    </Swiper>
    )
}
export default HorizontalSlider