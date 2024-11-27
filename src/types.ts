export interface RickAndMortyData {
    id: number
    name: string
    status: string
    species: Species
    type: string
    gender: Gender
    origin: Origin
    location: Location
    image: string
    episode: string[]
    url: string
    created: string
}

type Gender = "Male" | "Female" | "unknown"
type Species = "Alien" | "Human"

export interface Origin {
    name: string
    url: string
}

export interface Location {
    name: string
    url: string
}
