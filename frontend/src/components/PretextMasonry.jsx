import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { prepare, layout } from '@chenglou/pretext';
import { formatMoney } from '../utils/money';
import { PlusIcon } from './icons';
import '../styles/PretextMasonry.css';

// Constants for height prediction
const NAME_FONT = 'bold 16px Inter, sans-serif';
const DESC_FONT = '13px Inter, sans-serif';
const CARD_PADDING = 16;
const IMAGE_HEIGHT = 160;
const PLACEHOLDER_HEIGHT = 120;
const BUTTON_HEIGHT = 40;
const GAP = 16;
const NAME_LINE_HEIGHT = 22;
const DESC_LINE_HEIGHT = 19;

const PretextMasonry = ({ items, onAddToCart, columnCount = 2 }) => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Observe container width
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setContainerWidth(el.clientWidth);

    // Trigger mount animation
    requestAnimationFrame(() => setMounted(true));

    return () => observer.disconnect();
  }, []);

  // Calculate card width
  const cardWidth = useMemo(() => {
    if (!containerWidth) return 0;
    return (containerWidth - GAP * (columnCount - 1)) / columnCount;
  }, [containerWidth, columnCount]);

  // Predict card heights using Pretext
  const cardLayouts = useMemo(() => {
    if (!cardWidth || cardWidth <= 0) return [];

    const textWidth = cardWidth - CARD_PADDING * 2;

    return items.map(item => {
      let textHeight = 0;

      // Measure item name height
      try {
        const namePrepared = prepare(item.name || 'Menu Item', NAME_FONT);
        const nameResult = layout(namePrepared, textWidth - 70, NAME_LINE_HEIGHT); // 70px for price
        textHeight += nameResult.height;
      } catch {
        textHeight += NAME_LINE_HEIGHT;
      }

      // Measure description height
      if (item.description) {
        try {
          const descPrepared = prepare(item.description, DESC_FONT);
          const descResult = layout(descPrepared, textWidth, DESC_LINE_HEIGHT);
          textHeight += descResult.height + 6; // 6px gap
        } catch {
          textHeight += DESC_LINE_HEIGHT * 2;
        }
      }

      const imgH = item.image_url ? IMAGE_HEIGHT : PLACEHOLDER_HEIGHT;
      const totalHeight = imgH + CARD_PADDING + textHeight + 10 + BUTTON_HEIGHT + CARD_PADDING;

      return {
        item,
        height: totalHeight,
      };
    });
  }, [items, cardWidth]);

  // Position cards in masonry columns
  const positionedCards = useMemo(() => {
    if (!cardLayouts.length || !cardWidth) return [];

    const colHeights = Array(columnCount).fill(0);
    const positioned = [];

    for (const { item, height } of cardLayouts) {
      // Find shortest column
      let minCol = 0;
      for (let c = 1; c < columnCount; c++) {
        if (colHeights[c] < colHeights[minCol]) minCol = c;
      }

      const x = minCol * (cardWidth + GAP);
      const y = colHeights[minCol];

      positioned.push({ item, height, x, y, col: minCol });
      colHeights[minCol] += height + GAP;
    }

    return positioned;
  }, [cardLayouts, cardWidth, columnCount]);

  // Total container height
  const totalHeight = useMemo(() => {
    if (!positionedCards.length) return 0;
    return Math.max(...positionedCards.map(c => c.y + c.height)) + GAP;
  }, [positionedCards]);

  return (
    <div className="pretext-masonry" ref={containerRef}>
      <div className="pretext-masonry-inner" style={{ height: totalHeight }}>
        {positionedCards.map(({ item, height, x, y, col }, idx) => (
          <div
            key={item.id}
            className={`pm-card ${mounted ? 'pm-card-visible' : ''}`}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: cardWidth,
              height,
              transitionDelay: `${idx * 50}ms`,
            }}
          >
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="pm-card-img" />
            ) : (
              <div className="pm-card-placeholder">🍽️</div>
            )}
            <div className="pm-card-body">
              <div className="pm-card-row">
                <h3 className="pm-card-name">{item.name}</h3>
                <span className="pm-card-price">{formatMoney(item.price)}</span>
              </div>
              {item.description && (
                <p className="pm-card-desc">{item.description}</p>
              )}
              <button className="pm-card-add" onClick={() => onAddToCart(item)}>
                <PlusIcon size={14} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="pm-empty">No items found in this category.</p>
      )}
    </div>
  );
};

export default PretextMasonry;
