

let answers = {
    2: null,
    3: null,
    4: null,
    5: null
}

let btnNext = document.querySelectorAll('[data-nav="next"]');

btnNext.forEach(item => {
    item.addEventListener('click', () => {
        let thisCard = item.closest("[data-card]");
        let thisCardNumber = +(thisCard.dataset.card);

        if (thisCard.dataset.validate == 'novalidate') {
            navigate('next', thisCard)
            updateProgressBar('next', thisCardNumber)

        } else {
            //При переходе на другую карточку сохраняем данные в объект
            saveAnswer(thisCardNumber, gatherCardData(thisCardNumber))

            // Валидация на заполненность
            if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
                navigate('next', thisCard)
                updateProgressBar('next', thisCardNumber)

            } else {
                alert("Сделайте ответ,перед тем как переходить далее")
            }

        }

    })
})

let btnPrev = document.querySelectorAll('[data-nav="prev"]');

btnPrev.forEach(item => {
    item.addEventListener('click', () => {
        let thisCard = item.closest("[data-card]");
        let thisCardNumber = +(thisCard.dataset.card);

        navigate('prev', thisCard)
        updateProgressBar('prev', thisCardNumber)
    })
})

function navigate(direction, thisCard) {
    let thisCardNumber = +(thisCard.dataset.card);
    if (direction == 'next') {
        let nextCard = thisCardNumber + 1;
        document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden')

    } else if (direction == 'prev') {
        let prevCard = thisCardNumber - 1;
        document.querySelector(`[data-card="${prevCard}"]`).classList.remove('hidden')

    }

    thisCard.classList.add('hidden');

}
//Функция которая собирает все данные из карточек
function gatherCardData(number) {
    let result = [];

    //Находим каротчку по номеру и data-атрибуту
    let currentCard = document.querySelector(`[data-card="${number}"]`)

    //Находим главный вопрос карточки
    let question = currentCard.querySelector("[data-question]").innerText;

    // Находим значения отмеченных радио кнопок
    let radioValues = currentCard.querySelectorAll('[type="radio"]');
    radioValues.forEach(item => {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    let checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]')
    checkBoxValues.forEach(item => {
        if (item.checked) {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    let inputValues = currentCard.querySelectorAll('[type="text"], [type="email"], [type="number"]')
    inputValues.forEach(item => {
        if (item.value.trim() != '') {
            result.push({
                name: item.name,
                value: item.value
            })
        }
    })

    let data = {
        question: question,
        answer: result
    }

    return data;
}

// Функция которая записывает ответ в объект answers
function saveAnswer(number, data) {
    answers[number] = data;
}
// Функция проверки на заполненность карточки
function isFilled(number) {
    if (answers[number].answer.length > 0) {
        return true;
    } else {
        return false;
    }
}

//Функция для проверки email
function validateEmail(email) {
    let pattern = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
    return pattern.test(email)
}

// Проверка на заполненность required чекбоксов и инпутов с email
function checkOnRequired(number) {
    let currentCard = document.querySelector(`[data-card="${number}"]`);

    //required пишем в html разметке "требуемый"
    let requiredFields = currentCard.querySelectorAll('[required]');
    let isValidArray = [];

    requiredFields.forEach(item => {
        if (item.type == 'checkbox' && item.checked == false) {
            isValidArray.push(false);
        } else if (item.type == 'email') {
            if (validateEmail(item.value)) {
                isValidArray.push(true);
            } else {
                isValidArray.push(false);
            }
        }
    });

    if (isValidArray.indexOf(false) == -1) {
        return true;
    } else {
        return false;
    };
}

// Подсвечиваем рамку а радиокнопок
document.querySelectorAll('.radio-group').forEach(item => {
    item.addEventListener('click', e => {
        let label = e.target.closest('label');
        if (label) {
            //Отменяем класс active у всех тегов label
            label.closest('.radio-group').querySelectorAll('label').forEach(item => {
                item.classList.remove('radio-block--active');
            })
            //Добавляем класс active к label по которому кликнули
            label.classList.add('radio-block--active');
        }
    })
})

// Подсвечиваем рамку для checkBoxes
document.querySelectorAll('label.checkbox-block input[type="checkbox"]').forEach(item => {
    item.addEventListener('change', e => {
        if (item.checked) {
            item.closest('label').classList.add('checkbox-block--active');
        } else {
            item.closest('label').classList.remove('checkbox-block--active');
        }
    })
})


// Отображение прогресс бара 
function updateProgressBar(direction, cardNumber) {
    //Находим кол-во всех карточек
    let cardsTotalNumber = document.querySelectorAll('[data-card]').length;

    //Находим текущую карточку
    //Проверка направления перемещения
    if (direction == 'next') {
        cardNumber = cardNumber + 1;
    } else if (direction == 'prev') {
        cardNumber = cardNumber - 1;
    }

    //Расчет % прохождения
    let progress = (cardNumber * 100) / cardsTotalNumber;
    //Убираем знаки после запятой или можно использовать метод toFixed()
    progress = (progress | 0);

    //Обновляем прогресс бар
    let progressBar = document.querySelector(`[data-card="${cardNumber}"]`)
        .querySelector('.progress')
    if (progressBar) {
        //Обновить число прогресс бара
        progressBar.querySelector('.progress__label strong').innerText = `${progress}%`;
        //Обновить полоску прогресс бара
        progressBar .querySelector('.progress__line-bar').style = `width: ${progress}%`;

    }

}