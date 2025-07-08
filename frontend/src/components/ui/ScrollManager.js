class ScrollManager {
    constructor() {
        this.scrollToTopButton = null
        this.currentPageContainer = null
        this.init()
    }
    
    init() {
        this.createScrollToTopButton()
        this.setupKeyboardNavigation()
    }
    
    createScrollToTopButton() {
        this.scrollToTopButton = document.createElement('button')
        this.scrollToTopButton.className = 'scroll-to-top'
        this.scrollToTopButton.innerHTML = '↑'
        this.scrollToTopButton.setAttribute('aria-label', 'Back to top')
        this.scrollToTopButton.setAttribute('title', 'Back to top')
        
        // Add click event
        this.scrollToTopButton.addEventListener('click', () => {
            this.scrollToTop()
        })
        
        document.body.appendChild(this.scrollToTopButton)
    }
    
    // Set current page scroll container
    setCurrentPageContainer(container) {
        this.currentPageContainer = container
        this.setupScrollListener()
    }
    
    setupScrollListener() {
        if (!this.currentPageContainer) return
        
        this.currentPageContainer.addEventListener('scroll', () => {
            this.handleScroll()
        })
    }
    
    handleScroll() {
        if (!this.currentPageContainer) return
        
        const scrollTop = this.currentPageContainer.scrollTop
        const showButtonThreshold = 200
        
        if (scrollTop > showButtonThreshold) {
            this.scrollToTopButton.classList.add('visible')
        } else {
            this.scrollToTopButton.classList.remove('visible')
        }
    }
    
    scrollToTop() {
        if (!this.currentPageContainer) return
        
        this.currentPageContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        
        // Add scroll animation effect
        this.addScrollEffect()
    }
    
    addScrollEffect() {
        const effect = document.createElement('div')
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100px;
            height: 100px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: scrollEffect 0.8s ease-out forwards;
        `
        
        const style = document.createElement('style')
        style.textContent = `
            @keyframes scrollEffect {
                0% {
                    width: 100px;
                    height: 100px;
                    opacity: 1;
                }
                100% {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
        `
        document.head.appendChild(style)
        document.body.appendChild(effect)
        
        setTimeout(() => {
            if (effect.parentNode) {
                document.body.removeChild(effect)
                document.head.removeChild(style)
            }
        }, 800)
    }
    
    // Setup keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Home key to go back to top
            if (e.key === 'Home' && this.currentPageContainer) {
                e.preventDefault()
                this.scrollToTop()
            }
            
            // End key to scroll to bottom
            if (e.key === 'End' && this.currentPageContainer) {
                e.preventDefault()
                this.scrollToBottom()
            }
            
            // Page Up/Down scrolling
            if (e.key === 'PageUp' && this.currentPageContainer) {
                e.preventDefault()
                this.scrollPage(-1)
            }
            
            if (e.key === 'PageDown' && this.currentPageContainer) {
                e.preventDefault()
                this.scrollPage(1)
            }
        })
    }
    
    scrollToBottom() {
        if (!this.currentPageContainer) return
        
        this.currentPageContainer.scrollTo({
            top: this.currentPageContainer.scrollHeight,
            behavior: 'smooth'
        })
    }
    
    scrollPage(direction) {
        if (!this.currentPageContainer) return
        
        const currentScroll = this.currentPageContainer.scrollTop
        const pageHeight = this.currentPageContainer.clientHeight
        const newScroll = currentScroll + (direction * pageHeight * 0.8)
        
        this.currentPageContainer.scrollTo({
            top: newScroll,
            behavior: 'smooth'
        })
    }
    
    // Hide scroll button
    hideScrollButton() {
        this.scrollToTopButton.classList.remove('visible')
        this.currentPageContainer = null
    }
    
    // Smooth scroll to specified element
    scrollToElement(selector) {
        if (!this.currentPageContainer) return
        
        const element = this.currentPageContainer.querySelector(selector)
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }
    }
    
    // Add scroll progress bar
    addScrollProgress(color = '#2196F3') {
        const progressBar = document.createElement('div')
        progressBar.className = 'scroll-progress'
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: ${color};
            width: 0%;
            z-index: 10001;
            transition: width 0.3s ease;
            box-shadow: 0 0 10px ${color};
        `
        
        document.body.appendChild(progressBar)
        
        if (this.currentPageContainer) {
            this.currentPageContainer.addEventListener('scroll', () => {
                const scrollTop = this.currentPageContainer.scrollTop
                const scrollHeight = this.currentPageContainer.scrollHeight - this.currentPageContainer.clientHeight
                const progress = (scrollTop / scrollHeight) * 100
                progressBar.style.width = `${Math.min(progress, 100)}%`
            })
        }
        
        return progressBar
    }
    
    // Remove scroll progress bar
    removeScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress')
        if (progressBar) {
            progressBar.remove()
        }
    }
}

export default ScrollManager 