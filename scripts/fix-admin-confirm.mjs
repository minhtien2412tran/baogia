import fs from 'node:fs';

const files = [
  'apps/admin/src/app/dashboard/content/videos/page.tsx',
  'apps/admin/src/app/dashboard/empty-legs/page.tsx',
  'apps/admin/src/app/dashboard/fixed-price/page.tsx',
  'apps/admin/src/app/dashboard/jet-card/page.tsx',
  'apps/admin/src/app/dashboard/travel-credits/page.tsx',
];

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace('}, [remove]);', '}, []);');
  s = s.replace('}, [review]);', '}, []);');
  if (!s.includes('pendingDelete')) {
    s = s.replace(
      /const \[msg, setMsg\] = useState\(''\);/,
      "const [msg, setMsg] = useState('');\n  const [pendingDelete, setPendingDelete] = useState<number | string | null>(null);",
    );
  }
  s = s.replace(/onClick=\{\(\) => remove\(([^}]+)\)\}/g, 'onClick={() => setPendingDelete($1)}');

  // Ensure ConfirmDialog import
  if (!s.includes('ConfirmDialog')) {
    s = s.replace(
      /from '(\.\.\/)+components\/AdminFormFields';/,
      (m) => m.replace("AdminFormFields';", "AdminFormFields';").replace(
        /\{([^}]+)\}/,
        (_m2, inner) => `{${inner.includes('ConfirmDialog') ? inner : `${inner}, ConfirmDialog`}}`,
      ),
    );
  }

  // Replace confirm()-based remove body usage: keep async remove for ConfirmDialog onConfirm
  if (!s.includes('<ConfirmDialog')) {
    s = s.replace(
      /<\/AdminShell>/,
      `      <ConfirmDialog
        open={pendingDelete != null}
        title="Confirm delete"
        message="Delete this item? This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const id = pendingDelete;
          setPendingDelete(null);
          if (id != null) void remove(id as never);
        }}
      />
    </AdminShell>`,
    );
  }

  // remove() should not call confirm anymore
  s = s.replace(/if \(!confirm\([^)]*\)\) return;\s*/g, '');

  fs.writeFileSync(f, s);
  console.log('ok', f);
}

// partners: just revert deps
{
  const f = 'apps/admin/src/app/dashboard/partners/page.tsx';
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace('}, [review]);', '}, []);');
  // store actions outside load — use pendingReview state
  if (!s.includes('pendingReview')) {
    s = s.replace(
      /const \[msg, setMsg\] = useState\(''\);/,
      "const [msg, setMsg] = useState('');\n  const [pendingReview, setPendingReview] = useState<{ id: number; status: string } | null>(null);",
    );
  }
  s = s.replace(
    /onClick=\{\(\) => review\(([^,]+), 'APPROVED'\)\}/g,
    "onClick={() => setPendingReview({ id: $1, status: 'APPROVED' })}",
  );
  s = s.replace(
    /onClick=\{\(\) => review\(([^,]+), 'REJECTED'\)\}/g,
    "onClick={() => setPendingReview({ id: $1, status: 'REJECTED' })}",
  );
  if (!s.includes('ConfirmDialog')) {
    s = s.replace(/\{([^}]+)\} from '(\.\.\/)+components\/AdminFormFields';/, (m) =>
      m.includes('ConfirmDialog') ? m : m.replace('{', '{ ConfirmDialog, '),
    );
  }
  if (!s.includes('<ConfirmDialog')) {
    s = s.replace(
      /<\/AdminShell>/,
      `      <ConfirmDialog
        open={pendingReview != null}
        title="Confirm review"
        message={pendingReview ? \`Mark application #\${pendingReview.id} as \${pendingReview.status}?\` : ''}
        confirmLabel="Confirm"
        onCancel={() => setPendingReview(null)}
        onConfirm={() => {
          const p = pendingReview;
          setPendingReview(null);
          if (p) void review(p.id, p.status);
        }}
      />
    </AdminShell>`,
    );
  }
  fs.writeFileSync(f, s);
  console.log('ok partners');
}
