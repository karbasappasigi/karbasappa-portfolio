# Karbasappa - Computer Science & Network Engineering Portfolio

A modern, high-performance personal portfolio website specifically tailored for **Karbasappa**, a Computer Science & Network Engineering student at Presidency University, Bengaluru.

## 🚀 Key Features

- **Cyber-Network Aesthetic**: Tailored for network engineers with high-tech typography, dark & light theme modes, and glassmorphism styling.
- **Interactive Canvas Network Topology**: Real-time 2D animated nodes and data packets simulating dynamic routing and packet switching across interconnected hubs.
- **Live Terminal & CLI**: Interactive Unix/Cisco-style console where visitors can run commands:
  - `help` - Show all commands
  - `whoami` - Profile overview
  - `ping [host]` - Simulated 4-packet ICMP test with RTT statistics
  - `traceroute [host]` - Multi-hop route trace
  - `skills` - Detailed matrix of protocols, cloud, and programming capabilities
  - `projects` - Topologies and systems overview
  - `certifications` - CCNA, Cisco Packet Tracer, GCP 300+ Badges, IBM Dev Day
  - `cat resume.txt` - Plain-text CV summary
  - `contact` - Direct phone, email, and social links
- **Interactive Project Architecture Modals**: SVG-powered topology diagrams for:
  - VoIP Network (Cisco 2811 Call Manager Express, Catalyst 3560, VLANs 10-40, QoS)
  - Campus Network Design (3 buildings, 500+ endpoints, OSPF/RIP failover)
  - Underwater Marine Life Tracking System (IoT Raspberry Pi telemetry platform)
  - Intelligent Customer Support Chatbot (Pinnacle Labs NLP/ML pipeline)
- **Live Simulated IoT Marine Telemetry**: Auto-fluctuating sensor readouts for water temperature, depth, salinity, and calibrated accuracy.
- **Filterable Skills Matrix**: Protocol categorization (Networking, Cloud & Security, Tools & Hardware, Programming & Scripting).
- **Printable / PDF-Ready Resume Modal**: Standardized clean CV view formatted for single-click printing or PDF export.
- **Instant Connect & Clipboard Toasts**: Direct click-to-copy for email and phone number with instant toast feedback.

---

## 📁 File Structure

```
karbasappa-portfolio/
├── index.html       # Semantic HTML5 layout with all profile sections & modals
├── style.css        # Responsive cyber-tech CSS, dark/light themes, animations
├── script.js        # Canvas simulation, CLI parser, modals, telemetry ticker
└── README.md        # Documentation & deployment guide
```

---

## 💻 Local Preview

To preview the portfolio locally:

### Option 1: Direct File Open
Simply double-click `index.html` or right-click and choose **Open with Browser** (Google Chrome, Edge, Firefox, Brave).

### Option 2: Python HTTP Server
Open a terminal in the project directory and run:
```bash
python -m http.server 8000
```
Then visit: `http://localhost:8000`

### Option 3: Node.js / npx serve
```bash
npx serve .
```

---

## 🌐 Free One-Click Deployment

### 1. GitHub Pages
1. Create a new GitHub repository named `portfolio` or `<username>.github.io`.
2. Push this folder's contents to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/<username>/portfolio.git
   git push -u origin main
   ```
3. Go to **Settings > Pages** in your GitHub repository.
4. Select the `main` branch and `/ (root)` folder, then click **Save**. Your site will be live at `https://<username>.github.io/portfolio/`.

### 2. Vercel / Netlify
- Drag and drop the `karbasappa-portfolio` folder directly into [Netlify Drop](https://app.netlify.com/drop) for instant deployment with a free HTTPS URL.

---

## 🛠️ Customization

- **Profile Links**: Update `https://github.com`, `https://linkedin.com`, and `https://www.credly.com` in `index.html` and `script.js` with your specific profile handles.
- **Resume Text**: Adjust dates or additional accomplishments in the `#resume-modal` section in `index.html`.
