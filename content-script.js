//fa css
if (!document.getElementById('faCss')) {
    let link = document.createElement('link');
    link.id = 'faCss';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    link.media = 'all';
    document.getElementsByTagName('head')[0].appendChild(link);
}

//Set settings
chrome.storage.sync.get('settings', (data) => {
    //If missing, set and use default
    if (typeof data.settings === 'undefined') {
        chrome.storage.sync.set({ 'settings': defaultSettings })
        return
    }

    if (data.settings.hideExclusions) doHideExclusions()
    if (data.settings.showCleanButton) doShowCleanButton()
})

//Clean button
const doShowCleanButton = () => {
    let cleanBtn = document.createElement("button")
    cleanBtn.setAttribute('type', 'button')
    cleanBtn.classList.add("HZVG1b", "Tg7LZd")
    cleanBtn.addEventListener('click', () => {
        //Get Exclusion String
        chrome.storage.sync.get('blockTerms', (data) => {
            let exclusionString = ''

            //If missing, set and use default
            if (typeof data.blockTerms === 'undefined') {
                chrome.storage.sync.set({ 'blockTerms': defaultBlockTermsArr })
                exclusionString = ' -"' + (defaultBlockTermsArr).join('" -"') + '"'
            } else {
                exclusionString = ' -"' + (data.blockTerms).join('" -"') + '"'
            }

            let searchFieldText = document.getElementById("APjFqb").value.split(' -"')[0]
            document.getElementById("APjFqb").innerHTML = searchFieldText += exclusionString

            //Click search
            document.getElementsByClassName("HZVG1b", "Tg7LZd")[0].click()
        })
    })
    let cleanBtnIcon = document.createElement("i")
    cleanBtnIcon.classList.add("fa", "fa-search")
    cleanBtnIcon.style.cssText = 'color: lime;font-size:16px'
    cleanBtn.appendChild(cleanBtnIcon)

    document.getElementsByClassName("RNNXgb")[0].appendChild(cleanBtn)
}

//Hide exclusions
const doHideExclusions = () => {
    let searchFieldText = document.getElementById("APjFqb").value

    if (searchFieldText.includes('-"')) {
        let cleanedSearch = searchFieldText.split(' -"')[0]
        document.title = cleanedSearch
        document.getElementById("APjFqb").innerHTML = cleanedSearch
    }
}



