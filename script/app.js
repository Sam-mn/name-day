const citiesList = document.querySelector('.cities');
const citiesList2 = document.querySelector('.cities2');
const citiesList3= document.querySelector('.cities3');
const timeZoneList = document.querySelector('#time-zone');
const cdForm = document.querySelector('.form-group-1');
const dmForm = document.querySelector('#DM');
const nav = document.querySelector('.nav');

//Start agin button
document.querySelector('.start-again').addEventListener('click', ()=>{
    document.querySelector('.info-div').classList.add('hide');
    nav.classList.add('hide');
})

//First three buttons to choose between the way to search.
//By name and country button.
document.querySelector('.by-name').addEventListener('click', ()=>{
    document.querySelector('#countriesList').classList.remove('hide');
    document.querySelector('#TTY').classList.add('hide');
    dmForm.classList.add('hide');
    nav.classList.remove('hide');
    document.querySelector('.info-div').classList.remove('hide')
    document.querySelector('#info').innerHTML= '';
})

//Today and tomorrow and yesterday button.
document.querySelector('.our-days').addEventListener('click', ()=>{
    document.querySelector('#TTY').classList.remove('hide');
    document.querySelector('.first-list').classList.remove('hide');
    document.querySelector('.second-list').classList.add('hide');
    timeZoneList.classList.remove('hide');
    document.querySelector('#countriesList').classList.add('hide');
    cdForm.classList.add('hide');
    dmForm.classList.add('hide');
    document.querySelector('.info-div').classList.remove('hide')
    nav.classList.remove('hide');
    document.querySelector('#info').innerHTML= '';
})

//By day and month button.
document.querySelector('.by-day').addEventListener('click', ()=>{
    dmForm.classList.remove('hide');
    document.querySelector('#TTY').classList.add('hide');
    document.querySelector('#countriesList').classList.add('hide');
    cdForm.classList.add('hide');
    document.querySelector('.info-div').classList.remove('hide');
    nav.classList.remove('hide');
    document.querySelector('#info').innerHTML= '';
    document.querySelector('.third-list').classList.remove('hide');
})

//To convert from city code to city name.
const cities = [
{name:'Austria',code:'at'}, {name:'Denmark',code:'dk'}, {name:'France',code:'fr'}, {name:'Italy',code:'it'},
{name:'Slovakia',code:'sk'}, {name:'Croatia',code:'hr'}, {name:'Poland',code:'pl'},
{name:'United States of America',code:'us'}, {name:'Germany',code:'de'}, {name:'Finland',code:'fi'},
{name:'Hungary',code:'hu'}, {name:'Sweden',code:'se'}, {name:'Czechia',code:'cz'}, {name:'Spain',code:'es'}
];

//Time zone names.
const timeZone =  [
    'America/Denver', 'America/Costa_Rica', 'America/Los_Angeles', 'America/St_Vincent','America/Toronto',
    'Europe/Amsterdam', 'Europe/Monaco', 'Europe/Prague', 'Europe/Isle_of_Man', 'Africa/Cairo',
    'Africa/Johannesburg', 'Africa/Nairobi', 'Asia/Yakutsk', 'Asia/Hong_Kong', 'Asia/Taipei',
    'Pacific/Midway', 'Pacific/Honolulu', 'Etc/GMT-6', 'US/Samoa', 'Zulu', 'US/Hawaii', 'Israel', 'Etc/GMT-2',
]

//To Convert from number to month.
const monthsConvert = (number)=>{
    let month;
    switch(number){
        case 1:
        month = 'January';
        break;
        case 2:
        month = 'February';
        break;
        case 3:
        month = 'March';
        break;
        case 4:
        month = 'April';
        break;
        case 5:
        month = 'May';
        break;
        case 6:
        month = 'June';
        break;
        case 7:
        month = 'July';
        break;
        case 8:
        month = 'August';
        break;
        case 9:
        month = 'September';
        break;
        case 10:
        month = 'October';
        break;
        case 11:
        month = 'November';
        break;
        case 12:
        month = 'December';
        break;
        default:
        month = 'January'
    }

    return month;
}


const appendError = (color, msg)=>{
    document.querySelector('#info').innerHTML = `
            <div class="error text-center" style="background-color:${color}">
                <p>${msg}</p>
            </div>`
} 

//Append the responded information from the searching by name and country
const addInfo = (data)=>{
    data.results.forEach(obj => {
    let month = monthsConvert(obj.month);
        let info = `
            <div class="info-card">
                <p class="first-result">The name day is: <span class='date'>${obj.day}/${month}</span></p>
                <div>
                    <h1 class="text-center country-name">${data['country name']}</h1>
                    <h2 class="text-center">This day names:</h2>
                    <p class="text-center">${obj.name}</p>
                </div>
            </div>
        `
        document.querySelector('#info').innerHTML += info;
        });
}

//Append the responded information from the searching for T&T&y and by name and month

const addInfo2 = (data)=>{
    data.forEach(obj => {
    let month = monthsConvert(obj.dates.month);
    let info = `
        <div class="info-card info-card2">
            <p class="first-result">${obj.dates.day}/${month}</p>
            <div>
                <h2 class="text-center">This day names:</h2>
                <ul class="infoList">
                </ul>
            </div>
        </div>
    `
    document.querySelector('#info').innerHTML += info;

        for (const property in obj.namedays) {
            let country = property;
            let names = obj.namedays[property];
            cities.forEach(city=>{
                if(country === city.code){
                    country = city.name;
                }
            })
            let nameCountry = `<li><span class='country-name'>${country}</span><br> ${names}</li>`;
            document.querySelector('.infoList').innerHTML += nameCountry;
        }
    });
}



//To get information by name & country
const citiesEl = cities.map(city=>`<li class='${city.code}'>${city.name}</li>`).join('');

citiesList.innerHTML += citiesEl;
citiesList2.innerHTML += citiesEl;
citiesList3.innerHTML += citiesEl;

let cityCode = null;
citiesList.addEventListener('click', e=>{
    if(e.target.tagName === 'LI'){
        cityCode = e.target.className;
        cdForm.classList.remove('hide');
        document.querySelector('#info').classList.add('hide');
    }
})

cdForm.addEventListener('submit', e =>{
    e.preventDefault();
    document.querySelector('#info').classList.remove('hide');
    document.querySelector('#info').innerHTML= '';
    const cdInput = cdForm.nameCountry.value;

    getNameDay(`https://api.abalin.net/getdate?name=${cdInput}&country=${cityCode}`)
    .then(data=>{
        if(data.results.length === 0){
            appendError('#e8ce178c','There is no match, try with another name.');   
        }else{
            addInfo(data);
        }})
    .catch(err=> appendError('#ea00008c', err.message))
    cdForm.classList.add('hide');
    cdForm.reset();
})

//To get information for today & yesterday & tomorrow
const timeZoneEl = timeZone.map(zone=>`<li>${zone}</li>`).join('');
timeZoneList.innerHTML = timeZoneEl;
let timeZoneCode = null;

timeZoneList.addEventListener('click', (e)=>{
    if(e.target.tagName === 'LI'){
        timeZoneCode = e.target.innerText;
        document.querySelector('#info').innerHTML= '';   
        citiesList2.classList.remove('hide');
        document.querySelector('.first-list').classList.add('hide');
        document.querySelector('.second-list').classList.remove('hide');
    }
});

let cityCode2 = null;
citiesList2.addEventListener('click', e=>{
    if(e.target.tagName === 'LI'){
        cityCode2 = e.target.className;
        document.querySelector('.t-y-t-btns').classList.remove('hide');
    }
})

const addRemove = ()=>{
    document.querySelector('#info').innerHTML= '';
    document.querySelector('.t-y-t-btns').classList.add('hide');
    document.querySelector('.first-list').classList.remove('hide');
    document.querySelector('.second-list').classList.add('hide');
}

document.querySelector('#today').addEventListener('click', e=>{
    e.preventDefault();
    addRemove();
    getNameDay(`https://api.abalin.net/today?timezone=${timeZoneCode}&country=${cityCode2}`)
    .then(data=> addInfo2(data.data))
    .catch(err=> appendError('#ea00008c', err.message))
}) 

document.querySelector('#tomorrow').addEventListener('click', e=>{
    e.preventDefault();
    addRemove();
    getNameDay(`https://api.abalin.net/tomorrow?timezone=${timeZoneCode}&country=${cityCode2}`)
    .then(data=> addInfo2(data.data))
    .catch(err=> appendError('#ea00008c', err.message))
})

document.querySelector('#yesterday').addEventListener('click', e=>{
    e.preventDefault();
    addRemove();
    getNameDay(`https://api.abalin.net/yesterday?timezone=${timeZoneCode}&country=${cityCode2}`)
    .then(data=> addInfo2(data.data))
    .catch(err=>appendError('#ea00008c', err.message))
})

//get information by day & month
let cityCode3 = null;
citiesList3.addEventListener('click', e=>{
    if(e.target.tagName === 'LI'){
        cityCode3 = e.target.className;
    }
    document.querySelector('.third-list').classList.add('hide');
})

dmForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    document.querySelector('#info').innerHTML= '';
    document.querySelector('.third-list').classList.remove('hide');
    let day = dmForm.dayMonth.value.split('-');
    /*
    //To apply searching by numbers buttons
    let day = dmForm.dayMonth.value;
    let month = dmForm.monthDay.value;
    */
    getNameDay(`https://api.abalin.net/namedays?country=${cityCode3}&month=${parseInt(day[1])}&day=${parseInt(day[2])}`)
    .then(data=>addInfo2(data.data))
    .catch(err=>appendError('#ea00008c', err.message));
})

