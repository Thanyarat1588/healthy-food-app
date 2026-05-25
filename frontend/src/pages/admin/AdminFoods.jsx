import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Modal from '../../components/shared/Modal';

const defaultForm = {
  name: '', nameTh: '', description: '', category: '',
  servingSize: '100g', preparationTime: 0, difficulty: 'easy',
  nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
  ingredients: [], healthBenefits: [], tags: [], isActive: true
};

export default function AdminFoods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  // temp input state for arrays
  const [tempIngredient, setTempIngredient] = useState('');
  const [tempBenefit, setTempBenefit] = useState('');
  const [tempTag, setTempTag] = useState('');

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set('search', search);
      // fetch all including inactive for admin
      const res = await api.get(`/foods?${params}`);
      setFoods(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data || []));
  }, []);

  useEffect(() => { fetchFoods(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchFoods(); };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...defaultForm, category: categories[0]?._id || '' });
    setImageFile(null); setImagePreview('');
    setTempIngredient(''); setTempBenefit(''); setTempTag('');
    setModalOpen(true);
  };

  const openEdit = (food) => {
    setEditing(food);
    setForm({
      name: food.name || '', nameTh: food.nameTh || '',
      description: food.description || '', category: food.category?._id || '',
      servingSize: food.servingSize || '100g', preparationTime: food.preparationTime || 0,
      difficulty: food.difficulty || 'easy',
      nutrition: { ...defaultForm.nutrition, ...food.nutrition },
      ingredients: food.ingredients || [], healthBenefits: food.healthBenefits || [],
      tags: food.tags || [], isActive: food.isActive !== false
    });
    setImageFile(null);
    setImagePreview(food.image || '');
    setTempIngredient(''); setTempBenefit(''); setTempTag('');
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const addToArray = (field, value, setter) => {
    if (!value.trim()) return;
    setForm(f => ({ ...f, [field]: [...f[field], value.trim()] }));
    setter('');
  };

  const removeFromArray = (field, idx) => {
    setForm(f => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.category) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็น'); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('nameTh', form.nameTh);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('servingSize', form.servingSize);
      fd.append('preparationTime', form.preparationTime);
      fd.append('difficulty', form.difficulty);
      fd.append('isActive', form.isActive);
      fd.append('nutrition', JSON.stringify(form.nutrition));
      fd.append('ingredients', JSON.stringify(form.ingredients));
      fd.append('healthBenefits', JSON.stringify(form.healthBenefits));
      fd.append('tags', JSON.stringify(form.tags));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await api.put(`/foods/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('แก้ไขข้อมูลอาหารสำเร็จ');
      } else {
        await api.post('/foods', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('เพิ่มเมนูอาหารสำเร็จ');
      }
      setModalOpen(false);
      fetchFoods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('ยืนยันการลบเมนูอาหารนี้?')) return;
    try {
      await api.delete(`/foods/${id}`);
      toast.success('ลบเมนูอาหารสำเร็จ');
      fetchFoods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">จัดการเมนูอาหาร</h1>
          <p className="text-gray-500 text-sm">ทั้งหมด {pagination.total || 0} รายการ</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} /> เพิ่มเมนูอาหาร
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="ค้นหาเมนูอาหาร..." />
        </div>
        <button type="submit" className="btn-primary text-sm px-4">ค้นหา</button>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">อาหาร</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">หมวดหมู่</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">แคลอรี</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">สถานะ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : foods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">ไม่พบข้อมูล</td>
                </tr>
              ) : foods.map(food => (
                <tr key={food._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary-50 flex-none flex items-center justify-center">
                        {food.image ? (
                          <img src={food.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">{food.category?.icon || '🥗'}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{food.nameTh || food.name}</p>
                        {food.nameTh && <p className="text-xs text-gray-400">{food.name}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {food.category && (
                      <span className="badge text-xs" style={{ backgroundColor: food.category.color + '20', color: food.category.color }}>
                        {food.category.icon} {food.category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                    {food.nutrition?.calories || 0} kcal
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${food.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {food.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(food)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(food._id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50">← ก่อนหน้า</button>
            <span className="flex items-center px-3 text-xs text-gray-500">หน้า {page}/{pagination.pages}</span>
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50">ถัดไป →</button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'แก้ไขเมนูอาหาร' : 'เพิ่มเมนูอาหาร'} size="xl">
        <div className="space-y-5">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพ</label>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center flex-none">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                ) : <Upload size={24} className="text-gray-300" />}
              </div>
              <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-400 cursor-pointer transition-colors">
                <Upload size={18} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">คลิกเพื่ออัปโหลด</span>
                <span className="text-xs text-gray-400">PNG, JPG, WEBP (สูงสุด 5MB)</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อภาษาไทย</label>
              <input value={form.nameTh} onChange={e => setForm({ ...form, nameTh: e.target.value })} className="input-field" placeholder="ชื่ออาหาร (ไทย)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ชื่อภาษาอังกฤษ *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Food name (English)" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">คำอธิบาย *</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field resize-none" rows={3} placeholder="คำอธิบายอาหาร..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">หมวดหมู่ *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                <option value="">-- เลือกหมวดหมู่ --</option>
                {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">ระดับความยาก</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="input-field">
                <option value="easy">ง่าย</option>
                <option value="medium">ปานกลาง</option>
                <option value="hard">ยาก</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">เวลาเตรียม (นาที)</label>
              <input type="number" value={form.preparationTime} onChange={e => setForm({ ...form, preparationTime: parseInt(e.target.value) || 0 })} className="input-field" min={0} />
            </div>
          </div>

          {/* Nutrition */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">คุณค่าทางโภชนาการ</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: 'calories', label: 'แคลอรี (kcal)' },
                { key: 'protein', label: 'โปรตีน (g)' },
                { key: 'carbs', label: 'คาร์บ (g)' },
                { key: 'fat', label: 'ไขมัน (g)' },
                { key: 'fiber', label: 'ไฟเบอร์ (g)' },
                { key: 'sugar', label: 'น้ำตาล (g)' },
                { key: 'sodium', label: 'โซเดียม (mg)' },
              ].map(n => (
                <div key={n.key}>
                  <label className="block text-xs text-gray-500 mb-1">{n.label}</label>
                  <input
                    type="number"
                    value={form.nutrition[n.key]}
                    onChange={e => setForm({ ...form, nutrition: { ...form.nutrition, [n.key]: parseFloat(e.target.value) || 0 } })}
                    className="input-field text-sm py-2"
                    min={0} step="0.1"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">วัตถุดิบ</label>
            <div className="flex gap-2 mb-2">
              <input value={tempIngredient} onChange={e => setTempIngredient(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToArray('ingredients', tempIngredient, setTempIngredient))}
                className="input-field text-sm py-2 flex-1" placeholder="กรอกวัตถุดิบแล้วกด Enter" />
              <button type="button" onClick={() => addToArray('ingredients', tempIngredient, setTempIngredient)} className="btn-secondary px-3 py-2 text-sm">เพิ่ม</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.ingredients.map((ing, i) => (
                <span key={i} className="badge bg-gray-100 text-gray-700 gap-1">
                  {ing}
                  <button onClick={() => removeFromArray('ingredients', i)} className="ml-1 text-gray-400 hover:text-red-500"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Health Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ประโยชน์ต่อสุขภาพ</label>
            <div className="flex gap-2 mb-2">
              <input value={tempBenefit} onChange={e => setTempBenefit(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToArray('healthBenefits', tempBenefit, setTempBenefit))}
                className="input-field text-sm py-2 flex-1" placeholder="กรอกประโยชน์แล้วกด Enter" />
              <button type="button" onClick={() => addToArray('healthBenefits', tempBenefit, setTempBenefit)} className="btn-secondary px-3 py-2 text-sm">เพิ่ม</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.healthBenefits.map((b, i) => (
                <span key={i} className="badge bg-green-50 text-green-700 gap-1">
                  ✓ {b}
                  <button onClick={() => removeFromArray('healthBenefits', i)} className="ml-1 text-gray-400 hover:text-red-500"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">แท็ก</label>
            <div className="flex gap-2 mb-2">
              <input value={tempTag} onChange={e => setTempTag(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToArray('tags', tempTag, setTempTag))}
                className="input-field text-sm py-2 flex-1" placeholder="กรอกแท็กแล้วกด Enter" />
              <button type="button" onClick={() => addToArray('tags', tempTag, setTempTag)} className="btn-secondary px-3 py-2 text-sm">เพิ่ม</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, i) => (
                <span key={i} className="badge bg-blue-50 text-blue-700 gap-1">
                  #{tag}
                  <button onClick={() => removeFromArray('tags', i)} className="ml-1 text-gray-400 hover:text-red-500"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="foodActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-primary-600" />
            <label htmlFor="foodActive" className="text-sm text-gray-700">เปิดใช้งาน</label>
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
