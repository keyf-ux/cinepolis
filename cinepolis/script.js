/**
 * CINÉPOLIS PERÚ - CORE JS OPTIMIZADO PARA INP & PERFORMANCE
 */
document.addEventListener('DOMContentLoaded', () => {

  /* 1. INYECCIÓN PASIVA Y DIFERIDA DE COMPONENTES */
  function ensureComponentsExist() {
    const headerUtils = document.querySelector('.header-utilities');
    
    if (headerUtils && !document.getElementById('hamburgerBtn')) {
      const burgerHTML = `
        <button class="icon-btn hamburger-btn" id="hamburgerBtn" aria-label="Abrir menú">
          <svg class="icon-svg" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      `;
      headerUtils.insertAdjacentHTML('beforeend', burgerHTML);
    }

    if (!document.getElementById('navBackdrop')) {
      document.body.insertAdjacentHTML('beforeend', `<div class="nav-backdrop" id="navBackdrop"></div>`);
    }

    if (!document.getElementById('authModal')) {
      const authHTML = `
        <div class="modal-overlay" id="authModal">
          <div class="modal-card">
            <button class="modal-close" id="closeAuthModal">&times;</button>
            <h2 class="modal-title">Bienvenido a CineTicket</h2>
            <p class="modal-subtitle">Inicia sesión para acumular puntos y acceder a beneficios.</p>

            <form class="modal-form" id="loginForm">
              <div class="form-group">
                <label style="display:block; font-size:0.75rem; font-weight:800; margin-bottom:0.3rem; color:var(--navy-dark);">DNI</label>
                <div class="input-with-icon">
                  <span class="input-icon">
                    <svg class="icon-svg" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </span>
                  <input type="text" class="input-field" placeholder="Tu número de documento" required>
                </div>
              </div>

              <div class="form-group">
                <label style="display:block; font-size:0.75rem; font-weight:800; margin-bottom:0.3rem; color:var(--navy-dark);">Contraseña</label>
                <div class="input-with-icon">
                  <span class="input-icon">
                    <svg class="icon-svg" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </span>
                  <input type="password" class="input-field" placeholder="••••••••" required>
                </div>
              </div>

              <a href="#" class="modal-link-forgot">¿Olvidaste tu contraseña?</a>
              <button type="submit" class="btn-pill-navy" style="margin-top: 0.5rem;">Ingresar</button>
            </form>

            <p class="modal-footer-text">
              ¿No eres socio? <a href="registro.html">Regístrate aquí</a>
            </p>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', authHTML);
    }

    if (!document.getElementById('searchModal')) {
      const searchHTML = `
        <div class="modal-overlay" id="searchModal">
          <div class="search-modal-card">
            <button class="modal-close" id="closeSearchModal">&times;</button>
            <h2 class="modal-title" style="font-size: 1.3rem;">Buscar Película</h2>
            <div class="search-input-wrapper">
              <span class="input-icon">
                <svg class="icon-svg" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input type="text" class="search-input-field" id="searchInput" placeholder="Escribe el nombre de la película o género..." autocomplete="off">
            </div>
            <div class="search-results-list" id="searchResultsContainer"></div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', searchHTML);
    }
  }

  ensureComponentsExist();

  /* 2. CAROUSEL AUTOMÁTICO EFICIENTE CON REQUESTANIMATIONFRAME */
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  if (slides.length > 0) {
    let currentSlide = 0;
    const intervalTime = 5000;

    function goToSlide(index) {
      requestAnimationFrame(() => {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
      });
    }

    let slideTimer = setInterval(() => goToSlide(currentSlide + 1), intervalTime);

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(slideTimer);
        goToSlide(idx);
        slideTimer = setInterval(() => goToSlide(currentSlide + 1), intervalTime);
      }, { passive: true });
    });
  }

  /* 3. PESTAÑAS (CARTELERA / PREVENTA / PRÓXIMOS ESTRENOS) */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const movieCards = document.querySelectorAll('.movie-card');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = btn.dataset.tab || 'en-cartelera';

        requestAnimationFrame(() => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          movieCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (targetTab === 'all' || cardCategory === targetTab) {
              card.classList.remove('hidden');
            } else {
              card.classList.add('hidden');
            }
          });
        });
      });
    });
  }

  /* 4. MENÚ HAMBURGUESA MÓVIL */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.querySelector('.main-nav');
  const navBackdrop = document.getElementById('navBackdrop');

  if (hamburgerBtn && mainNav && navBackdrop) {
    const toggleMobileMenu = () => {
      requestAnimationFrame(() => {
        const isOpen = mainNav.classList.contains('active');
        mainNav.classList.toggle('active', !isOpen);
        navBackdrop.classList.toggle('active', !isOpen);
      });
    };

    hamburgerBtn.addEventListener('click', toggleMobileMenu, { passive: true });
    navBackdrop.addEventListener('click', toggleMobileMenu, { passive: true });
  }

  /* 5. BUSCADOR GLOBAL CON DEBOUNCE (OPTIMIZACIÓN INP) */
  const moviesCatalog = [
    { title: 'Álbum de Familia', genre: 'Drama', duration: '1h 34m', url: 'pelicula_nombredepelicula.html', image: 'posters/albumdefamilia.jpg' },
    { title: 'Código: Venganza', genre: 'Acción', duration: '1h 35m', url: 'pelicula_nombredepelicula.html', image: 'posters/codigovenganza.jpg' },
    { title: 'Coyote vs Acme', genre: 'Animación, Familiar', duration: '1h 41m', url: 'pelicula_nombredepelicula.html', image: 'posters/coyotevsacme.jpg' },
    { title: 'Hechizo de amor: La magia continúa', genre: 'Fantasía, Drama, Romance', duration: '2h 10m', url: 'pelicula_nombredepelicula.html', image: 'posters/hechizodeamor.jpg' },
    { title: 'La odisea', genre: 'Acción, Aventura, Fantasía', duration: '1h 44m', url: 'pelicula_nombredepelicula.html', image: 'posters/laodisea.jpg' },
    { title: 'Flor Pucarina', genre: 'Documental, Musical', duration: '1h 30m', url: 'pelicula_nombredepelicula.html', image: 'posters/flordepucarina.jpg' }
  ];

  const searchModal = document.getElementById('searchModal');
  const closeSearchModal = document.getElementById('closeSearchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const searchBtns = document.querySelectorAll('.icon-btn[aria-label="Buscar"]');

  function renderSearchResults(filteredMovies) {
    if (!searchResultsContainer) return;
    if (filteredMovies.length === 0) {
      searchResultsContainer.innerHTML = `<div class="search-no-results"><p>No se encontraron películas.</p></div>`;
      return;
    }
    searchResultsContainer.innerHTML = filteredMovies.map(movie => `
      <a href="${movie.url}" class="search-result-item">
        <img src="${movie.image}" alt="${movie.title}" class="search-result-thumb" width="50" height="72" loading="lazy">
        <div class="search-result-info">
          <h3 class="search-result-title">${movie.title}</h3>
          <span class="search-result-meta">${movie.genre} &nbsp;•&nbsp; ⏱ ${movie.duration}</span>
        </div>
      </a>
    `).join('');
  }

  searchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal?.classList.add('active');
      renderSearchResults(moviesCatalog);
      setTimeout(() => searchInput?.focus(), 50);
    });
  });

  if (closeSearchModal) {
    closeSearchModal.addEventListener('click', () => searchModal?.classList.remove('active'));
  }

  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.toLowerCase().trim();
      debounceTimer = setTimeout(() => {
        const filtered = moviesCatalog.filter(movie => 
          movie.title.toLowerCase().includes(query) ||
          movie.genre.toLowerCase().includes(query)
        );
        renderSearchResults(filtered);
      }, 150);
    });
  }

  /* 6. AUTENTICACIÓN */
  const authModal = document.getElementById('authModal');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const loginForm = document.getElementById('loginForm');
  const btnContinuePay = document.getElementById('btnContinuePay');
  const userAccountBtns = document.querySelectorAll('.icon-btn[aria-label="Mi cuenta"], #openAuthModalHeader');
  let openedFromSeatFlow = false;

  userAccountBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'perfil.html';
      } else {
        openedFromSeatFlow = false;
        authModal?.classList.add('active');
      }
    });
  });

  if (btnContinuePay) {
    btnContinuePay.addEventListener('click', (e) => {
      e.preventDefault();
      if (!btnContinuePay.classList.contains('btn-disabled')) {
        openedFromSeatFlow = true;
        authModal?.classList.add('active');
      }
    });
  }

  if (closeAuthModal) {
    closeAuthModal.addEventListener('click', () => authModal?.classList.remove('active'));
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'true');
      if (openedFromSeatFlow) {
        window.location.href = 'pago.html';
      } else {
        authModal?.classList.remove('active');
      }
    });
  }

  /* 7. ASIENTOS CON EVENT DELEGATION PARA INP RÁPIDO (<50MS) */
  const seatsGrid = document.getElementById('seatsGrid');
  const ticketCount = document.getElementById('ticketCount');
  const selectedSeatsList = document.getElementById('selectedSeatsList');
  const totalPrice = document.getElementById('totalPrice');

  if (seatsGrid) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 22;
    const ticketUnitPrice = 15.00;
    const occupiedSeats = new Set(['D4', 'D5', 'D6', 'D7', 'F5']);
    const selectedSeats = new Set();

    // Renderizado eficiente con DocumentFragment
    const fragment = document.createDocumentFragment();

    rows.forEach(rowLabel => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'seat-row';

      const labelLeft = document.createElement('span');
      labelLeft.className = 'row-label';
      labelLeft.textContent = rowLabel;
      rowDiv.appendChild(labelLeft);

      const seatsList = document.createElement('div');
      seatsList.className = 'seats-list';

      for (let i = 1; i <= seatsPerRow; i++) {
        const seatBtn = document.createElement('button');
        const seatId = `${rowLabel}${i}`;
        seatBtn.className = 'seat' + (occupiedSeats.has(seatId) ? ' occupied' : '');
        seatBtn.dataset.seatId = seatId;
        seatBtn.type = 'button';
        seatsList.appendChild(seatBtn);
      }

      rowDiv.appendChild(seatsList);

      const labelRight = document.createElement('span');
      labelRight.className = 'row-label';
      labelRight.textContent = rowLabel;
      rowDiv.appendChild(labelRight);

      fragment.appendChild(rowDiv);
    });

    seatsGrid.appendChild(fragment);

    // Delegación de eventos única en lugar de cientos de listeners
    seatsGrid.addEventListener('click', (e) => {
      const target = e.target;
      if (!target.classList.contains('seat') || target.classList.contains('occupied')) return;

      const seatId = target.dataset.seatId;
      if (selectedSeats.has(seatId)) {
        selectedSeats.delete(seatId);
        target.classList.remove('selected');
      } else {
        selectedSeats.add(seatId);
        target.classList.add('selected');
      }

      // Batch DOM update
      requestAnimationFrame(() => {
        const count = selectedSeats.size;
        if (ticketCount) ticketCount.textContent = count;
        if (count > 0) {
          if (selectedSeatsList) {
            selectedSeatsList.textContent = Array.from(selectedSeats).join(', ');
            selectedSeatsList.style.color = 'var(--navy-dark)';
          }
          if (totalPrice) totalPrice.textContent = `S/ ${(count * ticketUnitPrice).toFixed(2)}`;
          if (btnContinuePay) btnContinuePay.classList.remove('btn-disabled');
        } else {
          if (selectedSeatsList) {
            selectedSeatsList.textContent = 'Ninguno seleccionado';
            selectedSeatsList.style.color = 'var(--text-secondary)';
          }
          if (totalPrice) totalPrice.textContent = 'S/ 0.00';
          if (btnContinuePay) btnContinuePay.classList.add('btn-disabled');
        }
      });
    }, { passive: true });
  }

});