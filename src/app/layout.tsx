import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lolla Toledo Mega Hair — Excelência e Sofisticação em Mega Hair Premium",
  description:
    "Especialista em Mega Hair premium. Glamour, profissionalismo e estética de alto padrão. Catálogo de cabelos, avaliação e aplicação.",
  openGraph: {
    title: "Lolla Toledo Mega Hair",
    description: "Excelência e sofisticação em Mega Hair premium.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-[#1E1412] text-[#E2B07E] antialiased">
        {children}
      </body>
    </html>
  );
}
