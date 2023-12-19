let jsonObject = {}
let itemsToShow = 24;

const createRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const CommentsPerStars = function(commentsObects, stars){
    let count = 0;
    for(var comment of commentsObects){
        if(comment.star_rating == stars){
            count += 1
        }
    }
    return count;
}

const showReviewBar = function(commentsObects){
    const star5 = CommentsPerStars(commentsObects, 5);
    const star4 = CommentsPerStars(commentsObects, 4);
    const star3 = CommentsPerStars(commentsObects, 3);
    const star2 = CommentsPerStars(commentsObects, 2);
    const star1 = CommentsPerStars(commentsObects, 1);
 
    document.querySelector('.bar--5').style.setProperty('width', `calc(${star5 / commentsObects.length} * 100%)`);
    document.querySelector('.bar--4').style.setProperty('width', `calc(${star4 / commentsObects.length} * 100%)`);
    document.querySelector('.bar--3').style.setProperty('width', `calc(${star3 / commentsObects.length} * 100%)`);
    document.querySelector('.bar--2').style.setProperty('width', `calc(${star2 / commentsObects.length} * 100%)`);
    document.querySelector('.bar--1').style.setProperty('width', `calc(${star1 / commentsObects.length} * 100%)`);

    document.querySelector('.js-dialog-star5').innerHTML = star5;
    document.querySelector('.js-dialog-star4').innerHTML = star4;
    document.querySelector('.js-dialog-star3').innerHTML = star3;
    document.querySelector('.js-dialog-star2').innerHTML = star2;
    document.querySelector('.js-dialog-star1').innerHTML = star1;
}

const showAvgRating = function(commentsObects){
    // Totaal aantal sterren ophalen
    let totalStarsUsers = 0
    for(var comment of commentsObects){
        totalStarsUsers += comment.star_rating
    }
    console.log(totalStarsUsers)
    console.log(commentsObects.length)
    // Gemiddelde berekenen (totaal aantal sterren / aantal comments)
    let avgRating = (totalStarsUsers / commentsObects.length).toFixed(1)
    console.log(avgRating)
    let html = 
    `<h3 class="u-mb-clear">${avgRating}</h3>
    <meter class="c-rating c-rating__avg" min="0" max="5" value="${avgRating}"></meter>
    <p class="u-mb-clear">Gemiddelde van ${commentsObects.length} reviews</p>`
    document.querySelector('.js-dialog-avgreview').innerHTML = html;
    document.querySelector(`.c-rating__avg`).style.setProperty('--percent', `calc(${avgRating}/5*100%)`);
}

const showComments = function(commentsObects){
    let html = '';
    let i = 0
    const comments = document.querySelector('.js-dialog-comments')
    comments.innerHTML = '';
    for(var comment of commentsObects){
        html = 
        `<div class="c-dialog__comment">
            <h4 class="u-mb-clear">${comment.name}</h4>
            <meter class="c-rating c-rating__comment c-rating__comment--${i}" min="0" max="5" value="${comment.star_rating}"></meter>
            <div class="c-dialog__text">${comment.comment}</div>
        </div>`
        comments.innerHTML += html;
        // hier maken we voor elke comment een apparte modifier voor het displayen van het aantal sterren
        document.querySelector(`.c-rating__comment--${i}`).style.setProperty('--percent', `calc(${comment.star_rating}/5*100%)`);
        i += 1;
    }
}

let GenerateComments = async() => {
    // Genereert aantal comments om te displayen
    const aantalComments = createRandomNumber(5, 10);
    console.log(aantalComments);
    // Genereert een lijst van commentIds
    let commentIds = [];
    for(let i = 0; i < aantalComments; i ++){
        commentIds.push(createRandomNumber(1, 20));
    }
    console.log(commentIds);
    
    // we halen voor elk id in onze lijst de comment op
    let comments = []
    const json = await fetch('./comments/data.json')
        .then((response) => response.json())

    for(var id of commentIds){
        for(var comment of json){
            if(comment.id == id){
                comments.push(comment);
            }
        }
    }
    console.log(comments);
    showComments(comments)
    showAvgRating(comments);
    showReviewBar(comments);
}

const showPlaform = function(platform){
    if(platform == "PC (Windows)"){
        return '<div class="c-games__windows"><div class="box"></div><div class="box"></div> <div class="box"></div><div class="box"></div></div>';
    }else if(platform == "Web Browser"){
        return '<svg class="c-games__browser" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h420v-140H160v140Zm500 0h140v-360H660v360ZM160-460h420v-140H160v140Z"/></svg>'
    }else{
        return'<div class="c-games__windows"><div class="box"></div><div class="box"></div><div class="box"></div><div class="box"></div></div><svg class="c-games__browser" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h420v-140H160v140Zm500 0h140v-360H660v360ZM160-460h420v-140H160v140Z"/></svg>'
    }
}

const listenTocloseDialog = function(){
    document.querySelector('.js-dialog-close').addEventListener('click', function(){
        document.startViewTransition(() => document.querySelector('dialog').close());
        setTimeout(() => {
            document.documentElement.style.overflow = '';        
        }, 400);
    })
}

const showDetailsOfGame = function(jsonObject){
    const dialog = document.querySelector('dialog');
    const screenshots = document.querySelector('.js-dialog-screenshots');
    if(jsonObject.screenshots.length >= 2){
        screenshots.innerHTML = 
        `<img class="c-dialog__screenshot" src="${jsonObject.screenshots[0].image}" alt="${jsonObject.title}">
        <img class="c-dialog__screenshot" src="${jsonObject.screenshots[1].image}" alt="${jsonObject.title}">`
    }else if(jsonObject.screenshots.length == 1){
        screenshots.innerHTML = 
        `<img class="c-dialog__screenshot" src="${jsonObject.screenshots[0].image}" alt="${jsonObject.title}">`
    }
    else{
        screenshots.innerHTML = "No images found"
    }
    document.querySelector('.js-dialog-name').innerHTML = jsonObject.title;
    document.querySelector('.js-dialog-img').src = jsonObject.thumbnail;
    document.querySelector('.js-dialog-description').innerHTML = jsonObject.short_description
    document.querySelector('.js-dialog-title').innerHTML = jsonObject.title;
    document.querySelector('.js-dialog-developer').innerHTML = jsonObject.developer;
    document.querySelector('.js-dialog-publisher').innerHTML = jsonObject.publisher;
    document.querySelector('.js-dialog-releasedate').innerHTML = jsonObject.release_date;
    document.querySelector('.js-dialog-genre').innerHTML = jsonObject.genre;
    document.querySelector('.js-dialog-platform').innerHTML = jsonObject.platform;
    document.querySelector('.js-dialog-screenshot-title').innerHTML = `${jsonObject.title} screenshots`
    document.querySelector('.js-dialog-link').href = jsonObject.game_url

    GenerateComments();

    document.startViewTransition(() => dialog.showModal());
    document.documentElement.style.overflow = 'hidden';
    listenTocloseDialog();
}

const showGames = function(jsonObject, itemsToShow){
    const games = document.querySelector('.js-games');
    for(const game of jsonObject.slice(itemsToShow - 24, itemsToShow)){
        const button = document.createElement('button');
        button.classList.add('c-games__cell', 'js-game', 'o-button-reset');
        button.setAttribute('data-title', `${game.title}`);
        button.setAttribute('data-id', `${game.id}`);

        const img = document.createElement('img');
        img.classList.add('c-games__photo');
        img.src = game.thumbnail;
        img.alt = game.title;

        const div = document.createElement('div');
        div.classList.add('c-games__body');

        const h3 = document.createElement('h3');
        h3.classList.add('c-games__title');
        h3.innerHTML = `${game.title}`;

        const div2 = document.createElement('div');
        div2.classList.add('c-games__filters');

        const p = document.createElement('p');
        p.classList.add('c-games__genre', "u-mb-clear");
        p.innerHTML = `${game.genre}`;

        const div3 = document.createElement('div');
        div3.classList.add('c-games__platform');
        div3.innerHTML = `${showPlaform(game.platform)}`;

        button.appendChild(img);
        div.appendChild(h3);
        div2.appendChild(p);
        div2.appendChild(div3)
        div.appendChild(div2);
        button.appendChild(div);

        games.appendChild(button)
        // html += 
        // `<button class="c-games__cell js-game o-button-reset" data-title=${game.title} data-id=${game.id}>
        //     <img class="c-games__photo" src="${game.thumbnail}" alt="${game.title}">
        //     <div class="c-games__body">
        //         <h3 class="c-games__title">${game.title}</h3>
        //         <div class="c-games__filters">
        //             <p class="c-games__genre u-mb-clear">${game.genre}</p>
        //             <div class="c-games__platform">
        //                 ${showPlaform(game.platform)}
        //             </div>
        //         </div>
        //     </div>
        // </button>`;
    }
    listenToClickGame();
}   

let getGamesByReleaseDate = async() => {
    const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games?sort-by=release-date';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options).then((response) => response.json())
        // const result = await response.text();
        console.info(response);
        jsonObject = response
        showGames(jsonObject, itemsToShow);
    } catch (error) {
        console.error(error);
    }
}

let getGamesByPopularity = async() => {
    const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games?sort-by=popularity';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options).then((response) => response.json())
        // const result = await response.text();
        console.info(response);
        jsonObject = response
        showGames(jsonObject, itemsToShow);
    } catch (error) {
        console.error(error);
    }
}


let getDetailsOfGame = async(gameId) => {
    const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`;
    const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options).then((response) => response.json());
        // const result = await response.text();
        console.info(response);
        showDetailsOfGame(response);
    } catch (error) {
        console.error(error);
    }
}

const listenToClickGame = function(){
    const games = document.querySelectorAll('.c-games__cell');
    for(const game of games){
        game.addEventListener('click', function(){
            const id = this.getAttribute('data-id');
            console.info(id);
            getDetailsOfGame(id);
        })
    }
}

const listenToScroll = function(){
    let offsetHeight = 50;
    window.addEventListener('scroll', function(){
        // console.info(`inner heigt: ${window.innerHeight}`);
        // console.info(`scrollY: ${window.scrollY}`);
        // console.info(`body: ${document.body.offsetHeight}`);
        if (window.innerHeight + window.scrollY + offsetHeight >= document.body.offsetHeight) {
            console.info('laad meer data');
            itemsToShow += 24;
            showGames(jsonObject, itemsToShow);
            console.info(offsetHeight);
        }
    });
}

const listenToSortBy = function(){
    const sortBy = document.querySelector('.js-sort-by');
    sortBy.addEventListener('change', function(){
        itemsToShow = 24;
        const value = sortBy.value;
        if(value == "release-date"){
            getGamesByReleaseDate();
            document.querySelector('.js-games').innerHTML = '';
        }else{
            getGamesByPopularity();
            document.querySelector('.js-games').innerHTML = '';
        }
    })
}

/* theme toggle */

const storageKey = 'theme-preference'

const changeThemePreference = () => {
    // flip current value
    theme.value = theme.value === 'light'
        ? 'dark'
        : 'light'

    setThemePreference()
}

const getThemePreference = () => {
    if (localStorage.getItem(storageKey))
        return localStorage.getItem(storageKey)
    else
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
}

const setThemePreference = () => {
    localStorage.setItem(storageKey, theme.value)
    reflectThemePreference()
}

const reflectThemePreference = () => {
    document.firstElementChild
        .setAttribute('data-theme', theme.value)
}

const theme = {
    value: getThemePreference(),
}

// set early so no page flashes / CSS is made aware
reflectThemePreference()

window.onload = () => {
    // set on load so screen readers can see latest value on the button
    reflectThemePreference()

    // now this script can find and listen for clicks on the control
    document
        .querySelector('.js-toggle')
        .addEventListener('click', changeThemePreference)
}


const init = function(){
    getGamesByReleaseDate();
    listenToSortBy();
    listenToScroll();
}

window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', ({ matches: isDark }) => {
        theme.value = isDark ? 'dark' : 'light'
        setThemePreference()
    })


document.addEventListener('DOMContentLoaded', init);