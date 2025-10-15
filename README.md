# Northern Variables - Interactive Demos

This repository hosts interactive React-based demonstrations and components created by Northern Variables. These demos are embedded on our main website and showcase various capabilities and solutions.

## 🚀 Live Site

View all demos: `https://northernvariables.github.io/artifacts/`

## 📁 Repository Structure

```
artifacts/
├── index.html              # Directory page listing all demos
├── _template.html          # Template for creating new demos
├── example-demo.html       # Example/test demo
├── your-demo-1.html        # Your demos go here
├── your-demo-2.html
└── README.md
```

## ✨ Adding a New Demo

### Step 1: Get Your Artifact from Claude
Create your interactive component using Claude and copy the React code.

### Step 2: Create New Demo File
```bash
# Copy the template
cp _template.html new-demo-name.html
```

### Step 3: Paste Your Code
Open `new-demo-name.html` and paste your Claude artifact code where indicated in the template.

### Step 4: Test Locally
Open the HTML file in your browser to verify it works correctly.

### Step 5: Push to GitHub
```bash
git add .
git commit -m "Add new demo: [demo name]"
git push origin main
```

### Step 6: Update Index Page (Optional)
Add your new demo to `index.html` in the demo grid:

```html
<a href="new-demo-name.html" class="demo-card">
  <div class="icon">🎯</div>
  <h3>Your Demo Title</h3>
  <p>Brief description of what this demo does.</p>
</a>
```

### Step 7: Embed in WordPress
Use an iframe in Elementor's HTML widget:

```html
<div style="width: 100%; max-width: 1200px; margin: 0 auto;">
  <iframe 
    src="https://northernvariables.github.io/artifacts/new-demo-name.html"
    style="width: 100%; height: 600px; border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
    title="Demo Name"
  ></iframe>
</div>
```

## 🎨 Customization

### Brand Colors
Edit the CSS variables in `_template.html`:

```css
:root {
  --nv-primary: #1e40af;
  --nv-primary-dark: #1e3a8a;
  --nv-accent: #3b82f6;
}
```

### Header/Footer
The template includes an optional header with the Northern Variables logo. To remove it from specific demos, delete or comment out the header section in that demo file.

## 🛠️ Technology Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Babel Standalone** - JSX compilation
- **Lucide Icons** - Icon library (optional)
- **GitHub Pages** - Hosting

## 📊 Traffic & Bandwidth

GitHub Pages provides:
- 100GB bandwidth per month
- ~2 million page loads capacity
- Suitable for most business demo needs

If traffic exceeds limits, consider migrating to Vercel or Netlify.

## 📝 License & Usage

All code in this repository is © 2025 Northern Variables. 

These demonstrations are publicly viewable for portfolio and reference purposes. The code may not be copied, modified, or distributed without explicit written permission from Northern Variables.

## 📧 Contact

**Northern Variables**
- Website: [northernvariables.ca](https://northernvariables.ca)
- Substack: [axorc.substack.com](https://axorc.substack.com)
- Email: contact@northernvariables.ca

For licensing inquiries or custom demo requests, please reach out.

---

*Last updated: October 2025*
