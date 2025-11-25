// Di sini baru boleh pakai ../../ karena posisinya ada di dalam folder (dashboard)
import Sidebar from '../../components/sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      {/* Layout Dashboard yang Lebar */}
      <main className="flex-1 ml-72 p-8 lg:p-12 overflow-y-auto min-h-screen">
        <div className="w-full mx-auto fade-in-up"> 
            {children}
        </div>
      </main>
    </div>
  );
}