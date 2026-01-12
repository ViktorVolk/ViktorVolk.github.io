// Ссылки на картинки с ImgBB (примерные - замените на свои)
const IMAGE_URLS = [
    "https://i.ibb.co/7NZ4t2Dy/photo-2025-12-09-17-29-21.jpg",
    "https://i.ibb.co/7NZ4t2Dy/photo-2025-12-09-17-29-21.jpg",
    "https://i.ibb.co/7NZ4t2Dy/photo-2025-12-09-17-29-21.jpg"
];

// Описания для картинок
const IMAGE_CAPTIONS = [
    "Первая сцена текста",
    "Ключевой момент повествования", 
    "Заключительная часть истории"
];

// Ссылка на аудиозапись (замените на свою)
const AUDIO_URL = "https://archive.org/download/fortuna-812-based-god-rare/FORTUNA%20812%20%20BasedGod%20-%20rare.mp3"; // Примерная ссылка

// Состояние картинок (скрыты/открыты)
let imagesRevealed = [false, false, false];

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация элементов
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const stopBtn = document.getElementById('stop-btn');
    const restartBtn = document.getElementById('restart-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressBar = document.getElementById('progress-bar');
    const currentTime = document.getElementById('current-time');
    const audioDuration = document.getElementById('audio-duration');
    const volumeSlider = document.getElementById('volume-slider');
    const volumePercent = document.getElementById('volume-percent');
    const imagesGrid = document.getElementById('images-grid');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.getElementById('modal-close');
    const completeBtn = document.getElementById('complete-btn');
    const completionModal = document.getElementById('completion-modal');
    
    // Устанавливаем источник аудио
    audioPlayer.src = AUDIO_URL;
    
    // Загружаем картинки
    loadImages();
    
    // Инициализация аудиоплеера
    initAudioPlayer();
    
    // Обработчики событий
    playBtn.addEventListener('click', playAudio);
    pauseBtn.addEventListener('click', pauseAudio);
    stopBtn.addEventListener('click', stopAudio);
    restartBtn.addEventListener('click', restartAudio);
    
    progressBar.addEventListener('click', seekAudio);
    volumeSlider.addEventListener('input', changeVolume);
    
    modalClose.addEventListener('click', closeImageModal);
    imageModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeImageModal();
        }
    });
    
    completeBtn.addEventListener('click', completeAssignment);
    
    document.getElementById('back-to-list-btn')?.addEventListener('click', function() {
        window.location.href = 'task_dictation.html';
    });
    
    // Закрытие модального окна завершения при клике вне его
    completionModal.addEventListener('click', function(e) {
        if (e.target === this) {
            completionModal.style.display = 'none';
        }
    });
    
    // Закрытие при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (imageModal.style.display === 'flex') {
                closeImageModal();
            }
            if (completionModal.style.display === 'flex') {
                completionModal.style.display = 'none';
            }
        }
    });
    
    // Функция загрузки картинок
    function loadImages() {
        // Показываем состояние загрузки
        imagesGrid.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p class="loading-text">Загружаем картинки...</p>
            </div>
        `;
        
        // Создаем элементы картинок
        setTimeout(() => {
            imagesGrid.innerHTML = '';
            
            IMAGE_URLS.forEach((url, index) => {
                const imageIndex = index;
                const imageItem = document.createElement('div');
                imageItem.className = 'image-item';
                imageItem.setAttribute('data-index', imageIndex);
                
                // Генерируем SVG placeholder на случай ошибки
                const placeholderSVG = generatePlaceholderSVG(imageIndex);
                
                imageItem.innerHTML = `
                    <div class="reveal-overlay">
                        <div class="reveal-icon">
                            <i class="fas fa-eye"></i>
                        </div>
                        <div class="reveal-text">Нажмите, чтобы посмотреть картинку</div>
                    </div>
                    <img src="${url}" 
                         alt="${IMAGE_CAPTIONS[index]}"
                         data-placeholder="${placeholderSVG}"
                         loading="lazy">
                    <div class="image-caption">${IMAGE_CAPTIONS[index]}</div>
                `;
                
                imagesGrid.appendChild(imageItem);
                
                // Добавляем обработчик ошибок
                const imgElement = imageItem.querySelector('img');
                imgElement.onerror = function() {
                    console.warn(`Не удалось загрузить картинку ${imageIndex + 1}. Используем placeholder.`);
                    this.src = this.getAttribute('data-placeholder');
                    this.onerror = null;
                    this.style.objectFit = 'contain';
                };
                
                // Добавляем обработчик клика для раскрытия картинки
                imageItem.addEventListener('click', function() {
                    revealImage(imageIndex);
                });
                
                // Добавляем обработчик двойного клика для увеличения
                imageItem.addEventListener('dblclick', function() {
                    openImageModal(imageIndex);
                });
            });
        }, 500);
    }
    
    // Функция для генерации SVG placeholder
    function generatePlaceholderSVG(index) {
        const colors = ['#673AB7', '#3F51B5', '#2196F3'];
        const color = colors[index] || '#9E9E9E';
        const caption = IMAGE_CAPTIONS[index] || `Картинка ${index + 1}`;
        
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                <rect width="400" height="300" fill="${color}" opacity="0.8"/>
                <rect x="40" y="40" width="320" height="220" fill="white" opacity="0.2" rx="10"/>
                <text x="200" y="120" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" font-weight="bold">
                    Картинка ${index + 1}
                </text>
                <text x="200" y="160" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">
                    ${caption}
                </text>
                <circle cx="200" cy="220" r="30" fill="white" opacity="0.3"/>
                <text x="200" y="225" font-family="Arial, sans-serif" font-size="18" fill="${color}" text-anchor="middle" font-weight="bold">
                    ${index + 1}
                </text>
                <text x="200" y="280" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">
                    Нажмите, чтобы посмотреть
                </text>
            </svg>
        `;
        
        return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    }
    
    // Функция раскрытия картинки
    function revealImage(index) {
        const imageItem = document.querySelector(`.image-item[data-index="${index}"]`);
        if (!imageItem) return;
        
        imagesRevealed[index] = true;
        imageItem.classList.add('revealed');
        
        // Анимация раскрытия
        imageItem.style.transform = 'scale(1.05)';
        setTimeout(() => {
            imageItem.style.transform = 'scale(1)';
        }, 300);
        
    }
    
    // Функция открытия модального окна с картинкой
    function openImageModal(index) {
        const imageUrl = IMAGE_URLS[index];
        const caption = IMAGE_CAPTIONS[index];
        
        modalImage.src = imageUrl;
        modalCaption.textContent = caption;
        imageModal.style.display = 'flex';
        
        // Автоматически раскрываем картинку, если еще не раскрыта
        if (!imagesRevealed[index]) {
            revealImage(index);
        }
    }
    
    // Функция закрытия модального окна
    function closeImageModal() {
        imageModal.style.display = 'none';
        modalImage.src = '';
    }
    
    // Функция инициализации аудиоплеера
    function initAudioPlayer() {
        // Когда аудио загружено, обновляем длительность
        audioPlayer.addEventListener('loadedmetadata', function() {
            const duration = formatTime(audioPlayer.duration);
            audioDuration.textContent = duration;
        });
        
        // Обновление прогресса воспроизведения
        audioPlayer.addEventListener('timeupdate', updateProgress);
        
        // Когда аудио закончило играть
        audioPlayer.addEventListener('ended', function() {
            playBtn.disabled = false;
            pauseBtn.disabled = true;
            stopBtn.disabled = true;
        });
        
        // Обработка ошибок загрузки аудио
        audioPlayer.addEventListener('error', function(e) {
            console.error('Ошибка загрузки аудио:', e);
            alert('Не удалось загрузить аудиозапись. Пожалуйста, проверьте подключение к интернету.');
        });
        
        // Устанавливаем начальную громкость
        audioPlayer.volume = volumeSlider.value / 100;
        volumePercent.textContent = `${volumeSlider.value}%`;
    }
    
    // Функция воспроизведения аудио
    function playAudio() {
        audioPlayer.play();
        playBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
    }
    
    // Функция паузы аудио
    function pauseAudio() {
        audioPlayer.pause();
        playBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // Функция остановки аудио
    function stopAudio() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        updateProgress();
    }
    
    // Функция перезапуска аудио
    function restartAudio() {
        audioPlayer.currentTime = 0;
        if (audioPlayer.paused) {
            playAudio();
        }
        updateProgress();
    }
    
    // Функция перемотки по клику на прогресс-бар
    function seekAudio(e) {
        const progressBar = e.currentTarget;
        const clickPosition = e.offsetX;
        const progressBarWidth = progressBar.offsetWidth;
        const percentage = clickPosition / progressBarWidth;
        
        audioPlayer.currentTime = percentage * audioPlayer.duration;
        updateProgress();
    }
    
    // Функция изменения громкости
    function changeVolume() {
        const volume = volumeSlider.value / 100;
        audioPlayer.volume = volume;
        volumePercent.textContent = `${volumeSlider.value}%`;
    }
    
    // Функция обновления прогресса воспроизведения
    function updateProgress() {
        if (audioPlayer.duration) {
            const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = `${percentage}%`;
            
            currentTime.textContent = formatTime(audioPlayer.currentTime);
        }
    }
    
    // Функция форматирования времени
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Функция сохранения прогресса в localStorage
    function saveProgress() {
        const progress = {
            imagesRevealed: imagesRevealed,
            audioPlayed: !audioPlayer.paused,
            lastPlayTime: audioPlayer.currentTime
        };
        localStorage.setItem('dictationProgress', JSON.stringify(progress));
    }
    
    // // Функция загрузки прогресса из localStorage
    // function loadProgress() {
    //     const saved = localStorage.getItem('dictationProgress');
    //     if (saved) {
    //         const progress = JSON.parse(saved);
    //         imagesRevealed = progress.imagesRevealed || [false, false, false];
            
    //         // Восстанавливаем состояние картинок
    //         imagesRevealed.forEach((revealed, index) => {
    //             if (revealed) {
    //                 const imageItem = document.querySelector(`.image-item[data-index="${index}"]`);
    //                 if (imageItem) {
    //                     imageItem.classList.add('revealed');
    //                 }
    //             }
    //         });
            
    //         // Восстанавливаем время воспроизведения аудио
    //         if (progress.lastPlayTime) {
    //             audioPlayer.currentTime = progress.lastPlayTime;
    //             updateProgress();
    //         }
    //     }
    // }
    
    // Функция завершения задания
    function completeAssignment() {
        completionModal.style.display = 'flex';
        
        // Сохраняем факт завершения задания
        const completion = {
            completed: true,
            completedAt: new Date().toISOString(),
            imagesViewed: imagesRevealed.filter(revealed => revealed).length,
            audioDuration: audioPlayer.duration
        };
        localStorage.setItem('dictationCompleted', JSON.stringify(completion));
    }
    
    // // Загружаем прогресс при загрузке страницы
    // setTimeout(loadProgress, 1000);
    
    // Для отладки
    console.log('Загружаем аудио по ссылке:', AUDIO_URL);
    console.log('Загружаем картинки:', IMAGE_URLS);
    
    // Проверяем, поддерживает ли браузер аудиоформат
    const audio = new Audio();
    const canPlayMP3 = audio.canPlayType('audio/mpeg');
    console.log('Поддержка MP3:', canPlayMP3);
});