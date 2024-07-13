import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CanvasContainer from "../CanvasContainer/CanvasContainer";

import { ACTIONS, CONFIG, ICONS, STYLE } from "./ImageViewer.constant";
import "./ImageViewer.css";

const ImageViewer = ({ content, actions, components, icons, style }) => {
  const { onLoad, onClose, onZoomIn, onZoomOut, onRotate } = actions;
  const { height, width } = style;
  const { PrevArrow, NextArrow } = components;

  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const { title } = content[activeSlide];

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
    onZoomIn();
  };
  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));
    onZoomOut();
  };
  const handleRotate = () => {
    setRotation((prevRotation) => prevRotation - 90);
    onRotate();
  };

  const resetImage = () => {
    setScale(1);
    setRotation(0);
  };

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      resetImage();
      setActiveSlide(next);
    },
    nextArrow: NextArrow,
    prevArrow: PrevArrow,
  };

  useEffect(() => {
    onLoad();
    return () => {
      onClose();
    };
  }, []);

  return (
    <div
      className="imageViewerContainer"
      style={{ height: height, width: width }}
    >
      <div className="header">
        <h3>{title}</h3>
      </div>

      <div className="carouselContainer">
        <div className="sliderContainer">
          <Slider
            {...CONFIG}
            beforeChange={(current, next) => {
              resetImage();
              setActiveSlide(next);
            }}
            nextArrow={NextArrow}
            prevArrow={PrevArrow}
          >
            {content.map((item) => (
              <div key={item.url}>
                <CanvasContainer
                  imageSrc={item.url}
                  scale={scale}
                  rotation={rotation}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>

      <div className="footer">
        <button onClick={handleZoomIn}>
          <img className="icon" src={icons.zoomIn} />
        </button>
        <button onClick={handleRotate}>
          <img className="icon" src={icons.rotate} />{" "}
        </button>
        <button onClick={handleZoomOut}>
          <img className="icon" src={icons.zoomOut} />
        </button>
      </div>
    </div>
  );
};

function SampleArrow(props) {
  const { className, onClick, arrowIcon } = props;
  return (
    <div onClick={onClick} className={className}>
      <img className="icon" src={arrowIcon} />
    </div>
  );
}

ImageViewer.defaultProps = {
  content: [],
  actions: ACTIONS,
  icons: ICONS,
  components: {
    PrevArrow: <SampleArrow arrowIcon={ICONS.prevArrow} />,
    NextArrow: <SampleArrow arrowIcon={ICONS.nextArrow} />,
  },
  style: STYLE,
};

export default ImageViewer;
