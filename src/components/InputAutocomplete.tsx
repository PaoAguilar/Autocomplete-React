import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RickAndMortyData} from "../types";
import {highlightMatch} from "../utils";
import {fetchCharactersName} from "../services/rickAndMortyService";

const InputAutocomplete = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [searchResults, setSearchResults] = useState<RickAndMortyData[]>([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);


    const inputRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        setIsOptionSelected(false);
    }

    const scrollToIndex = (index: number) => {
        if (listRef.current && listRef.current.children[index]) {
            const currentNameElement = listRef.current.children[index] as HTMLElement;
            const containerHeight = listRef.current.clientHeight;
            const topEdgeElementPosition = currentNameElement.offsetTop;
            const currentNameHeight = currentNameElement.clientHeight;

            if (topEdgeElementPosition < listRef.current.scrollTop) {
                // the idea is to check if the element is above the visible area of the container
                // if is, adjust scrollTop to align the element with the top of the visible area.
                listRef.current.scrollTop = topEdgeElementPosition;
            } else if (topEdgeElementPosition + currentNameHeight > listRef.current.scrollTop + containerHeight) {
                // same as before, check if the bottom of the element is below the visible area of the container
                // if is, adjust scrollTop to scroll the container down so the element is fully visible at the bottom.
                listRef.current.scrollTop = topEdgeElementPosition + currentNameHeight - containerHeight;
            }
        }
    };

    const fetchRickAndMortyData = useCallback(async () => {
        if (inputValue) {
            setIsLoading(true);
            const results = await fetchCharactersName(inputValue);
            setSearchResults(results);
            setIsLoading(false);
        } else {
            setSearchResults([]);
        }
    }, [inputValue])

    const handleFocus = async () => {
        if (!inputValue) {
            setIsLoading(true);
            const results = await fetchCharactersName();
            setSearchResults(results);
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex(prev => {
                const newIndex = prev < searchResults.length - 1 ? prev + 1 : prev;
                scrollToIndex(newIndex);
                return newIndex;
            });
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex(prev => {
                const newIndex = prev > 0 ? prev - 1 : 0;
                scrollToIndex(newIndex);
                return newIndex;
            });
        } else if (event.key === 'Enter' && activeIndex >= 0) {
            setInputValue(searchResults[activeIndex].name);
            setSearchResults([]);
            setActiveIndex(-1);
            setIsOptionSelected(true);
        } else if (event.key === 'Escape') {
            setSearchResults([]);
            setActiveIndex(-1);
        }
    }

    const handleSelectedOption = (name: string) => {
        setInputValue(name);
        setSearchResults([]);
        setActiveIndex(-1);
        setIsOptionSelected(true);
    };

    useEffect(() => {
        const fetchCharacterNames = async () => {
            if (inputValue && !isOptionSelected) {
                await fetchRickAndMortyData();
            } else {
                setSearchResults([]);
            }
        };
        const debounce = setTimeout(fetchCharacterNames, 300);

        return () => clearTimeout(debounce);
    }, [inputValue, isOptionSelected, fetchRickAndMortyData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <label className="search-label" htmlFor="input-search">Search Rick and Morty Character:</label>
            <div ref={inputRef} className="input-container">
                <input
                    autoFocus
                    type="text"
                    id="input-search"
                    className="autocomplete-input"
                    placeholder="Search character"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    role="combobox"
                    aria-autocomplete="list"
                    aria-controls="search-results"
                    aria-expanded={searchResults.length > 0}
                />
                {isLoading && <div>Loading...</div>}
                <ul id="search-results" className="suggestions-list" role="listbox" ref={listRef}>
                    {searchResults.length > 0 &&
                        <>
                            {
                                searchResults.map((suggestion: RickAndMortyData, index) => {
                                    return (
                                        <li
                                            role="option"
                                            aria-selected={activeIndex === index}
                                            key={suggestion.id}
                                            className={`${index === activeIndex ? 'suggestion-active' : ''}`}
                                            onClick={() => handleSelectedOption(suggestion.name)}
                                        >
                                            <span>{highlightMatch(suggestion.name, inputValue)}</span>
                                        </li>
                                    )
                                })
                            }
                        </>
                    }
                </ul>
            </div>
        </>
    );
};

export default InputAutocomplete;