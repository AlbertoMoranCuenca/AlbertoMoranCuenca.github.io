const menuIcon = document.getElementById("menu-icon")
const crossIcon = document.getElementById('cross-icon')
const menu = document.getElementById('menu')
const aboutLink = document.getElementById('about-link')
const projectLink = document.getElementById('project-link')

menuIcon.addEventListener("click", () => {
    menu.removeAttribute("invisible")
    menuIcon.setAttribute("invisible",true)
})

aboutLink.addEventListener("click", () => {
    menu.setAttribute("invisible",true)
    menuIcon.removeAttribute("invisible")
})

projectLink.addEventListener("click", () => {
    menu.setAttribute("invisible",true)
    menuIcon.removeAttribute("invisible")
})

crossIcon.addEventListener("click", () => {
    menu.setAttribute("invisible",true)
    menuIcon.removeAttribute("invisible")
})

const profileTab = document.getElementById("profile-tab")
const profileSelector = document.getElementById('profile-selector')

const skillsTab = document.getElementById('skills-tab')
const skillsSelector = document.getElementById('skills-selector')

const experienceTab = document.getElementById('experience-tab')
const experienceSelector = document.getElementById('experience-selector')

profileSelector.addEventListener("click", () => {
    profileSelector.setAttribute("selected",true)
    skillsSelector.removeAttribute("selected")
    experienceSelector.removeAttribute("selected")
    profileTab.removeAttribute("invisible")
    skillsTab.setAttribute("invisible",true)
    experienceTab.setAttribute("invisible",true)
})

skillsSelector.addEventListener("click", () => {
    profileSelector.removeAttribute("selected")
    skillsSelector.setAttribute("selected",true)
    experienceSelector.removeAttribute("selected")
    profileTab.setAttribute("invisible",true)
    skillsTab.removeAttribute("invisible")
    experienceTab.setAttribute("invisible",true)
})

experienceSelector.addEventListener("click", () => {
    profileSelector.removeAttribute("selected")
    skillsSelector.removeAttribute("selected")
    experienceSelector.setAttribute("selected",true)
    profileTab.setAttribute("invisible",true)
    skillsTab.setAttribute("invisible",true)
    experienceTab.removeAttribute("invisible")
})