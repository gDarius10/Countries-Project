
//Timezone filter is working only for the first item in timezones array


 

let data2 ;


async function getCountries() {
    const url = 'https://restcountries.com/v3.1/all';
    
    try{

        const response = await fetch(url);
        const data  = await response.json();
        
        //deconstrucing and transforming language and currencies into arrays from the list
        data.forEach( count => {
             
              if(count.languages){
              count.languages = Object.values(count.languages);
              //console.log(count.languages);
              }
              if(count.currencies){
              
                  count.currencies = Object.values(count.currencies)
                  Object.entries(count.currencies).forEach(([key, value]) => count.currencies= value)

              }
                
        })
        data.forEach(count =>{
          if(count.currencies){
            delete count.currencies.symbol
            if(count.currencies ){
            count.currencies = Object.values(count.currencies)
            }
          }
        })
        
        
           
        data2 = data;
        //console.log(data.sort(order));
       // console.log(data)      
        
        displayCountries(); 
                 
    }
    catch (error){

        console.error('Noo :' + error);
    }
   


}


getCountries();


//ordering functions for name and population
function order(x, y){
  return x.name.common.localeCompare(y.name.common, 'en', {ignorePunctuation: true});
}
function orderX(x, y){
  return x.localeCompare(y, 'en', {ignorePunctuation: true});
}

function orderPopAsc(x,y){
  return x.population - y.population;
}
function orderPopDesc(x,y){
  return y.population - x.population;
}
 
//destroys all the cards 
function emptyContainer(){
  let element = document.querySelector("#cardRow");
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  } 
}

//main function that
function displayCountries (){
  
  //ordering alphabetically by country name
  data2.sort(order);  
  //defining the state for pagination and dataset
  var state = {
    'querySet': data2,
    'page': 1,
    'cards': 32,
    'window': 6,
}
  // let allpopulation = 0;
  const searchBtn = document.querySelector('.submit-btn')
  const resetBtn = document.querySelector('.reset-btn');
  const regionMenu = document.querySelector('#region_filter');
  const timeMenu  = document.querySelector('#time_filter');
  const currenMenu = document.querySelector('#currency_filter');
  const langMenu = document.querySelector('#language_filter');
  const searchInput = document.querySelector('#search_input');
  //const regionList = regionMenu.querySelectorAll('.dropdown-item')
 // const populationMenu = document.querySelector('#population_filter')
  const popRange = document.querySelector('#customRange2');
  const populationLabel = document.querySelector('#populationLabel');
  
  
  buildCountries()
 
//saving all values for filters and removing duplicates
 const arrContinents = [...new Set(data2.map(item => item.continents))];
 let mergedContin = [].concat.apply([], arrContinents);
 mergedContin = [...new Set(mergedContin)];

const  arrTime = [...new Set(data2.map(item => item.timezones))];
let mergedTime = [].concat.apply([], arrTime);
mergedTime = [...new Set(mergedTime)];
mergedTime.sort();

const arrCurrencies = [...new Set(data2.map(item => item.currencies))];
let mergedCurren = [].concat.apply([], arrCurrencies);
mergedCurren = [...new Set(mergedCurren)];

const arrLanguages = [...new Set(data2.map(item => item.languages))];
let mergedLanguages =[].concat.apply([], arrLanguages);
mergedLanguages = [...new Set(mergedLanguages)];


    //trying to come up with a method to make filters work together without submit btn
    // var allFilters = {
    //     'continents' : '',
    //     'timezones'  : '',
    //     'currencies' : '',
    //     'languages'  : '',
    // }
 //creating the select option for filters
  mergedContin.forEach( continent =>{
    let option = document.createElement('option');
    option.innerHTML = continent;
    option.value = continent;
    regionMenu.appendChild(option);
     
  })

  mergedTime.forEach( time => {
    let option = document.createElement('option');
    option.innerHTML = time;
    option.value = time;
    timeMenu.appendChild(option);
  })

  mergedCurren.forEach( curren => {
    let option = document.createElement('option');
    option.innerHTML = curren;
    option.value = curren;
    currenMenu.appendChild(option);
  })

  mergedLanguages.forEach( lang =>{
    let option = document.createElement('option');
    option.innerHTML = lang;
    option.value = lang;
    langMenu.appendChild(option);
  })
  
   
  // popRange.addEventListener('change', (event) =>{
  //   allpopulation = event.target.value;
   
  //   emptyContainer()
  //   buildCountries()
  // })
  //function to filter everthing on SEARCh btn
  function bigFilter(){
    state.querySet = data2;
    
    //console.log(regionMenu.value);
    
    if(regionMenu.value){
      state.querySet =  state.querySet.filter( country => country.continents == regionMenu.value )  
    }
    if(currenMenu.value){
      state.querySet =  state.querySet.filter( country => country.currencies == currenMenu.value )  
    }
    if(langMenu.value){
      state.querySet =  state.querySet.filter( country => country.languages == langMenu.value )  
    }
    if(timeMenu.value){
      state.querySet =  state.querySet.filter( country => country.timezones[0] == timeMenu.value )  
    }
    if(popRange.value != -1){
      
      state.querySet =  state.querySet.filter( country => country.population > popRange.value)  
      state.querySet.sort(orderPopAsc)
     // console.log(popRange.value);
    }
    state.page = 1;
    emptyContainer()
      buildCountries()
  }
  searchBtn.addEventListener('click',(event)=>{
    bigFilter();
  })
  resetBtn.addEventListener('click',(event) =>{
    //setting the list to normal on btn reset
    currenMenu.value = '';
    regionMenu.value = '';
    langMenu.value = '';
    timeMenu.value = '';
    popRange.value = -1;
    state.querySet = data2;
    emptyContainer()
    buildCountries()
  })
  searchInput.addEventListener('keyup',(event) =>{
      state.querySet = data2;
      let searchResult = searchInput.value;
      
      if(searchResult){
      searchResult = searchResult.charAt(0).toUpperCase() + searchResult.slice(1);
      state.querySet = data2.filter( country => country.capital == searchResult.trim() || country.cca2 == searchResult.toUpperCase() || country[`name`].common == searchResult)
     // console.log(state.querySet);
        if(state.querySet.length == 0){
          let alert = document.querySelector('.alert-warning');
          //alert.classList.remove('show');
          alert.classList.add('show');
        }
      }
      state.page = 1;
      emptyContainer()
      buildCountries()
     // console.log(searchInput.value);
    })
 
    popRange.addEventListener('change', (event) =>{
    //  console.log(event.target.value);
      populationLabel.innerText = `> \u00A0 ${new Intl.NumberFormat().format(event.target.value)}`
    })
 
    


  function pagination(querySet, page, cards) {

      var trimStart = (page - 1) * cards
      var trimEnd = trimStart + cards

      var trimmedData = querySet.slice(trimStart, trimEnd)

      var pages = Math.round(querySet.length / cards);
      
      return {
          'querySet': trimmedData,
          'pages': pages,
      }
  }

  function pageButtons(pages) {
      var wrapper = document.getElementById('pagination-wrapper')

      wrapper.innerHTML = ``
   
      var maxLeft = (state.page - Math.floor(state.window / 2))
      var maxRight = (state.page + Math.floor(state.window / 2))

      if (maxLeft < 1) {
          maxLeft = 1
          maxRight = state.window
      }

      if (maxRight > pages) {
          maxLeft = pages - (state.window - 1)
          
          if (maxLeft < 1){
            maxLeft = 1
          }
          maxRight = pages
      }
      
      

      for (var page = maxLeft; page <= maxRight; page++) {
        wrapper.innerHTML += `<button value=${page} class="page btn btn-sm btn-dark">${page}</button>`
      }

      if (state.page != 1) {
          wrapper.innerHTML = `<button value=${1} class="page btn btn-sm btn-dark">&#171; First</button>` + wrapper.innerHTML
      }

      if (state.page != pages) {
          wrapper.innerHTML += `<button value=${pages} class="page btn btn-sm btn-dark">Last &#187;</button>`
      }
     
      
      const allPages = document.querySelectorAll('.page');
      
      allPages.forEach( page => {
         
         page.addEventListener('click', (event) => {
          //emptying container before changing pages
          emptyContainer()
            state.page = Number(page.value);
            //create Cards
            buildCountries()
         })
      })

      

  }
 
  

  function buildCountries() {
     
     const container = document.querySelector('#cardRow');
     const countriesCount = document.querySelector('#country_count')
    
      let data = pagination(state.querySet, state.page, state.cards)
     
      
      let country = data.querySet
      
      const wrapperX = document.querySelector('#pagination-wrapper')
      countriesCount.innerHTML = `${state.querySet.length} results`

      if(state.querySet.length ==0) countriesCount.innerHTML += `\u00A0found, try another search`;

      if(state.querySet.length == 0  || state.querySet.length < 32){
           
        wrapperX.classList.add('d-none')
      }else{
        wrapperX.classList.remove('d-none')
      }
      
      //deconstructing the list and creating country card 
      for (var i = 1 in country) {
      
       
        let {
          name:{common},
          flags:{svg},
          region,
          population,
          capital,
          cca2,
          cca3,
          latlng,
          area,
          timezones,
          borders,
          currencies,
          languages,

      } = country[i];

        
       
                
                let borderArray  = '';
               
                if(borders){
                  
                    for(let border of borders){
                      let borderFullName = data2.find(o => o.cca3 === border);
                      borderArray += `<span class="borders" id="${border}" data-toggle="tooltip" data-placement="top" title="${borderFullName.name.common}" 
                      data-bs-toggle="modal" data-bs-target="#exampleModal" > ${border} </span>`;
                      
                     // borderFullName = '';
                    }
                    
                }
                let cardContainer = document.createElement('div')
                let card = document.createElement('div')
                let frontCard = document.createElement('div')
                let backCard  = document.createElement('div')

                cardContainer.id =`${cca3}`;

                cardContainer.classList.add('col-12','col-md-3','scene');
                card.classList.add('card');
                frontCard.classList.add('card__face','card__face--front')
                backCard.classList.add('card__face','card__face--back')

                card.addEventListener( 'click', (event) => { 
                  //console.log(event.target);
                  if(event.target.tagName != 'SPAN'){
                    card.classList.toggle('is-flipped');
                  }
                 
                });

                frontCard.innerHTML = `<div class="card-img"> <img class="img-fit" src="${svg}"> </div>
                                <div class="card-body"><p class="country-name">${common}</p>
                                <div class="d-flex flex-wrap justify-content-center">
                               <p class="card-elements w-50"><span> Region </span> <br> ${region}</p>
                               <p class="card-elements w-50"> <span>Capital <br></span> ${ (capital) ? capital : "Not found"}</p> 
                               <p class="card-elements"> <span>Population</span> <br> ${new Intl.NumberFormat().format(population)}</p></div></div>`;

                let timeZone = timezones[0].toString();
                let timeOffset = timeZone.slice(3);
                let timeOffsetMinutes = timeOffset.slice(4);
               
                backCard.innerHTML = `<div class="card-body">
                                          <p class="country-name">${common}</p>
                                          <p class="clock country-name" timezone="${timeOffset}" minutes="${timeOffsetMinutes}"></p>
                                          Alpha 2 code :  ${cca2}<br>
                                          Latlng : ${new Intl.NumberFormat().format(latlng[0])} , ${new Intl.NumberFormat().format(latlng[1])}<br>
                                          Area : <span>${area} km<sup>2</sup></span><br>
                                          Borders : ${(borders) ? (borderArray) : "no bordering countries"}<br>
                                          Timezone : ${timezones} <br>
                                          Currency : ${(currencies) ? (currencies) : "no currency"}<br>
                                          Language : ${(languages)  ? (Object.values(languages)) : "no language"}<br>
                                          </div>`;



                container.appendChild(cardContainer);
                cardContainer.appendChild(card);
                card.appendChild(frontCard);
                card.appendChild(backCard);
                
          
      }
      setTimeout(startClocks, 1000);
      borderModal()
      pageButtons(data.pages);
      //enable tooltips from bootstrap
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
  }
}


//alphabetical order for countries after country Name


function borderModal(){

  let border = document.querySelectorAll('.borders');
  border.forEach( border => {
    border.addEventListener('click', (event) => {
      let countryBorder = data2.find(o => o.cca3 === event.target.id);
      
          const {
            name:{common},
            flags:{svg},
            region,
            population,
            capital,
            cca2,
            cca3,
            latlng,
            area,
            timezones,
            borders,
            currencies,
            languages,

        } = countryBorder;

       

        let modalTilte = document.querySelector('.modal-title');
        let modalBody = document.querySelector('.modal-body');

        modalTilte.innerHTML = `${common}  : `
        modalBody.innerHTML =`<img width="240" src="${svg}" >
              <p>Population : ${new Intl.NumberFormat().format(population)}<br>
                 Capital : ${capital}<br>
                 Region : ${region}<br>
                 Currencies : ${(currencies) ? (currencies) : "no currency"} <br>
                 Cca2 : ${cca2}<br>
                 Area : ${area}
              </p>`;
    })
  })
}


  function dateToText(date) {
    var hours = date.getHours()
    var minutes = date.getMinutes();
    // var seconds = date.getSeconds();
    if (minutes < 10) minutes = '0'+minutes;
    //if  seconds < 10) seconds = '0'+seconds;
    if (hours < 10) hours = '0'+hours;
    return hours + ":" + minutes; // + ":" + seconds;
}

function updateClocks() {
	for (var i = 0; i < window.arrClocks.length; i++) {
		var clock = window.arrClocks[i];
		var offset = window.arrOffsets[i];
		clock.innerHTML = dateToText(new Date(new Date().getTime()+offset));
	}
}

function startClocks() {
	clockElements = document.getElementsByClassName('clock');
	window.arrClocks = []
	window.arrOffsets = [];
	var j = 0;
	for(var i = 0; i < clockElements.length; i++) {
		el = clockElements[i];
		timezone = parseInt(el.getAttribute('timezone'));
    minutes = el.getAttribute('minutes');
    
		if (!isNaN(timezone)) {
      if(minutes =='30'){
        var tzDifference = timezone * 60 + (new Date()).getTimezoneOffset() + 30;
      }if(minutes =='45'){
        var tzDifference = timezone * 60 + (new Date()).getTimezoneOffset() + 45;
      }else{
        var tzDifference = timezone * 60 + (new Date()).getTimezoneOffset();
      }
		
			var offset = tzDifference * 60 * 1000;
			window.arrClocks.push(el);
			window.arrOffsets.push(offset);
		}
	}
	updateClocks();
	clockID = setInterval(updateClocks, 30000);
  
}
//changing some classes to display filters
const searchSubmit = document.querySelector('#search_submit')

searchSubmit.addEventListener('click', (event) =>{
  const hideFilterCol = document.querySelectorAll('.hideFilters');
  hideFilterCol.forEach( col => {
    col.classList.toggle('d-block')
   
  })
  const filterMainCol = document.querySelector('#filterMainCol');
  const searchInputCol = document.querySelector('#searchInputCol')
  filterMainCol.classList.toggle('col-md-12')
  searchInputCol.classList.toggle('col-md-5')
  if(filterMainCol.classList.contains('col-md-12')){
    searchSubmit.innerHTML = `Hide`
  }else{
    searchSubmit.innerHTML = `Filters`
  }
  //console.log(hideFilterCol);
  
})