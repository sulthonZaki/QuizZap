import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "QuizZap",
  description: "Platform quiz interaktif",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
