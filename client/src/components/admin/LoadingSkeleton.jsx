import "./AdminFeedback.css";

const LoadingSkeleton = ({
  rows = 5,
  columns = 5,
  cards = false,
}) => {
  if (cards) {
    return (
      <div className="skeleton-card-grid">
        {Array.from({ length: columns }).map((_, index) => (
          <div
            className="skeleton-card"
            key={index}
          >
            <div className="skeleton skeleton-icon" />
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-value" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          className="skeleton-table-row"
          key={rowIndex}
        >
          {Array.from({ length: columns }).map(
            (_, columnIndex) => (
              <div
                className="skeleton skeleton-cell"
                key={columnIndex}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;