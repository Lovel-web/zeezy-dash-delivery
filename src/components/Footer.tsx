const Footer = () => {
  return (
    <footer className="bg-muted mt-16 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold text-lg mb-3 text-primary">🚚 Zeezy Deliveries</h3>
            <p className="text-sm text-muted-foreground">
              Fast, trusted delivery from stores to your doorstep in Akure, Nigeria.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</a></li>
              <li><a href="/cart" className="text-muted-foreground hover:text-primary transition-colors">Cart</a></li>
              <li><a href="/auth" className="text-muted-foreground hover:text-primary transition-colors">Login</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Akure, Ondo State, Nigeria<br />
              WhatsApp: +234 XXX XXX XXXX
            </p>
          </div>
        </div>
        
        <div className="border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Zeezy Deliveries. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by <span className="font-semibold text-foreground">GAMEUNPAREIL Enterprise</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
