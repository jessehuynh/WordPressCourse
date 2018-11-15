import $ from 'jquery';

class Search {
    constructor(){
        this.searchHTML();
        this.openButton = $('.js-search-trigger');
        this.closeButton = $('.search-overlay__close');
        this.overlay = $('.search-overlay');
        this.searchField = $('#search-term');
        this.events();
        this.isOpen = false;
        this.typingTimer;
        this.results = $('#search-overlay__results');
        this.isSpinning = false;
        this.previousValue;
    }
    events(){
        this.openButton.on('click', this.open.bind(this))
        this.closeButton.on('click', this.close.bind(this))
        $(document).on('keydown', this.keyPress.bind(this))
        this.searchField.on('keyup', this.typing.bind(this))
    }
    open(){
        this.overlay.addClass('search-overlay--active');
        $('body').addClass('body-no-scroll')
        this.searchField.val(' ')
        setTimeout(() => this.searchField.focus(), 301)
        this.isOpen = true;
        return false
    }
    close(){
        this.overlay.removeClass('search-overlay--active')
        $('body').removeClass('body-no-scroll')
        this.isOpen = false;
    }
    keyPress(e){
        if(e.keyCode === 83 && !this.isOpen && !$('input, textarea').is(':focus')){
            this.open()
        } 
        
        if (e.keyCode === 27 && this.isOpen) {
            this.close()
        } 

    }
    typing(){
        if(this.searchField.val() != this.previousValue){
            clearTimeout(this.typingTimer);
            if(this.searchField.val()){
                if(!this.isSpinning) {
                    this.results.html('<div class="spinner-loader"></div>')
                    this.isSpinning = true;
                }
                this.typingTimer = setTimeout(this.getResults.bind(this), 750);
            } else {
                this.results.html('')
                this.isSpinning = false;
            }
        }
        
        this.previousValue = this.searchField.val()
    }
    getResults(){
        $.getJSON(`${universityData.root_url}/wp-json/university/v1/search?term=${this.searchField.val()}`, res => {
            this.results.html(`
                <div class="row">
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${res.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that search</p>'}
                        ${res.generalInfo.map((item) => `<li><a href="${item.url}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`).join(' ')}
                        ${res.generalInfo.length ? '</ul>' : ''}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Programs</h2>
                        ${res.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href=${universityData.root_url}/programs>View All Programs</a></p>`}
                        ${res.programs.map((item) => `<li><a href="${item.url}">${item.title}</a></li>`).join(' ')}
                        ${res.programs.length ? '</ul>' : ''}

                        <h2 class="search-overlay__section-title">Professors</h2>    
                        ${res.professors.length ? '<ul class="professor-cards">' : '<p>No professors match that search</p>'}
                        ${res.professors.map((item) => `
                            <li class="professor-card__list-item">
                                <a class="professor-card" href="${item.url}">
                                    <img class="professor-card__image" src="${item.image}">
                                    <span class="professor-card__name">${item.title}</span>
                                </a>
                            </li>
                        `).join(' ')}
                        ${res.professors.length ? '</ul>' : ''}    

                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Campuses</h2>
                        ${res.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search. <a href=${universityData.root_url}/campuses>View Our Campuses</a></p>`}
                        ${res.campuses.map((item) => `<li><a href="${item.url}">${item.title}</a></li>`).join(' ')}
                        ${res.campuses.length ? '</ul>' : ''}

                        <h2 class="search-overlay__section-title">Events</h2>
                        ${res.events.length ? '' : `<p>No events match that search</p>. <a href=${universityData.root_url}/events>View All Events</a></p>`}
                        ${res.events.map((item) => `
                        <div class="event-summary">
                            <a class="event-summary__date t-center" href="${item.url}">
                                <span class="event-summary__month">
                                    ${item.month}
                                </span>
                                <span class="event-summary__day">
                                    ${item.day}
                                </span>  
                            </a>
                            <div class="event-summary__content">
                                <h5 class="event-summary__title headline headline--tiny"><a href="${item.url}">${item.title}</a></h5>
                                <p>${item.description} <a href="${item.url}" class="nu gray">Learn more</a></p>
                            </div>
                        </div>
                        `).join(' ')}

                    </div>
                </div>
            `);
            this.isSpinning = false;
        })
    }
    searchHTML() {
        $('body').append(`
        <div class="search-overlay">
            <div class="search-overlay__top">
                <div class="container">
                    <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
                    <input type="search" class="search-term" placeholder="What are you looking for?" id="search-term">
                    <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
                </div>
            </div>
            <div class="container">
            <div id="search-overlay__results"></div>
        </div>
      </div>`)
    }
}

export default Search;