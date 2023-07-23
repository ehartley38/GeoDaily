type ResultsSummaryProps = {
  distance: number;
};

export const ResultsSummary = ({ distance }: ResultsSummaryProps) => {
  return (
    <div className="content-center z-30">
      <h1>Distance: {distance} meters</h1>
    </div>
  );
};
