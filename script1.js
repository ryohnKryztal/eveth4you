// El código de las partículas se mantiene igual, ya que es independiente y usa JS puro
const canvas = document.getElementById('particles-bg');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createPixel() {
    return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.floor(Math.random() * 2 + 1), // tamaño entero entre 1 y 2
        vx: (Math.random() - 0.5) * 0.6, // velocidad X
        vy: (Math.random() - 0.5) * 0.6, // velocidad Y
        alpha: 1 // opacidad completa para que sea nítido
    };
}

function updateParticles() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Si se sale de pantalla, se reinicia
        if (p.x < 0 || p.x > window.innerWidth || p.y < 0 || p.y > window.innerHeight) {
            particles[i] = createPixel();
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    });

    requestAnimationFrame(updateParticles);
}

// Crear partículas
for (let i = 0; i < 30; i++) {
    particles.push(createPixel());
}

updateParticles();


// --- Bloque jQuery: Asegúrate de que el DOM esté listo antes de manipularlo ---
$(document).ready(function() {
    // La función getRandomColor y su uso para el link.neon han sido eliminadas
    // ya que ahora el cambio de color del link neon se maneja con CSS.

    function getRandomColor() { // Se mantiene para el párrafo .jp si se usa allí.
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    $('.content-to-type').hide();
    const $linkCargarRegalo = $('.link.neon'); // Selecciona el link
    let hiddenJpSpans = [];
    let hiddenJpCurrentIndex = 0;
    let hiddenJpAnimationInterval;

    function animateHiddenJpColors() {
        if (hiddenJpSpans.length === 0) {
            clearInterval(hiddenJpAnimationInterval);
            return;
        }
        // Aplica el color aleatorio a los spans .jp
        $(hiddenJpSpans[hiddenJpCurrentIndex]).css('color', getRandomColor());
        hiddenJpCurrentIndex++;
        if (hiddenJpCurrentIndex >= hiddenJpSpans.length) {
            hiddenJpCurrentIndex = 0;
        }
    }

    let dotAnimationInterval = null;
    const baseWaitingText = "Por favor espera";
    let currentDotCount = 0;
    const $waitingTextElement = $(".content-to-type .p5");

    function animateWaitingDots() {
        currentDotCount = (currentDotCount + 1) % 4;
        let dots = '';
        for (let i = 0; i < currentDotCount; i++) {
            dots += '.';
        }
        if ($waitingTextElement.is(':visible')) {
            $waitingTextElement.text(baseWaitingText + dots);
        }
    }

    $linkCargarRegalo.on('click', function(e) {
        e.preventDefault();

        // **Añade esta línea:** Agrega la clase 'clicked' al link
        $(this).addClass('clicked');

        $(this).addClass('disabled').off('click'); // Esto ya existía para deshabilitarlo

        const paragraphsToType = [
            $(".content-to-type .p1"),
            $(".content-to-type .p2"),
            $(".content-to-type .p3"),
            $(".content-to-type .p4"),
            $(".content-to-type .p5"),
            $(".content-to-type .p6"),
            $(".content-to-type .p7"),
            $(".content-to-type .p8"),
            $(".content-to-type .p9"),
            $(".content-to-type .p10"),
            $(".content-to-type .acciones .link.p11"),
            $(".content-to-type .acciones .link:not(.p11)")
        ];
        let paragraphIndex = 0;

        function typeWriter(paragraphElement, text, i, callback) {
            if (i < text.length) {
                if (paragraphElement.is('a')) {
                    paragraphElement.text(paragraphElement.text() + text.charAt(i));
                } else {
                    paragraphElement.html(text.substring(0, i + 0.5));
                }
                setTimeout(() => typeWriter(paragraphElement, text, i + 1, callback), 12);
            } else {
                callback();
            }
        }

        function processParagraphs() {
            if (paragraphIndex < paragraphsToType.length) {
                const $currentParagraph = paragraphsToType[paragraphIndex];
                const originalText = $currentParagraph.data('original-text');
                $currentParagraph.show();

                if ($currentParagraph.hasClass('p8') && $currentParagraph.hasClass('jp')) {
                    let jpText = originalText;
                    let jpNewHtml = '';
                    for (let i = 0; i < jpText.length; i++) {
                        jpNewHtml += `<span>${jpText.charAt(i)}</span>`;
                    }
                    $currentParagraph.html(jpNewHtml);
                    hiddenJpSpans = $currentParagraph.find('span');
                    hiddenJpCurrentIndex = 0;
                    if (hiddenJpAnimationInterval) {
                        clearInterval(hiddenJpAnimationInterval);
                    }
                    hiddenJpAnimationInterval = setInterval(animateHiddenJpColors, 80);
                    setTimeout(() => {
                        paragraphIndex++;
                        processParagraphs();
                    }, 500);
                } else if ($currentParagraph.hasClass('p5')) {
                    $currentParagraph.text('');
                    typeWriter($currentParagraph, originalText, 0, () => {
                        $currentParagraph.text(originalText);
                        currentDotCount = 0;
                        if (dotAnimationInterval) {
                            clearInterval(dotAnimationInterval);
                        }
                        dotAnimationInterval = setInterval(animateWaitingDots, 500);

                        setTimeout(() => {
                            paragraphIndex++;
                            processParagraphs();
                        }, 5000);
                    });
                } else {
                    $currentParagraph.html('');
                    typeWriter($currentParagraph, originalText, 0, () => {
                        paragraphIndex++;
                        if ($currentParagraph.hasClass('p6')) {
                            setTimeout(processParagraphs, 1500);
                        } else {
                            processParagraphs();
                        }
                    });
                }
            } else {
                $('.acciones .link').show();
            }
        }

        $('.acciones .link').hide();
        $('.content-to-type').slideDown(500, function() {
            processParagraphs();
        });
    });

    $(document).on('keydown', function(e) {
        if (e.key === "Escape") {
            if (window.location.hash === '#modal-llorar') {
                const videoElement = $('#video-loquera')[0];
                if (videoElement) {
                    videoElement.pause();
                    videoElement.currentTime = 0;
                    $(videoElement).hide();
                    $('#boton-berrear').show();
                }
            }
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    });

    $('.modal-overlay').on('click', function(e) {
        if (e.target === this || $(e.target).hasClass('modal-close')) {
            if ($(this).attr('id') === 'modal-llorar') {
                const videoElement = $('#video-loquera')[0];
                if (videoElement) {
                    videoElement.pause();
                    videoElement.currentTime = 0;
                    $(videoElement).hide();
                    $('#boton-berrear').show();
                }
            }
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
    });

    $('#boton-berrear').on('click', function() {
        const videoElement = $('#video-loquera')[0];
        $(this).hide();
        $(videoElement).show();
        if (videoElement) {
            videoElement.play().catch(error => {
                console.error("Error al intentar reproducir el video:", error);
            });
        }
    });

    // --- MANEJO CORRECTO DEL BOTÓN "SÍ, ESTOY SEGURA" CON jQuery ---
    // Asegúrate de que el ID en tu HTML sea 'boton-si-segura'
    $('#boton-si-segura').on('click', function(e) {
    e.preventDefault();
    console.log("¡Botón 'Sí, estoy segura' clickeado!"); // Agrega esto
    window.location.href = 'cerrado.html';
});

    // ---------------------------------------------------------------
});


class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// ——————————————————————————————————————————————————
// Example
// ——————————————————————————————————————————————————

const phrases = [
  "Eveth,",
  "Parece que te desconectaste.",
  "El archivo tuvo un desfase.",
  "Igual que yo lo hice, entre neones y silencio.",
  "Y entenderás que hay una diferencia real...",
  "...entre conocer el camino...",
  "y reconocerlo en silencio"
];

const el = document.querySelector(".text");
const fx = new TextScramble(el);

let counter = 0;
const next = () => {
  fx.setText(phrases[counter]).then(() => {
    setTimeout(next, 1700);
  });
  counter = (counter + 1) % phrases.length;
};

next();
