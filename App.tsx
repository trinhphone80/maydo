
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Countdown from './components/Countdown';
import OrderForm from './components/OrderForm';
import HealthAssistant from './components/HealthAssistant';
import AdminDashboard from './components/AdminDashboard';
import ProductGallery from './components/ProductGallery';
import { Order, AppConfig } from './types';
import { IMAGES, CONTACT, GOOGLE_SHEET_URL, BANK_CONFIG, PAYMENT_DEFAULTS } from './constants';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aicare_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [config, setConfig] = useState<AppConfig>(() => {
    const saved = localStorage.getItem('aicare_config');
    const defaultConfig: AppConfig = {
      heroImageUrl: IMAGES.hero,
      specsImageUrl: IMAGES.specs,
      thumbImageUrl: IMAGES.thumb,
      galleryImageUrls: IMAGES.gallery,
      googleSheetUrl: GOOGLE_SHEET_URL,
      notificationEmail: CONTACT.email,
      bankId: BANK_CONFIG.bankId,
      accountNo: BANK_CONFIG.accountNo,
      accountName: BANK_CONFIG.accountName,
      paymentLink: PAYMENT_DEFAULTS.link,
      paymentQrUrl: PAYMENT_DEFAULTS.qrImage,
      payosClientId: '',
      payosApiKey: '',
      payosChecksumKey: ''
    };
    
    if (saved) {
      const parsed = JSON.parse(saved);
      // ÉP BUỘC ĐỒNG BỘ: Luôn sử dụng URL script và Email từ constants để đảm bảo tính ổn định
      parsed.googleSheetUrl = GOOGLE_SHEET_URL;
      parsed.notificationEmail = CONTACT.email;
      return { ...defaultConfig, ...parsed };
    }
    return defaultConfig;
  });
  
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [lastNotification, setLastNotification] = useState<{name: string, loc: string} | null>(null);

  useEffect(() => {
    localStorage.setItem('aicare_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('aicare_config', JSON.stringify(config));
  }, [config]);

  // Kiểm tra trạng thái thanh toán tự động
  useEffect(() => {
    let interval: any;
    if (currentOrder && currentOrder.status === 'PENDING') {
      interval = setInterval(async () => {
        try {
          const ts = Date.now();
          const checkUrl = `${config.googleSheetUrl}?action=CHECK_STATUS&orderId=${currentOrder.id}&t=${ts}`;
          const res = await fetch(checkUrl);
          if (!res.ok) return;
          
          const data = await res.json();
          if (data.status === 'PAID') {
            const updatedOrder: Order = { ...currentOrder, status: 'PAID' };
            setCurrentOrder(updatedOrder);
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            clearInterval(interval);
          }
        } catch (e) {
          console.debug("Đang kiểm tra thanh toán...");
        }
      }, 3500); 
    }
    return () => clearInterval(interval);
  }, [currentOrder, config.googleSheetUrl]);

  useEffect(() => {
    const names = ["Chị Lan", "Anh Tuấn", "Cô Hạnh", "Chú Bình", "Bác Nam", "Chị Mai"];
    const locs = ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];
    const trigger = () => {
      setLastNotification({ name: names[Math.floor(Math.random() * names.length)], loc: locs[Math.floor(Math.random() * locs.length)] });
      setTimeout(() => setLastNotification(null), 4000);
    };
    const inv = setInterval(() => { if (Math.random() > 0.4) trigger(); }, 15000);
    return () => clearInterval(inv);
  }, []);

  const handleOrderSuccess = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCurrentOrder(order);
  }, []);

  const clearOrders = useCallback(() => { if (window.confirm('Xóa dữ liệu?')) setOrders([]); }, []);
  const updateConfig = useCallback((newConfig: AppConfig) => setConfig(newConfig), []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-3/5 space-y-8 animate-fadeIn text-center lg:text-left">
              <div className="inline-flex items-center gap-3 bg-red-50 text-red-600 px-6 py-2 rounded-full text-sm font-black tracking-widest border border-red-200 shadow-sm mx-auto lg:mx-0">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                CHIẾN DỊCH VÌ SỨC KHỎE CỘNG ĐỒNG
              </div>
              <h1 className="text-5xl md:text-8xl font-black leading-tight text-gray-900">TẶNG MÁY <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500 italic">AICARE W33</span></h1>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <span className="text-3xl font-bold text-gray-400">GIÁ:</span>
                <span className="text-7xl md:text-9xl font-black text-red-600 animate-pulse">0 ĐỒNG</span>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">Sở hữu máy đo đường huyết chuẩn bệnh viện miễn phí. <span className="text-red-600 font-bold">Chỉ phí vận chuyển 70k</span>.</p>
              <div className="pt-6">
                <a href="#order-form" className="inline-block bg-red-600 text-white font-black py-6 px-16 rounded-[2rem] text-2xl shadow-xl transform transition hover:-translate-y-2 shaking-element">NHẬN MÁY 0Đ NGAY</a>
              </div>
            </div>
            <div className="w-full lg:w-2/5">
                <img src={config.heroImageUrl} className="w-full rounded-[3rem] shadow-2xl border-8 border-white" alt="AICARE W33" />
            </div>
          </div>
        </div>
      </section>

      <Countdown />
      <ProductGallery images={config.galleryImageUrls} />
      <OrderForm 
        onOrderSuccess={handleOrderSuccess} 
        thumbUrl={config.thumbImageUrl} 
        config={config} 
      />

      <footer className="bg-gray-950 text-white py-12 text-center">
        <p className="text-xs text-gray-600 font-black uppercase">© 2024 ĐỨC PHƯƠNG MEDICAL</p>
        <button onClick={() => setIsAdminOpen(true)} className="mt-4 text-[10px] text-gray-800 hover:text-gray-600 uppercase font-black">Admin Panel</button>
      </footer>

      {isAdminOpen && <AdminDashboard orders={orders} onClose={() => setIsAdminOpen(false)} onClear={clearOrders} config={config} onUpdateConfig={updateConfig} />}

      {currentOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl border-8 border-green-50 my-10 relative">
            <button onClick={() => setCurrentOrder(null)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition">✕</button>
            
            {currentOrder.status === 'PAID' ? (
              <div className="animate-scaleUp">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl">✓</div>
                <h3 className="text-3xl font-black text-green-600 mb-2 uppercase tracking-tighter">ĐÃ NHẬN THANH TOÁN!</h3>
                <p className="text-gray-600 font-bold mb-6 italic">Cảm ơn bác {currentOrder.name}, đơn hàng đã được hệ thống ưu tiên xử lý gửi ngay lập tức!</p>
                <button onClick={() => setCurrentOrder(null)} className="w-full bg-green-600 text-white font-black py-5 rounded-[2rem] text-xl shadow-lg">TUYỆT VỜI!</button>
              </div>
            ) : (
              <div>
                <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl animate-pulse">💳</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">ĐĂNG KÝ THÀNH CÔNG!</h3>
                <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 mb-8 mt-6">
                   <div className="text-[10px] font-black text-blue-600 uppercase mb-2">Thanh toán phí ship (70k) để gửi quà ngay</div>
                   <div className="relative mx-auto w-56 h-56 bg-white p-2 rounded-2xl shadow-lg border border-blue-200 overflow-hidden mb-6">
                      <img src={`https://img.vietqr.io/image/${config.bankId}-${config.accountNo}-compact2.png?amount=70000&addInfo=${currentOrder.id}&accountName=${config.accountName}`} className="w-full h-full object-contain" alt="Payment QR" />
                   </div>
                   {currentOrder.paymentUrl && (
                     <a href={currentOrder.paymentUrl} target="_blank" rel="noopener noreferrer" className="block w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-base shadow-xl mb-4 uppercase">Thanh toán qua PayOS ➔</a>
                   )}
                   <p className="text-[10px] text-gray-500 italic">Sau khi bác chuyển khoản thành công, hệ thống sẽ tự động chuyển sang màu xanh thông báo!</p>
                </div>
                <button onClick={() => setCurrentOrder(null)} className="w-full bg-gray-900 text-white font-black py-5 rounded-[2rem] text-xl">THANH TOÁN SAU</button>
              </div>
            )}
          </div>
        </div>
      )}

      {lastNotification && (
        <div className="fixed bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/50 z-50 flex items-center gap-4 animate-slideInRight">
          <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center text-xl">📦</div>
          <div className="text-left">
            <div className="text-[9px] text-red-600 font-black uppercase">Vừa đăng ký máy 0đ</div>
            <div className="text-sm font-black text-gray-900 leading-none">{lastNotification.name} - {lastNotification.loc}</div>
          </div>
        </div>
      )}
      <HealthAssistant />
    </div>
  );
};

export default App;
