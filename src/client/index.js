import { performAction } from './js/app'
import { checkForZip } from './js/zipChecker'
import {updateUI}  from './js/app'


import './styles/style.scss'
 
document.getElementById('generate').addEventListener('click', performAction);


export {
    performAction,
    checkForZip,
    updateUI

}