(() => {
    const characters = document.querySelector("#characters");
    const movieBox = document.querySelector("#movie-box");
    const movieCon = document.querySelector("#movie-con");
    const movieTemplate = document.querySelector("#movie-template");
    const baseUrl = "https://swapi.dev/api/people/?format=json";
  
    function getCharacters() {
      const loadingSpinner = document.querySelector("#characters .loading-spinner");
      loadingSpinner.style.display = "block"; 
  
      fetch(baseUrl)
        .then((response) => response.json())
        .then((response) => {
          loadingSpinner.style.display = "none"; 
          const results = response.results.slice(0, 10); 
          const ul = document.createElement("ul");
  
          results.forEach((character) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            const img = document.createElement("img");
  
  
            a.textContent = character.name;
            a.dataset.movies = character.films; 
  
            img.src = `images/${character.name}.jpg`;
            img.alt = character.name;
            img.className = "character-image";
            a.appendChild(img);
            li.appendChild(a);
            ul.appendChild(li);
          });
  
          characters.appendChild(ul);
  
          gsap.from("#characters ul li", {
            duration: 0.2,
            y: -50,
            opacity: 0,
            stagger: 0.1,
          });
  
          document.querySelectorAll("#characters li a").forEach((link) => {
            link.addEventListener("click", function (e) {
              document.querySelectorAll("#characters li a").forEach((l) => l.classList.remove("selected"));
              e.currentTarget.classList.add("selected");
              getMovies(e);
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching characters:", error);
          loadingSpinner.style.display = "none"; 
        });
    }
  
    function getMovies(e) {
      const loadingSpinner = document.querySelector("#movie-box .loading-spinner");
      loadingSpinner.style.display = "block"; 
  
      const filmURLs = e.currentTarget.dataset.movies; // Parse stored JSON
      movieCon.innerHTML = ""; 
  
      if (filmURLs.length === 0) {
        movieCon.innerHTML = "<p>No movies found for this character.</p>";
        loadingSpinner.style.display = "none"; 
        return;
      }
  
  
      filmURLs.forEach((filmUrl) => {
        fetch(filmUrl)
          .then((response) => response.json())
          .then((filmDetail) => {
            if (filmUrl === filmURLs.length - 1) {
              loadingSpinner.style.display = "none"; 
            }
            const movieElement = createMovieElement(filmDetail);
            movieCon.appendChild(movieElement);
          })
          .catch((error) => {
            console.error("Error fetching movie details:", error);
            loadingSpinner.style.display = "none"; 
          });
      });
    }
  
    function createMovieElement(movie) {
      const clonedTemplate = document.importNode(movieTemplate.content, true);
  
      const movieTitle = clonedTemplate.querySelector(".movie-heading");
      movieTitle.textContent = movie["title"];
  
      const movieImage = clonedTemplate.querySelector(".poster-image");
      movieImage.src = `images/${movie["episode_id"]}.jpg`;
      movieImage.alt = movie.title;
  
  
      const movieDescription = clonedTemplate.querySelector(".movie-description");
      movieDescription.innerHTML = movie["opening_crawl"];
  
      return clonedTemplate;
    }
  
    getCharacters(); 
  })();
  