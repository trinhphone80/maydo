
import React, { useState } from 'react';
import { Order, AdminView, AppConfig } from '../types';
import { GOOGLE_SHEET_URL } from '../constants';

interface Props {
  orders: Order[];
  config: AppConfig;
  onClose: () => void;
  onClear: () => void;
  onUpdateConfig: (config: AppConfig) => void;
}

const AdminDashboard: React.FC<Props> = ({ orders, config, onClose, onClear, onUpdateConfig }) => {
  const [view, setView] = useState<AdminView>(AdminView.LOGIN);
  const [password, setPassword] = useState('');
  const [tempConfig, setTempConfig] = useState<AppConfig>({ ...config });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '123456') {
      setView(AdminView.DASHBOARD);
    } else {
      alert('Mật khẩu quản trị không chính xác!');
    }
  };

  const saveConfig = () => {
    onUpdateConfig(tempConfig);
    alert('Đã cập nhật cấu hình hệ thống!');
  };

  const resetToDefaultUrl = () => {
    if (window.confirm("Bác có muốn khôi phục URL Google Apps Script về mặc định không?")) {
      setTempConfig({ ...tempConfig, googleSheetUrl: GOOGLE_SHEET_URL });
    }
  };

  if (view === AdminView.LOGIN) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl animate-scaleUp">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Hệ thống Quản Trị</h3>
            <p className="text-gray-500 text-sm">Vui lòng nhập mật khẩu truy cập</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-[#0056b3] focus:outline-none transition" 
              placeholder="••••••••"
            />
            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition">Hủy</button>
              <button type="submit" className="flex-1 bg-[#0056b3] text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition">Vào</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-2 md:p-8 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20">
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-6">
            <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg font-black text-xl">📊</div>
            <div className="flex gap-2">
               <button onClick={() => setView(AdminView.DASHBOARD)} className={`px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${view === AdminView.DASHBOARD ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Đơn hàng</button>
               <button onClick={() => setView(AdminView.SETTINGS)} className={`px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${view === AdminView.SETTINGS ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Cấu hình</button>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 transition border border-gray-700">✕</button>
        </div>

        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
          {view === AdminView.DASHBOARD ? (
             <div className="p-4">
                <div className="flex justify-between items-center mb-6 px-4">
                   <h3 className="text-xl font-black uppercase">Danh sách đơn hàng</h3>
                   <button onClick={onClear} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition">Xóa trắng dữ liệu</button>
                </div>
                <table className="w-full text-sm text-left text-gray-600 border-collapse min-w-[800px]">
                  <thead className="text-[11px] text-gray-400 uppercase tracking-widest bg-gray-50/80 sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="px-8 py-5 border-b font-black">Thời gian</th>
                      <th className="px-8 py-5 border-b font-black">Khách hàng</th>
                      <th className="px-8 py-5 border-b font-black">Địa chỉ</th>
                      <th className="px-8 py-5 border-b font-black text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-20 text-gray-300 font-bold uppercase">Chưa có đơn hàng</td></tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order.id} className="hover:bg-blue-50/50 transition">
                          <td className="px-8 py-6 whitespace-nowrap text-gray-400 font-mono text-[11px]">{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                          <td className="px-8 py-6">
                             <div className="font-black text-gray-800">{order.name}</div>
                             <div className="text-blue-600 font-bold text-xs">{order.phone}</div>
                          </td>
                          <td className="px-8 py-6 text-gray-500 text-xs max-w-xs">{order.address}</td>
                          <td className="px-8 py-6 text-center">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                              order.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }`}>
                              {order.status === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHỜ THANH TOÁN'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
          ) : (
             <div className="p-8 max-w-4xl mx-auto space-y-10 pb-20">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-blue-600 uppercase tracking-widest border-b pb-2">Tích hợp PayOS.vn (Tự động) ⚡</h4>
                    <div className="space-y-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500">Client ID</label>
                            <input type="text" value={tempConfig.payosClientId} onChange={e => setTempConfig({...tempConfig, payosClientId: e.target.value})} className="w-full p-3 border-2 border-white rounded-xl focus:border-blue-500 outline-none text-xs" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500">API Key</label>
                            <input type="password" value={tempConfig.payosApiKey} onChange={e => setTempConfig({...tempConfig, payosApiKey: e.target.value})} className="w-full p-3 border-2 border-white rounded-xl focus:border-blue-500 outline-none text-xs" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500">Checksum Key</label>
                            <input type="password" value={tempConfig.payosChecksumKey} onChange={e => setTempConfig({...tempConfig, payosChecksumKey: e.target.value})} className="w-full p-3 border-2 border-white rounded-xl focus:border-blue-500 outline-none text-xs" />
                        </div>
                        <p className="text-[9px] text-blue-600 italic">* Lấy các mã này trong menu "Cài đặt tích hợp" tại payos.vn</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b pb-2">Hệ thống</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black uppercase text-blue-600">Google Apps Script URL</label>
                          <button onClick={resetToDefaultUrl} className="text-[9px] text-red-600 hover:underline font-bold uppercase">Khôi phục mặc định</button>
                        </div>
                        <input 
                          type="text" 
                          value={tempConfig.googleSheetUrl} 
                          onChange={e => setTempConfig({...tempConfig, googleSheetUrl: e.target.value})} 
                          className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none font-medium text-xs bg-gray-50" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-red-600">Email nhận thông báo</label>
                        <input 
                          type="email" 
                          value={tempConfig.notificationEmail} 
                          onChange={e => setTempConfig({...tempConfig, notificationEmail: e.target.value})} 
                          className="w-full p-4 border-2 border-gray-50 rounded-2xl focus:border-red-500 outline-none font-bold" 
                        />
                    </div>
                  </div>
                </div>

                <button onClick={saveConfig} className="w-full bg-[#0056b3] text-white font-black py-5 rounded-2xl text-xl shadow-2xl hover:bg-blue-700 transition">LƯU CẤU HÌNH HỆ THỐNG</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
