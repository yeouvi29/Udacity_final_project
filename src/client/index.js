import { getData } from './js/app'
import { checkForDate } from './js/dateChecker'



import './styles/style.scss'
 
document.getElementById('generate').addEventListener('click', getData);


export {
    getData,
    checkForDate,
}