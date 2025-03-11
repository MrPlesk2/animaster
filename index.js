addListeners();

function animaster()
{
    const _steps = [];
    return {
        play(element, cycled = false) {
            if (_steps.length <= 0)
                return;

            _steps[0][0](element, ..._steps[0].slice(1));
            let interval = _steps[0][1]
            _steps.slice(1).forEach(x => {
                setTimeout(() => {
                    x[0](element, ...x.slice(1))
                }, interval)
                interval += x[1];
            });


        },

        addMove(duration, translation) {
            _steps.push([(e, d, t) => animaster().move(e, d ,t), duration, translation]);
            return this;
        },

        addFadeOut(duration) {
            _steps.push([(e, d) => animaster().fadeOut(e, d), duration]);
            return this;
        },

        addScale(duration, ratio) {
            _steps.push([(e, d, r) => animaster().scale(e, d , r), duration, ratio]);
            return this;
        },

        addFadeIn(duration) {
            _steps.push([(e, d) => animaster().fadeIn(e, d), duration]);
            return this;
        },

        addDelay(duration) {
          _steps.push([(e, d) => { }, duration]);
          return this;
        },

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
            const anim = animaster().addMove(duration * 2/5, { x: 100, y: 20 })
                                         .addFadeOut(duration * 3/5);
            anim.play(element);
            // animaster().move(element, duration * 2/5, { x: 100, y: 20 });
            // const timeout = setTimeout(() => animaster().fadeOut(element, duration * 3/5), duration * 2/5);
            // return {
            //     reset() {
            //         clearTimeout(timeout);
            //         reseter().resetMove(element);
            //         reseter().resetFadeOut(element);
            //     }
            // };
        },
        showAndHide(element, duration) {
            const anim = animaster().addFadeIn(duration * 1/3)
                                         .addDelay(duration * 1/3)
                                         .addFadeOut(duration * 1/3);
            anim.play(element);
            // animaster().fadeIn(element, duration * 1/3);
            // setTimeout(() => animaster().fadeOut(element, duration * 1/3), duration * 2/3);
        },

        heartBeating(element) {
            const anim = animaster().addScale(500, 1.4)
                                         .addScale(500, 1);
            anim.play(element, true);
            // let scaleUp = true;
            //
            // const interval = setInterval(() => {
            //     if (scaleUp) {
            //         animaster().scale(element, 500, 1.4);
            //     } else {
            //         animaster().scale(element, 500, 1);
            //     }
            //     scaleUp = !scaleUp;
            // }, 500);
            //
            // return {
            //     stop() {
            //         clearInterval(interval);
            //         reseter().resetMove();
            //         reseter().resetFadeOut();
            //     }
            // };
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
            const anim = animaster().addFadeIn(5000);
            anim.play(block);
        });

    document.getElementById('fadeInReset')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            reseter().resetFadeIn(block);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            const anim = animaster().addMove(1000, {x: 100, y: 10});
            anim.play(block);

        });
    
    document.getElementById('moveReset')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            reseter().resetMove(block);
        }); 

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            const anim = animaster().addScale(1000, 1.25);
            anim.play(block);
        });

    document.getElementById('scaleReset')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            reseter().resetScale(block);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            const anim = animaster().addFadeOut(5000);
            anim.play(block);
        });

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
