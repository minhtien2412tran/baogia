import { CdnImage } from '../ui/CdnImage';

export function StepsTimeline({ steps }: { steps: { title: string; body: string; image?: string }[] }) {
  return (
    <div className="jb-steps">
      {steps.map((step, i) => (
        <div
          key={step.title}
          className={`jb-step-item jb-step-item--heritage${step.image ? '' : ' jb-step-item--compact'}`}
        >
          <div className="jb-step-num">{i + 1}</div>
          {step.image && (
            <div className="jb-step-img">
              <CdnImage src={step.image} alt="" width={200} height={140} className="jb-step-image" />
            </div>
          )}
          <div className="jb-step-content">
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
