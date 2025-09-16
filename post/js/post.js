document.addEventListener('DOMContentLoaded', () => {
    const toc = document.querySelector('.toc');
    const article = document.querySelector('article');
    const btnTTS = document.getElementById('btn-tts');

    // Generar índice de contenidos a partir de <h2> y <h3>
    if (toc && article) {
        const headings = article.querySelectorAll('h2, h3');
        headings.forEach((heading, index) => {
            const id = `section-${index}`;
            heading.id = id;

            const li = document.createElement('li');
            li.classList.add(`ms-${heading.tagName === 'H3' ? '3' : '0'}`);

            const a = document.createElement('a');
            a.href = `#${id}`;
            a.textContent = heading.textContent;

            li.appendChild(a);
            toc.appendChild(li);
        });
    }

    // Scroll suave
    document.querySelectorAll('.toc a').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Texto a voz (TTS)
    if (btnTTS && article) {
        btnTTS.addEventListener('click', () => {
            const utterance = new SpeechSynthesisUtterance(article.textContent);

            utterance.lang = 'es-ES';
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.cancel(); // Cancelar si ya se está leyendo
            window.speechSynthesis.speak(utterance);
        });
    }
});
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // solo una vez
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
    animateOnScroll();
});
