'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function() {
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // })
  section1.scrollIntoView({behavior: 'smooth'});

});

/***** navigation *****/
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
})

const nav = document.querySelector('.nav');

const handleOver = function(e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
}

nav.addEventListener('mouseover', handleOver.bind(0.5));
nav.addEventListener('mouseout', handleOver.bind(1));

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const stickyNavObserver = new IntersectionObserver(
  stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
  }
)

stickyNavObserver.observe(header);

/***** tabbed component *****/
const operationsTabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const operationsContent = document.querySelectorAll('.operations__content');

operationsTabContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  if(!clicked) return;

  // resetting all values
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  operationsContent.forEach(o => o.classList.remove('operations__content--active'));

  // setting the active values
  clicked.classList.add('operations__tab--active');
  const data = clicked.dataset.tab;
  document.querySelector(`.operations__content--${data}`)
  .classList.add('operations__content--active');
});

/***** revealing elements on scroll *****/
const allSections = document.querySelectorAll('section');

const sectionObserverFunc = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
  console.log(entry);
}

const sectionObserver = new IntersectionObserver(
  sectionObserverFunc, {
    root: null,
    threshold: 0.15
  }
);

allSections.forEach(s => {
  s.classList.add('section--hidden');
  sectionObserver.observe(s);
});

/*****  Lazy Loading Images *****/
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));

/****** SLIDER COMPONENT ******/

const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');

  slides.forEach((s, i) => (s.style.transform = `translateX(${100*i}%)`));

  let curSlide = 0;

  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const createDots = function() {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML('beforeend', 
      `<button class="dots__dot" data-slide=${i}></button>`);
    }) 
  }

  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot')
    .forEach(d => d.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
  }

  const goToSlide = function(slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${(i - slide)*100}%)`));
    activateDot(curSlide);
  }

  const nextSlide = function() {
    if(curSlide === slides.length - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
  }

  const prevSlide = function() {
    if(curSlide === 0) {
      curSlide = slides.length - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  }

  const init = function() {
    createDots();
    activateDot(0);
    goToSlide(0);
  }

  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function(e){
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotsContainer.addEventListener('click', function(e) {
    if(e.target.classList.contains('dots__dot')){
      const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}
slider();