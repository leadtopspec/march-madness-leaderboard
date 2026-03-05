import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'March Madness Leaderboard | Live Competition Tracking',
  description: 'Real-time leaderboard for March Madness style competitions with live score submission and bracket visualization.',
  keywords: 'march madness, leaderboard, competition, real-time, bracket, tournament',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}