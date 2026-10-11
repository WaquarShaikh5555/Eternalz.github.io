# Waquar Shaikh Portfolio

A premium, production-ready personal portfolio built with HTML, CSS, and vanilla JavaScript.

## Features
- Dark theme with light/dark mode toggle
- Responsive sticky navigation and mobile menu
- Hero section with animated typing effect
- About, Skills, Projects, Experience, and Contact sections
- Glassmorphism cards, gradients, and smooth entry animations
- Contact form with validation and honeypot field
- SEO metadata and social preview tags
- Basic GitHub Pages / static hosting setup

## Run locally
1. Open the project folder in a code editor.
2. Serve it with any static server, for example:
   ```bash
   python3 -m http.server 8000
   ```
3. Open http://localhost:8000 in your browser.

## Deploy
This site is designed for static hosting.

### GitHub Pages
1. Push this repo to GitHub.
2. Go to Repository Settings → Pages.
3. Select the default branch and root folder.
4. Ensure the custom domain is set to `eternalz.me` and that `CNAME` exists.

### Netlify
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; base-uri 'self'; form-action 'self' https://formspree.io; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://formspree.io;"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

### Vercel
Add the following to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Content-Security-Policy", "value": "default-src 'self'; base-uri 'self'; form-action 'self' https://formspree.io; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://formspree.io;" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

### Nginx
```nginx
add_header Content-Security-Policy "default-src 'self'; base-uri 'self'; form-action 'self' https://formspree.io; frame-ancestors 'none'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://formspree.io;" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

## Contact form and security notes
- Use a backend or Formspree/EmailJS endpoint for production email sending.
- The current form includes a honeypot field and basic client-side validation.
- Don’t expose secrets or API keys in browser code.
- Use HTTPS only and set proper domain DNS records for `eternalz.me`.
- Replace placeholder social URLs, project details, and personal bio text before going live.

## Important
The repository already contains a `CNAME` file pointing to `eternalz.me`, which is the correct step for GitHub Pages custom domain setup. Actual live availability depends on DNS configuration at your domain provider and the GitHub Pages publishing settings.
