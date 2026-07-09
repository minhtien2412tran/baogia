'use client';

import { useCallback, useEffect, useState } from 'react';
import { SectionTitle, Muted, Button } from '@j-ta/ui';
import { AdminShell } from '../../../components/AdminShell';
import { AdminField, AdminPanel, ActionBtn } from '../../../components/AdminFormFields';
import { adminApi } from '../../../lib/api';

type Category = {
  id: number;
  code: string;
  label: string;
  maxPassengers: number;
  models?: Model[];
};

type Model = {
  id: number;
  manufacturer: string;
  model: string;
  categoryId: number;
  rangeKm?: number;
  speedKmh?: number;
  sleepCapacity?: number;
  category?: { code: string; label: string };
};

const emptyModel = (): Model & { isNew?: boolean } => ({
  id: 0,
  manufacturer: '',
  model: '',
  categoryId: 0,
  rangeKm: undefined,
  speedKmh: undefined,
  isNew: true,
});

export default function AircraftAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [modelForm, setModelForm] = useState<ReturnType<typeof emptyModel> | null>(null);
  const [catForm, setCatForm] = useState<{ id: number; code: string; label: string; maxPassengers: number } | null>(
    null,
  );

  const load = useCallback(() => {
    setLoading(true);
    adminApi
      .getAircraftCategories()
      .then((res) => setCategories((res.categories ?? []) as Category[]))
      .catch((e: Error) => setMsg(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveCategory() {
    if (!catForm) return;
    try {
      if (catForm.id) {
        await adminApi.updateAircraftCategory(catForm.id, catForm);
      } else {
        await adminApi.createAircraftCategory(catForm);
      }
      setCatForm(null);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    }
  }

  async function saveModel() {
    if (!modelForm) return;
    const body = {
      manufacturer: modelForm.manufacturer,
      model: modelForm.model,
      categoryId: modelForm.categoryId,
      rangeKm: modelForm.rangeKm,
      speedKmh: modelForm.speedKmh,
      sleepCapacity: modelForm.sleepCapacity,
    };
    try {
      if (modelForm.id) {
        await adminApi.updateAircraftModel(modelForm.id, body);
      } else {
        await adminApi.createAircraftModel(body);
      }
      setModelForm(null);
      load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    }
  }

  return (
    <AdminShell active="/dashboard/aircraft">
      <SectionTitle>Aircraft Fleet</SectionTitle>
      <Muted>Manage aircraft categories and models used in quote search and empty legs.</Muted>
      {msg && <p>{msg}</p>}
      {loading && <Muted>Loading…</Muted>}

      <div style={{ marginBottom: 16 }}>
        <Button type="button" onClick={() => setCatForm({ id: 0, code: '', label: '', maxPassengers: 8 })}>
          Add category
        </Button>
      </div>

      {!loading &&
        categories.map((cat) => (
          <div key={cat.id} style={{ marginBottom: 24, border: '1px solid #333', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>
                {cat.label} <code>({cat.code})</code> · max {cat.maxPassengers} pax
              </h3>
              <span>
                <ActionBtn onClick={() => setCatForm({ ...cat })}>Edit</ActionBtn>
                {' · '}
                <ActionBtn
                  variant="danger"
                  onClick={async () => {
                    if (!confirm('Delete category?')) return;
                    await adminApi.deleteAircraftCategory(cat.id);
                    load();
                  }}
                >
                  Delete
                </ActionBtn>
              </span>
            </div>
            <table style={{ width: '100%', marginTop: 12, fontSize: 14 }}>
              <thead>
                <tr>
                  <th align="left">Manufacturer</th>
                  <th align="left">Model</th>
                  <th align="left">Range km</th>
                  <th align="left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(cat.models ?? []).map((m) => (
                  <tr key={m.id}>
                    <td>{m.manufacturer}</td>
                    <td>{m.model}</td>
                    <td>{m.rangeKm ?? '—'}</td>
                    <td>
                      <ActionBtn onClick={() => setModelForm({ ...m, categoryId: cat.id })}>Edit</ActionBtn>
                      {' · '}
                      <ActionBtn
                        variant="danger"
                        onClick={async () => {
                          if (!confirm('Delete model?')) return;
                          await adminApi.deleteAircraftModel(m.id);
                          load();
                        }}
                      >
                        Delete
                      </ActionBtn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 8 }}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModelForm({ ...emptyModel(), categoryId: cat.id })}
              >
                Add model
              </Button>
            </div>
          </div>
        ))}

      {catForm && (
        <AdminPanel title={catForm.id ? 'Edit category' : 'New category'} onClose={() => setCatForm(null)}>
          <AdminField label="Code" value={catForm.code} onChange={(v) => setCatForm({ ...catForm, code: v })} />
          <AdminField label="Label" value={catForm.label} onChange={(v) => setCatForm({ ...catForm, label: v })} />
          <AdminField
            label="Max passengers"
            value={String(catForm.maxPassengers)}
            onChange={(v) => setCatForm({ ...catForm, maxPassengers: Number(v) || 8 })}
          />
          <Button type="button" onClick={saveCategory}>
            Save category
          </Button>
        </AdminPanel>
      )}

      {modelForm && (
        <AdminPanel title={modelForm.id ? 'Edit model' : 'New model'} onClose={() => setModelForm(null)}>
          <AdminField
            label="Manufacturer"
            value={modelForm.manufacturer}
            onChange={(v) => setModelForm({ ...modelForm, manufacturer: v })}
          />
          <AdminField label="Model" value={modelForm.model} onChange={(v) => setModelForm({ ...modelForm, model: v })} />
          <AdminField
            label="Range (km)"
            value={String(modelForm.rangeKm ?? '')}
            onChange={(v) => setModelForm({ ...modelForm, rangeKm: v ? Number(v) : undefined })}
          />
          <AdminField
            label="Speed (km/h)"
            value={String(modelForm.speedKmh ?? '')}
            onChange={(v) => setModelForm({ ...modelForm, speedKmh: v ? Number(v) : undefined })}
          />
          <Button type="button" onClick={saveModel}>
            Save model
          </Button>
        </AdminPanel>
      )}
    </AdminShell>
  );
}
