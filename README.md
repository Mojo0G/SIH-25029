SIH PS - 25029


With increasing digitization, the problem of fake degrees and forged academic certificates has become a major concern for higher education institutions, employers, and government bodies. Cases of fraudulent documents being used for jobs, admissions, or government schemes have highlighted the absence of a robust mechanism to verify the authenticity of educational credentials issued by colleges and universities.

At present, verification is often manual, relying on physical inspection, emails to institutions, or outdated databases. This creates delays, inconsistency, and susceptibility to corruption or manipulation. To preserve academic integrity and public trust, there is a pressing need for an efficient, secure, and scalable digital system to detect and prevent the use of fake degrees.

Detailed Description

The challenge is to create a digital platform that can authenticate and detect fake degrees or certificates issued by higher education institutions across Jharkhand. The system should be able to cross-verify uploaded documents (PDFs, scans, etc.) with institutional databases or credential registries, using metadata, QR codes, signatures, or embedded hashes.

Such a platform must work with both legacy certificates (issued before digitization) and new ones generated under university ERP systems. It should detect anomalies such as:
- Tampered grades or photos
- Forged seals or signatures
- Invalid certificate numbers
- Non-existent institutions or courses
- Duplicate or cloned documents

Incorporating AI, OCR (Optical Character Recognition), and blockchain or cryptographic validation, the platform should enable seamless certificate verification by employers, admission offices, scholarship agencies, and government departments. The goal is to create a trustable and publicly accessible system that protects institutions’ reputation and safeguards student achievements.

Expected Solution

A smart, scalable, and secure Fake Degree/Certificate Recognition system that includes:
• Upload interface for verifying entities (employers, institutions, agencies) to upload or input certificate details
• Certificate authenticity checker that:
   – Uses OCR to extract key details (name, roll number, marks, certificate ID)
   – Matches it against a verified database (centralized or decentralized)
   – Flags mismatches or formatting inconsistencies
• Digital watermark or blockchain verification support for newly issued certificates
• Institution integration module for universities/colleges to upload their certificate records in bulk or in real-time
• Admin dashboard for authorized bodies (e.g., Higher Education Department) to monitor verification activity, detect forgery trends, and blacklist offenders
• Alert system for invalid or forged entries
• Data privacy and access control measures to ensure secure handling of student information

This solution must be adaptable across different institutions, work with both physical and digital certificates, and be affordable for state-wide rollout.

## 🚀 Deployment

### Vercel Deployment (Frontend)

This project is configured for easy deployment on Vercel. The frontend is a React application built with Vite.

#### Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- Node.js 18+ installed locally

#### Quick Deploy
1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   # For production deployment
   npm run deploy

   # For preview deployment
   npm run preview-deploy
   ```

#### Manual Deployment
1. **Clone and setup**:
   ```bash
   git clone <your-repo-url>
   cd SIH-2025
   npm run install-deps
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy via Vercel CLI**:
   ```bash
   vercel
   ```

#### Configuration Files
- `vercel.json` - Vercel deployment configuration
- `package.json` - Root package scripts for deployment
- `frontend/vite.config.js` - Vite build configuration

#### Environment Variables
Add these environment variables in your Vercel dashboard:
- `NODE_ENV=production`

#### Build Settings
The deployment automatically:
- Builds the frontend using Vite
- Serves static files from the `dist` directory
- Applies security headers
- Configures proper routing for SPA

#### Domain Configuration
After deployment, you can:
- Connect a custom domain
- Configure DNS settings
- Set up SSL certificates (automatic with Vercel)

#### Mobile Optimization Features
- **Responsive Design**: All components adapt seamlessly to mobile screens
- **Touch-Friendly**: Minimum 44px touch targets for better usability
- **Optimized Performance**: Reduced motion and optimized animations for mobile
- **iOS Compatibility**: Prevents zoom on form inputs, proper viewport settings
- **Smooth Scrolling**: Enhanced scrolling experience on mobile devices
- **Grid Layouts**: Responsive grids that stack properly on small screens

#### Mobile-Specific Improvements
- Hero section with responsive text sizing (text-3xl to text-6xl)
- Optimized upload area with responsive padding and sizing
- Mobile-friendly navigation with collapsible menu
- Touch-optimized buttons and interactive elements
- Improved spacing and typography for mobile readability
- Better file list display with compact mobile layout

For more information, visit the [Vercel documentation](https://vercel.com/docs).
