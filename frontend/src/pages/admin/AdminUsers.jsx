import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Shield, User } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.set('search', search);
      const res = await api.get(`/users?${params}`);
      setUsers(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/users/${id}/toggle-status`);
      toast.success(res.data.message);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 font-display">จัดการสมาชิก</h1>
          <p className="text-gray-500 text-sm">ทั้งหมด {pagination.total || 0} คน</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchUsers(); }} className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-sm" placeholder="ค้นหาชื่อหรืออีเมล..." />
        </div>
        <button type="submit" className="btn-primary text-sm px-4">ค้นหา</button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">สมาชิก</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">อีเมล</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">บทบาท</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">วันที่สมัคร</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">สถานะ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-10 bg-gray-100 rounded animate-pulse"></div></td></tr>
                ))
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">ไม่พบสมาชิก</td></tr>
              ) : users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-none
                        ${user.role === 'admin' ? 'bg-amber-500' : 'bg-primary-500'}`}>
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800 text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-primary-100 text-primary-700'}`}>
                      {user.role === 'admin' ? <><Shield size={10} /> Admin</> : <><User size={10} /> สมาชิก</>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'ใช้งาน' : 'ระงับ'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(user._id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            user.isActive
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          {user.isActive ? <><UserX size={12} /> ระงับ</> : <><UserCheck size={12} /> เปิดใช้</>}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50">← ก่อนหน้า</button>
            <span className="flex items-center px-3 text-xs text-gray-500">หน้า {page}/{pagination.pages}</span>
            <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50">ถัดไป →</button>
          </div>
        )}
      </div>
    </div>
  );
}
