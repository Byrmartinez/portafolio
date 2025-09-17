document.addEventListener('DOMContentLoaded', function () {
    const mainNavbar = document.getElementById('mainNavbar');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIconMoon = document.getElementById('theme-icon-moon');
    const themeIconSun = document.getElementById('theme-icon-sun');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const brandLink = document.querySelector('.navbar-brand');
    const sections = document.querySelectorAll('section');

    // Actualizar el año actual en el footer
    window.addEventListener("load", () => {
        const currentYear = new Date().getFullYear();
        const yearElement = document.getElementById("currentYear");
        if (yearElement) {
            yearElement.innerText = currentYear;
        }
    });

    // --- Navegación suave al hacer clic en los enlaces ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Si el enlace tiene un href que apunta a un ID
            if (link.getAttribute('href')?.startsWith('#')) {
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();

                    // Scroll suave hacia la sección
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Cerrar el menú de hamburguesa en móvil si está abierto
                    const navbarToggler = document.querySelector('.navbar-toggler');
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show') && navbarToggler.offsetParent !== null) {
                        bootstrap.Collapse.getInstance(navbarCollapse).hide();
                    }
                }
            }
        });
    });

    // Manejar clic en el logo/brand para volver al inicio
    if (brandLink) {
        brandLink.addEventListener('click', (e) => {
            if (brandLink.getAttribute('href') === '#hero') {
                e.preventDefault();
                const heroSection = document.getElementById('hero');
                if (heroSection) {
                    heroSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }

    // Actualizar enlaces activos del navbar basados en la posición de scroll
    const updateActiveNavLink = () => {
        let scrollPosition = window.scrollY + 100; // Offset para mejorar UX

        // Encontrar la sección actual basada en la posición de scroll
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Si estamos en la sección actual
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remover clase activa de todos los enlaces
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Añadir clase activa al enlace correspondiente
                const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };

    // Escuchar evento de scroll para actualizar enlaces activos
    window.addEventListener('scroll', updateActiveNavLink);

    // Animaciones al hacer scroll mejoradas para responsividad
    const checkVisibility = () => {
        const animatedElements = document.querySelectorAll('.animated-on-scroll');
        const windowHeight = window.innerHeight;

        animatedElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = windowHeight > 768 ? 150 : 100; // Ajustar para móviles

            if (elementTop < windowHeight - elementVisible) {
                element.style.transitionDelay = `${index % 5 * 0.1}s`; // Stagger effect
                element.classList.add('visible');
            } else {
                element.classList.remove('visible');
                element.style.transitionDelay = '';
            }
        });
    };

    // Ejecutar checkVisibility en scroll y al cargar
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('load', checkVisibility);

    // --- Funcionalidad del Modo Claro/Oscuro ---
    const setInitialTheme = () => {
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme) {
            body.setAttribute('data-bs-theme', storedTheme);
        } else if (systemPrefersDark) {
            body.setAttribute('data-bs-theme', 'dark');
        } else {
            body.setAttribute('data-bs-theme', 'light');
        }
        updateThemeIcon(body.getAttribute('data-bs-theme'));
    };

    const updateThemeIcon = (theme) => {
        if (theme === 'dark') {
            themeIconMoon.classList.add('d-none');
            themeIconSun.classList.remove('d-none');
        } else {
            themeIconMoon.classList.remove('d-none');
            themeIconSun.classList.add('d-none');
        }
    };

    themeToggle.addEventListener('click', () => {
        let currentTheme = body.getAttribute('data-bs-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';

        // Iniciar transición
        body.classList.add('theme-transitioning');

        // Cambiar tema después de un pequeño delay
        setTimeout(() => {
            body.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);

            // Remover clase de transición después de que termine
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
            }, 1200);
        }, 50);
    });

    // Inicializar tema
    setInitialTheme();

    // Manejar la navegación con hash en la URL al cargar la página
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            // Pequeño retraso para asegurar que la página ha cargado completamente
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    // Observador mejorado para elementos que se animan al entrar en vista
    const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Opcional: resetear animación al salir de vista
                // entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: window.innerWidth <= 768 ? '0px 0px -30px 0px' : '0px 0px -50px 0px' // Ajustar para móviles
    });

    // Seleccionar todos los elementos a animar al hacer scroll
    const elementsToAnimate = document.querySelectorAll('.animated-on-scroll, .project-card-container');
    elementsToAnimate.forEach(element => {
        animateOnScrollObserver.observe(element);
    });

    // Función para el efecto de máquina de escribir
    function typeText(element, text, speed, callback) {
        let i = 0;
        element.classList.remove('invisible');
        element.textContent = '';
        element.classList.add('typing');

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing');
                if (callback) callback();
            }
        }
        type();
    }

    // Observador específico para la columna de texto de "Sobre Mí"
    const aboutTextObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const aboutTextCol = entry.target.querySelector('.col-md-8.animated-on-scroll');

            if (entry.isIntersecting && aboutTextCol && !aboutTextCol.dataset.typed) {
                aboutTextCol.classList.add('visible');

                const delayBeforeTyping = 700;
                const typingSpeed = window.innerWidth <= 768 ? 30 : 50; // Más rápido en móviles

                setTimeout(() => {
                    const typewriterElement = aboutTextCol.querySelector('.about-typewriter-text');
                    const textToType = typewriterElement.dataset.typewriterText;
                    const techIconsContainer = aboutTextCol.querySelector('.tech-icons-container');

                    if (typewriterElement && textToType) {
                        typeText(typewriterElement, textToType, typingSpeed, () => {
                            if (techIconsContainer) {
                                techIconsContainer.classList.add('visible');
                            }
                        });
                        aboutTextCol.dataset.typed = 'true';
                    }
                }, delayBeforeTyping);

                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: window.innerWidth <= 768 ? 0.3 : 0.5 // Threshold más bajo para móviles
    });

    // Observar la fila principal de la sección "Sobre Mí"
    const aboutSectionRow = document.querySelector('#sobre-mi .row.r-background');
    if (aboutSectionRow) {
        aboutTextObserver.observe(aboutSectionRow);
    }

    // Observador para secciones para actualizar el enlace activo
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                });
                const correspondingLink = document.querySelector(`#mainNavbar .nav-link[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                    correspondingLink.setAttribute('aria-current', 'page');
                }
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px'
    });

    // Observar cada sección
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Navegación suave mejorada
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            try {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Cerrar menú móvil si está abierto
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }
            } catch (error) {
                console.error("Error scrolling to section:", error);
            }
        });
    });

    // Manejar específicamente el botón "Mis Proyectos"
    const projectsButton = document.querySelector('[data-navigate-to-section="1"]');
    if (projectsButton) {
        projectsButton.addEventListener('click', function (e) {
            try {
                const target = document.querySelector('#proyectos');
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch (error) {
                console.error("Error scrolling to projects section:", error);
            }
        });
    }

    // Optimizaciones para rendimiento en móviles
    let ticking = false;

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavLink);
            ticking = true;
        }
    }

    function updateActiveNavLinkOptimized() {
        updateActiveNavLink();
        ticking = false;
    }

    // Reemplazar el listener de scroll original con la versión optimizada
    window.removeEventListener('scroll', updateActiveNavLink);
    window.addEventListener('scroll', requestTick, { passive: true });

    // Manejar cambios de orientación en móviles
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            checkVisibility();
        }, 100);
    });

    // Optimizar resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            checkVisibility();
        }, 150);
    });
});

// Función para copiar email al portapapeles con mejoras para móviles
function copyEmail() {
    const emailBtn = document.getElementById('copyEmailBtn');
    const email = emailBtn.getAttribute('data-email');
    const successMsg = document.getElementById('copySuccess');

    // Usar la API moderna del portapapeles
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyEmail(email);
        });
    } else {
        fallbackCopyEmail(email);
    }
}

// Función fallback para copiar mejorada
function fallbackCopyEmail(email) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.left = '-9999px'; // Mover fuera de la pantalla
    textArea.setAttribute('readonly', '');
    textArea.style.pointerEvents = 'none';
    textArea.style.fontSize = '16px'; // Prevenir zoom en iOS

    document.body.appendChild(textArea);

    // Para dispositivos móviles
    if (/ipad|iphone/i.test(navigator.userAgent)) {
        textArea.contentEditable = true;
        textArea.readOnly = false;
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        textArea.setSelectionRange(0, 999999);
    } else {
        textArea.select();
    }

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess();
        } else {
            throw new Error('Copy command failed');
        }
    } catch (err) {
        console.error('Error al copiar email:', err);
        // Mostrar el email para que el usuario lo copie manualmente
        if (window.confirm(`No se pudo copiar automáticamente.\n¿Quieres ver el email para copiarlo manualmente?\n\nEmail: ${email}`)) {
            // En móviles, mostrar el email de forma más visible
            alert(`Email: ${email}`);
        }
    }

    document.body.removeChild(textArea);
}

// Mostrar mensaje de éxito mejorado
function showCopySuccess() {
    const successMsg = document.getElementById('copySuccess');
    const copyBtn = document.getElementById('copyEmailBtn');

    // Mostrar mensaje
    successMsg.classList.remove('d-none');

    // Vibrar en dispositivos móviles que lo soporten
    if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
    }

    // Cambiar temporalmente el texto del botón
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>¡Copiado!';
    copyBtn.classList.add('btn-success');
    copyBtn.classList.remove('btn-secondary');
    copyBtn.disabled = true;

    // Restaurar después de 3 segundos
    setTimeout(() => {
        successMsg.classList.add('d-none');
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('btn-success');
        copyBtn.classList.add('btn-secondary');
        copyBtn.disabled = false;
    }, 3000);
}

// Función mejorada para mostrar aviso de WhatsApp
function mostrarAviso(event) {
    event.preventDefault();

    const email = "byr.martinez@duocuc.cl";
    const mensaje = `Esta funcionalidad aún no está lista.\n\nPuedes contactarme al email:\n${email}\n\n¿Quieres copiar el email al portapapeles?`;

    if (confirm(mensaje)) {
        // Intentar copiar al portapapeles
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(() => {
                alert("¡Email copiado al portapapeles!");
                // Vibrar si está disponible
                if ('vibrate' in navigator) {
                    navigator.vibrate(200);
                }
            }).catch(() => {
                alert(`Email: ${email}\n\n(Copia manualmente)`);
            });
        } else {
            // Fallback para navegadores sin soporte
            const textArea = document.createElement('textarea');
            textArea.value = email;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert("¡Email copiado al portapapeles!");
            } catch (err) {
                alert(`Email: ${email}\n\n(Copia manualmente)`);
            }
            document.body.removeChild(textArea);
        }
    }
}