



 
let data2 ;

// async function searchCountries(name){
//   const url = 'https://restcountries.com/v3.1/name/'+name;

//   try{
//     const respone = await fetch(url);
//     const data = await respone.json();

//     console.log(data);
//   }
//   catch (error){
//     console.error('What :' + error);
//   }
// }


async function getCountries() {
    const url = 'https://restcountries.com/v3.1/all';
    
    try{

        const response = await fetch(url);
        const data  = await response.json();
       
        //sorting alphabetically
        //console.log(data);
        data.sort(order);

        
            data2 = data;
           displayCountries();         
            
    }
    catch (error){

        console.error('What :' + error);
    }
   


}

getCountries();

//pentru search bar NU-i gata
function searchNameCountry(name) {
   
     let array2  = data2.map( country => {
       if(name === country.name.common){
            console.log(country);
       }
       return 
   })
}


function displayCountries (){
    var state = {
      'querySet': data2,
      'page': 1,
      'rows': 40,
      'window': 5,
  }

  buildTable()

  function pagination(querySet, page, rows) {

      var trimStart = (page - 1) * rows
      var trimEnd = trimStart + rows

      var trimmedData = querySet.slice(trimStart, trimEnd)

      var pages = Math.round(querySet.length / rows);

      return {
          'querySet': trimmedData,
          'pages': pages,
      }
  }

  function pageButtons(pages) {
      var wrapper = document.getElementById('pagination-wrapper')

      wrapper.innerHTML = ``
    console.log('Pages:', pages)

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
          let element = document.querySelector(".row");
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          } 
            state.page = Number(page.value);
            //create Cards
            buildTable()
         })
      })

  }


  function buildTable() {
     
     const container = document.querySelector('.row');
      let data = pagination(state.querySet, state.page, state.rows)
      let country = data.querySet
      console.log(country)
      //deconstructing object country
      for (var i = 1 in country) {
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

      } = country[i];
      let currencyName = '' ;

                if(currencies){
                  Object.keys(currencies).forEach( money => {
                      
                      currencyName += `${currencies[money].name} `;
                      
                  })
                }
                let borderArray  = '';

                if(borders){
                  
                    for(let border of borders){

                      let borderFullName = data2.find(o => o.cca3 === border);

                      borderArray += `<span id="${border}" data-toggle="tooltip" data-placement="top" title="${borderFullName.name.common}" 
                      data-bs-toggle="modal" data-bs-target="#exampleModal" > ${border} </span>`;
                      
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

                card.addEventListener( 'click', function() {
                  card.classList.toggle('is-flipped');
                });

                frontCard.innerHTML = `<div class="card-img"> <img class="img-fit" src="${svg}"> </div>
                                <div class="card-body"><p class="country-name">${common}</p>
                                Region : ${region}<br>
                                Capital : ${ (capital) ? capital : "Doesn't exist"} <br>
                                Population : ${new Intl.NumberFormat().format(population)}</div>`;
                
                backCard.innerHTML = `<div class="card-body">
                                          <p class="country-name">${common}</p>
                                          ${cca2}<br>
                                          ${latlng}<br>
                                          ${area}<br>
                                          ${timezones}<br>
                                          ${(borders) ? (borderArray) : "no borders"}<br>
                                          ${(currencies) ? (currencyName) : "no currency"}<br>
                                          ${(languages)  ? (Object.values(languages)) : "no language"}<br>
                                          </div>`;



                container.appendChild(cardContainer);
                cardContainer.appendChild(card);
                card.appendChild(frontCard);
                card.appendChild(backCard);
                
          
      }
      borderModal()
      pageButtons(data.pages);
      //enable tooltips from bootstrap
      $(function () {
        $('[data-toggle="tooltip"]').tooltip()
      })
  }
}


//alphabetical order for countries after country Name
function order( a, b ) {
  if ( a.name.common < b.name.common ){
    return -1;
  }
  if ( a.name.common > b.name.common ){
    return 1;
  }
  return 0;
}

function borderModal(){

  let border = document.querySelectorAll('.card-body span');
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

        let currencyName = '' ;
        if(currencies){
          Object.keys(currencies).forEach( money => {    

              currencyName += `${currencies[money].name} `; 

          })
        }

        let modalTilte = document.querySelector('.modal-title');
        let modalBody = document.querySelector('.modal-body');

        modalTilte.innerHTML = `${common}  : `
        modalBody.innerHTML =`<img width="240" src="${svg}" >
              <p>Population : ${new Intl.NumberFormat().format(population)}<br>
                 Capital : ${capital}<br>
                 Region : ${region}<br>
                 Currencies : ${currencyName} <br>
                 Borders : ${timezones}
              </p>`;
    })
  })
}