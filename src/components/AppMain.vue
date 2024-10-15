<template>
    <div>
        <nav>
            <ul class="nav-li">
                <li class="nav-li">
                    TvShows
                </li>
                <li class="nav-li">
                    Movies
                </li>
                <li class="nav-li">
                    Recently Added
                </li>
                <li class="nav-li">
                    MyList
                </li>
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
            <div class="card">
                <ul>
                    <li class="cards-list" v-for="item in items" :key="item.id">
                        <p><strong>Type:</strong> {{ item.type === 'movie' ? 'Film' : 'Serie TV' }}</p>
                        <p><strong>Title:</strong> {{ item.title }}</p>
                        <p><strong>Original Title:</strong> {{ item.original_title }}</p>
                        <p>
                            <strong>Language:</strong>
                            <img :src="getFlagUrl(item.original_language)" :alt="item.original_language" class="flag" />
                        </p>
                        <p><strong>Vote:</strong> {{ item.vote_average }}</p>
                        <p v-if="item.poster_path">
                            <img :src="getPosterUrl(item.poster_path)" alt="Poster" class="poster" />
                        </p>
                    </li>
                </ul>
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

        const getFlagUrl = (language) => {
            const images = {
                'en': '/src/assets/img/en.png',
                'it': '/src/assets/img/it.png',
                'fr': '/src/assets/img/fr.png',
                'es': '/src/assets/img/es.png',
                'de': '/src/assets/img/de.png',
                'ja': '/src/assets/img/ja.png',
                'zh': '/src/assets/img/zh.png',
                'ru': '/src/assets/img/ru.png',
                'default': '/src/assets/img/default.png',
            };
            return images[language] || images['default'];
        };

        const getPosterUrl = (posterPath) => {
            const baseUrl = 'https://image.tmdb.org/t/p/';
            const size = 'w342';  // dimensione
            return `${baseUrl}${size}${posterPath}`;
        };

        return {
            query,
            items,
            searchItems,
            getFlagUrl,
            getPosterUrl
        };
    }
};
</script>

<style scoped>
.container {
    padding: 3rem;
}

ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
}

li {
    cursor: default;
}

.nav-li {
    color: white;
    display: flex;
    justify-content: space-evenly;
    padding-top: 2rem;
    list-style: none;
    transition: color 0.3s;
}

.nav-li:hover {
    color: #007bff;
}

.cards-list {
    list-style-type: none;
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    flex: 0 0 calc(33.333% - 2rem);
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

.flag {
    width: 5%;
    height: 15px;
}

.poster {
    width: 100px;
    height: auto;
}

.cards {
    display: flex;
    flex-wrap: wrap;
}

.row {
    margin-bottom: 2rem;
    display: flex;
    width: 80%;
    margin: auto;
    margin-bottom: 2rem;
}

#jumbo {
    margin-bottom: 3rem;padding: 1rem;
}
</style>
