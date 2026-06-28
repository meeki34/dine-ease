const PretextOrderBubble = ({ children, order, completedItems = new Set() }) => {
  const totalItems = order?.OrderItems?.length || 0;
  const completedCount = order?.OrderItems?.reduce((count, _, idx) => {
    return count + (completedItems.has(`${order.id}-${idx}`) ? 1 : 0);
  }, 0) || 0;
  const progressPct = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  return (
    <div
      className="pretext-bubble-wrapper"
      style={{
        position: 'relative',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '18px',
      }}
    >
      {progressPct > 0 && progressPct < 100 && (
        <div
          className="pretext-bubble-progress"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '3px',
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #f48c25, #2ed573)',
            borderRadius: '3px 0 0 0',
            transition: 'width 0.5s ease',
            zIndex: 2,
          }}
        />
      )}
      {children}
    </div>
  );
};

export default PretextOrderBubble;
