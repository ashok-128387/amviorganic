import type { Metadata } from 'next'
import { Geist, Geist_Mono, Montserrat } from 'next/font/google'
import './globals.css'
import MarqueeBanner from '@/components/marquee-banner'
import Header from '@/components/header'
import Footer from '@/components/footer'
import CartDrawer from '@/components/cart-drawer'
import WhatsAppFloat from '@/components/whatsapp-float'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['500', '600', '700']
})

export const metadata: Metadata = {
  title: 'AMVI Organics - Pure Jaggery Products',
  description: 'Premium organic jaggery cubes, liquid jaggery, and jaggery powder - Pure and natural sweeteners',
  generator: 'v0.app',
  icons: {
    icon: '/Shoot Product only/12_Amvi-logoTL-01.webp',
    apple: '/Shoot Product only/12_Amvi-logoTL-01.webp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900">
        <MarqueeBanner />
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />

      </body>
    </html>
  )
}
