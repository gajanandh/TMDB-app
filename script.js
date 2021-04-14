const API_KEY = "1d6767f68bfa9e006dbfd379dcaa12f8"
let pages = 1;
let page = 1;
let api_url = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1d6767f68bfa9e006dbfd379dcaa12f8&page=" + `${page}`
const imgurl = "https://image.tmdb.org/t/p/w500"
const searchurl = "https://api.themoviedb.org/3/search/movie?api_key=1d6767f68bfa9e006dbfd379dcaa12f8&query="
const container = document.getElementById("container")
const pagination = document.getElementById("pagination");
const submit = document.getElementById("submit")
const nextpage = document.getElementById("nextpage")
const previouspage = document.getElementById("previouspage")
const search = document.getElementById("search")
const movieinfo = document.getElementById("movieinfo");
const moviedetails = document.getElementById("moviedetails");
const casttitle = document.getElementById("castdata");
previouspage.addEventListener("click", () => {
    page = page - 1;
    if (page == 0) {
        page = 1;
        return;
    }
    paginationfunction(page)
})
nextpage.addEventListener("click", () => {
    page = page + 1;
    paginationfunction(page)
})
search.addEventListener(
    "input", (e) => {
        movieinfo.classList.add('movieinfohidden');
        // actordetails.innerHTML = ""
        if (search.value && search.value == "") return;
        const searchterm = search.value;
        getapidata(searchurl + searchterm);
    }
)
window.onload(getapidata(api_url))
getapidata(api_url);
async function getapidata(url) {
    let response = await fetch(`${url}`);
    console.log(response)
    let data = await response.json();
    let pages = data.total_pages;

    getmovie(data.results)

}
function paginationfunction(page) {

    getapidata("https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1d6767f68bfa9e006dbfd379dcaa12f8&page=" + page)

}
function getmovie(movies) {
    if (movies.length < 1) {
        container.innerHTML = `"<p class="nomovies">coudln't find what you are searching for</p>"`;
        pagination.classList.add("removepagination")
        return
    }
    container.innerHTML = ""
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, id, overview, ...rest } = movie
        container.innerHTML += ` <div id="movie" onclick="getmoviedetails(${id} )">
        <div class="image">
          <img src="${poster_path ? (imgurl + poster_path) : "failedimg.png"}" alt="image not found" id="image" />
        </div>
        <div class="details">
          <h2>${title}</h2>
          <span>${vote_average}</span>
        </div>
        <div class="overview">
        ${overview}
        </div>
      </div>
      `

    })
}
async function getmoviedetails(id) {

    const imgurl = "https://image.tmdb.org/t/p/w500"
    movieinfo.innerhtml = ""

    let res = await fetch("https://api.themoviedb.org/3/movie/" + `${id}` + "?api_key=1d6767f68bfa9e006dbfd379dcaa12f8&append_to_response=videos,credits")
    // let response = await fetch("https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key=<<api_key>>&language=en-US")
    let data = await res.json();

    const {
        budget,
        genres,
        imdb_id,
        original_language,
        overview,
        poster_path,
        production_companies,
        release_date,
        revenue,
        runtime,
        status,
        tagline,
        title,
        videos,
        vote_average,
        vote_count,
        credits,
        ...rest
    } = data
    let cast = credits.cast;
    const castdetails = document.getElementById("cast");
    castdetails.innerHTML = "";
    cast.forEach(person => {
        const { character,
            id,
            name,
            profile_path, ...rest } = person;

        castdetails.innerHTML +=
            `<div class="castflex" id="slider">
                    <div class="castimg"><img src="${profile_path ? (imgurl + profile_path) : "failedcastimg.png"}" alt="image not found" class="movieposter" /></div>
            <div class="castname"><h3>${name}</h3><h4>${character}</h4></div>
            </div>`

    });
    let keys = videos.results[0].key
    container.innerHTML = ""
    movieinfo.classList.remove('movieinfohidden')
    pagination.classList.add("paginationoff")
    moviedetails.innerHTML =
        `<div>
        <img src="${poster_path ? (imgurl + poster_path) : "failedimg.png"}" alt="image not found" class="movieposter" />
        </div>   
        <div class="discription">
        <h1>${title}</h1>
        <h3>Overview</h3>
        <p>${overview}</p>
        <p>Budget: $${budget}</p>
        <p>Revenue: $${revenue}</p>
        <p>Language: ${original_language}</p>
        <p>Release date: ${release_date}</p>
        <p>Runtime: ${runtime}</p>
        <p>Status: ${status}</p>
        <p>Votes: ${vote_count}</p>
        <p>Rating: ${vote_average}</p>
        <div class="links">
        <a href="https://www.youtube.com/watch?v=${videos.results[0].key}">Watch trailer</a>
        <a href="index.html">Go Back</a>
        </div>
        </div> 
        `
    casttitle.innerHTML = `<h3>Cast</h3><hr>`

    const slider = document.getElementById('cast');
    let isDown = false;
    let startX;
    let scrollLeft;


    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;

    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX); //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });


}
