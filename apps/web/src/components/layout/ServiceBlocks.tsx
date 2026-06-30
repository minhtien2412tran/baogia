import { CdnImage } from '../ui/CdnImage';

export function ServiceBlocks({
  items,
}: {
  items: { title: string; body: string; image: string }[];
}) {
  return (
    <div className="jb-service-blocks">
      {items.map((item, i) => (
        <article key={item.title} className={`jb-service-block${i % 2 === 1 ? ' reverse' : ''}`}>
          <div className="jb-service-block-visual">
            <CdnImage src={item.image} alt={item.title} width={560} height={360} className="jb-service-block-img" />
          </div>
          <div className="jb-service-block-body">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
