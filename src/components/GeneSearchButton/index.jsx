import React from 'react'
import OpenInSearchIcon from './assets/images/open_in_search.png'
import config from './assets/config'

export default function GeneSearchButton(props) {
    const {geneNames} = props;
    return (
    <a href={config.search_url + "?genes=" + geneNames} target="_blank" rel="noopener noreferrer">
        <img src={OpenInSearchIcon} alt="Find Related Networks" />
    </a>
)
}