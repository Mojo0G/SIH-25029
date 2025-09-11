import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
          >
            {/* Company Info */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">SIH</span>
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  SIH 2025
                </span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Revolutionizing certificate authentication with blockchain and AI technology.
                Secure, transparent, and efficient verification for the digital age.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <social.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-green-400 transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Contact Info</h3>
              <div className="space-y-3">
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Mail className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">contact@sih2025.com</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Phone className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <MapPin className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-sm">Tech Innovation Hub, India</span>
                </motion.div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Stay Updated</h3>
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter for the latest updates on blockchain and AI innovations.
              </p>
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
                <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                Powered by Blockchain
              </Badge>
              <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-600/30">
                AI Enhanced
              </Badge>
            </div>
            <p className="text-gray-400 text-sm">
              © {currentYear} SIH 2025. All rights reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;