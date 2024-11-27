export const fetchCharactersName = async (name?: string) => {
    try {
        const url = name
            ? `https://rickandmortyapi.com/api/character?name=${name}`
            : `https://rickandmortyapi.com/api/character`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
};