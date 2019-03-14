import React from 'react'
import OpenInNDExIcon from './assets/images/open_in_ndex.png'
import {Button} from '@material-ui/core'

function openInNDEx(url){
    alert("Open NDEx with specified URL to view anonymously.")
}

export default function OpenInNDExButton(props) {

    const onClick = props.onClick ||
        openInNDEx(props.url)


    return (
        <Button onClick={onClick}>
            <img src={OpenInNDExIcon} alt="Open in NDEx" />
        </Button>
    )
}