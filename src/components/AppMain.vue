<template>
    <div>
        <nav>
            <ul class="nav-li">
                <li class="nav-li">TvShows</li>
                <li class="nav-li">Movies</li>
                <li class="nav-li">Recently Added</li>
                <li class="nav-li">MyList</li>
            </ul>
        </nav>
    </div>
    <div class="container">
        <div id="jumbo">
            <img src="../assets/img/boolflix-3437674168.png" alt="">
        </div>
        <!-- Searchbar -->
        <div class="row">
            <input type="text" v-model="query" placeholder="Search for movies or TV shows..."
                @keyup.enter="searchItems" />
            <button @click="searchItems">Search</button>
        </div>
        <!-- Lista dei film trovati -->
        <div class="cards">
            <div class="card" v-for="item in items" :key="item.id">
                <div v-if="item.poster_path" class="poster-container">
                    <img :src="getPosterUrl(item.poster_path)" alt="Poster" class="poster" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { state, setItems, setQuery } from '../store/store';
import axios from 'axios';

export default {
    name: 'AppMain',
    setup() {
        const query = computed({
            get() {
                return state.query;
            },
            set(value) {
                setQuery(value);
            }
        });

        const items = computed(() => state.items);

        const searchItems = () => {
            console.log('Searching for:', query.value);
            if (query.value.trim() !== '') {
                axios.get(`https://api.themoviedb.org/3/search/movie`, {
                    params: {
                        api_key: state.apiKey,
                        query: query.value,
                        language: 'it-IT'
                    }
                })
                    .then(movieResponse => {
                        const movies = movieResponse.data.results.map(movie => ({
                            id: movie.id,
                            title: movie.title,
                            original_title: movie.original_title,
                            original_language: movie.original_language,
                            vote_average: movie.vote_average,
                            type: 'movie',
                            poster_path: movie.poster_path
                        }));

                        axios.get(`https://api.themoviedb.org/3/search/tv`, {
                            params: {
                                api_key: state.apiKey,
                                query: query.value,
                                language: 'it-IT'
                            }
                        })
                            .then(tvResponse => {
                                const tvShows = tvResponse.data.results.map(tv => ({
                                    id: tv.id,
                                    title: tv.name,
                                    original_title: tv.original_name,
                                    original_language: tv.original_language,
                                    vote_average: tv.vote_average,
                                    type: 'tv',
                                    poster_path: tv.poster_path
                                }));

                                setItems([...movies, ...tvShows]);
                            })
                            .catch(error => {
                                console.error('Error fetching TV shows:', error);
                                setItems([]);
                            });
                    })
                    .catch(error => {
                        console.error('Error fetching movies:', error);
                        setItems([]);
                    });
            } else {
                setItems([]);
            }
        };

        const getPosterUrl = (posterPath) => {
            const baseUrl = 'https://image.tmdb.org/t/p/';
            const size = 'w342';
            return `${baseUrl}${size}${posterPath}`;
        };

        return {
            query,
            items,
            searchItems,
            getPosterUrl
        };
    }
};
</script>

<style scoped>
.container {
    padding: 3rem;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
}

.card {
    flex: 1 1 calc(20% - 1rem);
    background-color: #f9f9f9;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 2rem;
}

.poster-container {
    width: 100%;
    height: 0;
    padding-bottom: 150%;
    position: relative;
}

.poster {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 15px;
    transition: filter 0.3s ease;
}

.poster:hover {
    filter: brightness(0.7);
}

input {
    flex: 1;
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    margin-right: 1rem;
    transition: border-color 0.3s;
}

button {
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    padding: 1rem;
}

button:hover {
    background-color: #0056b3;
}

.row {
    margin-bottom: 2rem;
    display: flex;
    width: 80%;
    margin: auto;
    margin-bottom: 2rem;
}

#jumbo {
    margin-bottom: 3rem;
    padding: 1rem;
}

.nav-li {
    color: white;
    padding: 1rem;
    list-style: none;
    cursor: pointer;
    transition: color 0.3s;
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.nav-li:hover {
    color: #007bff;
}

nav {
    background-color: #000;
    padding: 1rem;
}
</style>
