export function Footer() {
  return (
    <footer className="border-t border-forest/10 mt-20">
      <div className="container-page py-8 text-sm text-muted flex justify-between">
        <span>© {new Date().getFullYear()} TrailTales</span>
        <span>Stories worth telling.</span>
      </div>
    </footer>
  );
}
