/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/* Menu show */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/* Menu hidden */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

const linkAction = () =>{
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== SHADOW HEADER ===============*/
const shadowHeader = () =>{
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the shadow-header class to the header tag
    this.scrollY >= 50 ? header.classList.add('shadow-header') 
                        : header.classList.remove('shadow-header')
}
window.addEventListener('scroll', shadowHeader)

/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form'),
        contactMessage = document.getElementById('contact-message')

const sendEmail = (e) =>{
    e.preventDefault()

    // serviceID - templateID - #form - publicKey
    emailjs.sendForm('service_w6wo8ju','template_pp0uzys','#contact-form','c47rwtY9rbzUAqD2t')
    .then(() =>{
        // Show sent message
        contactMessage.textContent = 'Message sent successfully ✅'

        // Remove message after five seconds
        setTimeout(() =>{
            contactMessage.textContent = ''
        }, 5000)

        // Clear input fields
        contactForm.reset()

    }, () => {
        // Show error message
        contactMessage.textContent = 'Message not sent (service error) ❌'
    })
}

contactForm.addEventListener('submit', sendEmail)

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
    // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
	this.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
						: scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')
    
const scrollActive = () =>{
    const scrollDown = window.scrollY

	sections.forEach(current =>{
		const sectionHeight = current.offsetHeight,
                sectionTop = current.offsetTop - 58,
                sectionId = current.getAttribute('id'),
                sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

		if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
			sectionsClass.classList.add('active-link')
		}else{
			sectionsClass.classList.remove('active-link')
		}                                                    
	})
}
window.addEventListener('scroll', scrollActive)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
} else {
    // Dark is the default. Only an explicit stored choice of 'light' opts out,
    // which is handled by the branch above.
    document.body.classList.add(darkTheme)
    themeButton.classList.add(iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (!prefersReducedMotion) {
    const sr = ScrollReveal({
        origin: 'top',
        distance: '60px',
        duration: 2500,
        delay: 400,
        reset: false // Reveal once, do not replay on every scroll
    })

    sr.reveal(`.home__perfil, .about__image, .contact__mail`, {origin: 'right'})
    sr.reveal(`.home__name, .home__info,
                .about__container .section__title-1, .about__info,
                .contact__social, .contact__data`, {origin: 'left'})
    sr.reveal(`.services__card`, {interval: 100})
    sr.reveal(`.projects__carousel`)
}

/*=============== PROJECTS CAROUSEL ===============*/
const projectsTrack = document.getElementById('projects-track')

if (projectsTrack) {
    const prevButton = document.getElementById('projects-prev')
    const nextButton = document.getElementById('projects-next')
    const dotsContainer = document.getElementById('projects-dots')
    const cards = Array.from(projectsTrack.querySelectorAll('.projects__card'))

    // How many whole cards fit in the visible track at the current breakpoint
    const cardsPerView = () => {
        const cardWidth = cards[0].getBoundingClientRect().width
        if (!cardWidth) return 1
        const gap = parseFloat(getComputedStyle(projectsTrack).columnGap) || 0
        return Math.max(1, Math.round((projectsTrack.clientWidth + gap) / (cardWidth + gap)))
    }

    const pageCount = () => Math.max(1, Math.ceil(cards.length / cardsPerView()))

    // Tracked explicitly rather than derived from scrollLeft on demand, so the
    // controls stay correct even if scroll events are coalesced or delayed.
    let activePage = 0

    const updateControls = () => {
        prevButton.disabled = activePage <= 0
        nextButton.disabled = activePage >= pageCount() - 1
        Array.from(dotsContainer.children).forEach((dot, i) => {
            dot.setAttribute('aria-selected', String(i === activePage))
        })
    }

    const setActivePage = (index) => {
        activePage = Math.min(Math.max(index, 0), pageCount() - 1)
        updateControls()
    }

    const goToPage = (index) => {
        const target = Math.min(Math.max(index, 0), pageCount() - 1)
        projectsTrack.scrollTo({
            left: target * projectsTrack.clientWidth,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        })
        // Update immediately rather than waiting for the scroll to settle
        setActivePage(target)
    }

    const buildDots = () => {
        dotsContainer.innerHTML = ''
        for (let i = 0; i < pageCount(); i++) {
            const dot = document.createElement('button')
            dot.type = 'button'
            dot.setAttribute('role', 'tab')
            dot.setAttribute('aria-label', `Go to project page ${i + 1}`)
            dot.addEventListener('click', () => goToPage(i))
            dotsContainer.appendChild(dot)
        }
    }

    prevButton.addEventListener('click', () => goToPage(activePage - 1))
    nextButton.addEventListener('click', () => goToPage(activePage + 1))

    // Arrow keys browse the track once it has focus
    projectsTrack.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault()
            goToPage(activePage + 1)
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            goToPage(activePage - 1)
        }
    })

    // Keeps state honest when the visitor swipes or trackpad scrolls the track directly
    let scrollTimer
    projectsTrack.addEventListener('scroll', () => {
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(() => {
            setActivePage(Math.round(projectsTrack.scrollLeft / (projectsTrack.clientWidth || 1)))
        }, 80)
    })

    let resizeTimer
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
            buildDots()
            setActivePage(Math.round(projectsTrack.scrollLeft / (projectsTrack.clientWidth || 1)))
        }, 150)
    })

    buildDots()
    updateControls()
}

/*=============== PROJECT DETAIL MODAL ===============*/
const projectModal = document.getElementById('project-modal')

if (projectModal) {
    const modalBody = document.getElementById('project-modal-body')
    const modalClose = document.getElementById('project-modal-close')
    const cards = Array.from(document.querySelectorAll('.projects__card'))
    const supportsDialog = typeof projectModal.showModal === 'function'

    if (!supportsDialog) {
        // Without <dialog> support the trigger would be a dead control, so remove it
        document.querySelectorAll('.projects__more').forEach(button => button.remove())
    } else {
        const openProject = (card) => {
            const cardImage = card.querySelector('.projects__img')
            const cardContent = card.querySelector('.projects__content')
            const cardLink = card.querySelector('.projects__buttons .projects__link')

            modalBody.innerHTML = ''

            if (cardImage) {
                const media = document.createElement('div')
                media.className = 'project-modal__media'
                const image = document.createElement('img')
                image.src = cardImage.getAttribute('src')
                image.alt = cardImage.getAttribute('alt') || ''
                media.appendChild(image)
                modalBody.appendChild(media)
            }

            // Cloned from the card so the copy lives in exactly one place.
            // The truncation is scoped to .projects__track, so nothing is cut off here.
            const details = document.createElement('div')
            details.className = 'project-modal__content'
            details.innerHTML = cardContent.innerHTML

            const heading = details.querySelector('.projects__title')
            if (heading) {
                heading.id = 'project-modal-title'
            }

            if (cardLink) {
                const actions = document.createElement('div')
                actions.className = 'project-modal__actions'
                const cta = cardLink.cloneNode(true)
                cta.classList.remove('projects__link')
                cta.classList.add('button')
                actions.appendChild(cta)
                details.appendChild(actions)
            }

            modalBody.appendChild(details)
            modalBody.scrollTop = 0
            document.body.classList.add('modal-open')
            projectModal.showModal()
        }

        cards.forEach((card) => {
            const trigger = card.querySelector('.projects__more')
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation()
                    openProject(card)
                })
            }

            // The card is clickable too, but a swipe across the carousel must not
            // count as a click, so compare the pointer travel first.
            let pointerX = 0
            let pointerY = 0

            card.addEventListener('pointerdown', (e) => {
                pointerX = e.clientX
                pointerY = e.clientY
            })

            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('.projects__more')) return
                const travelled = Math.abs(e.clientX - pointerX) + Math.abs(e.clientY - pointerY)
                if (travelled > 10) return
                openProject(card)
            })
        })

        // Unlocking the page must not depend on the 'close' event alone. Every
        // explicit dismissal goes through here, and the listeners below are a
        // safety net for the browser driven Escape key.
        const closeProject = () => {
            document.body.classList.remove('modal-open')
            if (projectModal.open) {
                projectModal.close()
            }
        }

        modalClose.addEventListener('click', closeProject)

        projectModal.addEventListener('click', (e) => {
            // Following an in-page link should dismiss the modal first
            if (e.target.closest('a[href^="#"]')) {
                closeProject()
                return
            }
            // A click landing on the dialog itself is a click on the backdrop
            if (e.target === projectModal) {
                closeProject()
            }
        })

        // Escape is handled by the browser, so mirror the cleanup on every
        // signal it gives us rather than trusting a single one to arrive.
        projectModal.addEventListener('cancel', () => {
            document.body.classList.remove('modal-open')
        })

        projectModal.addEventListener('close', () => {
            document.body.classList.remove('modal-open')
        })

        projectModal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.body.classList.remove('modal-open')
            }
        })
    }
}
