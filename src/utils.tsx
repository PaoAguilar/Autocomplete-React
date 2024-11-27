import React from "react";

export const highlightMatch = (text: string, match: string) => {
    const position = text.toLocaleLowerCase().indexOf(match.toLocaleLowerCase());
    const highlightedText = text.split("").map((character, index) => {
        if (index > position + match.length - 1 || index < position) {
            return <span key={String(index) + character}>{character}</span>
        } else {
            return <b key={String(index) + character}>{character}</b>
        }
    });
    return highlightedText
};