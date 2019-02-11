import React from 'react'

import './style.css'

function WarningBar({ paperStyle }) {
    return (
        <p className='disclaimer'>
            <b>NOTE:</b> This service is experimental. The interface is subject to change.
            See <a href="https://github.com/shfong/nbgwas">https://github.com/shfong/nbgwas</a> for details and to report issues.
        </p>
    );
}

export default WarningBar;