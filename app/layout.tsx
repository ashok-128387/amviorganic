import type { Metadata } from 'next'
import { Geist, Geist_Mono, Montserrat } from 'next/font/google'
import './globals.css'
import MarqueeBanner from '@/components/marquee-banner'
import Header from '@/components/header'
import Footer from '@/components/footer'
import CartDrawer from '@/components/cart-drawer'

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
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #c8922a, #e8b84b, #c8922a)', position: 'sticky', top: 0, zIndex: 51 }} />
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />

      </body>
    </html>
  )
}
