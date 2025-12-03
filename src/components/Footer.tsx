import doubleEagleLogo from "@/assets/double-eagle-logo.png";

const footerLinks = {
  Product: ["Features", "Missions", "Pricing", "Mobile App"],
  Company: ["About", "Careers", "Press", "Blog"],
  Support: ["Help Center", "Contact", "Privacy", "Terms"],
  Social: ["Twitter", "Instagram", "YouTube", "Discord"],
};

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-4">
              <img 
                src={doubleEagleLogo} 
                alt="Double Eagle Challenge" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-lg font-heading font-bold text-foreground uppercase tracking-wider">
                Double Eagle
              </span>
            </a>
            <p className="text-muted-foreground text-sm">
              Forge your strength. Earn your badge.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-heading font-semibold text-foreground mb-4 uppercase tracking-wide">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Double Eagle Challenge. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
