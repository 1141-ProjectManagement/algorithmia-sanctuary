import React, { ReactNode, useState, useMemo, MouseEvent, CSSProperties } from 'react';

interface RippleState {
  key: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface RippleButtonProps {
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'hover' | 'ghost' | 'hoverborder';
  rippleColor?: string;
  rippleDuration?: number;
  hoverBaseColor?: string;
  hoverRippleColor?: string;
  hoverBorderEffectColor?: string;
  hoverBorderEffectThickness?: string;
}

const GRID_HOVER_NUM_COLS = 36;
const GRID_HOVER_NUM_ROWS = 12;
const GRID_HOVER_TOTAL_CELLS = GRID_HOVER_NUM_COLS * GRID_HOVER_NUM_ROWS;
const GRID_HOVER_RIPPLE_EFFECT_SIZE = "18.973665961em";

const hexToRgba = (hex: string, alpha: number): string => {
  let hexValue = hex.startsWith('#') ? hex.slice(1) : hex;
  if (hexValue.length === 3) {
    hexValue = hexValue.split('').map(char => char + char).join('');
  }
  const r = parseInt(hexValue.slice(0, 2), 16);
  const g = parseInt(hexValue.slice(2, 4), 16);
  const b = parseInt(hexValue.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const JS_RIPPLE_KEYFRAMES = `
  @keyframes js-ripple-animation {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }
  .animate-js-ripple-effect {
    animation: js-ripple-animation var(--ripple-duration) ease-out forwards;
  }
`;

export const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  onClick,
  className = '',
  disabled = false,
  variant = 'default',
  rippleColor: userProvidedRippleColor,
  rippleDuration = 600,
  hoverBaseColor = '#d4af37',
  hoverRippleColor: customHoverRippleColor,
  hoverBorderEffectColor = 'hsla(43, 74%, 53%, 0.47)',
  hoverBorderEffectThickness = '0.3em',
}) => {
  const [jsRipples, setJsRipples] = useState<RippleState[]>([]);

  const determinedJsRippleColor = useMemo(() => {
    if (userProvidedRippleColor) {
      return userProvidedRippleColor;
    }
    return 'var(--button-ripple-color, hsla(43, 74%, 53%, 0.3))';
  }, [userProvidedRippleColor]);

  const dynamicGridHoverStyles = useMemo(() => {
    let nthChildHoverRules = '';
    const cellDim = 0.25;
    const initialTopOffset = 0.125;
    const initialLeftOffset = 0.1875;
    const hoverEffectDuration = '0.9s';

    for (let r = 0; r < GRID_HOVER_NUM_ROWS; r++) {
      for (let c = 0; c < GRID_HOVER_NUM_COLS; c++) {
        const childIndex = r * GRID_HOVER_NUM_COLS + c + 1;
        const topPos = initialTopOffset + r * cellDim;
        const leftPos = initialLeftOffset + c * cellDim;

        if (variant === 'hover') {
          nthChildHoverRules += `
            .hover-variant-grid-cell:nth-child(${childIndex}):hover ~ .hover-variant-visual-ripple {
              top: ${topPos}em; left: ${leftPos}em;
              transition: width ${hoverEffectDuration} ease, height ${hoverEffectDuration} ease, top 0s linear, left 0s linear;
            }`;
        } else if (variant === 'hoverborder') {
          nthChildHoverRules += `
            .hoverborder-variant-grid-cell:nth-child(${childIndex}):hover ~ .hoverborder-variant-visual-ripple {
              top: ${topPos}em; left: ${leftPos}em;
              transition: width ${hoverEffectDuration} ease-out, height ${hoverEffectDuration} ease-out, top 0s linear, left 0s linear;
            }`;
        }
      }
    }

    if (variant === 'hover') {
      const actualHoverRippleColor = customHoverRippleColor
        ? customHoverRippleColor
        : hexToRgba(hoverBaseColor, 0.466);
      return `
        .hover-variant-visual-ripple {
          background-color: ${actualHoverRippleColor};
          transition: width ${hoverEffectDuration} ease, height ${hoverEffectDuration} ease, top 99999s linear, left 99999s linear;
        }
        .hover-variant-grid-cell:hover ~ .hover-variant-visual-ripple {
          width: ${GRID_HOVER_RIPPLE_EFFECT_SIZE}; height: ${GRID_HOVER_RIPPLE_EFFECT_SIZE};
        }
        ${nthChildHoverRules}
      `;
    } else if (variant === 'hoverborder') {
      return `
        .hoverborder-variant-ripple-container {
          padding: ${hoverBorderEffectThickness};
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }
        .hoverborder-variant-visual-ripple {
          background-color: ${hoverBorderEffectColor};
          transition: width ${hoverEffectDuration} ease-out, height ${hoverEffectDuration} ease-out, top 99999s linear, left 9999s linear;
        }
        .hoverborder-variant-grid-cell:hover ~ .hoverborder-variant-visual-ripple {
          width: ${GRID_HOVER_RIPPLE_EFFECT_SIZE}; height: ${GRID_HOVER_RIPPLE_EFFECT_SIZE};
        }
        ${nthChildHoverRules}
      `;
    }
    return '';
  }, [variant, hoverBaseColor, customHoverRippleColor, hoverBorderEffectColor, hoverBorderEffectThickness]);

  const createJsRipple = (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const newRipple: RippleState = { key: Date.now(), x, y, size, color: determinedJsRippleColor };
    setJsRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setJsRipples(currentRipples => currentRipples.filter(r => r.key !== newRipple.key));
    }, rippleDuration);
  };

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      createJsRipple(event);
      if (onClick) onClick(event);
    }
  };

  const jsRippleElements = (
    <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
      <style>{JS_RIPPLE_KEYFRAMES}</style>
      {jsRipples.map(ripple => (
        <span
          key={ripple.key}
          className="absolute rounded-full animate-js-ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: ripple.color,
            '--ripple-duration': `${rippleDuration}ms`,
          } as CSSProperties}
        />
      ))}
    </span>
  );

  if (variant === 'hover') {
    const hoverButtonFinalClassName = [
      "relative", "rounded-lg", "text-lg", "px-4", "py-2",
      "border-none", "bg-transparent", "isolate", "overflow-hidden", "cursor-pointer",
      disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
      className,
    ].filter(Boolean).join(" ");
    return (
      <>
        <style>{dynamicGridHoverStyles}</style>
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={hoverButtonFinalClassName}
        >
          {Array.from({ length: GRID_HOVER_TOTAL_CELLS }).map((_, i) => (
            <span key={i} className="hover-variant-grid-cell absolute w-[0.25em] h-[0.25em] z-[2]" style={{ top: `${0.125 + Math.floor(i / GRID_HOVER_NUM_COLS) * 0.25}em`, left: `${0.1875 + (i % GRID_HOVER_NUM_COLS) * 0.25}em` }} />
          ))}
          <span className="hover-variant-visual-ripple absolute w-0 h-0 rounded-full -translate-x-1/2 -translate-y-1/2 -z-[1]" />
          <span className="relative z-[1]">{children}</span>
          {jsRippleElements}
        </button>
      </>
    );
  }

  if (variant === 'hoverborder') {
    const hoverborderButtonFinalClassName = [
      "relative", "rounded-lg", "text-lg", "px-4", "py-2",
      "border-none", "bg-transparent", "isolate", "overflow-hidden", "cursor-pointer",
      disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
      className,
    ].filter(Boolean).join(" ");
    return (
      <>
        <style>{dynamicGridHoverStyles}</style>
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          className={hoverborderButtonFinalClassName}
        >
          <span className="hoverborder-variant-ripple-container absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
            {Array.from({ length: GRID_HOVER_TOTAL_CELLS }).map((_, i) => (
              <span key={i} className="hoverborder-variant-grid-cell absolute w-[0.25em] h-[0.25em] z-[2]" style={{ top: `${0.125 + Math.floor(i / GRID_HOVER_NUM_COLS) * 0.25}em`, left: `${0.1875 + (i % GRID_HOVER_NUM_COLS) * 0.25}em` }} />
            ))}
            <span className="hoverborder-variant-visual-ripple absolute w-0 h-0 rounded-full -translate-x-1/2 -translate-y-1/2 -z-[1]" />
          </span>
          <span className="relative z-[1]">{children}</span>
          {jsRippleElements}
        </button>
      </>
    );
  }

  if (variant === 'ghost') {
    const ghostButtonFinalClassName = [
      "relative", "rounded-lg", "text-lg", "px-4", "py-2",
      "border-none", "bg-transparent", "overflow-hidden", "cursor-pointer",
      disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
      className,
    ].filter(Boolean).join(" ");
    return (
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={ghostButtonFinalClassName}
      >
        <span className="relative z-[1]">{children}</span>
        {jsRippleElements}
      </button>
    );
  }

  // Default variant
  const defaultButtonFinalClassName = [
    "relative", "rounded-lg", "text-lg", "px-4", "py-2",
    "overflow-hidden", "cursor-pointer",
    disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
    className,
  ].filter(Boolean).join(" ");
  return (
    <button
      type="button"
      onClick={handleButtonClick}
      disabled={disabled}
      className={defaultButtonFinalClassName}
    >
      <span className="relative z-[1]">{children}</span>
      {jsRippleElements}
    </button>
  );
};
