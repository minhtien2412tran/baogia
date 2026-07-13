import type { Metadata } from 'next';
import {
  CONTRACT_MODULES,
  DEMO_ACCOUNTS,
  NEXT_ACTIONS,
  OUT_OF_SCOPE_NOW,
  OUTSIDE_74TR,
  OVERALL_PROGRESS_PCT,
  PHASES,
  REFERENCE_LINKS,
  REPORT_META,
  TECH_BENEFITS,
  VALUE_POINTS,
  statusLabel,
  type WorkStatus,
} from './progress-report';
import { ProgressReportEffects } from './ProgressReportEffects';
import './baocaotiendo.css';

export const metadata: Metadata = {
  title: 'JetVina Website – Báo cáo triển khai | minhtien.online',
  description:
    'Báo cáo tiến độ triển khai website JetVina (hợp đồng / mã nội bộ dự án JetBay) gửi Anh Tuấn Anh — lộ trình 4 tháng kể từ 09/07/2026.',
  robots: { index: false, follow: false },
};

function tone(status: WorkStatus) {
  return `pr-tone pr-tone--${status}`;
}

export default function BaoCaoTienDoPage() {
  return (
    <div className="pr-page">
      <div className="pr-bg" aria-hidden />
      <ProgressReportEffects />
      <header className="pr-hero">
        <div className="pr-hero__badge">
          <span className="pr-hero__route">SGN</span>
          <span className="pr-hero__dash" aria-hidden />
          <span className="pr-hero__plane-mini" aria-hidden>
            ✈
          </span>
          <span className="pr-hero__dash" aria-hidden />
          <span className="pr-hero__route">GO LIVE</span>
        </div>
        <p className="pr-eyebrow">Báo cáo tiến độ · Dành cho khách hàng</p>
        <h1 className="pr-title">JetVina Website – Báo cáo triển khai</h1>
        <p className="pr-lead">
          Kính gửi <strong>{REPORT_META.client}</strong>,
          <br />
          <br />
          Dự án (mã nội bộ / hợp đồng: JetBay → thương hiệu công khai JetVina) chính thức bắt đầu từ ngày{' '}
          <strong>{REPORT_META.startDate}</strong>, thực hiện trong khoảng{' '}
          <strong>{REPORT_META.plannedMonths} tháng ({REPORT_META.plannedWeeks} tuần)</strong> theo{' '}
          <a href={REPORT_META.quoteUrl} target="_blank" rel="noopener noreferrer">
            hợp đồng &amp; báo giá 74TR
          </a>
          . Đây là báo cáo tuần đầu (tuần {REPORT_META.currentWeek}/{REPORT_META.plannedWeeks}): chúng tôi
          tập trung dựng nền Backend và môi trường kiểm thử. Các phần Web hoàn thiện, CMS vận hành và
          thanh toán online vẫn theo lịch các tháng sau — báo cáo cố ý không ghi nhận vượt mốc để Anh
          theo dõi đúng nhịp hợp đồng.
        </p>
        <dl className="pr-meta">
          <div>
            <dt>Dự án</dt>
            <dd>{REPORT_META.project}</dd>
          </div>
          <div>
            <dt>Ngày bắt đầu</dt>
            <dd>{REPORT_META.startDate}</dd>
          </div>
          <div>
            <dt>Ngày báo cáo</dt>
            <dd>
              {REPORT_META.reportDate} · bản {REPORT_META.reportVersion}
            </dd>
          </div>
          <div>
            <dt>Đơn vị thực hiện</dt>
            <dd>{REPORT_META.vendor}</dd>
          </div>
        </dl>
      </header>

      <section className="pr-summary" aria-label="Tóm tắt tiến độ">
        <div className="pr-summary__card pr-summary__card--main">
          <p className="pr-summary__label">Tiến độ tổng thể theo lịch 4 tháng</p>
          <p className="pr-summary__pct">
            <span data-count-to={OVERALL_PROGRESS_PCT} data-count-suffix="%">
              0%
            </span>
          </p>
          <div
            className="pr-bar"
            data-pct={OVERALL_PROGRESS_PCT}
            role="progressbar"
            aria-valuenow={OVERALL_PROGRESS_PCT}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span className="pr-bar__fill" />
          </div>
          <p className="pr-summary__note">{REPORT_META.overallNote}</p>
        </div>
        <div className="pr-summary__stats">
          <article>
            <span>Tuần hiện tại</span>
            <strong>
              {REPORT_META.currentWeek}/{REPORT_META.plannedWeeks}
            </strong>
          </article>
          <article>
            <span>Giai đoạn đang làm</span>
            <strong>GĐ1</strong>
          </article>
          <article>
            <span>GĐ2 · GĐ3 · GĐ4</span>
            <strong>Chưa tới hạn</strong>
          </article>
          <article>
            <span>Phạm vi HĐ</span>
            <strong>74TR · 4 tháng</strong>
          </article>
        </div>
      </section>

      <nav className="pr-toc" aria-label="Mục lục">
        <a href="#contract">Theo hạng mục 74TR</a>
        <a href="#value">Hướng làm tuần đầu</a>
        <a href="#tech">Công nghệ đang dùng</a>
        <a href="#phases">Theo 4 giai đoạn</a>
        <a href="#outside">Ngoài gói 74TR</a>
        <a href="#backlog">Việc còn mở</a>
        <a href="#demo">Tài khoản xem thử</a>
        <a href="#next">Việc tuần tới</a>
        <a href="#links">Đường dẫn tham khảo</a>
      </nav>

      <section id="contract" className="pr-section">
        <h2>1. Các hạng mục trong gói 74TR — tình hình tuần đầu</h2>
        <p className="pr-section__intro">
          Dưới đây bám theo phần “74 triệu bao gồm những gì” trên trang báo giá. Phần trăm phản ánh mức
          độ <em>so với cả lộ trình 4 tháng</em>, không phải “đã xong gần hết”. Những hạng mục thuộc
          tháng 2–4 được giữ tỷ lệ thấp hoặc ghi nhận đang phát triển / chưa tới hạn.
        </p>
        <div className="pr-modules">
          {CONTRACT_MODULES.map((m) => (
            <article key={m.code} className="pr-module">
              <header className="pr-module__head">
                <div>
                  <p className="pr-module__code">
                    {m.code} · {m.in74tr ? 'Trong gói 74TR' : 'Ngoài gói'}
                  </p>
                  <h3>{m.name}</h3>
                  <p className="pr-module__quote">{m.quoteLine}</p>
                </div>
                <div className="pr-module__badge">
                  <span className={tone(m.status)}>{statusLabel(m.status)}</span>
                  <strong>
                    <span data-count-to={m.progressPct} data-count-suffix="%">
                      0%
                    </span>
                  </strong>
                </div>
              </header>
              <div className="pr-bar pr-bar--sm" data-pct={m.progressPct}>
                <span className="pr-bar__fill" />
              </div>
              <div className="pr-module__grid">
                <div>
                  <h4>Đã làm trong tuần đầu</h4>
                  <ul>
                    {m.doneHighlights.map((h) => (
                      <li key={h}>
                        <span className={tone(m.status === 'not_started' ? 'not_started' : 'partial')}>
                          ·
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Vì sao làm phần này trước</h4>
                  <p>{m.why}</p>
                  <h4>Anh được lợi gì</h4>
                  <p>{m.benefit}</p>
                  {m.pending ? (
                    <>
                      <h4>Phần còn lại / chưa tới hạn</h4>
                      <p className="pr-module__pending">{m.pending}</p>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="value" className="pr-section">
        <h2>2. Hướng làm trong tuần đầu — vì sao chọn cách này</h2>
        <div className="pr-value">
          {VALUE_POINTS.map((v) => (
            <article key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="tech" className="pr-section">
        <h2>3. Công nghệ đang dùng — nói ngắn gọn</h2>
        <p className="pr-section__intro">
          Không đi sâu thuật ngữ. Bảng dưới chỉ giúp Anh nắm: mỗi lớp kỹ thuật phục vụ việc gì trong
          dự án.
        </p>
        <div className="pr-table-wrap">
          <table className="pr-table">
            <thead>
              <tr>
                <th>Công nghệ</th>
                <th>Dùng để làm gì</th>
                <th>Giúp ích thế nào</th>
              </tr>
            </thead>
            <tbody>
              {TECH_BENEFITS.map((t) => (
                <tr key={t.tech}>
                  <td>
                    <strong>{t.tech}</strong>
                  </td>
                  <td>{t.role}</td>
                  <td>{t.helps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="phases" className="pr-section">
        <h2>4. Bốn giai đoạn hợp đồng — chỉ GĐ1 đang mở</h2>
        <p className="pr-section__intro">
          Mỗi giai đoạn khoảng 25% giá trị hợp đồng. Hiện tại chỉ Giai đoạn 1 đang triển khai. GĐ2–GĐ4
          có thể đã có khung xem trước, nhưng tỷ lệ hoàn thành cố ý giữ thấp vì chưa đến hạn nghiệm
          thu.
        </p>
        <div className="pr-phases">
          {PHASES.map((phase) => (
            <article key={phase.id} className="pr-phase" id={phase.id}>
              <header className="pr-phase__head">
                <div>
                  <p className="pr-phase__weeks">
                    {phase.weeks} · {phase.calendar} · {phase.contractPct}% HĐ
                  </p>
                  <h3>{phase.name}</h3>
                </div>
                <div className="pr-phase__badge">
                  <span className={tone(phase.status)}>{statusLabel(phase.status)}</span>
                  <strong>
                    <span data-count-to={phase.completionPct} data-count-suffix="%">
                      0%
                    </span>
                  </strong>
                </div>
              </header>
              <div className="pr-bar pr-bar--sm" data-pct={phase.completionPct}>
                <span className="pr-bar__fill" />
              </div>
              <p className="pr-phase__summary">{phase.summary}</p>

              {phase.done.length > 0 && (
                <div className="pr-block">
                  <h4>Việc đã làm</h4>
                  <ul>
                    {phase.done.map((item) => (
                      <li key={item.title}>
                        <span className={tone('done')}>✓</span>
                        <span>
                          {item.title}
                          {item.note ? <em> — {item.note}</em> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {phase.inProgress.length > 0 && (
                <div className="pr-block">
                  <h4>Đang phát triển</h4>
                  <ul>
                    {phase.inProgress.map((item) => (
                      <li key={item.title}>
                        <span className={tone('partial')}>◐</span>
                        <span>
                          {item.title}
                          {item.note ? <em> — {item.note}</em> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {phase.backlog.length > 0 && (
                <div className="pr-block">
                  <h4>Chưa tới hạn / còn lại</h4>
                  <ul>
                    {phase.backlog.map((item) => (
                      <li key={item.title}>
                        <span className={tone(item.status)}>○</span>
                        <span>
                          {item.title}
                          {item.note ? <em> — {item.note}</em> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {phase.deliverables.length > 0 && (
                <div className="pr-links-inline">
                  {phase.deliverables.map((d) => (
                    <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer">
                      {d.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="outside" className="pr-section">
        <h2>5. Việc không nằm trong 74TR</h2>
        <p className="pr-section__intro">
          Để tránh hiểu nhầm tiến độ: một số chi phí và hạng mục nằm ngoài số 74 triệu, dù kỹ thuật
          tích hợp có thể nằm trong hợp đồng.
        </p>
        <ul className="pr-backlog">
          {OUTSIDE_74TR.map((item) => (
            <li key={item.title}>
              <span className={tone('not_started')}>Ngoài gói</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="backlog" className="pr-section">
        <h2>6. Việc còn mở (ngắn gọn)</h2>
        <ul className="pr-backlog">
          {OUT_OF_SCOPE_NOW.map((item) => (
            <li key={item.title}>
              <span className={tone(item.status)}>{statusLabel(item.status)}</span>
              <div>
                <strong>{item.title}</strong>
                {item.note ? <p>{item.note}</p> : null}
              </div>
            </li>
          ))}
          {PHASES.map((p) =>
            [...p.inProgress, ...p.backlog].map((item) => (
              <li key={`${p.id}-${item.title}`}>
                <span className={tone(item.status)}>{statusLabel(item.status)}</span>
                <div>
                  <strong>
                    {p.id.toUpperCase()}: {item.title}
                  </strong>
                  {item.note ? <p>{item.note}</p> : null}
                </div>
              </li>
            )),
          )}
        </ul>
      </section>

      <section id="demo" className="pr-section">
        <h2>7. Tài khoản xem thử (môi trường đang phát triển)</h2>
        <p className="pr-section__intro">
          Anh có thể đăng nhập để xem khung hệ thống. Đây là bản đang làm, chưa phải bản nghiệm thu
          cuối từng giai đoạn.
        </p>
        <div className="pr-demo">
          {DEMO_ACCOUNTS.map((a) => (
            <article key={a.email}>
              <h3>{a.role}</h3>
              <p>
                <code>{a.email}</code> / <code>{a.password}</code>
              </p>
              <a href={a.url} target="_blank" rel="noopener noreferrer">
                Mở trang đăng nhập ↗
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="next" className="pr-section">
        <h2>8. Việc tuần tới &amp; phối hợp</h2>
        <div className="pr-next">
          {NEXT_ACTIONS.map((block) => (
            <article key={block.owner}>
              <h3>{block.owner}</h3>
              <ol>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section>

      <section id="links" className="pr-section">
        <h2>9. Đường dẫn tham khảo</h2>
        <div className="pr-ref-grid">
          {(['live', 'collateral'] as const).map((kind) => (
            <div key={kind} className="pr-ref-col">
              <h3>{kind === 'live' ? 'Hệ thống đang dựng' : 'Hợp đồng / báo giá'}</h3>
              <ul>
                {REFERENCE_LINKS.filter((l) => l.kind === kind).map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="pr-footer">
        <p>
          Trân trọng,
          <br />
          {REPORT_META.vendor}
          <br />
          Báo cáo bám lộ trình 4 tháng kể từ {REPORT_META.startDate}. Các tuần sau sẽ cập nhật tiếp trên
          cùng địa chỉ này.
        </p>
        <p className="pr-footer__path">
          Địa chỉ báo cáo: <code>https://www.minhtien.online/baocaotiendo</code>
          <br />
          Tham chiếu hợp đồng:{' '}
          <a href={REPORT_META.quoteUrl} target="_blank" rel="noopener noreferrer">
            m-tien.com/jet-bay
          </a>
        </p>
      </footer>
    </div>
  );
}
