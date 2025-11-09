// Configurazione dell'app
const CONFIG = {
    // Messaggio della schermata iniziale
    introMessage: `Ciao Viola 💖\n\nTanti auguri di buon compleanno.\n\nUn piccolo pensiero, fatto con il cuore per una persona speciale.\n\nQuesta è la nostra piccola app, creata solo per noi due.\nOgni foto, ogni parola, ogni cuore, ogni cosa... racconta di noi.\n\nOgni giorno trascorso con te è un dono prezioso che voglio poter ricordare sempre.\n\nIl bene che ti voglio non è racchiudibile in una semplice applicazione, ma spero di poter rendere l'idea.\n\nPremi "Continua" quando vuoi vedere le nostre fantastiche avventure per piccoli. 💕`,
    
    // Dati delle foto (placeholder - li sostituirai con le tue)
    photos: [
        {
            src: 'img/1.jpg',
            phrase: 'Il nostro primo viaggio 💕',
            alt: 'Foto 1'
        },
        {
            src: 'img/2.jpg', 
            phrase: 'Con le nostre migliori amiche',
            alt: 'Foto 2'
        },
        {
            src: 'img/3.jpg',
            phrase: '💕',
            alt: 'Foto 3'
        },
        {
            src: 'img/4.jpg',
            phrase: 'Momento skincare in casa Vincenzo Sopra Polleria (ANGRI)',
            alt: 'Foto 4'
        },
        {
            src: 'img/5.jpg',
            phrase: 'La bébé dormiente 😴',
            alt: 'Foto 5'
        },
        {
            src: 'img/6.jpg',
            phrase: 'Naboliiii',
            alt: 'Foto 6'
        },
        {
            src: 'img/7.jpg',
            phrase: 'Mpeiiiiiii',
            alt: 'Foto 7'
        },
        {
            src: 'img/8.jpg',
            phrase: 'Noi al Mayer!!!!',
            alt: 'Foto 8'
        }
    ],
    
    // Notifiche
    notificationMessages: [
        'Hai ricevuto un bacio! 💕',
        'Un cuore per te! ❤️',
        'Ti pensano! 💖',
        'Arrivano coccole! 💕'
    ]
};

// Stato dell'app
let appState = {
    currentSlide: 0,
    isTyping: false,
    notificationsEnabled: true
};

// Utility functions
function $(selector) {
    return document.querySelector(selector);
}

function createElement(tag, className, content = '') {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.innerHTML = content;
    return element;
}

// Effetto scrittura della schermata iniziale
function typeWriterEffect(text, element, callback) {
    appState.isTyping = true;
    let index = 0;
    element.innerHTML = '';
    
    function type() {
        if (index < text.length) {
            if (text[index] === '\\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += text[index];
            }
            index++;
            setTimeout(type, 40);
        } else {
            appState.isTyping = false;
            if (callback) callback();
        }
    }
    
    type();
}

// Mostra il bottone continua
function showContinueButton() {
    setTimeout(() => {
        $('#continueBtn').classList.add('show');
    }, 500);
}

// Passa alla schermata principale
function showMainContent() {
    $('#intro').classList.add('hidden');
    setTimeout(() => {
        $('#intro').style.display = 'none';
        $('#main-content').classList.remove('hidden');
        initializeCarousel();
        initializeNotifications();
    }, 1000);
}

// Inizializza il carosello
function initializeCarousel() {
    const carousel = $('#carousel');
    const indicators = $('#indicators');
    
    // Crea le slide
    CONFIG.photos.forEach((photo, index) => {
        const slide = createElement('div', 'carousel-item');
        slide.innerHTML = `
            <img src="${photo.src}" alt="${photo.alt}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmYwMDY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Rm90byAke2luZGV4ICsgMX08L3RleHQ+PC9zdmc+'">
            <div class="phrase">${photo.phrase}</div>
        `;
        carousel.appendChild(slide);
        
        // Crea indicatori
        const indicator = createElement('div', 'indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });
    
    // Aggiungi event listeners
    $('#prevBtn').addEventListener('click', () => prevSlide());
    $('#nextBtn').addEventListener('click', () => nextSlide());
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    }
}

// Navigazione carosello
function updateCarousel() {
    const carousel = $('#carousel');
    const indicators = document.querySelectorAll('.indicator');
    
    carousel.style.transform = `translateX(-${appState.currentSlide * 100}%)`;
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === appState.currentSlide);
    });
}

function nextSlide() {
    appState.currentSlide = (appState.currentSlide + 1) % CONFIG.photos.length;
    updateCarousel();
}

function prevSlide() {
    appState.currentSlide = (appState.currentSlide - 1 + CONFIG.photos.length) % CONFIG.photos.length;
    updateCarousel();
}

function goToSlide(index) {
    appState.currentSlide = index;
    updateCarousel();
}

// Effetti cuori
function createHeartEffect(x, y) {
    const heart = createElement('div', 'heart-effect');
    heart.innerHTML = '💕';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    
    $('#heartEffects').appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 3000);
}

function createHeartRain() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight;
            createHeartEffect(x, y);
        }, i * 200);
    }
}

// Notifiche
function showNotification(message) {
    if (!appState.notificationsEnabled) return;
    
    const notification = createElement('div', 'notification');
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-emoji">💕</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    $('#notificationArea').appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Sistema di notifiche locali
function initializeNotifications() {
    // Richiedi permesso per le notifiche
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // Simula ricezione notifiche (nel tuo caso, l'altra persona)
    setInterval(() => {
        if (Math.random() < 0.1) { // 10% di probabilità ogni 30 secondi (solo per demo)
            const message = CONFIG.notificationMessages[Math.floor(Math.random() * CONFIG.notificationMessages.length)];
            showNotification(message);
            createHeartRain();
            
            // Notifica di sistema se il browser è minimizzato
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Caldarrosta 💕', {
                    body: message,
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💕</text></svg>'
                });
            }
        }
    }, 30000);
}

// Manda un bacio
function sendHeart() {
    const heartBtn = $('#heartBtn');
    
    // Animazione bottone
    heartBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        heartBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Effetti visivi
    createHeartRain();
    
    // Mostra notifica locale
    showNotification('Hai mandato un bacio! 💕');
    
    // Salva nel localStorage (per sincronizzazione futura)
    const hearts = JSON.parse(localStorage.getItem('hearts') || '[]');
    hearts.push({
        timestamp: Date.now(),
        sender: 'me'
    });
    localStorage.setItem('hearts', JSON.stringify(hearts));
    
    // Vibrazione se supportata
    if ('vibrate' in navigator) {
        navigator.vibrate(200);
    }
}

// Inizializzazione dell'app
document.addEventListener('DOMContentLoaded', function() {
    // Effetto scrittura iniziale
    const introText = $('#intro-text');
    typeWriterEffect(CONFIG.introMessage, introText, showContinueButton);
    
    // Event listeners
    $('#continueBtn').addEventListener('click', showMainContent);
    $('#heartBtn').addEventListener('click', sendHeart);
    
    // Installazione PWA
    initializePWA();
});

// PWA (Progressive Web App) - Per salvare l'app sul telefono
function initializePWA() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log('Service Worker registrato'))
            .catch(err => console.log('Service Worker non registrato:', err));
    }
    
    // Mostra prompt di installazione
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Mostra un bottone di installazione se vuoi
        setTimeout(() => {
            if (deferredPrompt) {
                console.log('Puoi installare l\'app!');
            }
        }, 5000);
    });
}

// Utility per salvare/caricare dati
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

// Gestione errori
window.addEventListener('error', (e) => {
    console.error('Errore nell\'app:', e.error);
    // Potresti mostrare un messaggio all'utente
});

// Gestione offline
window.addEventListener('online', () => {
    showNotification('Sei di nuovo online! 💕');
});

window.addEventListener('offline', () => {
    showNotification('Sei offline, ma l\'app continua a funzionare! 💕');
});