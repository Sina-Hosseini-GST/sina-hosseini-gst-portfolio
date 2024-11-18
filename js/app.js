import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { DoubleSide, Group } from 'three'

// Body
const body = document.body

// Prevent from fast scroll
const lockedClass = 'locked'

// Webgl element
const canvas = document.querySelector('canvas')

// Represent each part of the website (header, main, and footer)
let part

if (window.innerWidth >= 1024)
{
    part = Math.round(document.documentElement.scrollLeft / window.innerWidth)
}
else
{
    part = Math.round(document.documentElement.scrollTop / window.innerHeight)
}

// Represent each section of the website
let section

// Contain three sections
const sectionContainer = document.querySelector('#section-container')
const sections = document.querySelectorAll('section')

// Buttons to navigate the website along with the x axis
const button_1_2 = document.getElementById('1-2-button')
const button_2_1 = document.getElementById('2-1-button')
const button_2_3 = document.getElementById('2-3-button')
const button_3_2 = document.getElementById('3-2-button')

const xButtonArray = [button_1_2, button_2_1, button_2_3, button_3_2]

// Buttons to navigate the website along with the y axis
const upButton = document.querySelector('#up-button')
const downButton = document.querySelector('#down-button')

const yButtonArray = [upButton, downButton]

// First and last element of the website
const header = document.querySelector('header')
const footer = document.querySelector('footer')

// main element, containing canvas and the three sections
const main = document.querySelector('main')

// Website stuff
const websiteInformation = document.querySelector('#website-information')
const websiteContainer = document.querySelector('#website-container')
const openWebsiteButton = document.querySelector('#open-website-button')
const closeWebsiteButton = document.querySelector('#close-website-button')
const nextWebsiteButton = document.querySelector('#next-website-button')
const previousWebsiteButton = document.querySelector('#previous-website-button')
const maximizeWebsiteButton = document.querySelector('#maximize-website-button')
const iframe = document.querySelector('iframe')
const websiteLink = document.querySelector('#website-link')
const websiteTechnologiesAndDescription = document.querySelector('#website-technologies-description')
const websiteDuration = 300 / 2
let isWebsiteMaximized = false

let websiteIndex = 0
const websites = [
    {
        link: 'https://www.fablesofnaranj.com/',
        technologies: 'HTML, CSS -> { Tailwind CSS }, JS -> { Svelte -> { SvelteKit }, Three.js -> { GSAP }, Embla }',
        description: `Don'n miss the <span class="font-bold">Who I am</span> page with its parallax scrolling effect!`
    },
    {
        link: 'https://www.fablesoftoranj.com/',
        technologies: 'HTML, CSS -> { Tailwind CSS }, JS -> { Svelte -> { SvelteKit } }'
    },
    {
        link: 'https://fatherhoodgame.com/',
        technologies: 'HTML, CSS -> { Tailwind CSS }, JS, PHP, WordPress -> { Pods, Panda Pods Repeater Field }'
    },
    {
        link: 'https://persisplay.com/',
        technologies: 'HTML, CSS -> { Tailwind CSS }, JS, PHP, WordPress -> { Pods, Panda Pods Repeater Field }'
    },
    {
        link: 'https://persia-pack.surge.sh/',
        technologies: 'HTML, CSS -> { Tailwind CSS }, JS'
    }
]

// Determine if cube rotates
let rotationState = true

const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()

const textureArrayOne = [
    // Top face
    textureLoader.load('/assets/img/webdev/svelte.png'),
    // Bottom face
    textureLoader.load('/assets/img/webdev/css.png'),
    // Front face
    textureLoader.load('/assets/img/webdev/html.png'),
    // Back face
    textureLoader.load('/assets/img/webdev/javascript.png'),
    // Left face
    textureLoader.load('/assets/img/webdev/three-js.png'),
    // Right face
    textureLoader.load('/assets/img/webdev/tailwind-css.png')
]

const textureArrayTwo = [
    // Top face
    textureLoader.load('/assets/img/gaming/bootleg-games-wiki.png'),
    // Bottom face
    textureLoader.load('/assets/img/gaming/bootleg-games-wiki.png'),
    // Front face
    textureLoader.load('/assets/img/gaming/forever-classic-games.png'),
    // Back face
    textureLoader.load('/assets/img/gaming/forever-classic-games.png'),
    // Left face
    textureLoader.load('/assets/img/gaming/mega-cat.png'),
    // Right face
    textureLoader.load('/assets/img/gaming/mega-cat.png')
]

const textureArrayThree = [
    // Top face
    textureLoader.load('/assets/img/translation/metal-gear.png'),
    // Bottom face
    textureLoader.load('/assets/img/translation/metal-gear.png'),
    // Front face
    textureLoader.load('/assets/img/translation/resident-evil.png'),
    // Back face
    textureLoader.load('/assets/img/translation/resident-evil.png'),
    // Left face
    textureLoader.load('/assets/img/translation/ninja-gaiden.png'),
    // Right face
    textureLoader.load('/assets/img/translation/ninja-gaiden.png')
]

const textureArray = [textureArrayOne, textureArrayTwo, textureArrayThree]

/* Shre on Gist */
/* https://gist.github.com/Sina-Hosseini-GST/1563e409bf4039f918238fbf05250edc */

const createCubeFromPlanes = (boxSegment, planeSize) =>
{
    const cube = new THREE.Group()

    const boxSize = boxSegment * planeSize

    // Contain position of each plane
    const planePositionArray = []

    // Check if boxSegment is odd/even
    // Fill planePositionArray (containing position of each plane)
    if (boxSegment % 2 == 1)
    {
        let value = 0
    
        planePositionArray.push(value)
    
        for(let i = 0; i < Math.floor(boxSegment / 2); i++)
        {
            value += planeSize
            planePositionArray.reverse()
            planePositionArray.push(value)
            planePositionArray.reverse()
            planePositionArray.push(- value)
        }
        planePositionArray.reverse()
    }
    else
    {
        let value = planeSize / 2
    
        planePositionArray.push(value)
        planePositionArray.push(- value)
    
        for(let i = 0; i < (boxSegment / 2) - 1; i++)
        {
            value += planeSize
            planePositionArray.reverse()
            planePositionArray.push(value)
            planePositionArray.reverse()
            planePositionArray.push(- value)
        }
        planePositionArray.reverse()
    }

    // Create 6 faces from planes
    for(let i = 0; i < 6; i++)
    {
        const planeGroup = new THREE.Group()
        
        for(let j = 0; j < boxSegment; j++)
        {
            for(let k = 0; k < boxSegment; k++)
            {
                // Create plane
                const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize)
                const planeMaterial = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 1
                })
                const plane = new THREE.Mesh(planeGeometry, planeMaterial)

                plane.position.x = planePositionArray[j]
                plane.position.y = planePositionArray[k]

                planeGroup.add(plane)
            }
        }

        planeGroup.userData.id = i

        switch(i)
        {
            // Top face
            case 0:
                planeGroup.position.y = boxSize / 2
                planeGroup.rotation.x = - Math.PI / 2
                break
            // Bottom face
            case 1:
                planeGroup.position.y = - boxSize / 2
                planeGroup.rotation.x = Math.PI / 2
                break
            // Front face
            case 2:
                planeGroup.position.z = boxSize / 2
                break
            // Back face
            case 3:
                planeGroup.position.z = - boxSize / 2
                planeGroup.rotation.y = Math.PI
                break
            // Left face
            case 4:
                planeGroup.position.x = - boxSize / 2
                planeGroup.rotation.y = - Math.PI / 2
                break
            // Right face
            case 5:
                planeGroup.position.x = boxSize / 2
                planeGroup.rotation.y = Math.PI / 2
                break
        }
        
        cube.add(planeGroup)
    }

    return cube
}

const addTextureToCube = (textureArray, cube) =>
{
    // Loop through each face
    for(let i = 0; i < 6; i++)
    {
        const planeGroup = cube.children[i]
        const boxSegment = Math.sqrt(planeGroup.children.length)

        // Contain offset of each plane's texture
        const textureOffsetArray = []

        let textureOffsetX = - 1 / boxSegment
        
        // Fill textureOffsetArray (containing offset of each plane's texture)
        for(let j = 0; j < boxSegment; j++)
        {
            textureOffsetX += 1 / boxSegment
    
            let textureOffsetY = - 1 / boxSegment
    
            for(let k = 0; k < boxSegment; k++)
            {
                textureOffsetY += 1 / boxSegment
    
                textureOffsetArray.push([textureOffsetX, textureOffsetY])
            }
        }

        if (i == planeGroup.userData.id)
        {
            // Loop through each plane of the face
            for(let j = 0; j < planeGroup.children.length; j++)
            {
                const plane = planeGroup.children[j]

                plane.material.map = textureArray[i].clone()
                plane.material.map.needsUpdate = true

                plane.material.map.offset.x = textureOffsetArray[j][0]
                plane.material.map.offset.y = textureOffsetArray[j][1]

                plane.material.map.repeat.x = 1 / boxSegment
                plane.material.map.repeat.y = 1 / boxSegment
            }
        }
    }
}

/* https://gist.github.com/Sina-Hosseini-GST/1563e409bf4039f918238fbf05250edc */
/* Shre on Gist */

const getPlanePositionOfCube = (cube) =>
{
    const planePositionArray = []

    for(let i = 0; i < cube.children.length; i++)
    {
        const planeGroup = cube.children[i]
        for(let j = 0; j < planeGroup.children.length; j++)
        {
            const plane = planeGroup.children[j]
            planePositionArray.push({ x: plane.position.x, y: plane.position.y, z: plane.position.z })
        }
    }

    return planePositionArray
}

const deformCube = (cube, duration) =>
{
    for(let i = 0; i < cube.children.length; i++)
    {
        const planeGroup = cube.children[i]
        for(let j = 0; j < planeGroup.children.length; j++)
        {
            const plane = planeGroup.children[j]
            
            const xPlanePosition = Math.random() * 50
            const yPlanePosition = Math.random() * 50
            const zPlanePosition = Math.random() * 50

            gsap.to(plane.position, { duration, ease: 'power4.in', x: xPlanePosition, y: yPlanePosition, z: zPlanePosition })
            
            const xPlaneRotation = Math.random() * 5
            const yPlaneRotation = Math.random() * 5
            const zPlaneRotation = Math.random() * 5

            gsap.to(plane.rotation, { duration, ease: 'power4.in', x: xPlaneRotation, y: yPlaneRotation, z: zPlaneRotation })

            gsap.to(plane.material, { duration, ease: 'power4.in', opacity: 0 })
        }
    }
}

const reformCube = (cube, duration, planePositionArray) =>
{
    for(let i = 0; i < cube.children.length; i++)
    {
        const planeGroup = cube.children[i]
        for(let j = 0; j < planeGroup.children.length; j++)
        {
            const plane = planeGroup.children[j]

            gsap.to(plane.position, { duration, ease: 'power4.out', x: planePositionArray[j].x, y: planePositionArray[j].y, z: planePositionArray[j].z })
            
            gsap.to(plane.rotation, { duration, ease: 'power4.out', x: 0, y: 0, z: 0 })

            gsap.to(plane.material, { duration, ease: 'power4.out', opacity: 1 })
        }
    }
}

const transformCube = (cube , duration, section) =>
{
    deformCube(cube, duration)

    rotationState = false

    setTimeout(() =>
    {
        addTextureToCube(textureArray[section], cube)

        reformCube(cube, duration, planePositionArray)

        rotationState = true
    }, duration * 1000)
}

const transformCanvas = (section) =>
{
    if (section == 1)
    {
        canvas.classList.remove('md:-translate-x-1/3')
        canvas.classList.add('md:translate-x-0')
    }
    else
    {
        canvas.classList.remove('md:translate-x-0')
        canvas.classList.add('md:-translate-x-1/3')
    }
}

const fadeOutAllSections = () =>
{
    for(let i = 0; i < sectionContainer.childElementCount; i++)
    {
        const section = sections[i]
        section.classList.remove('opacity-100')
        section.classList.add('opacity-0')
    }
}

const fadeOut = (element) =>
{
    element.classList.remove('opacity-100')
    element.classList.add('opacity-0')
}

const fadeIn = (element) =>
{
    element.classList.remove('opacity-0')
    element.classList.add('opacity-100')
}

const fadeInSection = (index) =>
{
    const section = sections[index]
    section.classList.remove('opacity-0')
    section.classList.add('opacity-100')
}

const showAllYButtons = () =>
{
    upButton.classList.remove('-top-16')
    upButton.classList.add('top-0')
    downButton.classList.remove('-bottom-16')
    downButton.classList.add('bottom-0')
}

const hideUpButton = () =>
{
    upButton.classList.remove('top-0')
    upButton.classList.add('-top-16')
}

const hideDownButton = () =>
{
    downButton.classList.remove('bottom-0')
    downButton.classList.add('-bottom-16')
}

const convertHeadingIntoPieces = (heading) =>
{
    const headingContent = heading.textContent.trim()
    
    let headingAltContent = ``

    for(let j = 0; j < headingContent.length; j++)
    {
        headingAltContent += `<span class="inline-flex transition-transform duration-1000 ease-in-out">${headingContent[j]}</span>`
    }

    heading.innerHTML = headingAltContent
}

const animateHeading = (section) =>
{
    // Remove styles
    const headingArray = document.querySelectorAll('h3')

    for(let i = 0; i < headingArray.length; i++)
    {
        const heading = headingArray[i]

        for(let j = 0; j < heading.childElementCount; j++)
        {
            const span = heading.children[j]
            span.style.transform = 'rotateX(180deg)'
        }
    }

    // Add styles
    const heading = document.querySelector(`section:nth-child(${section + 1}) > article > h3`)

    for(let i = 0; i < heading.childElementCount; i++)
    {
        const span = heading.children[i]
        
        setTimeout(() =>
        {
            span.style.transform = 'rotateX(360deg)'
        }, i * 50)
    }
}

const updateScreenSizedElementsHeight = () =>
{
    const hScreenArray = document.querySelectorAll('.h-screen')

    for(let i = 0; i < hScreenArray.length; i++)
    {
        const hScreen = hScreenArray[i]
    
        hScreen.style.height = `${window.innerHeight}px`
    }
}

const configureLockedClass = () =>
{
    body.classList.add(lockedClass)

    setTimeout(() =>
    {
        body.classList.remove(lockedClass)
    }, 1000)
}

const configureWebsite = () =>
{
    iframe.setAttribute('src', websites[websiteIndex].link)
    websiteLink.setAttribute('href', websites[websiteIndex].link)
    websiteLink.innerHTML = `You're Visiting <span class="group-hover:bg-white group-hover:text-black transition-colors duration-300">${websites[websiteIndex].link}</span>`
    websiteTechnologiesAndDescription.textContent = `Technologies Used => ${websites[websiteIndex].technologies}`
    fixWebsiteContainerBottom()
}

const fixWebsiteContainerBottom = () =>
{
    if (!isWebsiteMaximized)
    {
        websiteContainer.style.bottom = `${websiteTechnologiesAndDescription.getBoundingClientRect().height}px`
    }
    else
    {
        websiteContainer.style.bottom = 0
    }
}

// Update screen sized elements' height
updateScreenSizedElementsHeight()

// Convert headings' content into groups of spans
const headingArray = document.querySelectorAll('h3')

for(let i = 0; i < headingArray.length; i++)
{
    const heading = headingArray[i]
    convertHeadingIntoPieces(heading)
}

// Open website modal
openWebsiteButton.addEventListener('click', () =>
{
    configureWebsite()

    main.classList.remove('z-20')
    main.classList.add('z-40')

    websiteInformation.classList.remove('invisible', 'opacity-0')
    websiteInformation.classList.add('opacity-100')

    websiteLink.classList.remove('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60')
    websiteLink.classList.add('top-0')

    setTimeout(() =>
    {
        maximizeWebsiteButton.classList.remove('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60', 'right-0')
        maximizeWebsiteButton.classList.add('top-0', 'xl:right-c-7', 'lg:right-c-27', 'md:right-c-59', 'right-c-60')

        setTimeout(() =>
        {
            closeWebsiteButton.classList.remove('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60', 'xl:-right-c-7', 'lg:-right-c-27', 'md:-right-c-59', '-right-c-60')
            closeWebsiteButton.classList.add('top-0', 'right-0')
        
            setTimeout(() =>
            {
                nextWebsiteButton.classList.remove('xl:-right-c-7', 'lg:-right-c-27', 'md:-right-c-59', '-right-c-60')
                nextWebsiteButton.classList.add('right-0')
        
                setTimeout(() =>
                {
                    websiteTechnologiesAndDescription.classList.remove('-bottom-full')
                    websiteTechnologiesAndDescription.classList.add('bottom-0')
    
                    setTimeout(() =>
                    {
                        previousWebsiteButton.classList.remove('xl:-left-c-7', 'lg:-left-c-27', 'md:-left-c-59', '-left-c-60')
                        previousWebsiteButton.classList.add('left-0')
    
                        fixWebsiteContainerBottom()
                    }, websiteDuration)
                }, websiteDuration)
            }, websiteDuration)
        }, websiteDuration)
    }, websiteDuration)
})

closeWebsiteButton.addEventListener('click', () =>
{
    setTimeout(() =>
    {
        previousWebsiteButton.classList.remove('left-0')
        previousWebsiteButton.classList.add('xl:-left-c-7', 'lg:-left-c-27', 'md:-left-c-59', '-left-c-60')

        setTimeout(() =>
        {
            websiteTechnologiesAndDescription.classList.remove('bottom-0')
            websiteTechnologiesAndDescription.classList.add('-bottom-full')
    
            setTimeout(() =>
            {
                nextWebsiteButton.classList.remove('right-0')
                nextWebsiteButton.classList.add('xl:-right-c-7', 'lg:-right-c-27', 'md:-right-c-59', '-right-c-60')

                setTimeout(() =>
                {
                    closeWebsiteButton.classList.remove('top-0', 'right-0')
                    closeWebsiteButton.classList.add('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60', 'xl:-right-c-7', 'lg:-right-c-27', 'md:-right-c-59', '-right-c-60')

                    setTimeout(() =>
                    {
                        maximizeWebsiteButton.classList.remove('top-0', 'xl:right-c-7', 'lg:right-c-27', 'md:right-c-59', 'right-c-60')
                        maximizeWebsiteButton.classList.add('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60', 'right-0')

                        setTimeout(() =>
                        {
                            websiteLink.classList.remove('top-0')
                            websiteLink.classList.add('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60')

                            websiteInformation.classList.remove('opacity-100')
                            websiteInformation.classList.add('opacity-0')

                            setTimeout(() =>
                            {
                                websiteInformation.classList.add('invisible')
                            }, websiteDuration * 2)

                            main.classList.remove('z-40')
                            main.classList.add('z-20')
                        }, websiteDuration)
                    }, websiteDuration)
                }, websiteDuration)
            }, websiteDuration)
        }, websiteDuration)
    }, websiteDuration)
})

maximizeWebsiteButton.addEventListener('click', () =>
{
    if (!websiteInformation.classList.contains(lockedClass))
    {
        isWebsiteMaximized = !isWebsiteMaximized

        if (isWebsiteMaximized)
        {
            previousWebsiteButton.classList.remove('left-0')
            previousWebsiteButton.classList.add('xl:-left-c-7', 'lg:-left-c-27', 'md:-left-c-59', '-left-c-60')
        
            setTimeout(() =>
            {
                websiteTechnologiesAndDescription.classList.remove('bottom-0')
                websiteTechnologiesAndDescription.classList.add('-bottom-full')
        
                setTimeout(() =>
                {
                    nextWebsiteButton.classList.remove('right-0')
                    nextWebsiteButton.classList.add('xl:-right-c-7', 'lg:-right-c-27', 'md:-right-c-59', '-right-c-60')
    
                    setTimeout(() =>
                    {
                        closeWebsiteButton.classList.remove('top-0', 'right-0')
                        closeWebsiteButton.classList.add('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60', 'xl:-right-c-7', 'lg:-right-c-27', 'md:-right-c-59', '-right-c-60')
    
                        setTimeout(() =>
                        {
                            websiteLink.classList.remove('top-0')
                            websiteLink.classList.add('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60')
    
                            setTimeout(() =>
                            {
                                maximizeWebsiteButton.classList.remove('top-0', 'xl:right-c-7', 'lg:right-c-27', 'md:right-c-59', 'right-c-60')
                                maximizeWebsiteButton.classList.add('top-0', 'right-0')
    
                                websiteContainer.classList.remove('xl:inset-c-7', 'lg:inset-c-27', 'md:inset-c-59', 'inset-c-60')
                                websiteContainer.classList.add('inset-0')

                                fixWebsiteContainerBottom()
                            }, websiteDuration)
                        }, websiteDuration)
                    }, websiteDuration)
                }, websiteDuration)
            }, websiteDuration)
        }
        else
        {
            websiteContainer.classList.remove('inset-0')
            websiteContainer.classList.add('xl:inset-c-7', 'lg:inset-c-27', 'md:inset-c-59', 'inset-c-60')

            fixWebsiteContainerBottom()
    
            setTimeout(() =>
            {
                websiteLink.classList.remove('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60')
                websiteLink.classList.add('top-0')
        
                setTimeout(() =>
                {
                    maximizeWebsiteButton.classList.remove('top-0', 'right-0')
                    maximizeWebsiteButton.classList.add('top-0', 'xl:right-c-7', 'lg:right-c-27', 'md:right-c-59', 'right-c-60')
            
                    setTimeout(() =>
                    {
                        closeWebsiteButton.classList.remove('xl:-top-c-7', 'lg:-top-c-27', 'md:-top-c-59', '-top-c-60', 'xl:-right-c-7', 'lg:-right-c-27', 'md:-right-c-59', '-right-c-60')
                        closeWebsiteButton.classList.add('top-0', 'right-0')
                    
                        setTimeout(() =>
                        {
                            nextWebsiteButton.classList.remove('xl:-right-c-7', 'lg:-right-c-27', 'md:-right-c-59', '-right-c-60')
                            nextWebsiteButton.classList.add('right-0')
                    
                            setTimeout(() =>
                            {
                                websiteTechnologiesAndDescription.classList.remove('-bottom-full')
                                websiteTechnologiesAndDescription.classList.add('bottom-0')
                
                                setTimeout(() =>
                                {
                                    previousWebsiteButton.classList.remove('xl:-left-c-7', 'lg:-left-c-27', 'md:-left-c-59', '-left-c-60')
                                    previousWebsiteButton.classList.add('left-0')
                                }, websiteDuration)
                            }, websiteDuration)
                        }, websiteDuration)
                    }, websiteDuration)
                }, websiteDuration)
            }, websiteDuration)
        }

        websiteInformation.classList.add(lockedClass)

        setTimeout(() =>
        {
            websiteInformation.classList.remove(lockedClass)
        }, websiteDuration * 6)
    }
})

nextWebsiteButton.addEventListener('click', () =>
{
    websiteIndex++
    if (websiteIndex == websites.length)
    {
        websiteIndex = 0
    }
    configureWebsite()
})

previousWebsiteButton.addEventListener('click', () =>
{
    websiteIndex--
    if (websiteIndex == - 1)
    {
        websiteIndex = websites.length - 1
    }
    configureWebsite()
})

// Optimize x-buttons
for(let i = 0; i < xButtonArray.length; i++)
{
    const xButton = xButtonArray[i]

    xButton.addEventListener('click', () =>
    {
        // Scroll right
        if (xButton == button_1_2)
        {
            part += 1
            sectionContainer.scrollIntoView({ behavior: 'smooth' })
            animateHeading(section)
        }
        // Scroll left
        else if (xButton == button_2_1)
        {
            part -= 1
            header.scrollIntoView({ behavior: 'smooth' })
        }
        // Scroll right
        else if (xButton == button_2_3)
        {
            part += 1
            footer.scrollIntoView({ behavior: 'smooth' })
        }
        // Scroll left
        else if (xButton == button_3_2)
        {
            part -= 1
            sectionContainer.scrollIntoView({ behavior: 'smooth' })
            animateHeading(section)
        }
    })
}

// Optimize y-buttons
showAllYButtons()

if (part == 0)
{
    hideUpButton()
}
else if (part == 2)
{
    hideDownButton()
}

for(let i = 0; i < yButtonArray.length; i++)
{
    const yButton = yButtonArray[i]

    yButton.addEventListener('click', () =>
    {
        if (!body.classList.contains(lockedClass))
        {
            showAllYButtons()
    
            // Click up button
            if (yButton == upButton)
            {
                // Scroll up
                if (part == 2)
                {
                    part -= 1
                    sectionContainer.scrollIntoView({ behavior: 'smooth' })
                    animateHeading(section)
                }
                // Scroll up
                else if (part == 1 && section != 0)
                {
                    section -= 1
                    transformCube(cube, .5, section)
                    fadeOutAllSections()
                    fadeInSection(section)
                    animateHeading(section)
                    sections[section].scrollIntoView({ behavior: 'smooth' })
                }
                // Scroll up
                else if (part == 1 && section == 0)
                {
                    part -= 1
                    header.scrollIntoView({ behavior: 'smooth' })
                    hideUpButton()
                }
            }
            // Click down button
            else if (yButton == downButton)
            {
                // Scroll down
                if (part == 0)
                {
                    part += 1
                    sectionContainer.scrollIntoView({ behavior: 'smooth' })
                    animateHeading(section)
                }
                // Scroll down
                else if (part == 1 && section != 2)
                {
                    section += 1
                    transformCube(cube, .5, section)
                    fadeOutAllSections()
                    fadeInSection(section)
                    animateHeading(section)
                    sections[section].scrollIntoView({ behavior: 'smooth' })
                }
                // Scroll down
                else if (part == 1 && section == 2)
                {
                    part += 1
                    footer.scrollIntoView({ behavior: 'smooth' })
                    hideDownButton()
                }
            }
    
            // Everytime
            transformCanvas(section)

            configureLockedClass()
        }
    })
}

let touchstartValue
let touchendValue
let touchTarget

window.addEventListener('touchstart', (e) =>
{
    touchstartValue = e.changedTouches[0].clientY
    touchTarget = e.target
})

window.addEventListener('touchend', (e) =>
{
    if (!body.classList.contains(lockedClass))
    {
        touchendValue = e.changedTouches[0].clientY
    
        // Touch, into bottom
        if (touchendValue > touchstartValue)
        {
            showAllYButtons()
    
            // Scroll up
            if (part == 2)
            {
                part -= 1
                fadeOut(footer)
                fadeOut(main)
                fadeOut(sectionContainer)
                fadeOutAllSections()
                setTimeout(() =>
                {
                    window.scrollBy(0, - window.innerHeight)
                    fadeIn(footer)
                    fadeIn(main)
                    setTimeout(() =>
                    {
                        fadeIn(sectionContainer)
                        fadeInSection(section)
                        animateHeading(section)
                    }, 500)
                }, 500)
            }
            // Scroll up
            else if (part == 1 && section != 0)
            {
                section -= 1
                fadeOut(sectionContainer)
                fadeOutAllSections()
                deformCube(cube, .5)
                setTimeout(() =>
                {
                    sectionContainer.scrollBy(0, - window.innerHeight)
                    addTextureToCube(textureArray[section], cube)
                    reformCube(cube, .5, planePositionArray)
                    setTimeout(() =>
                    {
                        fadeIn(sectionContainer)
                        fadeInSection(section)
                        animateHeading(section)
                    }, 500)
                }, 500)
            }
            // Scroll up
            else if (part == 1 && section == 0)
            {
                part -= 1
                fadeOut(main)
                fadeOut(sectionContainer)
                fadeOut(header)
                setTimeout(() =>
                {
                    window.scrollBy(0, - window.innerHeight)
                    fadeIn(main)
                    fadeIn(sectionContainer)
                    setTimeout(() =>
                    {
                        fadeIn(header)
                    }, 500)
                }, 500)
                hideUpButton()
            }
            else if (part == 0)
            {
                hideUpButton()
            }
    
            transformCanvas(section)
        }
        // Touch, into top
        else if (touchstartValue > touchendValue)
        {
            showAllYButtons()
    
            // Scroll down
            if (part == 0)
            {
                part += 1
                fadeOut(header)
                fadeOut(main)
                fadeOut(sectionContainer)
                fadeOutAllSections()
                setTimeout(() =>
                {
                    window.scrollBy(0, window.innerHeight)
                    fadeIn(header)
                    fadeIn(main)
                    setTimeout(() =>
                    {
                        fadeIn(sectionContainer)
                        fadeInSection(section)
                        animateHeading(section)
                    }, 500)
                }, 500)
            }
            // Scroll down
            else if (part == 1 && section != 2)
            {
                section += 1
                fadeOut(sectionContainer)
                fadeOutAllSections()
                deformCube(cube, .5)
                setTimeout(() =>
                {
                    sectionContainer.scrollBy(0, window.innerHeight)
                    addTextureToCube(textureArray[section], cube)
                    reformCube(cube, .5, planePositionArray)
                    setTimeout(() =>
                    {
                        fadeIn(sectionContainer)
                        fadeInSection(section)
                        animateHeading(section)
                    }, 500)
                }, 500)
            }
            // Scroll down
            else if (part == 1 && section == 2)
            {
                part += 1
                fadeOut(main)
                fadeOut(sectionContainer)
                fadeOut(footer)
                setTimeout(() =>
                {
                    window.scrollBy(0, window.innerHeight)
                    fadeIn(main)
                    fadeIn(sectionContainer)
                    setTimeout(() =>
                    {
                        fadeIn(footer)
                    }, 500)
                }, 500)
                hideDownButton()
            }
            else if (part == 2)
            {
                hideDownButton()
            }
    
            transformCanvas(section)
        }
        else if (touchstartValue == touchendValue)
        {
            showAllYButtons()
    
            // Click up button
            if (touchTarget == upButton)
            {
                // Scroll up
                if (part == 2)
                {
                    part -= 1
                    sectionContainer.scrollIntoView({ behavior: 'smooth' })
                    animateHeading(section)
                }
                // Scroll up
                else if (part == 1 && section != 0)
                {
                    section -= 1
                    transformCube(cube, .5, section)
                    fadeOutAllSections()
                    fadeInSection(section)
                    animateHeading(section)
                    sections[section].scrollIntoView({ behavior: 'smooth' })
                }
                // Scroll up
                else if (part == 1 && section == 0)
                {
                    part -= 1
                    header.scrollIntoView({ behavior: 'smooth' })
                    hideUpButton()
                }
            }
            // Click down button
            else if (touchTarget == downButton)
            {
                // Scroll down
                if (part == 0)
                {
                    part += 1
                    sectionContainer.scrollIntoView({ behavior: 'smooth' })
                    animateHeading(section)
                }
                // Scroll down
                else if (part == 1 && section != 2)
                {
                    section += 1
                    transformCube(cube, .5, section)
                    fadeOutAllSections()
                    fadeInSection(section)
                    animateHeading(section)
                    sections[section].scrollIntoView({ behavior: 'smooth' })
                }
                // Scroll down
                else if (part == 1 && section == 2)
                {
                    part += 1
                    footer.scrollIntoView({ behavior: 'smooth' })
                    hideDownButton()
                }
            }
    
            // Everytime
            transformCanvas(section)
        }

        configureLockedClass()
    }
})

// Randomize binary code
const codeBlock = document.querySelector('#code-block')

const maxBlockLength = 7

for(let i = 0 ; i < maxBlockLength; i++)
{
    let codeSubBlock = `<div>`

    for(let j = 0 ; j < Math.ceil((Math.random() + .25) * maxBlockLength); j++)
    {
        if (Math.random() < .5)
        {
            codeSubBlock += `<span class="code">0</span>`
        }
        else
        {
            codeSubBlock += `<span class="code font-bold">1</span>`
        }
    }

    codeSubBlock += `</div>`

    codeBlock.innerHTML += codeSubBlock
}

const codeArray = document.querySelectorAll('.code')

for(let i = 0; i < codeArray.length; i++)
{
    const code = codeArray[i]

    const duration = (Math.random() + .5) * 2000

    setInterval(() =>
    {
        if (code.textContent == '1')
        {
            code.textContent = '0'
        }
        else
        {
            code.textContent = '1'
        }
    }, duration)
}

/* Docs */

// createCubeFromPlanes(boxSegment, planeSize)
// boxSegment can't be float
const cube = createCubeFromPlanes(4, .45)

scene.add(cube)

// addTextureToCube(textureArray, cube)
// addTextureToCube(textureArrayOne, cube)

/* Docs */

const planePositionArray = getPlanePositionOfCube(cube)

// Scroll effects
section = Math.round(sectionContainer.scrollTop / window.innerHeight)
addTextureToCube(textureArray[section], cube)
fadeOutAllSections()
fadeInSection(section)
animateHeading(section)
transformCanvas(section)

window.addEventListener('wheel', (e) =>
{
    if (!body.classList.contains(lockedClass))
    {
        const scrollY = e.deltaY

        showAllYButtons()
        
        // Move down
        if (scrollY > 0)
        {
            // Scroll right
            if (part == 0)
            {
                part += 1
                sectionContainer.scrollIntoView({ behavior: 'smooth' })
                animateHeading(section)
            }
            // Scroll down
            else if (part == 1 && section != 2)
            {
                section += 1
                transformCube(cube, .5, section)
                fadeOutAllSections()
                fadeInSection(section)
                animateHeading(section)
                sections[section].scrollIntoView({ behavior: 'smooth' })
            }
            // Scroll right
            else if (part == 1 && section == 2)
            {
                part += 1
                footer.scrollIntoView({ behavior: 'smooth' })
                hideDownButton()
            }
            else if (part == 2)
            {
                hideDownButton()
            }
        }
        // Move up
        else if (scrollY < 0)
        {
            // Scroll left
            if (part == 2)
            {
                part -= 1
                sectionContainer.scrollIntoView({ behavior: 'smooth' })
                animateHeading(section)
            }
            // Scroll up
            else if (part == 1 && section != 0)
            {
                section -= 1
                transformCube(cube, .5, section)
                fadeOutAllSections()
                fadeInSection(section)
                animateHeading(section)
                sections[section].scrollIntoView({ behavior: 'smooth' })
            }
            // Scroll left
            else if (part == 1 && section == 0)
            {
                part -= 1
                header.scrollIntoView({ behavior: 'smooth' })
                hideUpButton()
            }
            else if (part == 0)
            {
                hideUpButton()
            }
        }

        // Everytime
        transformCanvas(section)

        configureLockedClass()
    }
})

window.addEventListener('keyup', (e) =>
{
    if (!body.classList.contains(lockedClass))
    {
        const key = e.key
    
        // Press down
        if (key == 'ArrowDown' || key == 'PageDown')
        {
            showAllYButtons()
    
            // Scroll right
            if (part == 0)
            {
                part += 1
                sectionContainer.scrollIntoView({ behavior: 'smooth' })
                animateHeading(section)
            }
            // Scroll down
            else if (part == 1 && section != 2)
            {
                section += 1
                transformCube(cube, .5, section)
                fadeOutAllSections()
                fadeInSection(section)
                animateHeading(section)
                sections[section].scrollIntoView({ behavior: 'smooth' })
            }
            // Scroll right
            else if (part == 1 && section == 2)
            {
                part += 1
                footer.scrollIntoView({ behavior: 'smooth' })
                hideDownButton()
            }
            else if (part == 2)
            {
                hideDownButton()
            }
        }
        // Press up
        else if (key == 'ArrowUp' || key == 'PageUp')
        {
            showAllYButtons()
            
            // Scroll left
            if (part == 2)
            {
                part -= 1
                sectionContainer.scrollIntoView({ behavior: 'smooth' })
                animateHeading(section)
            }
            // Scroll up
            else if (part == 1 && section != 0)
            {
                section -= 1
                transformCube(cube, .5, section)
                fadeOutAllSections()
                fadeInSection(section)
                animateHeading(section)
                sections[section].scrollIntoView({ behavior: 'smooth' })
            }
            // Scroll left
            else if (part == 1 && section == 0)
            {
                part -= 1
                header.scrollIntoView({ behavior: 'smooth' })
                hideUpButton()
            }
            else if (part == 0)
            {
                hideUpButton()
            }
        }
    
        // Everytime
        transformCanvas(section)

        configureLockedClass()
    }
})

window.addEventListener('resize', () =>
{
    fixWebsiteContainerBottom()
    
    // Update sizes
    sizes.width = window.innerWidth * 1.5
    sizes.height = window.innerHeight

    // Update screen sized elements' height
    updateScreenSizedElementsHeight()

    // Update html
    sectionContainer.scrollTop = section * window.innerHeight

    if (window.innerWidth >= 1024)
    {
        document.documentElement.scrollLeft = part * window.innerWidth
    }
    else
    {
        document.documentElement.scrollTop = part * window.innerHeight
    }

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const sizes = {
    width: window.innerWidth * 1.5,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 4
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(0x0f0f0f)

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    if (rotationState)
    {
        const xCubeRotation = elapsedTime * .125
        const yCubeRotation = elapsedTime * .25
        const zCubeRotation = elapsedTime

        cube.rotation.x = xCubeRotation
        cube.rotation.y = yCubeRotation
        cube.rotation.z = zCubeRotation
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()