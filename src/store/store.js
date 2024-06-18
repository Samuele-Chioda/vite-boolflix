import { reactive } from 'vue';

export const state = reactive({
    items: [],
    query: '',
    apiKey: '6a7962e30080b932ef0adfe6293d4c66' 
});

export function setItems(items) {
    state.items = items;
}

export function setQuery(query) {
    state.query = query;
}
