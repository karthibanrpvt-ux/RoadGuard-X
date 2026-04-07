import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const outlineX = useSpring(mouseX, { damping: 35, stiffness: 150 });
  const outlineY = useSpring(mouseY, { damping: 35, stiffness: 150 });

  const [isHovering, setIsHovering] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, input, label, .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isClicked ? 0.8 : isHovering ? 1.5 : 1,
        }}
      />
      <motion.div
        className="custom-cursor-outline"
        style={{
          x: outlineX,
          y: outlineY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isClicked ? 1.2 : isHovering ? 1.8 : 1,
          rotate: isHovering ? 90 : 0,
        }}
      >
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-8 text-[8px] font-black text-cyan-500 uppercase tracking-[0.2em] whitespace-nowrap"
          >
            Interact
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

export default CustomCursor;
