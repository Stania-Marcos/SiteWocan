document.addEventListener('DOMContentLoaded', function() {
    // Animação de fade-in para elementos
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
        fadeInObserver.observe(element);
    });
    
    // Efeito de parallax para o hero section
    const heroSection = document.querySelector('.hero');
    
    // Controle de visibilidade do menu durante o scroll
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        // Efeito parallax
        const scrollPosition = window.scrollY;
        if (heroSection) {
            heroSection.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
        
        // Controle de visibilidade do menu
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Rolando para baixo e além de 100px do topo - esconde o menu
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.transition = 'transform 0.3s ease-in-out';
        } else {
            // Rolando para cima ou próximo ao topo - mostra o menu
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Para compatibilidade com mobile/iOS
    });

    
    // Contador para estatísticas
    function startCounter() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;
        
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };
            
            updateCount();
        });
    }
    
    // Iniciar contador quando a seção estiver visível
    const statsSection = document.querySelector('.stats-section');
    
    if (statsSection) {
        const statsSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounter();
                    statsSectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        statsSectionObserver.observe(statsSection);
    }
});