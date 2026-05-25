import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Modal from '../../components/shared/Modal';

const defaultForm = { name: '', description: '', icon: '🥗', color: '#22c55e', isActive: true };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    try {
      const res = await api.get('/categories/all');
      setCategories(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '🥗', color: cat.color || '#22c55e', isActive: cat.isActive }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('กรุณากรอกชื่อหมวดหมู่'); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/categories/${editing._id}`, form);
        toast.success('แก้ไขหมวดหมู่สำเร็จ');
      } else {
        await api.post('/categories', form);
        toast.success('เพิ่มหมวดหมู่สำเร็จ');
      }
      setModalOpen(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบหมวดหมู่นี้?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('ลบหมวดหมู่สำเร็จ');
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  const icons = ['🥗', '🍎', '🥩', '🌾', '🥤', '🥜', '🥦', '🍊', '🥑', '🍋'];

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">จัดการหมวดหมู่</h1>
          <p className="text-gray-500 text-sm">{categories.length} หมวดหมู่</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> เพิ่มหมวดหมู่
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className={`bg-white rounded-2xl border p-4 flex items-center gap-4 ${!cat.isActive ? 'opacity-50' : 'border-gray-100'}`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none" style={{ backgroundColor: cat.color + '20' }}>
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800 truncate">{cat.name}</p>
                  {!cat.isActive && <span className="badge bg-red-100 text-red-600 text-xs">ปิดใช้งาน</span>}
                </div>
                {cat.description && <p className="text-xs text-gray-500 truncate">{cat.description}</p>}
              </div>
              <div className="flex gap-1 flex-none">
                <button onClick={() => openEdit(cat)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(cat._id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อหมวดหมู่ *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="ชื่อหมวดหมู่" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">คำอธิบาย</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={2} placeholder="คำอธิบายหมวดหมู่" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ไอคอน</label>
            <div className="flex flex-wrap gap-2">
              {icons.map(ic => (
                <button key={ic} type="button" onClick={() => setForm({ ...form, icon: ic })}
                  className={`w-10 h-10 text-xl rounded-xl border-2 transition-all ${form.icon === ic ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">สี</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
              <input value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="input-field w-32 font-mono text-sm" />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: form.color + '20' }}>{form.icon}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="catActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary-600" />
            <label htmlFor="catActive" className="text-sm text-gray-700">เปิดใช้งาน</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">ยกเลิก</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
