window.onload = function (){
    document.querySelector('.left').innerHTML = '';
    getData(function (err , data) {
        if(err) throw new Error(`Ошибка при обработке данных: ${err.message}`);
    
        for (let item in data){
           createItem(data[item].author ,data[item].name , data[item].img);
        }
    })
}

function getData(colback){
    fetch('./static/data.json')
    .then(dataJSON => dataJSON.json())
    .then(data => {colback(null , data)})
    .catch(err => {colback(err)});
    
    return;
}
function createItem( author,name,imageURL){

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

    function createAfter(){
        let after = document.createElement('div');

        after.className = 'after';
        
        return after;
    }
    
    //Собираем item
    item.appendChild(createImage());
    item.appendChild(createTitle());
    item.appendChild(createAfter());

    document.querySelector('.left').appendChild(item);
    return;
}


