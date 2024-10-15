//Set Settings
const hideExclusionsCB = document.getElementById("hideExclusionsCB")
const showCleanButtonCB = document.getElementById("showCleanButtonCB")


showCleanButtonCB.addEventListener('change', () => {
    chrome.storage.sync.get('settings', (data) => {
        chrome.storage.sync.set({
            'settings': {
                showCleanButton: showCleanButtonCB.checked,
                hideExclusions: data.settings.hideExclusions,
            }
        })

        //Reload page
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            let url = tabs[0].url
            if (url.includes('&udm=2&')) chrome.tabs.reload()
        })
    })
})

hideExclusionsCB.addEventListener('change', () => {
    chrome.storage.sync.get('settings', (data) => {
        chrome.storage.sync.set({
            'settings': {
                showCleanButton: data.settings.showCleanButton,
                hideExclusions: hideExclusionsCB.checked,
            }
        })
    })
})

chrome.storage.sync.get('settings', data => {
    showCleanButtonCB.checked = data.settings.showCleanButton
    hideExclusionsCB.checked = data.settings.hideExclusions
})

//Display Blocked Terms List 
let blockedTermsList = document.getElementById("blockedTermsList");

const displayList = () => {
    //reset list
    blockedTermsList.innerHTML = ''

    chrome.storage.sync.get('blockTerms', (data) => {
        for (i = 0; i < data.blockTerms.length; ++i) {
            let a = document.createElement('a')
            a.innerText = data.blockTerms[i]
            a.classList.add('tooltip')

            if (i >= defaultBlockTermsArr.length) {
                //Remove button
                let removeIcon = document.createElement("i")
                removeIcon.classList.add("fa", "fa-trash-o")
                removeIcon.style.cssText = "padding-left: 8px"
                removeIcon.addEventListener('click', () => removeItemListener(data.blockTerms[i]))

                //Remove Tooltip
                let removeTooltip = document.createElement("span")
                removeTooltip.classList.add('tooltiptextLeft')
                removeTooltip.innerText = 'Remove "' + data.blockTerms[i] + '"?\n(cannot be undone)'

                a.appendChild(removeIcon)
                a.appendChild(removeTooltip)
            }

            blockedTermsList.appendChild(a)
            blockedTermsList.appendChild(document.createElement("br"))
        }
    })
}

//Display list on popup
displayList()


//Reset Blocked Terms List
const resetListBtn = document.getElementById('resetListBtn')
resetListBtn.addEventListener('click', () => {
    chrome.storage.sync.set({ 'blockTerms': defaultBlockTermsArr })

    //Update UI
    displayList()
})

const enableResetListBtnCB = document.getElementById('enableResetListBtnCB')
enableResetListBtnCB.addEventListener('change', () => {
    resetListBtn.disabled = !enableResetListBtnCB.checked
})

//Add Block Term
const newBlockTermInput = document.getElementById('newBlockTermInput')
const addBlockTermBtn = document.getElementById('addBlockTermBtn')
addBlockTermBtn.addEventListener('click', () => {
    if (newBlockTermInput.value === '') return

    chrome.storage.sync.get('blockTerms', (data) => {
        let updatedBlockTermsArr = data.blockTerms
        let newBlockTerm = newBlockTermInput.value.toLowerCase()

        if (updatedBlockTermsArr.indexOf(newBlockTerm) !== -1) return

        //Push block term
        updatedBlockTermsArr.push(newBlockTerm)
        chrome.storage.sync.set({ 'blockTerms': updatedBlockTermsArr })

        //Update UI
        newBlockTermInput.value = ''
        displayList()
    })
})

//Remove Item
const removeItemListener = (blockTerm) => {
    chrome.storage.sync.get('blockTerms', (data) => {
        let updatedBlockTermsArr = data.blockTerms

        updatedBlockTermsArr.splice(updatedBlockTermsArr.indexOf(blockTerm), 1)
        chrome.storage.sync.set({ 'blockTerms': updatedBlockTermsArr })

        displayList()
    })
}