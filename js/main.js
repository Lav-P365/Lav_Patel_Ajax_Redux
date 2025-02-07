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
        const results = response.results;
        const ul = document.createElement("ul");

        results.forEach((character) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          const img = document.createElement("img");

          a.textContent = character.name;
          a.dataset.movies = JSON.stringify(character.films); // Store as JSON string

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
        console.error("Something went wrong when getting characters:", error);
        loadingSpinner.style.display = "none"; 
      });
  }

  function getMovies(e) {
    const loadingSpinner = document.querySelector("#movie-box .loading-spinner");
    loadingSpinner.style.display = "block"; 

    const filmURLs = JSON.parse(e.currentTarget.dataset.movies); // Parse stored JSON
    movieCon.innerHTML = ""; 

    // GSAP Scroll Animation
    gsap.to(window, {
      duration: 1.2, // Adjust duration for smooth effect
      scrollTo: { y: "#movie-box", offsetY: 20 }, // Scroll to movie section with some offset
      ease: "power2.out",
    });

    filmURLs.forEach((filmUrl, index) => {
      fetch(filmUrl)
        .then((response) => response.json())
        .then((filmDetail) => {
          if (index === filmURLs.length - 1) {
            loadingSpinner.style.display = "none"; 
          }
          const movieElement = createMovieElement(filmDetail);
          movieCon.appendChild(movieElement);
        })
        .catch((error) => {
          console.error("Something went wrong when getting film details:", error);
          loadingSpinner.style.display = "none"; 
        });
    });

    // Fade-in Animation for Movie Section
    gsap.from("#movie-box", {
      opacity: 0,
      y: 50,
      duration: 1.2,
      ease: "power2.out",
    });
  }

  function createMovieElement(movie) {
    const clonedTemplate = document.importNode(movieTemplate.content, true);

    const movieTitle = clonedTemplate.querySelector(".movie-heading");
    movieTitle.textContent = movie.title;

    const movieImage = clonedTemplate.querySelector(".movie-poster");
    movieImage.src = `images/${movie.episode_id}.jpeg`;
    movieImage.alt = movie.title;

    const movieDescription = clonedTemplate.querySelector(".movie-description");
    movieDescription.innerHTML = movie.opening_crawl;

    return clonedTemplate;
  }

  getCharacters(); 
})();
