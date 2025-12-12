const Footer = () => {
  return (
    <footer className="py-6 border-t border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-muted-foreground/70 text-xs font-light">
          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="text-primary/80 font-normal">Sirvoy.com</span>
            <span>&</span>
            <span className="text-primary/80 font-normal">Palawan Collective Inc.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;