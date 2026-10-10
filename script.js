document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. INYECCIÓN AUTOMÁTICA DE COMPONENTES (MODALES Y MENÚ MÓVIL)
     -------------------------------------------------------------------------- */
  function ensureComponentsExist() {
    const headerUtils = document.querySelector('.header-utilities');
    
    // Inyectar Botón Hamburguesa si no existe
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

    // Inyectar Telón de Fondo (Backdrop) para menú móvil
    if (!document.getElementById('navBackdrop')) {
      document.body.insertAdjacentHTML('beforeend', `<div class="nav-backdrop" id="navBackdrop"></div>`);
    }

    // Inyectar Modal de Autenticación
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

    // Inyectar Modal de Búsqueda
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

  /* --------------------------------------------------------------------------
     2. SLIDER, PESTAÑAS Y FILTRO RÁPIDO (INICIO / CATALOGO)
     -------------------------------------------------------------------------- */
  // Carousel automático
  const slides = document.querySelectorAll('.carousel-slide'); //
  const dots = document.querySelectorAll('.dot'); //
  if (slides.length > 0) {
    let currentSlide = 0; //[cite: 7]
    const intervalTime = 5000; //[cite: 7]

    function goToSlide(index) {
      slides.forEach(s => s.classList.remove('active')); //[cite: 7]
      dots.forEach(d => d.classList.remove('active')); //[cite: 7]
      currentSlide = (index + slides.length) % slides.length; //[cite: 7]
      slides[currentSlide].classList.add('active'); //[cite: 7]
      if (dots[currentSlide]) dots[currentSlide].classList.add('active'); //[cite: 7]
    }

    let slideTimer = setInterval(() => goToSlide(currentSlide + 1), intervalTime); //[cite: 7]

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(slideTimer); //[cite: 7]
        goToSlide(idx); //[cite: 7]
        slideTimer = setInterval(() => goToSlide(currentSlide + 1), intervalTime); //[cite: 7]
      });
    });
  }

  // Pestañas (Cartelera / Próximos estrenos)[cite: 7]
  const tabBtns = document.querySelectorAll('.tab-btn'); //[cite: 7]
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active')); //[cite: 7]
      btn.classList.add('active'); //[cite: 7]

      const targetTab = btn.dataset.tab; //[cite: 7]
      document.querySelectorAll('.movie-card').forEach(card => {
        if (targetTab === 'all' || card.dataset.category === targetTab) { //[cite: 7]
          card.classList.remove('hidden'); //[cite: 7]
        } else {
          card.classList.add('hidden'); //[cite: 7]
        }
      });
    });
  });

  // Filtro Rápido en Inicio[cite: 7]
  const quickFilterForm = document.getElementById('quickFilterForm'); //[cite: 7]
  if (quickFilterForm) {
    quickFilterForm.addEventListener('submit', (e) => {
      e.preventDefault(); //[cite: 7]
      const movieVal = document.getElementById('filterMovie')?.value.toLowerCase() || ''; //[cite: 7]
      const formatVal = document.getElementById('filterFormat')?.value.toLowerCase() || ''; //[cite: 7]

      document.querySelectorAll('.movie-card').forEach(card => {
        const title = card.querySelector('.movie-title')?.textContent.toLowerCase() || ''; //[cite: 7]
        const meta = card.querySelector('.movie-meta')?.textContent.toLowerCase() || ''; //[cite: 7]
        const matchMovie = !movieVal || title.includes(movieVal); //[cite: 7]
        const matchFormat = !formatVal || meta.includes(formatVal); //[cite: 7]

        card.classList.toggle('hidden', !(matchMovie && matchFormat)); //[cite: 7]
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. MENÚ HAMBURGUESA MÓVIL
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.querySelector('.main-nav');
  const navBackdrop = document.getElementById('navBackdrop');

  if (hamburgerBtn && mainNav && navBackdrop) {
    const toggleMobileMenu = () => {
      const isOpen = mainNav.classList.contains('active');
      mainNav.classList.toggle('active', !isOpen);
      navBackdrop.classList.toggle('active', !isOpen);
    };

    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    navBackdrop.addEventListener('click', toggleMobileMenu);

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        navBackdrop.classList.remove('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. BUSCADOR GLOBAL DE PELÍCULAS EN TIEMPO REAL
     -------------------------------------------------------------------------- */
  const moviesCatalog = [
    {
      title: 'Álbum de Familia',
      genre: 'Drama',
      format: 'IMAX, 2D, 4DX',
      duration: '1h 34m',
      url: 'pelicula_nombredepelicula.html',
      image: 'https://via.placeholder.com/300x450/1e293b/ffffff?text=Album+de+Familia'
    },
    {
      title: 'Código: Venganza',
      genre: 'Acción',
      format: 'IMAX, 2D, 4DX',
      duration: '1h 35m',
      url: 'pelicula_nombredepelicula.html',
      image: 'https://via.placeholder.com/300x450/0f172a/ffffff?text=Codigo+Venganza'
    },
    {
      title: 'Coyote vs Acme',
      genre: 'Animación, Familiar',
      format: '2D, 3D',
      duration: '1h 41m',
      url: 'pelicula_nombredepelicula.html',
      image: 'https://via.placeholder.com/300x450/334155/ffffff?text=Coyote+vs+Acme'
    },
    {
      title: 'Hechizo de amor: La magia continúa',
      genre: 'Fantasía, Drama, Romance',
      format: '2D',
      duration: '2h 10m',
      url: 'pelicula_nombredepelicula.html',
      image: 'https://via.placeholder.com/300x450/475569/ffffff?text=Hechizo+de+Amor'
    },
    {
      title: 'La odisea',
      genre: 'Acción, Aventura, Fantasía',
      format: 'IMAX, 3D, 4DX',
      duration: '1h 44m',
      url: 'pelicula_nombredepelicula.html',
      image: 'https://via.placeholder.com/300x450/0284c7/ffffff?text=La+Odisea'
    },
    {
      title: 'Flor Pucarina',
      genre: 'Documental, Musical',
      format: '2D, 3D',
      duration: '1h 30m',
      url: 'pelicula_nombredepelicula.html',
      image: 'https://via.placeholder.com/300x450/15803d/ffffff?text=Flor+Pucarina'
    }
  ];

  const searchModal = document.getElementById('searchModal');
  const closeSearchModal = document.getElementById('closeSearchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const searchBtns = document.querySelectorAll('.icon-btn[aria-label="Buscar"]');

  function renderSearchResults(filteredMovies) {
    if (!searchResultsContainer) return;

    if (filteredMovies.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="search-no-results">
          <p>No se encontraron películas que coincidan.</p>
        </div>
      `;
      return;
    }

    searchResultsContainer.innerHTML = filteredMovies.map(movie => `
      <a href="${movie.url}" class="search-result-item">
        <img src="${movie.image}" alt="${movie.title}" class="search-result-thumb">
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
      searchModal.classList.add('active');
      renderSearchResults(moviesCatalog);
      setTimeout(() => searchInput?.focus(), 100);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = moviesCatalog.filter(movie => 
        movie.title.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query)
      );
      renderSearchResults(filtered);
    });
  }

  if (closeSearchModal) {
    closeSearchModal.addEventListener('click', () => searchModal.classList.remove('active'));
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     5. AUTENTICACIÓN Y SESIÓN (MODAL Y RUTAS SEGÚN EL ORIGEN)
     -------------------------------------------------------------------------- */
  const authModal = document.getElementById('authModal');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const loginForm = document.getElementById('loginForm');
  const btnContinuePay = document.getElementById('btnContinuePay');
  const userAccountBtns = document.querySelectorAll('.icon-btn[aria-label="Mi cuenta"], #openAuthModalHeader');

  let openedFromSeatFlow = false;

  function updateUserIconState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    userAccountBtns.forEach(btn => {
      btn.style.color = isLoggedIn ? 'var(--yellow-accent)' : '#ffffff';
    });
  }

  updateUserIconState();

  userAccountBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'perfil.html';
      } else {
        openedFromSeatFlow = false;
        authModal.classList.add('active');
      }
    });
  });

  if (btnContinuePay) {
    btnContinuePay.addEventListener('click', (e) => {
      e.preventDefault();
      if (!btnContinuePay.classList.contains('btn-disabled')) {
        openedFromSeatFlow = true;
        authModal.classList.add('active');
      }
    });
  }

  if (closeAuthModal) {
    closeAuthModal.addEventListener('click', () => authModal.classList.remove('active'));
  }

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) authModal.classList.remove('active');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'true');
      updateUserIconState();

      if (openedFromSeatFlow) {
        window.location.href = 'pago.html';
      } else {
        authModal.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     6. RUTAS GENERALES Y PERFIL/REGISTRO
     -------------------------------------------------------------------------- */
  document.querySelectorAll('.time-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      window.location.href = 'asientos.html';
    });
  });

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'perfil.html';
    });
  }

  const logoutBtn = document.querySelector('.profile-menu-item.logout a');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
    });
  }

  /* --------------------------------------------------------------------------
     7. SELECCIÓN DE ASIENTOS CON RESPONSIVIDAD Y PRECIOS EN SOLES (S/)
     -------------------------------------------------------------------------- */
  const seatsGrid = document.getElementById('seatsGrid'); //[cite: 7]
  const ticketCount = document.getElementById('ticketCount'); //[cite: 7]
  const selectedSeatsList = document.getElementById('selectedSeatsList'); //[cite: 7]
  const totalPrice = document.getElementById('totalPrice'); //[cite: 7]

  if (seatsGrid) {
    // Envolver seatsGrid en un contenedor con overflow suave para móviles
    if (!seatsGrid.parentElement.classList.contains('seats-grid-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'seats-grid-wrapper';
      seatsGrid.parentNode.insertBefore(wrapper, seatsGrid);
      wrapper.appendChild(seatsGrid);
    }

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']; //[cite: 7]
    const seatsPerRow = 14; //[cite: 7]
    const ticketUnitPrice = 85.00; // Precio unitario por entrada en S/[cite: 7]
    const occupiedSeats = ['D4', 'D5', 'D6', 'D7', 'F5']; //[cite: 7]

    let selectedSeats = []; //[cite: 7]

    rows.forEach(rowLabel => {
      const rowDiv = document.createElement('div'); //[cite: 7]
      rowDiv.className = 'seat-row'; //[cite: 7]

      const labelLeft = document.createElement('span'); //[cite: 7]
      labelLeft.className = 'row-label'; //[cite: 7]
      labelLeft.textContent = rowLabel; //[cite: 7]
      rowDiv.appendChild(labelLeft); //[cite: 7]

      const seatsList = document.createElement('div'); //[cite: 7]
      seatsList.className = 'seats-list'; //[cite: 7]

      for (let i = 1; i <= seatsPerRow; i++) {
        const seatBtn = document.createElement('button'); //[cite: 7]
        const seatId = `${rowLabel}${i}`; //[cite: 7]
        seatBtn.className = 'seat'; //[cite: 7]
        seatBtn.dataset.seatId = seatId; //[cite: 7]

        if (occupiedSeats.includes(seatId)) {
          seatBtn.classList.add('occupied'); //[cite: 7]
        } else {
          seatBtn.addEventListener('click', () => {
            if (seatBtn.classList.contains('selected')) {
              seatBtn.classList.remove('selected'); //[cite: 7]
              selectedSeats = selectedSeats.filter(id => id !== seatId); //[cite: 7]
            } else {
              seatBtn.classList.add('selected'); //[cite: 7]
              selectedSeats.push(seatId); //[cite: 7]
            }
            updateSeatsSummary(); //[cite: 7]
          });
        }
        seatsList.appendChild(seatBtn); //[cite: 7]
      }

      rowDiv.appendChild(seatsList); //[cite: 7]

      const labelRight = document.createElement('span'); //[cite: 7]
      labelRight.className = 'row-label'; //[cite: 7]
      labelRight.textContent = rowLabel; //[cite: 7]
      rowDiv.appendChild(labelRight); //[cite: 7]

      seatsGrid.appendChild(rowDiv); //[cite: 7]
    });

    function updateSeatsSummary() {
      const count = selectedSeats.length; //[cite: 7]
      if (ticketCount) ticketCount.textContent = count; //[cite: 7]

      if (count > 0) {
        if (selectedSeatsList) {
          selectedSeatsList.textContent = selectedSeats.join(', '); //[cite: 7]
          selectedSeatsList.style.color = 'var(--navy-dark)'; //[cite: 7]
        }
        if (totalPrice) totalPrice.textContent = `S/ ${(count * ticketUnitPrice).toFixed(2)}`; //[cite: 7]
        if (btnContinuePay) btnContinuePay.classList.remove('btn-disabled'); //[cite: 7]
      } else {
        if (selectedSeatsList) {
          selectedSeatsList.textContent = 'Ninguno seleccionado'; //[cite: 7]
          selectedSeatsList.style.color = 'var(--text-secondary)'; //[cite: 7]
        }
        if (totalPrice) totalPrice.textContent = 'S/ 0.00'; //[cite: 7]
        if (btnContinuePay) btnContinuePay.classList.add('btn-disabled'); //[cite: 7]
      }
    }
  }

});
