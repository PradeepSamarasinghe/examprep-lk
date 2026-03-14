import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">ExamPrep LK</span>
            </div>
            <p className="text-sm text-muted-foreground">Sri Lanka's most advanced AI-powered exam preparation platform.</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 text-sm">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#subjects" className="hover:text-foreground transition-colors">Subjects</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Past Papers</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Study Guides</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Blog</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          © 2026 ExamPrep LK. All rights reserved. Made with ❤️ in Sri Lanka.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
