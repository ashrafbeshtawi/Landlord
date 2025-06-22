import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { StyledRoot } from "./StyledRoot";
import NavigationBar from "@/components/NavigationBar";
import Box from '@mui/material/Box';
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Land Lord Token",
  description: "Land Lord Token",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className="antialiased">
        <AppRouterCacheProvider>
          <StyledRoot>
          <Box
            className= 'gradient-background'
            sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
          {/* Persisted navigation across routes */}
          <NavigationBar />

          {/* Page content rendered here */}
          {children}
          </Box>
          </StyledRoot>
          </AppRouterCacheProvider>

      </body>
    </html>
  );
}
