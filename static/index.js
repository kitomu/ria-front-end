
window.onload = function (){

    const leftBar = document.querySelector('.left'),
          rightBar = document.querySelector('.right'),
          input = document.querySelector('input');

    input.value = '';
    
    //Очищаем рабочие зоны
    leftBar.innerHTML = '';
    rightBar.innerHTML = '';

    //забираем данные с помощью колбэка и создаем итемы
    getData(function (err , data) {
        //Слушаем ошибки
        if(err) throw new Error(`Ошибка при обработке данных: ${err.message}`);
        
        //ходим по ключам объекта, и передаем аргументы в функцию рендеринга
        for (let item in data){
           createItem(data[item].author ,data[item].name , data[item].img , item);
        }

        // Сумирование итемов в колонке
        document.querySelector('.left-counter').innerHTML = `В левой колонке: ${leftBar.childNodes.length}`
        document.querySelector('.right-counter').innerHTML = `В правой колонке: ${rightBar.childNodes.length}`
    });

    //"Гениальный" поиск с колбэк хэлом
    var timer;    
    input.addEventListener('keydown' , function(){
        //Избавляемся от многократных запросов при нажатии клавиши
        clearTimeout(timer);

        timer = setTimeout(() => {
            
            //Очищаем колонки для рендеринга нового контента
            leftBar.innerHTML = '';
            rightBar.innerHTML = '';
            
            // используем стрелочную функцию для доступа к объекту через this
            getData((err , data) => {
                //Слушаем ошибки
                if(err) throw new Error(`Ошибка при обработке данных: ${err.message}`);
                //ходим по ключам объекта, и передаем отобраные аргументы в функцию рендеринга
                for (let item in data){
                    //Сравниваем авторов и наш инпут в нижнем регистре, и отдаем только совпадающие элементы
                    if(data[item].author.toLowerCase().match(this.value.toLowerCase()))
                            createItem(data[item].author ,data[item].name , data[item].img , item);
                }
                // Сумирование итемов в колонке
                document.querySelector('.left-counter').innerHTML = `В левой колонке: ${leftBar.childNodes.length}`
                document.querySelector('.right-counter').innerHTML = `В правой колонке: ${rightBar.childNodes.length}`
            });
        },500);
    })
}

//Функция забора данных, колбэк принимает первым аргументом ошибку, а вторым данные
function getData(callback){
    fetch('./static/data.json')
    .then(dataJSON => dataJSON.json())
    .then(data => {callback(null , data)})
    .catch(err => {callback(err)});
    
    return;
}

//Функция рендеринга, на вход получает имя автора , имя книги , URL картинки и id книги и создает блок
function createItem( author , name , imageURL , bookId){
    //Создаем главный блок
    let item = document.createElement('div');
        item.className = 'item';

        //Создаем блок картинку
    function createImage(){
            
        //Обявляем нужные теги
        let pic = document.createElement('div'),
            span = document.createElement('span'),
            img = document.createElement('img');
        
        //Вставляем URL картинки    
        img.setAttribute('src' , imageURL);
        
        //Класы для тегов
        pic.className = 'pic';

        //Собираем блок
        span.appendChild(img)
        pic.appendChild(span);
        
        //Возвращаем готовый блок
        return pic;
    }

    //создаем текстовый узел
    function createTitle(){
        //Создаем нужные теги
        let title = document.createElement('div'),
            spanName = document.createElement('span'),
            spanAuth = document.createElement('span');
            
        //Чтобы не играться с <b> пользуемся шаблонными строками и innerHtml
        spanName.innerHTML = `<b>Название: </b> ${name}`
        title.appendChild(spanName);

        spanAuth.innerHTML = `<b>Автор: </b> ${author}`;
        title.appendChild(spanAuth);

        //Класы для тегов
        title.className = 'title';
        
        //Возвращаем собраный узел
        return title;
    }

    //Создаем кнопку переноса
    function createButton(){
        
        //Обявляем тег
        let button = document.createElement('div');

        //присваеваем тегу нужный клас (если он есть в сторе, тогда .before)
        button.className = (localStorage.getItem(bookId))?'before':'after';
        
        //слушаем на клик кнопки
        button.addEventListener('click', function(){
            
            //Переключаем клас при нажатии
            this.classList.toggle('after');
            this.classList.toggle('before');

            //Смотрим на клас и переносим в нужный раздел (если before тогда в правую колонку)
            switch(this.className){
                case "before":
                    document.querySelector('.right').appendChild(this.parentNode);
                    
                    //Добавляем в стор id нужной книги для сохранения в правой колонке
                    localStorage.setItem(bookId , true)

                    // динамический подсчет
                    document.querySelector('.left-counter').innerHTML = `В левой колонке: ${document.querySelector('.left').childNodes.length}`
                    document.querySelector('.right-counter').innerHTML = `В правой колонке: ${document.querySelector('.right').childNodes.length}`
                    break;
                case "after":
                    document.querySelector('.left').appendChild(this.parentNode);

                    //Удаляем из стора для отображения в левой колонке
                    localStorage.removeItem(bookId);

                    //динамический подсчет
                    document.querySelector('.left-counter').innerHTML = `В левой колонке: ${document.querySelector('.left').childNodes.length}`
                    document.querySelector('.right-counter').innerHTML = `В правой колонке: ${document.querySelector('.right').childNodes.length}`
                    break;
                default:
                    //По дефолту кидаем в правую колонку
                    document.querySelector('.left').appendChild(this.parentNode);
                    break;
            }

        })
        //Даем гототую кнопку с событиями
        return button;
    }
    
    //Собираем item из готовых блоков
    item.appendChild(createImage());
    item.appendChild(createTitle());
    item.appendChild(createButton());

    //при рендеренге выбираем колонку для добавления книги
    document.querySelector(
        //если есть в сторе тогда в правую ...
        (localStorage.getItem(bookId))?'.right':'.left'
                            ).appendChild(item);
    
    return;
}