// ===== GESTIONE PAGINA INDEX =====
function detectIndexPage() {
    const path = window.location.pathname;
    const isIndex = path.endsWith('index.html') || 
                   path === '/' || 
                   path.endsWith('/');
    
    if (isIndex) {
        document.body.classList.add('index-page');
        enhanceIndexPage();
    } else {
        enhanceContentPage();
    }
}

// ===== MIGLIORAMENTI PAGINA INDEX =====
function enhanceIndexPage() {
    // Aggiungi un titolo accattivante se non esiste
    const sidebar = document.getElementById('sidebar');
    if (sidebar && !sidebar.querySelector('.welcome-title')) {
        const title = document.createElement('h1');
        title.className = 'welcome-title';
        title.textContent = '📚 Documentazione';
        title.style.cssText = `
            margin-bottom: 20px;
            font-size: 2.5em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        `;
        sidebar.insertBefore(title, sidebar.firstChild);
    }
}

// ===== MIGLIORAMENTI PAGINA CONTENUTO =====
function enhanceContentPage() {
    // Evidenzia il link attivo nel TOC
    highlightActiveTOCLink();
    
    // Aggiungi smooth scroll
    addSmoothScroll();
    
    // Aggiungi pulsante "torna su"
    addBackToTopButton();
}

// Evidenzia il link del TOC corrispondente alla pagina corrente
function highlightActiveTOCLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('#sidebar a');
    
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.style.cssText = `
                background: #a5d5ff;
                color: #1a4070;
                font-weight: 600;
                border-left: 4px solid #667eea;
            `;
        }
    });
}

// Aggiungi smooth scroll per i link interni
function addSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Aggiungi pulsante "torna su"
function addBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        z-index: 1000;
        pointer-events: none;
    `;
    
    document.body.appendChild(button);
    
    // Mostra/nascondi il pulsante in base allo scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        } else {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    });
    
    // Click per tornare su
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-5px)';
        button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    });
}

// ===== ANIMAZIONI PER I LINK =====
function addLinkAnimations() {
    const contentLinks = document.querySelectorAll('#content a');
    contentLinks.forEach(link => {
        link.style.transition = 'all 0.2s ease';
        
        link.addEventListener('mouseenter', function() {
            this.style.color = '#667eea';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });
}

// ===== INIZIALIZZAZIONE =====
document.addEventListener('DOMContentLoaded', () => {
    detectIndexPage();
    addLinkAnimations();
});

// Esegui anche subito nel caso il DOM sia già caricato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        detectIndexPage();
        addLinkAnimations();
    });
} else {
    detectIndexPage();
    addLinkAnimations();
}
//plastex --extra-css=test.css --extra-js=custom.js --mathjax-url="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML"  main.tex