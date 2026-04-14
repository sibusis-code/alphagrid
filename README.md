# AlphaGrid Electrotechnical Solutions - Website

A modern, responsive catalog website for AlphaGrid Electrotechnical Solutions showcasing fiber optics, active equipment, power systems, and RF products.

## 🚀 Features

- **Product Catalog**: 17 products across 5 categories with detailed specifications
- **Advanced Search**: Real-time product search with relevance scoring
- **Category Filtering**: Filter products by category on the products page
- **Contact Forms**: Contact and quote request forms with validation
- **Responsive Design**: Mobile-first design that works on all devices
- **Smooth Animations**: Scroll-based animations and page transitions
- **Partner Showcase**: Display of trusted partners (DFS, Narada, Huber+Suhner, Emtelle)

## 📁 Project Structure

```
AlphaGrid/
├── index.html                 # Homepage
├── products.html              # Product catalog page
├── about.html                 # About us page
├── contact.html               # Contact page
├── quote.html                 # Quote request page
├── README.md                  # This file
│
├── assets/
│   ├── css/
│   │   ├── variables.css      # CSS custom properties (colors, spacing, etc.)
│   │   ├── reset.css          # Browser normalization
│   │   ├── layout.css         # Grid, header, footer, navigation
│   │   ├── components.css     # Buttons, cards, forms, modals
│   │   ├── responsive.css     # Breakpoints and media queries
│   │   └── animations.css     # Scroll reveals, transitions, effects
│   │
│   ├── js/
│   │   ├── utils.js           # Utility functions (validation, debounce, etc.)
│   │   ├── products.js        # Product loading, filtering, rendering
│   │   ├── search.js          # Search functionality
│   │   ├── forms.js           # Form validation and submission
│   │   ├── navigation.js      # Mobile menu, smooth scroll, active links
│   │   └── animations.js      # Intersection Observer, lazy loading
│   │
│   └── images/
│       ├── logo.png           # AlphaGrid logo
│       ├── favicon.png        # Browser favicon
│       ├── products/          # Product images (GPON.jpg, ONT.jpg, etc.)
│       └── partners/          # Partner logos (dfs.png, narada.png, etc.)
│
└── data/
    └── products.json          # Product catalog data
```

## 🛠️ Setup Instructions

### Local Development

1. **Clone or Download** this repository to your computer

2. **Open the Website**
   - Simply open `index.html` in a web browser
   - No build process or server required for basic functionality

3. **For Development** (optional):
   - Use a local development server for better testing:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server -p 8000
   ```
   - Then visit `http://localhost:8000` in your browser

### Adding Product Images

1. Place product images in `assets/images/products/`
2. Name them according to the product ID (e.g., `GPON.jpg`, `ONT-4GE.png`)
3. Images will be automatically displayed using the paths in `products.json`

### Adding Partner Logos

1. Place partner logos in `assets/images/partners/`
2. Recommended format: PNG with transparent background
3. Recommended size: 200x100px (or similar aspect ratio)

## 📝 Content Management

### Updating Products

Edit `data/products.json` to add, remove, or modify products:

```json
{
  "products": [
    {
      "id": "PRODUCT-ID",
      "name": "Product Name",
      "category": "Fibre Optics",
      "description": "Product description...",
      "specifications": [
        "Specification 1",
        "Specification 2"
      ],
      "features": [
        "Feature 1",
        "Feature 2"
      ],
      "imagePath": "assets/images/products/PRODUCT-ID.jpg",
      "partner": "Partner Name (optional)"
    }
  ]
}
```

**Categories**: Must be one of:
- Fibre Optics
- Active Equipment
- Power & Energy
- Fibre Management
- RF Products

### Updating Contact Information

Update contact details in all HTML files (search for these and replace):
- **Email**: `sales@alphagrid.co.za`
- **Phone**: `+27 65 052 9081`
- **Website**: `www.alphagrid.co.za`

Files to update:
- Footer section in all HTML files
- Contact page (`contact.html`)
- Quote page (`quote.html`)

### Updating Brand Colors

Edit `assets/css/variables.css`:

```css
:root {
  --color-primary: #003D6A;    /* Main blue */
  --color-accent: #8CC63F;     /* Accent green */
  /* ... other colors ... */
}
```

## 📧 Form Configuration

### Setting Up Form Submissions

The contact and quote forms are configured to use **FormSpree**. To enable form submissions:

1. **Create a FormSpree Account**
   - Go to [https://formspree.io/](https://formspree.io/)
   - Sign up for a free account

2. **Create Form Endpoints**
   - Create two forms: one for "Contact" and one for "Quote"
   - Copy the form endpoints (e.g., `https://formspree.io/f/YOUR_FORM_ID`)

3. **Update Form Actions**
   
   In `assets/js/forms.js`, update the endpoints:
   ```javascript
   // Contact Form
   const CONTACT_FORM_ENDPOINT = 'https://formspree.io/f/YOUR_CONTACT_FORM_ID';
   
   // Quote Form
   const QUOTE_FORM_ENDPOINT = 'https://formspree.io/f/YOUR_QUOTE_FORM_ID';
   ```

### Alternative: EmailJS

If you prefer EmailJS instead:

1. Sign up at [https://www.emailjs.com/](https://www.emailjs.com/)
2. Create email templates
3. Update the form submission functions in `assets/js/forms.js`

## 🚀 Deployment

### Option 1: Netlify (Recommended)

1. Create account at [https://www.netlify.com/](https://www.netlify.com/)
2. Drag and drop the entire project folder
3. Site will be live at `https://your-site-name.netlify.app`
4. **Netlify Forms**: Enable Netlify Forms for easy form handling without FormSpree

### Option 2: Vercel

1. Create account at [https://vercel.com/](https://vercel.com/)
2. Import the project from GitHub or upload directly
3. Site will be live at `https://your-site-name.vercel.app`

### Option 3: GitHub Pages

1. Create a GitHub repository
2. Upload all files
3. Go to Settings → Pages
4. Select main branch as source
5. Site will be live at `https://your-username.github.io/repository-name`

### Option 4: Traditional Hosting

1. Upload all files to your web host via FTP
2. Place files in the public_html or www directory
3. Ensure `index.html` is in the root directory

## 🎨 Customization

### Changing Typography

Edit `assets/css/variables.css`:

```css
:root {
  --font-primary: 'Segoe UI', system-ui, sans-serif;
  --font-heading: 'Segoe UI', system-ui, sans-serif;
}
```

To use custom fonts (e.g., Google Fonts):
1. Add font link to `<head>` of all HTML files
2. Update CSS variables

### Modifying Animations

Edit `assets/css/animations.css` or `assets/js/animations.js`:
- Adjust animation duration in CSS
- Modify Intersection Observer thresholds in JS
- Add/remove animation classes

### Responsive Breakpoints

Edit `assets/css/responsive.css`:

```css
/* Current breakpoints */
@media (min-width: 640px)  { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Mobile menu opens/closes properly
- [ ] Search finds relevant products
- [ ] Category filters work on products page
- [ ] Product modal displays details
- [ ] Contact form validates fields
- [ ] Quote form pre-fills product from URL parameter
- [ ] All forms show validation errors
- [ ] Responsive design works at 375px, 768px, 1440px
- [ ] Images load (or placeholders show)
- [ ] Smooth scrolling works
- [ ] Animations trigger on scroll

### Browser Testing

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS 14+, Android 8+)

## 🔧 Troubleshooting

### Forms Not Submitting
- Check FormSpree endpoint is correct in `assets/js/forms.js`
- Verify FormSpree account is active
- Check browser console for errors

### Products Not Loading
- Ensure `data/products.json` is valid JSON
- Check browser console for fetch errors
- Verify file path is correct

### Images Not Showing
- Check image paths in `products.json`
- Ensure images exist in `assets/images/products/`
- Check file extensions match (jpg vs png)

### Search Not Working
- Ensure products.json loaded successfully
- Check browser console for JavaScript errors
- Verify search.js is included before other scripts

### Mobile Menu Not Opening
- Check navigation.js is loaded
- Verify mobile menu button has correct class
- Check browser console for errors

## 📄 License

Copyright © 2026 AlphaGrid Electrotechnical Solutions. All rights reserved.

## 📞 Support

For questions or support with this website:
- **Email**: sales@alphagrid.co.za
- **Phone**: +27 65 052 9081
- **Website**: www.alphagrid.co.za

---

**Built with HTML, CSS, and vanilla JavaScript** • No frameworks or dependencies required
