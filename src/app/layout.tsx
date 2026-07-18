import "@/app/globals.css"; // We will configure Tailwind next

export const metadata = {
  title: "WriteFlow AI - Premium AI Writing Assistant",
  description: "Rewrite, improve, summarize, and polish your documents in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0F172A] text-slate-100">{children}</body>
    </html>
  );
}