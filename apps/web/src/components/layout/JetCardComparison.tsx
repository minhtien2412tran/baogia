import { JB } from '../../config/jetbay-cdn';

export function JetCardComparison() {
  const rows = JB.pages.jetCard.comparison.rows;

  return (
    <div className="jb-compare-wrap">
      <h2 className="jb-section-title" style={{ textAlign: 'center', marginBottom: 24 }}>
        JetBay Jet Card vs On-Demand Charter
      </h2>
      <table className="jb-compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            <th>JetBay Jet Card</th>
            <th>On-Demand Charter</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([feature, jetCard, onDemand]) => (
            <tr key={feature}>
              <td>{feature}</td>
              <td>{jetCard}</td>
              <td>{onDemand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
