addListeners();

function animaster()
{
    return {
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        /**
         * Блок плавно появляется из прозрачного.
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         */
        fadeIn(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        /**
         * Функция, увеличивающая/уменьшающая элемент
         * @param element — HTMLElement, который надо анимировать
         * @param duration — Продолжительность анимации в миллисекундах
         * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
         */
        scale(element, duration, ratio) {
            element.style.transitionDuration =  `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        fadeOut(element, duration) {
            element.style.transitionDuration =  `${duration}ms`;
            element.classList.add('hide');
            element.classList.remove('show');
        },
        moveAndHide(element, duration) {
            animaster().move(element, duration * 2/5, { x: 100, y: 20 });
            const timeout = setTimeout(() => animaster().fadeOut(element, duration * 3/5), duration * 2/5);
            return {
                reset() {
                    clearTimeout(timeout);
                    reseter().resetMove(element);
                    reseter().resetFadeOut(element);
                }
            };
        },
        showAndHide(element, duration) {
            animaster().fadeIn(element, duration * 1/3);
            setTimeout(() => animaster().fadeOut(element, duration * 1/3), duration * 2/3);
        },

        heartBeating(element) {
            let scaleUp = true;

            const interval = setInterval(() => {
                if (scaleUp) {
                    animaster().scale(element, 500, 1.4);
                } else {
                    animaster().scale(element, 500, 1);
                }
                scaleUp = !scaleUp;
            }, 500);

            return {
                stop() {
                    clearInterval(interval);
                    reseter().resetMove();
                    reseter().resetFadeOut();
                }
            };
        },
    };
}

function reseter() {
    return {
        resetMove(element) {
            element.style.transitionDuration = `${100}ms`;
            element.style.transform = null;
        },

        resetFadeIn(element){
            element.style.transitionDuration =  `${100}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        resetFadeOut(element) {
            element.style.transitionDuration = `${100}ms`;
            element.classList.add('show');
            element.classList.remove('hide');
        },
        
        resetScale(element) {
            element.style.transitionDuration =  `${100}ms`;
            element.style.transform = null;
        }
    }

}

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 5000);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            reseter().resetFadeIn(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            animaster().move(block, 1000, {x: 100, y: 10});
        });
    
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            reseter().resetMove(block);
        }); 

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            reseter().resetScale(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            animaster().fadeOut(block, 5000);
        });

    // document.getElementById('moveAndHidePlay')
    //     .addEventListener('click', function () {
    //         const block = document.getElementById('moveAndHideBlock');
    //         animaster().moveAndHide(block, 5000);
    //     });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            const stop = animaster().moveAndHide(block, 5000);
            document.getElementById('moveAndHideReset')
                .addEventListener('click', function () {
                    stop.reset();
                });
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            const stop = animaster().heartBeating(block);
            document.getElementById('heartBeatingStop')
                .addEventListener('click', function () {
                    stop.stop()
                });
        });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
