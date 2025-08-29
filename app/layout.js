import { Geist, Geist_Mono } from "next/font/google";
import "../src/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "🇨🇱 Fiestas Patrias Chile - 18 de Septiembre",
  description: "Chatbot sobre las tradiciones chilenas del 18 de Septiembre: comidas, historia, música y juegos típicos",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
