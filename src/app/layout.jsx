import './globals.css';

export const metadata = {
  title: 'Sistem Layanan Masyarakat',
  description: 'Aplikasi Pendataan Bansos',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}