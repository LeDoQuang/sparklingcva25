# Sparkling 25 - Coming Soon Website

A beautiful, modern "Coming Soon" landing page with animated background particles, countdown timer, and email notification signup.

## 🌟 Features

- **Stunning gradient background** with animated particles
- **Live countdown timer** (set to 30 days from initial load)
- **Email notification signup** form
- **Fully responsive** design for mobile and desktop
- **Smooth animations** and hover effects
- **Social media links** ready to customize

## 🚀 Live Demo

Visit: [www.sparkling25.com](https://www.sparkling25.com)

## 📦 Project Structure

```
sparkling-test/
├── index.html          # Main landing page
├── CNAME               # Custom domain configuration
├── README.md           # This file
└── .github/
    └── copilot-instructions.md  # AI agent guidance
```

## 🔧 Setup for GitHub Pages

### 1. Create GitHub Repository

```powershell
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Beautiful coming soon page"

# Add remote and push (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/sparkling-test.git
git branch -M main
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** > **Pages**
3. Under "Source", select **main** branch
4. Click **Save**

### 3. Configure Custom Domain

1. In your domain registrar (e.g., Namecheap, GoDaddy), add these DNS records:

   **For www subdomain:**
   ```
   Type: CNAME
   Host: www
   Value: YOUR_USERNAME.github.io
   TTL: Automatic
   ```

   **For root domain (optional apex domain):**
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

2. Wait for DNS propagation (can take 24-48 hours, usually faster)

3. In GitHub Pages settings, the custom domain should show as configured
4. Enable **Enforce HTTPS** once the certificate is provisioned

## 🎨 Customization

### Update Countdown Target Date

Edit `index.html`, find the countdown section:

```javascript
// Change this line to set your target date
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 30);  // 30 days from now

// Or set a specific date:
// const targetDate = new Date('2025-12-31T23:59:59');
```

### Update Social Links

Replace the `#` in social link hrefs:

```html
<a href="https://facebook.com/yourpage" class="social-link" title="Facebook">
<a href="https://twitter.com/yourhandle" class="social-link" title="Twitter">
<a href="https://instagram.com/yourhandle" class="social-link" title="Instagram">
<a href="https://linkedin.com/in/yourprofile" class="social-link" title="LinkedIn">
```

### Change Colors

Modify the CSS gradient in `index.html`:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* Try: #ff6b6b to #feca57 (sunset) */
    /* Try: #11998e to #38ef7d (teal) */
    /* Try: #ee0979 to #ff6a00 (vibrant) */
}
```

### Email Form Integration

To connect the email form to a real backend:

1. Use a service like [Formspree](https://formspree.io/), [EmailJS](https://www.emailjs.com/), or [Netlify Forms](https://www.netlify.com/products/forms/)

2. Replace the `handleSubmit` function with your service endpoint

Example with Formspree:
```html
<form class="email-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <input type="email" name="email" class="email-input" placeholder="Enter your email" required>
    <button type="submit" class="notify-btn">Notify Me</button>
</form>
```

## 🧪 Local Development

Simply open `index.html` in your browser:

```powershell
# Using default browser
Start-Process index.html

# Or with Python simple server
python -m http.server 8000
# Then visit: http://localhost:8000

# Or with Node.js http-server
npx http-server -p 8000
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Feel free to customize this page for your own projects! The code is clean and well-commented for easy modifications.

## 📄 License

Free to use for personal and commercial projects.

## 🎯 Next Steps

Once your site is live:
- [ ] Test on mobile devices
- [ ] Connect email form to a backend service
- [ ] Add Google Analytics or similar tracking
- [ ] Optimize images if you add any
- [ ] Test across different browsers
- [ ] Share on social media!

---

Made with ✨ and 💜
