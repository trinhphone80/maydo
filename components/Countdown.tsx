
import React, { useState, useEffect } from 'react';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset or stop
          hours = 5;
          minutes = 0;
          seconds = 0;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="py-12 bg-[#d32f2f] text-white text-center relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 uppercase tracking-wide">Ưu Đãi Kết Thúc Sau</h2>
        <div className="flex justify-center gap-4 text-center font-mono text-3xl md:text-5xl font-bold mb-8 text-yellow-300 drop-shadow-md">
          <div className="bg-black/20 p-3 rounded-lg min-w-[80px]">
            <span>{format(timeLeft.hours)}</span>
            <div className="text-xs font-sans font-normal text-white mt-1">Giờ</div>
          </div>
          <span className="self-center pb-8">:</span>
          <div className="bg-black/20 p-3 rounded-lg min-w-[80px]">
            <span>{format(timeLeft.minutes)}</span>
            <div className="text-xs font-sans font-normal text-white mt-1">Phút</div>
          </div>
          <span className="self-center pb-8">:</span>
          <div className="bg-black/20 p-3 rounded-lg min-w-[80px]">
            <span>{format(timeLeft.seconds)}</span>
            <div className="text-xs font-sans font-normal text-white mt-1">Giây</div>
          </div>
        </div>
        <p className="text-xl mb-0 font-medium">Đã có <span className="font-bold text-yellow-300">1,245</span> người đặt mua hôm nay</p>
      </div>
    </section>
  );
};

export default Countdown;
