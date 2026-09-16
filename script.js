/**
 * Karbasappa - Computer Science & Network Engineering Portfolio
 * Interactive Canvas, Terminal CLI, Modals, Telemetry, and State Management
 */

document.addEventListener('DOMContentLoaded', () => {
  initNetworkCanvas();
  initTypewriter();
  initSkillsFilter();
  initMarineTelemetry();
  initTerminal();
  initThemeToggle();
  initNavigation();
  initModals();
  initContactForm();
});

/* ===================================================================
   1. Interactive Network Topology Background Canvas
   Simulates network nodes & real-time data packets traversing links
   =================================================================== */
function initNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let nodes = [];
  let packets = [];
  const nodeCount = 55;
  const maxDistance = 140;
  const mouse = { x: null, y: null, radius: 160 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Node Class
  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2.2 + 1.5;
      this.isRouter = Math.random() > 0.82; // Special highlighted router node
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gravity interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.2;
          this.y -= (dy / dist) * force * 1.2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isRouter ? '#00f0ff' : '#38bdf8';
      ctx.shadowBlur = this.isRouter ? 10 : 4;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Packet Class (Data hopping along links)
  class Packet {
    constructor(sourceNode, targetNode) {
      this.source = sourceNode;
      this.target = targetNode;
      this.progress = 0;
      this.speed = 0.012 + Math.random() * 0.015;
    }

    update() {
      this.progress += this.speed;
      return this.progress < 1;
    }

    draw() {
      const currentX = this.source.x + (this.target.x - this.source.x) * this.progress;
      const currentY = this.source.y + (this.target.y - this.source.y) * this.progress;

      ctx.beginPath();
      ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#10b981';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Initialize Nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push(new Node());
  }

  // Spawn periodic data packets along connected links
  setInterval(() => {
    if (nodes.length < 2) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    // Find nearby node
    for (let i = 0; i < nodes.length; i++) {
      const b = nodes[i];
      if (a !== b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          packets.push(new Packet(a, b));
          if (packets.length > 25) packets.shift();
          break;
        }
      }
    }
  }, 400);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update & Draw Nodes
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].update();
      nodes[i].draw();

      // Connect with other nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Mouse Connection
      if (mouse.x !== null) {
        const mdx = nodes[i].x - mouse.x;
        const mdy = nodes[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const malpha = 1 - mdist / mouse.radius;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${malpha * 0.4})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    // Update & Draw Packets
    packets = packets.filter(packet => {
      const active = packet.update();
      if (active) packet.draw();
      return active;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. Hero Dynamic Typewriter Animation
   =================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    "Network Engineer",
    "CCNA Certified Specialist",
    "VoIP & Cisco Packet Tracer Architect",
    "Cloud & Infrastructure Engineer",
    "IoT Systems Developer",
    "Computer Science Engineer"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 75;
  const deleteSpeed = 40;
  const holdDelay = 1800;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === current.length) {
      delay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ===================================================================
   3. Skills Filter Tabs
   =================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* ===================================================================
   4. IoT Marine Telemetry Live Sensor Simulation
   =================================================================== */
function initMarineTelemetry() {
  const tempEl = document.getElementById('sensor-temp');
  const depthEl = document.getElementById('sensor-depth');
  const salEl = document.getElementById('sensor-salinity');

  if (!tempEl || !depthEl || !salEl) return;

  setInterval(() => {
    // Fluctuations around realistic marine baseline
    const temp = (24.4 + (Math.random() * 0.6 - 0.3)).toFixed(1);
    const depth = (18.2 + (Math.random() * 0.5 - 0.25)).toFixed(1);
    const sal = (34.7 + (Math.random() * 0.4 - 0.2)).toFixed(1);

    tempEl.textContent = `${temp} °C`;
    depthEl.textContent = `${depth} m`;
    salEl.textContent = `${sal} PSU`;
  }, 2500);
}

/* ===================================================================
   5. Interactive Network CLI Terminal
   =================================================================== */
function initTerminal() {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const submitBtn = document.getElementById('term-submit-btn');
  const clearBtn = document.getElementById('term-clear');
  const quickChips = document.querySelectorAll('.chip-btn');
  const openTerminalBtn = document.getElementById('btn-open-terminal');

  if (!terminalOutput || !terminalInput) return;

  const history = [];
  let historyIdx = -1;

  if (openTerminalBtn) {
    openTerminalBtn.addEventListener('click', () => {
      const termSec = document.getElementById('terminal-section');
      if (termSec) {
        termSec.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => terminalInput.focus(), 600);
      }
    });
  }

  // Clear Terminal
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      terminalOutput.innerHTML = `
        <div class="term-msg text-cyan">
          Terminal screen cleared. Type '<span class="text-emerald">help</span>' for available commands.
        </div>
      `;
    });
  }

  // Quick Command Chips
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      terminalInput.value = cmd;
      executeCommand(cmd);
      terminalInput.value = '';
    });
  });

  // Handle Input submission
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim();
      if (cmd) {
        history.push(cmd);
        historyIdx = history.length;
        executeCommand(cmd);
        terminalInput.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIdx > 0) {
        historyIdx--;
        terminalInput.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        terminalInput.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        terminalInput.value = '';
      }
    }
  });

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const cmd = terminalInput.value.trim();
      if (cmd) {
        history.push(cmd);
        historyIdx = history.length;
        executeCommand(cmd);
        terminalInput.value = '';
      }
    });
  }

  function appendOutput(content) {
    const div = document.createElement('div');
    div.className = 'term-result';
    div.innerHTML = content;
    terminalOutput.appendChild(div);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const fullCmd = rawCmd.trim();
    const args = fullCmd.split(' ');
    const command = args[0].toLowerCase();

    // Print command line
    const historyLine = document.createElement('div');
    historyLine.className = 'term-cmd-history';
    historyLine.innerHTML = `<span class="term-prompt-history">karbasappa@net-eng:~$</span> ${escapeHTML(fullCmd)}`;
    terminalOutput.appendChild(historyLine);

    switch (command) {
      case 'help':
        appendOutput(`
<span class="text-cyan">Available System Commands:</span>
  <span class="text-emerald">help</span>            - Display this manual
  <span class="text-emerald">whoami</span>          - Display engineer profile & qualifications
  <span class="text-emerald">ping [host]</span>     - Simulate ICMP ping to target host
  <span class="text-emerald">traceroute [host]</span>- Trace network hops to destination
  <span class="text-emerald">skills</span>          - List networking, cloud, and programming capabilities
  <span class="text-emerald">projects</span>        - Show key network topologies & IoT implementations
  <span class="text-emerald">certifications</span>  - Display verified credentials (CCNA, Cisco, GCP)
  <span class="text-emerald">cat resume.txt</span>  - Print plain-text resume summary
  <span class="text-emerald">contact</span>         - Display phone, email, and social coordinates
  <span class="text-emerald">clear</span>           - Clear screen buffer
  <span class="text-emerald">date</span>            - Display current system UTC/IST time
        `);
        break;

      case 'whoami':
        appendOutput(`
<span class="text-cyan">Name:</span> Karbasappa
<span class="text-cyan">Education:</span> B.E. Computer Science (Networks) @ Presidency University, Bengaluru
<span class="text-cyan">Specialization:</span> Network Engineering & Routing Protocols (OSPF/RIP/BGP), VoIP (Cisco CME)
<span class="text-cyan">Certifications:</span> CCNA 200-301 (Network Fundamentals), Cisco Packet Tracer Advanced
<span class="text-cyan">Location:</span> Bengaluru, Karnataka, India
<span class="text-cyan">Status:</span> Open for Network Engineering, Cloud & Software Internships / Roles
        `);
        break;

      case 'ping':
        const target = args[1] || 'karbasappa.gateway.net';
        appendOutput(`
<span class="text-cyan">PING ${escapeHTML(target)} (10.10.4.1): 56 data bytes</span>
64 bytes from 10.10.4.1: icmp_seq=1 ttl=64 time=0.412 ms
64 bytes from 10.10.4.1: icmp_seq=2 ttl=64 time=0.385 ms
64 bytes from 10.10.4.1: icmp_seq=3 ttl=64 time=0.392 ms
64 bytes from 10.10.4.1: icmp_seq=4 ttl=64 time=0.401 ms

<span class="text-emerald">--- ${escapeHTML(target)} ping statistics ---</span>
4 packets transmitted, 4 received, <span class="text-emerald">0% packet loss</span>, time 3004ms
rtt min/avg/max/mdev = 0.385/0.397/0.412/0.010 ms
        `);
        break;

      case 'traceroute':
        const traceTarget = args[1] || 'presidency.edu';
        appendOutput(`
<span class="text-cyan">traceroute to ${escapeHTML(traceTarget)} (172.16.10.1), 30 hops max, 60 byte packets</span>
 1  gateway.blr.lan (192.168.1.1)               0.512 ms  0.420 ms
 2  core-r1.presidency.net (10.0.0.1)           1.210 ms  1.104 ms  [OSPF Area 0]
 3  edge-sw01.isp-gateway.in (103.24.12.1)      4.821 ms  4.512 ms
 4  host.destination (172.16.10.1)              5.109 ms  4.980 ms
<span class="text-emerald">Trace complete. Zero packet jitter detected across all hops.</span>
        `);
        break;

      case 'skills':
        appendOutput(`
<span class="text-cyan">Networking Protocols:</span> TCP/IP, OSI Model, IPv4/IPv6, Subnetting (VLSM), RIP, OSPF, BGP basics, VLANs (802.1Q), STP, VoIP, Network Troubleshooting
<span class="text-cyan">Tools & Platforms:</span>    Cisco Packet Tracer (Advanced), Google Cloud Platform (GCP), Linux, Raspberry Pi, Wireshark
<span class="text-cyan">Cloud & Infrastructure:</span>Cloud Networking, VPC configuration, Firewall policies, Network Security
<span class="text-cyan">Languages:</span>            Python, C++, HTML, CSS, JavaScript, Bash scripting
        `);
        break;

      case 'projects':
        appendOutput(`
<span class="text-cyan">1. VoIP Network Implementation (Cisco Packet Tracer)</span>
   - 20+ IP phones across departments with VLAN separation & Cisco Call Manager (99.2% uptime).
<span class="text-cyan">2. Campus Network Design (Multi-Building Infrastructure)</span>
   - 500+ endpoints across 3 facilities, OSPF/RIP failover convergence, 98.5% delivery rate.
<span class="text-cyan">3. Underwater Marine Life Tracking System (IoT Solution)</span>
   - Raspberry Pi marine telemetry station with 95% sensor accuracy & Python analytics.
<span class="text-cyan">4. Intelligent Customer Support Chatbot (Pinnacle Labs)</span>
   - NLP & ML processing 100+ queries with 85%+ accuracy, 30% latency reduction.
        `);
        break;

      case 'certifications':
      case 'certs':
        appendOutput(`
<span class="text-emerald">[VERIFIED]</span> <span class="text-cyan">CCNA 200-301 (Network Fundamentals)</span> - Simplilearn SkillUp (Completed: August 20, 2026)
<span class="text-emerald">[VERIFIED]</span> <span class="text-cyan">Cisco Packet Tracer Advanced</span> - Simulation & Design Expertise
<span class="text-emerald">[VERIFIED]</span> <span class="text-cyan">Google Cloud Learning Badges</span> - 300+ Badges Completed & Recognized with Google Swag
<span class="text-emerald">[VERIFIED]</span> <span class="text-cyan">IBM Dev Day: Bob in Action</span> - Virtual Summit Participation (August 27-30, 2026)
        `);
        break;

      case 'cat':
        if (args[1] === 'resume.txt' || args[1] === 'resume') {
          appendOutput(`
===========================================================
KARBASAPPA | Computer Science & Networks Engineering
Bengaluru, India | +91-8496051416 | sigisangamesh6@gmail.com
===========================================================
* Bachelor of Engineering, CS (Networks) - Presidency University (Grad: 2027)
* Pre-University (PUC I & II) - Diamond PU College (2021-2023)
* CCNA 200-301 Certified & Cisco Packet Tracer Advanced Certified
* 300+ Google Cloud Platform Learning Badges
* Data Science Intern @ Pinnacle Labs
* Key Projects: VoIP Implementation (20+ phones), Campus Multi-Building Network (500+ hosts), Marine IoT Telemetry
Type '<span class="text-emerald">contact</span>' to connect directly.
===========================================================
          `);
        } else {
          appendOutput(`<span class="text-amber">cat: ${escapeHTML(args[1] || '')}: No such file. Try 'cat resume.txt'</span>`);
        }
        break;

      case 'contact':
        appendOutput(`
<span class="text-cyan">Email:</span>    sigisangamesh6@gmail.com
<span class="text-cyan">Phone:</span>    +91-8496051416
<span class="text-cyan">Location:</span> Bengaluru, Karnataka, India
<span class="text-cyan">GitHub:</span>   github.com
<span class="text-cyan">LinkedIn:</span> linkedin.com
<span class="text-cyan">Credly:</span>   credly.com
        `);
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        break;

      case 'date':
        appendOutput(new Date().toString());
        break;

      default:
        appendOutput(`<span class="text-amber">bash: ${escapeHTML(command)}: command not found. Type '<span class="text-emerald">help</span>' for available commands.</span>`);
        break;
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

/* ===================================================================
   6. Theme Toggle (Dark & Light Mode)
   =================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('kb-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('kb-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
    }
  }
}

/* ===================================================================
   7. Navigation & Mobile Drawer
   =================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isActive);
      mobileToggle.innerHTML = isActive 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // ScrollSpy for Active Nav Link
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 100;
      const secId = sec.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${secId}"]`);

      if (activeLink) {
        if (scrollY > secTop && scrollY <= secTop + secHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  });
}

/* ===================================================================
   8. Modals (Architecture Topology & Resume)
   =================================================================== */
function initModals() {
  const topologyModal = document.getElementById('topology-modal');
  const modalClose = document.getElementById('modal-close');
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('btn-open-resume');
  const resumeClose = document.getElementById('resume-modal-close');

  // Resume Modal
  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  if (resumeClose && resumeModal) {
    resumeClose.addEventListener('click', () => {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  // Topology Modal Close
  if (modalClose && topologyModal) {
    modalClose.addEventListener('click', () => {
      topologyModal.classList.remove('active');
      topologyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  // Close Modals on Overlay Click or Escape Key
  window.addEventListener('click', (e) => {
    if (e.target === topologyModal) {
      topologyModal.classList.remove('active');
      topologyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    if (e.target === resumeModal) {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (topologyModal) {
        topologyModal.classList.remove('active');
        topologyModal.setAttribute('aria-hidden', 'true');
      }
      if (resumeModal) {
        resumeModal.classList.remove('active');
        resumeModal.setAttribute('aria-hidden', 'true');
      }
      document.body.style.overflow = '';
    }
  });
}

// Global function to open Topology Modal with detailed graphics
window.openTopologyModal = function(type) {
  const modal = document.getElementById('topology-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');

  if (!modal || !title || !content) return;

  if (type === 'voip') {
    title.textContent = 'VoIP Network Architecture – Cisco Packet Tracer';
    content.innerHTML = `
      <div class="topo-modal-content">
        <p><strong>Overview:</strong> Full-scale Cisco Call Manager Express (CME) deployment connecting 20+ IP Telephones across 4 departments with VLAN segregation and prioritized QoS queuing.</p>
        
        <div class="topo-diagram-container">
          <svg class="topo-diagram-svg" viewBox="0 0 650 260" xmlns="http://www.w3.org/2000/svg">
            <rect width="650" height="260" fill="#090e17" rx="8"/>
            
            <!-- Router CME -->
            <rect x="260" y="20" width="130" height="50" rx="6" fill="#0f172a" stroke="#00f0ff" stroke-width="2"/>
            <text x="325" y="44" fill="#00f0ff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">Cisco 2811 Router</text>
            <text x="325" y="60" fill="#94a3b8" font-family="monospace" font-size="10" text-anchor="middle">Call Manager (CME)</text>

            <!-- Trunk Link -->
            <line x1="325" y1="70" x2="325" y2="105" stroke="#00f0ff" stroke-width="2" stroke-dasharray="4"/>
            <text x="340" y="92" fill="#10b981" font-family="monospace" font-size="9">802.1Q Trunk</text>

            <!-- Switch -->
            <rect x="250" y="105" width="150" height="40" rx="6" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="325" y="130" fill="#38bdf8" font-family="monospace" font-size="12" text-anchor="middle">Catalyst 3560 Switch</text>

            <!-- Department Links -->
            <line x1="280" y1="145" x2="100" y2="190" stroke="#94a3b8" stroke-width="1.5"/>
            <line x1="310" y1="145" x2="250" y2="190" stroke="#94a3b8" stroke-width="1.5"/>
            <line x1="340" y1="145" x2="400" y2="190" stroke="#94a3b8" stroke-width="1.5"/>
            <line x1="370" y1="145" x2="550" y2="190" stroke="#94a3b8" stroke-width="1.5"/>

            <!-- Endpoints -->
            <!-- Dept 1 -->
            <rect x="30" y="190" width="140" height="50" rx="6" fill="#131e33" stroke="#a855f7" stroke-width="1"/>
            <text x="100" y="210" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">Finance (VLAN 10)</text>
            <text x="100" y="228" fill="#a855f7" font-family="monospace" font-size="9" text-anchor="middle">IP Phones Ext: 101-105</text>

            <!-- Dept 2 -->
            <rect x="180" y="190" width="140" height="50" rx="6" fill="#131e33" stroke="#a855f7" stroke-width="1"/>
            <text x="250" y="210" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">HR Dept (VLAN 20)</text>
            <text x="250" y="228" fill="#a855f7" font-family="monospace" font-size="9" text-anchor="middle">IP Phones Ext: 201-205</text>

            <!-- Dept 3 -->
            <rect x="330" y="190" width="140" height="50" rx="6" fill="#131e33" stroke="#a855f7" stroke-width="1"/>
            <text x="400" y="210" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">Engineering (VLAN 30)</text>
            <text x="400" y="228" fill="#a855f7" font-family="monospace" font-size="9" text-anchor="middle">IP Phones Ext: 301-305</text>

            <!-- Dept 4 -->
            <rect x="480" y="190" width="140" height="50" rx="6" fill="#131e33" stroke="#a855f7" stroke-width="1"/>
            <text x="550" y="210" fill="#f8fafc" font-family="monospace" font-size="10" text-anchor="middle">Executive (VLAN 40)</text>
            <text x="550" y="228" fill="#a855f7" font-family="monospace" font-size="9" text-anchor="middle">IP Phones Ext: 401-405</text>
          </svg>
        </div>

        <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7;">
          <li>Configured DHCP Option 150 to broadcast TFTP server IP to Cisco IP Phones for instant boot configuration.</li>
          <li>Implemented separate Voice VLAN (ID 150) and Data VLANs with 802.1p priority tagging to prevent audio stutter.</li>
          <li>Achieved 99.2% uptime with zero packet degradation during peak concurrent calling simulations.</li>
        </ul>
      </div>
    `;
  } else if (type === 'campus') {
    title.textContent = 'Campus Network Infrastructure – Multi-Building';
    content.innerHTML = `
      <div class="topo-modal-content">
        <p><strong>Overview:</strong> Scalable enterprise campus architecture servicing 500+ active devices across 3 primary academic buildings with redundant OSPF/RIP failover links.</p>

        <div class="topo-diagram-container">
          <svg class="topo-diagram-svg" viewBox="0 0 650 240" xmlns="http://www.w3.org/2000/svg">
            <rect width="650" height="240" fill="#090e17" rx="8"/>
            
            <!-- Core Routers -->
            <rect x="180" y="20" width="120" height="45" rx="6" fill="#0f172a" stroke="#00f0ff" stroke-width="1.5"/>
            <text x="240" y="47" fill="#00f0ff" font-family="monospace" font-size="11" text-anchor="middle">Core Router A</text>

            <rect x="350" y="20" width="120" height="45" rx="6" fill="#0f172a" stroke="#00f0ff" stroke-width="1.5"/>
            <text x="410" y="47" fill="#00f0ff" font-family="monospace" font-size="11" text-anchor="middle">Core Router B</text>

            <!-- Redundant Cross-Link -->
            <line x1="300" y1="42" x2="350" y2="42" stroke="#10b981" stroke-width="2"/>
            <text x="325" y="36" fill="#10b981" font-family="monospace" font-size="8" text-anchor="middle">OSPF Area 0</text>

            <!-- Building 1 -->
            <line x1="200" y1="65" x2="100" y2="130" stroke="#38bdf8" stroke-width="1.5"/>
            <rect x="30" y="130" width="150" height="75" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1"/>
            <text x="105" y="155" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">Admin Building</text>
            <text x="105" y="172" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">120+ Hosts & Servers</text>
            <text x="105" y="188" fill="#10b981" font-family="monospace" font-size="9" text-anchor="middle">DNS / DHCP Services</text>

            <!-- Building 2 -->
            <line x1="260" y1="65" x2="325" y2="130" stroke="#38bdf8" stroke-width="1.5"/>
            <line x1="390" y1="65" x2="325" y2="130" stroke="#38bdf8" stroke-width="1.5"/>
            <rect x="250" y="130" width="150" height="75" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1"/>
            <text x="325" y="155" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">Engineering Block</text>
            <text x="325" y="172" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">250+ Lab Hosts</text>
            <text x="325" y="188" fill="#00f0ff" font-family="monospace" font-size="9" text-anchor="middle">VLAN 10, 20, 30</text>

            <!-- Building 3 -->
            <line x1="450" y1="65" x2="540" y2="130" stroke="#38bdf8" stroke-width="1.5"/>
            <rect x="470" y="130" width="150" height="75" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1"/>
            <text x="545" y="155" fill="#f8fafc" font-family="monospace" font-size="11" text-anchor="middle">Central Library</text>
            <text x="545" y="172" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">150+ Wireless Devices</text>
            <text x="545" y="188" fill="#a855f7" font-family="monospace" font-size="9" text-anchor="middle">WLC & Guest Portal</text>
          </svg>
        </div>

        <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7;">
          <li>Designed Variable Length Subnet Masking (VLSM) schema conserving IPv4 space across departments.</li>
          <li>Engineered dynamic multi-area OSPF routing with sub-second failover recovery when primary backbone links severed.</li>
          <li>Benchmarked network throughput and packet delivery rate at 98.5% under simulated peak campus load.</li>
        </ul>
      </div>
    `;
  } else if (type === 'marine') {
    title.textContent = 'Underwater Marine Life Tracking System – IoT Architecture';
    content.innerHTML = `
      <div class="topo-modal-content">
        <p><strong>Overview:</strong> Submersible IoT sensor platform utilizing Raspberry Pi for environmental telemetry, wireless telemetry transmission, and Python-driven telemetry analytics.</p>
        
        <div class="topo-diagram-container">
          <svg class="topo-diagram-svg" viewBox="0 0 650 200" xmlns="http://www.w3.org/2000/svg">
            <rect width="650" height="200" fill="#090e17" rx="8"/>
            
            <!-- Sensor Pod -->
            <rect x="30" y="60" width="140" height="80" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="100" y="85" fill="#38bdf8" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">SUBMERSIBLE POD</text>
            <text x="100" y="105" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">Water Temp &bull; Depth</text>
            <text x="100" y="122" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">Salinity &bull; Optical</text>

            <line x1="170" y1="100" x2="230" y2="100" stroke="#00f0ff" stroke-width="2"/>

            <!-- Raspberry Pi Controller -->
            <rect x="230" y="50" width="160" height="100" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
            <text x="310" y="75" fill="#10b981" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">Raspberry Pi Controller</text>
            <text x="310" y="95" fill="#f8fafc" font-family="monospace" font-size="9" text-anchor="middle">GPIO & ADC Interface</text>
            <text x="310" y="112" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">Python Telemetry Engine</text>
            <text x="310" y="128" fill="#10b981" font-family="monospace" font-size="9" text-anchor="middle">95% Sensor Calibration</text>

            <line x1="390" y1="100" x2="450" y2="100" stroke="#00f0ff" stroke-width="2" stroke-dasharray="4"/>

            <!-- Shore Dashboard -->
            <rect x="450" y="60" width="160" height="80" rx="6" fill="#131e33" stroke="#a855f7" stroke-width="1.5"/>
            <text x="530" y="85" fill="#a855f7" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">SURFACE BASE STATION</text>
            <text x="530" y="105" fill="#f8fafc" font-family="monospace" font-size="9" text-anchor="middle">Real-time Telemetry UI</text>
            <text x="530" y="122" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">Historical Trend Logging</text>
          </svg>
        </div>

        <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7;">
          <li>Calibrated multi-sensor arrays via Python scripts, achieving 95% measurement accuracy against standard marine baselines.</li>
          <li>Implemented fault-tolerant packet framing over wireless links, preserving sensor data during brief communication blackouts.</li>
          <li>Constructed live telemetry dashboards for researchers to monitor depth, temperature gradients, and salinity shifts.</li>
        </ul>
      </div>
    `;
  } else if (type === 'chatbot') {
    title.textContent = 'Customer Support Chatbot – ML Architecture';
    content.innerHTML = `
      <div class="topo-modal-content">
        <p><strong>Overview:</strong> Natural Language Processing and machine learning classification pipeline developed during internship at Pinnacle Labs to automate customer issue resolution.</p>

        <div class="topo-diagram-container">
          <svg class="topo-diagram-svg" viewBox="0 0 650 180" xmlns="http://www.w3.org/2000/svg">
            <rect width="650" height="180" fill="#090e17" rx="8"/>
            
            <rect x="30" y="55" width="110" height="70" rx="6" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="85" y="85" fill="#38bdf8" font-family="monospace" font-size="10" text-anchor="middle">Customer Input</text>
            <text x="85" y="105" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">100+ Queries</text>

            <line x1="140" y1="90" x2="180" y2="90" stroke="#00f0ff" stroke-width="2"/>

            <rect x="180" y="55" width="130" height="70" rx="6" fill="#0f172a" stroke="#00f0ff" stroke-width="1.5"/>
            <text x="245" y="85" fill="#00f0ff" font-family="monospace" font-size="10" text-anchor="middle">NLP Preprocessor</text>
            <text x="245" y="105" fill="#94a3b8" font-family="monospace" font-size="9" text-anchor="middle">Tokenize & Lemmatize</text>

            <line x1="310" y1="90" x2="350" y2="90" stroke="#00f0ff" stroke-width="2"/>

            <rect x="350" y="55" width="130" height="70" rx="6" fill="#0f172a" stroke="#10b981" stroke-width="1.5"/>
            <text x="415" y="85" fill="#10b981" font-family="monospace" font-size="10" text-anchor="middle">Intent Classifier</text>
            <text x="415" y="105" fill="#10b981" font-family="monospace" font-size="9" text-anchor="middle">85%+ Accuracy</text>

            <line x1="480" y1="90" x2="520" y2="90" stroke="#00f0ff" stroke-width="2"/>

            <rect x="520" y="55" width="100" height="70" rx="6" fill="#131e33" stroke="#a855f7" stroke-width="1.5"/>
            <text x="570" y="85" fill="#a855f7" font-family="monospace" font-size="10" text-anchor="middle">Auto-Response</text>
            <text x="570" y="105" fill="#a855f7" font-family="monospace" font-size="9" text-anchor="middle">30% Faster</text>
          </svg>
        </div>

        <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.7;">
          <li>Automated 100+ common customer inquiries with an 85%+ accuracy rating on intent classification.</li>
          <li>Engineered automated response logic that reduced customer wait time and latency by 30%.</li>
          <li>Conducted feature extraction and extensive data cleaning on unstructured conversational records.</li>
        </ul>
      </div>
    `;
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

/* ===================================================================
   9. Clipboard Copy Helper & Toast
   =================================================================== */
window.copyToClipboard = function(text, successMsg) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg || 'Copied to clipboard!');
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
};

function fallbackCopy(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg || 'Copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy to clipboard.');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3400);
}

// Attach quick email copy in hero
const heroCopyEmailBtn = document.getElementById('quick-copy-email');
if (heroCopyEmailBtn) {
  heroCopyEmailBtn.addEventListener('click', () => {
    window.copyToClipboard('sigisangamesh6@gmail.com', 'Email copied: sigisangamesh6@gmail.com');
  });
}

/* ===================================================================
   10. Contact Form Submission
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    // Direct mailto trigger as fallback & convenience
    const mailtoUrl = `mailto:sigisangamesh6@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;

    showToast(`Thank you, ${name}! Launching email client...`);
    
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1000);

    form.reset();
  });
}
