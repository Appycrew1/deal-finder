export const metadata = {
  title: "Deal Finder",
  description: "Find UK coupons and deals by company name",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
