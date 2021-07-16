module.exports.DateAndMonth = () => {
    const d = new Date();
    const date = d.getDate();
    const month = d.toLocaleString('default', {month: 'long'})
    const year = d.getFullYear();
    const finalDate = `${month} ${date}, ${year}`;
    return finalDate;
}

module.exports.Time = () => {
    const d = new Date();
    const hour = d.getHours();
    const minute = d.getMinutes();
    const finalTime = `${hour}:${minute}`;
    return finalTime;
}