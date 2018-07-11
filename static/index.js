
window.onload = function (){

    document.querySelector('.left').innerHTML = '';
    document.querySelector('.right').innerHTML = '';

    getData(function (err , data) {
        if(err) throw new Error(`Ошибка при обработке данных: ${err.message}`);
        
        for (let item in data){
           createItem(data[item].author ,data[item].name , data[item].img , item);
        }
    });

}


function getData(colback){
    fetch('./static/data.json')
    .then(dataJSON => dataJSON.json())
    .then(data => {colback(null , data)})
    .catch(err => {colback(err)});
    
    return;
}
function createItem( author , name , imageURL , bookId){
    console.log(bookId);
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
        
        return title;
    }

    function createButton(){
        let button = document.createElement('div');

        button.className = (localStorage.getItem(bookId))?'before':'after';
        
        button.addEventListener('click', function(){
            
            //Переключаем класы для отображения кнопки
            this.classList.toggle('after');
            this.classList.toggle('before');

            
            switch(this.className){
                case "before":
                    document.querySelector('.right').appendChild(this.parentNode);
                    localStorage.setItem(bookId , true)
                    break;
                case "after":
                    document.querySelector('.left').appendChild(this.parentNode);
                    localStorage.removeItem(bookId);
                    break;
                default:
                    break;
            }

        })

        return button;
    }
    
    //Собираем item
    item.appendChild(createImage());
    item.appendChild(createTitle());
    item.appendChild(createButton());

    document.querySelector(
        (localStorage.getItem(bookId))?'.right':'.left'
                            ).appendChild(item);
    return;
}


