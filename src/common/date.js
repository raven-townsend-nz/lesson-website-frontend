/**
 * Return current date in ISO format
 * @return {string}
 */
function currentIsoDate () {
    let date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString();
}


export default {
    currentIsoDate
}