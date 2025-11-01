export const metadata = {
  title: 'Cat Video Generator',
  description: 'Generate adorable animated cat videos instantly!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
