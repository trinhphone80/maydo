
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Countdown from './components/Countdown';
import OrderForm from './components/OrderForm';
import HealthAssistant from './components/HealthAssistant';
import AdminDashboard from './components/AdminDashboard';
import ProductGallery from './components/ProductGallery';
import { Order, AppConfig } from './types';
import { IMAGES, CONTACT, GOOGLE_SHEET_URL, BANK_CONFIG, PAYMENT_DEFAULTS, PAYOS_KEYS } from './constants';

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
      payosClientId: PAYOS_KEYS.clientId,
      payosApiKey: PAYOS_KEYS.apiKey,
      payosChecksumKey: PAYOS_KEYS.checksumKey
    };
    
    if (saved) {
      const parsed = JSON.parse(saved);
      return { 
        ...defaultConfig, 
        ...parsed,
        payosClientId: parsed.payosClientId || PAYOS_KEYS.clientId,
        payosApiKey: parsed.payosApiKey || PAYOS_KEYS.apiKey,
        payosChecksumKey: parsed.payosChecksumKey || PAYOS_KEYS.checksumKey,
        paymentLink: parsed.paymentLink || PAYMENT_DEFAULTS.link
      };
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

  // HỆ THỐNG KIỂM TRA TỰ ĐỘNG (POLLING) - LIÊN KẾT VỚI PAYOS QUA WEBHOOK TRÊN GOOGLE SHEET
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
          const isPaid = data.status === 'PAID' || 
                         data.status === 'SUCCESS' || 
                         data.status === 'ĐÃ THANH TOÁN' ||
                         data.status === 'Thành công';

          if (isPaid) {
            const updatedOrder: Order = { ...currentOrder, status: 'PAID' };
            setCurrentOrder(updatedOrder);
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            clearInterval(interval);
          }
        } catch (e) {
          console.debug("Đang kiểm tra trạng thái từ PayOS...");
        }
      }, 4000); 
    }
    return () => clearInterval(interval);
  }, [currentOrder, config.googleSheetUrl]);

  useEffect(() => {
    const names = ["Cô Lan", "Bác Hùng", "Chú Chín", "Anh Tài", "Chị Phượng", "Bác Sáu"];
    const locs = ["Quận 8", "Bình Chánh", "Hóc Môn", "Quận 10", "Thủ Đức", "Bình Tân"];
    const trigger = () => {
      setLastNotification({ name: names[Math.floor(Math.random() * names.length)], loc: locs[Math.floor(Math.random() * locs.length)] });
      setTimeout(() => setLastNotification(null), 4000);
    };
    const inv = setInterval(() => { if (Math.random() > 0.4) trigger(); }, 18000);
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
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
        <div className="container mx-auto px-4 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-3/5 space-y-8 animate-fadeIn">
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
              <p className="text-lg text-gray-600 leading-relaxed font-medium">Sở hữu máy đo đường huyết chuẩn bệnh viện miễn phí. <span className="text-red-600 font-bold italic">Bác chỉ cần hỗ trợ phí vận chuyển 70.000đ</span>.</p>
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
      
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Đăng ký nhận quà</h2>
          <p className="text-gray-500 mt-2 font-medium">Vui lòng điền đúng thông tin để bộ phận giao hàng liên hệ bác sớm nhất</p>
        </div>
        <OrderForm 
          onOrderSuccess={handleOrderSuccess} 
          thumbUrl={config.thumbImageUrl} 
          config={config} 
        />
      </div>

      <footer className="bg-gray-950 text-white pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-center md:text-left">
            <div className="space-y-6 flex flex-col items-center md:items-start">
              <img src={IMAGES.logo} alt="Đức Phương Medical" className="h-12 object-contain bg-white p-2 rounded-xl" />
              <h3 className="font-black text-xl uppercase tracking-tighter leading-tight">{CONTACT.companyName}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">Đơn vị phân phối thiết bị y tế gia đình hàng đầu TP.HCM.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest">Địa chỉ Showroom</h4>
              <p className="text-sm text-gray-300 font-medium">{CONTACT.address}</p>
              <p className="text-sm text-gray-300 font-medium">{CONTACT.showroom}</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest">Liên hệ nhanh</h4>
              <a href={`tel:${CONTACT.phone.replace(/\./g, '')}`} className="text-2xl font-black text-white block hover:text-blue-400 transition tracking-tighter">{CONTACT.phone}</a>
              <p className="text-xs text-gray-500 font-bold">ducphuongmedical@gmail.com</p>
            </div>
            <div className="space-y-4 flex flex-col items-center md:items-start">
               <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest">Kênh Youtube</h4>
               <a href={CONTACT.social.youtube} target="_blank" className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 hover:border-red-600 transition">
                  <span className="text-4xl">▶️</span>
               </a>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-900 flex justify-between items-center flex-wrap gap-4">
            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">© 2024 ĐỨC PHƯƠNG MEDICAL</p>
            <button onClick={() => setIsAdminOpen(true)} className="text-[9px] text-gray-700 hover:text-white uppercase font-black border border-gray-800 px-4 py-2 rounded-lg transition-colors">Quản trị viên</button>
          </div>
        </div>
      </footer>

      {isAdminOpen && <AdminDashboard orders={orders} onClose={() => setIsAdminOpen(false)} onClear={clearOrders} config={config} onUpdateConfig={updateConfig} />}

      {/* POPUP THANH TOÁN TỰ ĐỘNG - TÍCH HỢP PAYOS BÁC PHƯƠNG */}
      {currentOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-2xl px-4 overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] p-8 md:p-12 max-w-lg w-full text-center shadow-2xl border-[12px] border-blue-50 my-10 relative animate-scaleUp">
            <button onClick={() => setCurrentOrder(null)} className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-500 text-xl">✕</button>
            
            {currentOrder.status === 'PAID' ? (
              <div className="py-6">
                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-[0_0_40px_rgba(34,197,94,0.5)] animate-bounce">✓</div>
                <h3 className="text-4xl font-black text-green-600 mb-4 uppercase tracking-tighter leading-none">THANH TOÁN <br/>THÀNH CÔNG!</h3>
                <div className="bg-green-50 p-6 rounded-3xl mb-8 border border-green-100">
                  <p className="text-gray-700 font-bold leading-relaxed italic">
                    Dạ, Đức Phương đã nhận được phí ship 70k từ bác **{currentOrder.name}**. 
                    Máy sẽ được kiểm tra và gửi đi ngay. Chúc bác luôn mạnh khỏe ạ!
                  </p>
                </div>
                <button onClick={() => setCurrentOrder(null)} className="w-full bg-green-600 text-white font-black py-6 rounded-2xl text-xl shadow-xl hover:bg-green-700 transition active:scale-95 uppercase tracking-widest">Xác nhận xong ➔</button>
              </div>
            ) : (
              <div className="py-2">
                <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase mb-6 shadow-lg shadow-blue-200 tracking-widest">Thanh toán tự động</div>
                <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">BÁC {currentOrder.name.split(' ').pop()?.toUpperCase()} ƠI!</h3>
                <p className="text-gray-500 text-sm font-medium mb-8">Bác vui lòng thanh toán phí ship 70k để máy lên đường ạ</p>
                
                <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-[2.5rem] border-2 border-blue-100 mb-8 shadow-inner">
                   <div className="text-[11px] font-black text-blue-600 uppercase mb-4 tracking-widest">Quét bằng ứng dụng ngân hàng của bác</div>
                   <div className="relative mx-auto w-64 h-64 bg-white p-3 rounded-2xl shadow-xl border border-blue-200 overflow-hidden mb-4 group transition-transform hover:scale-105 duration-500">
                      {/* VietQR tự động điền mã đơn hàng vào nội dung chuyển khoản */}
                      <img 
                        src={`https://img.vietqr.io/image/${config.bankId}-${config.accountNo}-compact2.png?amount=70000&addInfo=${currentOrder.id}&accountName=${config.accountName}`} 
                        className="w-full h-full object-contain" 
                        alt="PayOS QR" 
                      />
                   </div>
                   
                   <div className="mb-6 bg-white py-3 px-4 rounded-xl border border-blue-100 inline-block shadow-sm">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Nội dung (Quan trọng):</div>
                      <div className="text-2xl font-black text-blue-700 font-mono tracking-widest uppercase">{currentOrder.id}</div>
                   </div>
                   
                   <div className="space-y-3">
                      <a href={config.paymentLink} target="_blank" className="block w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-base shadow-xl hover:bg-blue-700 transition active:scale-95 uppercase tracking-widest flex items-center justify-center gap-3">
                        MỞ TRANG THANH TOÁN PAYOS 
                        <span className="text-xl">➔</span>
                      </a>
                   </div>
                   
                   <div className="mt-6 flex items-center justify-center gap-3">
                      <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Hệ thống đang chờ bác trả tiền...</p>
                   </div>
                </div>
                <button onClick={() => setCurrentOrder(null)} className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-gray-600 transition underline decoration-2 underline-offset-4">Để sau, em bận tí bác nhé</button>
              </div>
            )}
          </div>
        </div>
      )}

      {lastNotification && (
        <div className="fixed bottom-8 left-8 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white/50 z-50 flex items-center gap-4 animate-slideInRight">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner">📦</div>
          <div className="text-left">
            <div className="text-[10px] text-red-600 font-black uppercase tracking-tighter">Vừa đăng ký nhận máy</div>
            <div className="text-sm font-black text-gray-900 leading-none">{lastNotification.name} - {lastNotification.loc}</div>
          </div>
        </div>
      )}
      <HealthAssistant />
    </div>
  );
};

export default App;
