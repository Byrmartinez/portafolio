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
            if (brandLink.getAttribute('href') === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
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

    // Animaciones al hacer scroll
    const checkVisibility = () => {
        const animatedElements = document.querySelectorAll('.animated-on-scroll');

        animatedElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150; // Cuántos píxeles deben estar visibles antes de animar

            if (elementTop < window.innerHeight - elementVisible) {
                element.style.transitionDelay = `${index % 5 * 0.1}s`; // Stagger effect (limitado a grupos de 5)
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
        body.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
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
    // Observador para elementos que simplemente se animan al entrar en vista
    const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejar de observar una vez que la animación se ha disparado
                // observer.unobserve(entry.target); // Descomentar si solo quieres que anime la primera vez
            } else {
                // Opcional: quitar la clase 'visible' si el elemento sale de vista
                // entry.target.classList.remove('visible'); // Descomentar si quieres que se resetee al salir
            }
        });
    }, {
        threshold: 0.1, // El 10% del elemento debe ser visible para activarse
        rootMargin: '0px 0px -50px 0px' // Empezar la animación 50px antes de que llegue al final del viewport
    });

    // Seleccionar todos los elementos a animar al hacer scroll
    const elementsToAnimate = document.querySelectorAll('.animated-on-scroll, .project-card-container');
    elementsToAnimate.forEach(element => {
        // Asegurarse de que los elementos estén invisibles por defecto si no lo están en CSS
        // element.style.opacity = 0; // No necesario si tu CSS ya los oculta inicialmente
        animateOnScrollObserver.observe(element);
    });


    // ==================================================
    // 3. Efecto Typewriter y Animación de Íconos (Integrado con Scroll Animation)
    // ==================================================

    // Función para el efecto de máquina de escribir
    function typeText(element, text, speed, callback) {
        let i = 0;
        element.classList.remove('invisible'); // ⬅️ Muy importante
        element.textContent = ''; // Limpiar contenido inicial
        element.classList.add('typing'); // Opcional

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.remove('typing'); // Opcional
                if (callback) callback();
            }
        }
        type();
    }


    // Observador específico para la columna de texto de "Sobre Mí"
    const aboutTextObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Identificar la columna de texto de la sección Sobre Mí
            const aboutTextCol = entry.target.querySelector('.col-md-8.animated-on-scroll'); // Ajusta el selector si cambias las clases

            // Asegurarse de que sea la columna de texto y que esté entrando en vista
            if (entry.isIntersecting && aboutTextCol && !aboutTextCol.dataset.typed) {
                // Añadir la clase visible para la animación CSS inicial (fade-in/slide-up)
                aboutTextCol.classList.add('visible');

                // Esperar un poco después de la animación CSS inicial para empezar el typeo
                // Ajusta el tiempo según la duración de tu CSS transition (ej: 0.6s)
                const delayBeforeTyping = 700; // ms
                const typingSpeed = 50; // Velocidad del typeo en ms por carácter

                setTimeout(() => {
                    const typewriterElement = aboutTextCol.querySelector('.about-typewriter-text');
                    const textToType = typewriterElement.dataset.typewriterText;
                    const techIconsContainer = aboutTextCol.querySelector('.tech-icons-container');


                    if (typewriterElement && textToType) {
                        // Ejecutar el typeo
                        typeText(typewriterElement, textToType, typingSpeed, () => {
                            // Callback al finalizar el typeo
                            if (techIconsContainer) {
                                // Disparar la animación de los íconos
                                techIconsContainer.classList.add('visible');
                                // Opcional: animar íconos individualmente (ver CSS comentado)
                                // animateIndividualIcons(techIconsContainer.querySelectorAll('.tech-icon'));
                            }
                        });
                        // Marcar como "tipiado" para no repetir
                        aboutTextCol.dataset.typed = 'true';
                    }
                }, delayBeforeTyping);

                // Dejar de observar esta columna una vez activada
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Ajusta si quieres que se active cuando la sección esté más visible
    });

    // Observar la fila principal de la sección "Sobre Mí" para saber cuándo está visible
    const aboutSectionRow = document.querySelector('#sobre-mi .row.r-background'); // Asegúrate de que este selector apunte al contenedor correcto
    if (aboutSectionRow) {
        aboutTextObserver.observe(aboutSectionRow);
    }


    // ==================================================
    // 4. Resaltar Enlace de Navegación Activo
    // ==================================================



    // Observador para secciones para actualizar el enlace activo
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                // Eliminar clase 'active' de todos los enlaces
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                });
                // Añadir clase 'active' al enlace correspondiente
                const correspondingLink = document.querySelector(`#mainNavbar .nav-link[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                    correspondingLink.setAttribute('aria-current', 'page');
                }
            }
        });
    }, {
        // Ajusta estos valores para determinar cuándo una sección se considera "activa"
        // threshold: 0.7, // Una sección está activa cuando al menos el 70% es visible
        rootMargin: '-50% 0px -50% 0px' // Considera activa la sección que cruza la línea media del viewport
    });

    // Observar cada sección
    sections.forEach(section => {
        sectionObserver.observe(section);
    });



    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Solo prevenir el default si el hash apunta a una sección existente
            try {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start' // O 'center', 'end'. 'start' es común para secciones
                    });
                }
            } catch (error) {
                console.error("Error scrolling to section:", error);
                // Si hay un error (ej: selector inválido), permitir el comportamiento por defecto
            }

        });
    });

    // Manejar específicamente el botón "Mis Proyectos" si usa data-navigate-to-section
    const projectsButton = document.querySelector('.animated-hero-button[data-navigate-to-section="1"]');
    if (projectsButton) {
        projectsButton.addEventListener('click', function (e) {
            // En este caso, sabemos que queremos ir a #proyectos
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
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.remove('hidden');
            el.classList.add('visible');
            startTyping(el); // tu función de animación
            observer.unobserve(el); // solo una vez
        }
    });
});

const target = document.getElementById('typedText');
observer.observe(target);

// Función para copiar email al portapapeles
function copyEmail() {
    const emailBtn = document.getElementById('copyEmailBtn');
    const email = emailBtn.getAttribute('data-email');
    const successMsg = document.getElementById('copySuccess');

    // Usar la API moderna del portapapeles
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            showCopySuccess();
        }).catch(() => {
            // Fallback si falla
            fallbackCopyEmail(email);
        });
    } else {
        // Fallback para navegadores más antiguos
        fallbackCopyEmail(email);
    }
}

// Función fallback para copiar
function fallbackCopyEmail(email) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Error al copiar email:', err);
        // Mostrar el email para que el usuario lo copie manualmente
        alert(`Por favor copia manualmente: ${email}`);
    }

    document.body.removeChild(textArea);
}

// Mostrar mensaje de éxito
function showCopySuccess() {
    const successMsg = document.getElementById('copySuccess');
    const copyBtn = document.getElementById('copyEmailBtn');

    // Mostrar mensaje
    successMsg.classList.remove('d-none');

    // Cambiar temporalmente el texto del botón
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>¡Copiado!';
    copyBtn.classList.add('btn-success');
    copyBtn.classList.remove('btn-outline-secondary');

    // Restaurar después de 3 segundos
    setTimeout(() => {
        successMsg.classList.add('d-none');
        copyBtn.innerHTML = originalText;
        copyBtn.classList.remove('btn-success');
        copyBtn.classList.add('btn-outline-secondary');
    }, 3000);
}
function mostrarAviso(event) {
    event.preventDefault(); // Evita que abra el link real

    // Email a copiar
    const email = "byr.martinez@duocuc.cl";

    // Copiar al portapapeles
    navigator.clipboard.writeText(email).then(() => {
        alert("Esta funcionalidad aún no está lista.\nPuedes contactarme al email: " + email + "\n\nEl correo ya fue copiado al portapapeles ✅");
    }).catch(() => {
        alert("Esta funcionalidad aún no está lista.\nPuedes contactarme al email: " + email);
    });
}
