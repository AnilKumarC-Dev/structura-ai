import "./globals.css";

export const metadata = {
  title: "StructureAI",
  description: "StructureAI - Enterprise Knowledge Platform",
};

// Applies the saved (or system) theme before first paint to avoid a flash
const themeInit = `(function(){try{var t=localStorage.getItem('structureai-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}