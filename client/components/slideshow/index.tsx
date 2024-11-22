import { Swiper, SwiperProps } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/free-mode";
import "./slideshow.css";

export default function SlideShow({
  className,
  speed = 5000,
  spaceBetween = 10,
  slidesPerView = 1,
  ...props
}: SwiperProps) {
  return (
    <Swiper
      {...props}
      className={`slideshow ${className}`}
      modules={[Autoplay, FreeMode]}
      speed={speed}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      direction={"horizontal"}
      autoplay={{ delay: 0, pauseOnMouseEnter: true }}
      loop
      freeMode
    />
  );
}
