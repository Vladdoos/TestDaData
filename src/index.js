import './css/style.css'
let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
let token = "fd4470e25f1c4e6f7fab00f1536333da4e8d8726";
let query = null;

let inputField = document.getElementById('party');

//get div, ul, input, section
const div = document.querySelector('#container')
const section = document.querySelector('.container')
const ul = document.querySelector('#json-ul');
const input = document.getElementById('party');

// создать XMLHttpRequest
let request = new XMLHttpRequest();

// Получение фрагмента
const t = document.querySelector('#content');
const label = t.content.querySelector('label');

label.textContent = 'Краткое наименование'
//Дубликат узла
let el = t.content.cloneNode(true);
section.append(el)

label.textContent = 'Полное наименование'
//Дубликат узла
el = t.content.cloneNode(true);
section.append(el)

label.textContent = 'ИНН / КПП'
//Дубликат узла
el = t.content.cloneNode(true);
section.append(el)

label.textContent = 'Адрес'
//Дубликат узла
el = t.content.cloneNode(true);
section.append(el)
// Запрос к серверу
function post () {
    let json = JSON.stringify({query: query})
    request.open('POST', url, false);
    request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('Accept', 'application/json');
    request.setRequestHeader('Authorization', `Token ${token}`);
    request.send(json);

}
// Очищение ul и type организации
function deleteUl () {
    if(request.response) {
        document.querySelectorAll("li").forEach(e => e.remove());
    }
}
function deleteP () {
    if(request.response) {
        document.querySelectorAll(".p-delete").forEach(e => e.remove())
    }
}
// Отслеживание изменения input, создаем подсказки
input.oninput = async function() {
    await deleteUl ();
    query = await inputField.value;
    await post()
    if (request.status === 200) {
        let jsonLi = JSON.parse(request.response);
        jsonLi.suggestions.forEach(function (item) {
            let li = document.createElement('li');
            li.textContent = item.value
            ul.appendChild(li);
            selectedUl ();
        });
    } else {
        input.placeholder = 'System error...'
    }

};
// Заполнение полей
function handleClick(e) {
    query = e.target.textContent;
    input.value = e.target.textContent
    deleteP ();
    deleteUl ();
    post ();
    let p = document.createElement('p');
    p.textContent = `Организация (${JSON.parse(request.response).suggestions[0].data.type})`;
    div.insertAdjacentElement('beforeend', p)
    p.classList.add("p-delete")
    let clone = document.querySelectorAll(".clone");
    clone[0].value = JSON.parse(request.response).suggestions[0].data.name.short_with_opf;
    clone[1].value = JSON.parse(request.response).suggestions[0].data.name.full_with_opf;
    clone[2].value = JSON.parse(request.response).suggestions[0].data.inn + " / " + JSON.parse(request.response).suggestions[0].data.kpp;
    clone[3].value = JSON.parse(request.response).suggestions[0].data.address.unrestricted_value
    liSelected = null;
}
// Отслеживаем клик ul
ul.addEventListener('click', handleClick);

let liSelected;
//Листание кнопками клавиатуры, выбор по enter
function selectedUl () {
    let ul = document.getElementById('json-ul');
    let index = -1;

    document.addEventListener('keydown', function(event) {
        let len = ul.getElementsByTagName('li').length-1;
        if(event.key === 'ArrowDown') {
            index++;
            //down
            if (liSelected) {
                removeClass(liSelected, 'selected');
                let next = ul.getElementsByTagName('li')[index];
                if(typeof next !== undefined && index <= len) {

                    liSelected = next;
                } else {
                    index = 0;
                    liSelected = ul.getElementsByTagName('li')[0];
                }
                addClass(liSelected, 'selected');
                enterLi (liSelected);

            }
            else {
                index = 0;

                liSelected = ul.getElementsByTagName('li')[0];
                addClass(liSelected, 'selected');
            }
        }
        else if (event.key === 'ArrowUp') {

            //up
            if (liSelected) {
                removeClass(liSelected, 'selected');
                index--;
                enterLi (liSelected);
                let next = ul.getElementsByTagName('li')[index];
                if(typeof next !== undefined && index >= 0) {
                    liSelected = next;
                } else {
                    index = len;
                    liSelected = ul.getElementsByTagName('li')[len];
                }
                addClass(liSelected, 'selected');
            }
            else {
                index = 0;
                liSelected = ul.getElementsByTagName('li')[len];
                addClass(liSelected, 'selected');
            }
        }
    }, false);

    function removeClass(el, className) {
        if(el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\b)' + className.split(' ').join('|') + '(\b|$)', 'gi'), ' ');
        }
    }

    function addClass(el, className) {
        if(el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    function enterLi (liSelected) {
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' && liSelected.className === 'selected') {
                liSelected.click()
                index = -1;
            }
        });
    }

}
// Отслеживаем клик li
liSelected?.addEventListener('click', handleClick);


