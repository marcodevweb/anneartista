// Background Doodles Parallax System - Ainoa Artes (Versão Global 3.0)
// Mantém a estética original mas estende por toda a página

document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.gsap === 'undefined') return;

    // 1. Container Global em camada estratégica
    // z-index: 5 para ficar acima dos backgrounds (z-0) mas abaixo do conteúdo (z-10)
    const container = document.createElement('div');
    container.id = 'doodles-parallax-container';
    container.className = 'fixed inset-0 pointer-events-none z-0 overflow-hidden';
    document.body.appendChild(container);

    const colors = ['text-midnight-teal', 'text-moss-green', 'text-rosy-brown', 'text-dark-green', 'text-dark-green/40'];
    
    const shapes = [
        // Raio Original
        `<svg width="100%" height="100%" viewBox="0 0 256 256" class="overflow-visible"><polygon points="160,16 48,144 128,144 96,240 208,112 128,112" fill="currentColor" stroke="#0A3323" stroke-width="16" stroke-linejoin="round"/></svg>`,
        // Estrela Cartoon Original
        `<svg width="100%" height="100%" viewBox="0 0 256 256" class="overflow-visible"><path fill="currentColor" stroke="#0A3323" stroke-width="14" stroke-linejoin="round" d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z"/></svg>`,
        // Lápis de Escrever (Classic Slender Style)
        `<svg width="100%" height="100%" viewBox="0 0 256 256" class="overflow-visible"><g transform="translate(128,128) rotate(-45) translate(-128,-128)"><path d="M108,30 L148,30 L148,180 L128,230 L108,180 Z" fill="currentColor" stroke="#0A3323" stroke-width="12" stroke-linejoin="round"/><path d="M108,30 L148,30 L148,60 L108,60 Z" fill="#0A3323" /><path d="M108,180 L118,192 L128,180 L138,192 L148,180" fill="none" stroke="#0A3323" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M120,210 L136,210 L128,230 Z" fill="#0A3323"/><rect x="120" y="80" width="16" height="80" fill="#F7F4D5" opacity="0.3" rx="4" /></g></svg>`,
        // Joia Brutalista (Diamond)
        `<svg width="100%" height="100%" viewBox="0 0 256 256" class="overflow-visible"><polygon points="128,232 24,104 72,32 184,32 232,104" fill="currentColor" stroke="#0A3323" stroke-width="16" stroke-linejoin="round"/><line x1="24" y1="104" x2="232" y2="104" stroke="#0A3323" stroke-width="16" stroke-linecap="round"/><line x1="72" y1="32" x2="128" y2="104" stroke="#0A3323" stroke-width="16" stroke-linecap="round"/><line x1="184" y1="32" x2="128" y2="104" stroke="#0A3323" stroke-width="16" stroke-linecap="round"/></svg>`,
        // Triângulo Rebelde
        `<svg width="100%" height="100%" viewBox="0 0 256 256" class="overflow-visible"><polygon points="128,32 32,208 224,208" fill="currentColor" stroke="#0A3323" stroke-width="16" stroke-linejoin="round"/></svg>`,
        // Asterisco/Cruz Grossa
        `<svg width="100%" height="100%" viewBox="0 0 256 256" fill="none" class="overflow-visible"><line x1="128" y1="40" x2="128" y2="216" stroke="currentColor" stroke-width="28" stroke-linecap="round"/><line x1="40" y1="128" x2="216" y2="128" stroke="currentColor" stroke-width="28" stroke-linecap="round"/></svg>`,
        // Espiral Orgânica
        `<svg width="100%" height="100%" viewBox="0 0 256 256" fill="none" class="overflow-visible"><path d="M40,128 C40,40 216,40 216,128 C216,192 80,192 80,128 C80,96 176,96 176,128 C176,144 128,144 128,128" stroke="currentColor" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    ];

    // Calcula a quantidade espalhada pela página
    const docHeight = document.documentElement.scrollHeight;
    
    const isMobile = window.innerWidth <= 768;
    // Mobile: 1 doodle a cada 400px | Desktop: 1 doodle a cada 100px
    const spacingPx = isMobile ? 400 : 100;
    const numElements = Math.floor(docHeight / spacingPx);
    const doodleElements = [];

    // Tática de Separação: Fatias Verticais Dedicadas
    const sectorPercent = 100 / numElements;

    for (let i = 0; i < numElements; i++) {
        const div = document.createElement('div');
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // --- SISTEMA DE SEPARAÇÃO ORGÂNICA ---
        // 1. Zigue-Zague Horizontal (Garante que nunca formem uma coluna amontoada)
        const isLeftSide = i % 2 === 0;
        const posX = isLeftSide 
            ? Math.random() * 30 + 10   // Caem entre 10% e 40% da tela (Lado Esquerdo)
            : Math.random() * 30 + 60;  // Caem entre 60% e 90% da tela (Lado Direito)
            
        // 2. Isolamento Vertical (Cada doodle mora dentro do seu próprio "andar")
        const minPosY = i * sectorPercent;
        // Margem interna dentro do andar (20% de buffer no topo e no fundo do seu espaço)
        const posY = minPosY + (Math.random() * (sectorPercent * 0.6)) + (sectorPercent * 0.2); 
        
        // --- SISTEMA DE PROFUNDIDADE (3D Parallax) ---
        // Camadas: 0 = Fundo Falso, 1 = Meio, 2 = Frente
        const depth = Math.floor(Math.random() * 3);
        
        let sizeClass = '';
        let blurClass = '';
        let opacityClass = '';
        let speedMultiplier = 1;

        if (depth === 0) {
            // Longe (Fundo Desfocado)
            sizeClass = ['w-12 h-12', 'w-16 h-16'][Math.floor(Math.random() * 2)];
            opacityClass = 'opacity-10';
            blurClass = 'blur-[3px]';
            speedMultiplier = 0.3; // Mínima interação física e scroll lento
        } else if (depth === 1) {
            // Meio-Termo
            sizeClass = ['w-24 h-24', 'w-32 h-32'][Math.floor(Math.random() * 2)];
            opacityClass = 'opacity-20';
            blurClass = 'blur-[1px]';
            speedMultiplier = 0.6; // Scroll e atração médias
        } else {
            // Perto (Em Frente, Nítido e Enorme)
            sizeClass = ['w-48 h-48', 'w-64 h-64'][Math.floor(Math.random() * 2)];
            opacityClass = 'opacity-[0.35]'; // Mais visível no nível de interação
            blurClass = 'blur-none';
            speedMultiplier = 1.3; // Scroll agressivo e muita repulsão do mouse
        }

        const rotate = Math.floor(Math.random() * 360);
        
        // Velocidades calculadas multiplicadas pelo fator de profundidade (3D Feel)
        const pSpeed = (Math.random() - 0.5) * 1.5 * speedMultiplier;
        const mSpeedX = (Math.random() - 0.5) * 150 * speedMultiplier;
        const mSpeedY = (Math.random() - 0.5) * 150 * speedMultiplier;

        div.className = `absolute ${color} ${sizeClass} ${opacityClass} ${blurClass}`;
        div.style.left = `${posX}%`;
        // Top 0 pois o Y real será controlado pelo GSAP
        div.style.top = `0px`; 
        
        // A sombra Neo-Brutalista afasta conforme o objeto está "mais perto" da tela
        const shadowOffset = depth === 2 ? '8px' : (depth === 1 ? '4px' : '2px');
        div.style.filter = `drop-shadow(${shadowOffset} ${shadowOffset} 0px rgba(10, 51, 35, 1))`;
        div.innerHTML = shape;

        // Armazena cache interno para evitar reflows caros
        div.doodleConfig = {
            baseRot: rotate,
            yPercent: posY / 100, // Salva a posição relativa ao documento total
            pSpeed: speedMultiplier, // Multiplicador de Parallax (1 é estático com o scroll)
            mSpeedX: mSpeedX,
            mSpeedY: mSpeedY,
            // Vida Própria (Drift): Movimentação autônoma mesmo sem mouse
            floatSpeed: (Math.random() * 0.001) + 0.0005, // Velocidade do giro autônomo (bem lento)
            floatOffsetX: Math.random() * Math.PI * 2, // Fases diferentes para não se moverem iguais
            floatOffsetY: Math.random() * Math.PI * 2,
            floatAmpX: (Math.random() * 20 + 10) * speedMultiplier, // Distância máxima do drift XY
            floatAmpY: (Math.random() * 20 + 10) * speedMultiplier  // Multiplicado pela profundidade
        };

        gsap.set(div, { rotation: rotate });
        container.appendChild(div);
        doodleElements.push(div);
    }

    // Engine de Performance e Cálculo em Massa
    let mouseX = 0;
    let mouseY = 0;
    
    // Alvos para interpolação macia ("Lurp") em vez de seguir o mouse rigidamente
    let targetMouseX = 0;
    let targetMouseY = 0;

    window.addEventListener('mousemove', (e) => {
        // Range normalizado para -1 até 1 a partir do centro
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    gsap.ticker.add(() => {
        // Suaviza a rota mecânica do mouse criando um 'rastro' natural
        mouseX += (targetMouseX - mouseX) * 0.04;
        mouseY += (targetMouseY - mouseY) * 0.04;
        
        const scrollY = window.scrollY;
        const time = Date.now(); // Tempo contínuo para o efeito "Vida Própria"

        for (let i = 0; i < doodleElements.length; i++) {
            const el = doodleElements[i];
            const cfg = el.doodleConfig;
            
            // Vida Própria: Usa seno e cosseno para fazer um caminho curvo suave e orgânico
            const driftX = Math.sin(time * cfg.floatSpeed + cfg.floatOffsetX) * cfg.floatAmpX;
            const driftY = Math.cos(time * cfg.floatSpeed + cfg.floatOffsetY) * cfg.floatAmpY;

            // Posição baseada no scroll (calculada contra a altura total do documento)
            // Se o pSpeed for 1, ele acompanha o scroll perfeitamente.
            const basePageY = (cfg.yPercent * docHeight) - (scrollY * cfg.pSpeed);

            // X combina a atração do mouse com a flutuação contínua
            const valX = (mouseX * cfg.mSpeedX) + driftX;
            // Y combina a posição na página, repulsão do mouse e a flutuação
            const valY = basePageY + (mouseY * cfg.mSpeedY) + driftY;
            // Rotação viva: Mouse distorce a base levemente e o Drift autônomo aplica um giro minúsculo e orgânico
            const valRot = cfg.baseRot + (mouseX * 20) + (mouseY * 20) + (driftX * 0.5);

            // A chamada GSAP SET por baixo dos panos usa matrix3d otimizada por hardware
            gsap.set(el, {
                x: valX,
                y: valY,
                rotation: valRot
            });
        }
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Em tese container 'inset-0' se reajusta naturalmente no HTML, mas garantimos atualização se o DOM alongar abruptamente
            container.style.height = `${document.documentElement.scrollHeight}px`;
        }, 500);
    });
});
