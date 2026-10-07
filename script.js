document.addEventListener('DOMContentLoaded', () => {

  /* 1. CARROUSEL AUTOMÁTICO (SLIDER) DE BANNERS */
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  const intervalTime = 5000; // Cambia automáticamente cada 5 segundos

  if (slides.length > 0) {
    function goToSlide(index) {
      slides.forEach(s => s.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    let slideTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, intervalTime);

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        clearInterval(slideTimer);
        goToSlide(idx);
        slideTimer = setInterval(() => goToSlide(currentSlide + 1), intervalTime);
      });
    });
  }

  /* 2. PESTAÑAS (En cartelera, Preventa, Próximos estrenos) */
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;
      const cards = document.querySelectorAll('.movie-card');

      cards.forEach(card => {
        if (targetTab === 'all' || card.dataset.category === targetTab) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* 3. FILTRO DINÁMICO EN LA MISMA PÁGINA (INDEX) */
  const quickFilterForm = document.getElementById('quickFilterForm');
  if (quickFilterForm) {
    quickFilterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const movieVal = document.getElementById('filterMovie').value.toLowerCase();
      const formatVal = document.getElementById('filterFormat').value.toLowerCase();
      const cards = document.querySelectorAll('.movie-card');

      cards.forEach(card => {
        const title = card.querySelector('.movie-title').textContent.toLowerCase();
        const meta = card.querySelector('.movie-meta').textContent.toLowerCase();

        const matchMovie = !movieVal || title.includes(movieVal);
        const matchFormat = !formatVal || meta.includes(formatVal);

        if (matchMovie && matchFormat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

});


document.addEventListener('DOMContentLoaded', () => {

  /* GENERADOR Y LÓGICA DE SELECCIÓN DE ASIENTOS (ASIENTOS.HTML) */
  const seatsGrid = document.getElementById('seatsGrid');
  const ticketCount = document.getElementById('ticketCount');
  const selectedSeatsList = document.getElementById('selectedSeatsList');
  const totalPrice = document.getElementById('totalPrice');
  const btnContinuePay = document.getElementById('btnContinuePay');

  if (seatsGrid) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 14;
    const ticketUnitPrice = 15.00;
    const occupiedSeats = ['D4', 'D5', 'D6', 'D7', 'F5']; // Asientos ocupados en el prototipo

    let selectedSeats = [];

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
        seatBtn.className = 'seat';
        seatBtn.dataset.seatId = seatId;

        if (occupiedSeats.includes(seatId)) {
          seatBtn.classList.add('occupied');
        } else {
          seatBtn.addEventListener('click', () => {
            if (seatBtn.classList.contains('selected')) {
              seatBtn.classList.remove('selected');
              selectedSeats = selectedSeats.filter(id => id !== seatId);
            } else {
              seatBtn.classList.add('selected');
              selectedSeats.push(seatId);
            }
            updateSeatsSummary();
          });
        }
        seatsList.appendChild(seatBtn);
      }

      rowDiv.appendChild(seatsList);

      const labelRight = document.createElement('span');
      labelRight.className = 'row-label';
      labelRight.textContent = rowLabel;
      rowDiv.appendChild(labelRight);

      seatsGrid.appendChild(rowDiv);
    });

    function updateSeatsSummary() {
      const count = selectedSeats.length;
      ticketCount.textContent = count;

      if (count > 0) {
        selectedSeatsList.textContent = selectedSeats.join(', ');
        selectedSeatsList.style.color = 'var(--navy-dark)';
        const total = (count * ticketUnitPrice).toFixed(2);
        totalPrice.textContent = `$${total}`;
        btnContinuePay.classList.remove('btn-disabled');
      } else {
        selectedSeatsList.textContent = 'Ninguno seleccionado';
        selectedSeatsList.style.color = 'var(--text-secondary)';
        totalPrice.textContent = '$0.00';
        btnContinuePay.classList.add('btn-disabled');
      }
    }
  }

});

document.addEventListener('DOMContentLoaded', () => {

  /* 1. DIRECCIONAR BOTONES DE HORARIOS (.time-pill) A ASIENTOS.HTML */
  const timePills = document.querySelectorAll('.time-pill');
  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      window.location.href = 'asientos.html';
    });
  });

  /* 2. MANEJO DEL MODAL DE AUTENTICACIÓN / INICIO DE SESIÓN */
  const authModal = document.getElementById('authModal');
  const btnContinuePay = document.getElementById('btnContinuePay');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const openAuthModalHeader = document.getElementById('openAuthModalHeader');
  const loginForm = document.getElementById('loginForm');

  if (btnContinuePay && authModal) {
    btnContinuePay.addEventListener('click', (e) => {
      e.preventDefault();
      if (!btnContinuePay.classList.contains('btn-disabled')) {
        authModal.classList.add('active');
      }
    });
  }

  if (openAuthModalHeader && authModal) {
    openAuthModalHeader.addEventListener('click', (e) => {
      e.preventDefault();
      authModal.classList.add('active');
    });
  }

  if (closeAuthModal && authModal) {
    closeAuthModal.addEventListener('click', () => {
      authModal.classList.remove('active');
    });

    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) authModal.classList.remove('active');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'pago.html';
    });
  }

  /* 3. ENVIAR FORMULARIO DE REGISTRO -> DIRIGIR A PERFIL.HTML */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'perfil.html';
    });
  }

  /* 4. SELECCIÓN DE ASIENTOS CON FORMATEO EN SOLES (S/) */
  const seatsGrid = document.getElementById('seatsGrid');
  const ticketCount = document.getElementById('ticketCount');
  const selectedSeatsList = document.getElementById('selectedSeatsList');
  const totalPrice = document.getElementById('totalPrice');

  if (seatsGrid) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 14;
    const ticketUnitPrice = 15.00; // Precio unitario por entrada en S/
    const occupiedSeats = ['D4', 'D5', 'D6', 'D7', 'F5'];

    let selectedSeats = [];

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
        seatBtn.className = 'seat';
        seatBtn.dataset.seatId = seatId;

        if (occupiedSeats.includes(seatId)) {
          seatBtn.classList.add('occupied');
        } else {
          seatBtn.addEventListener('click', () => {
            if (seatBtn.classList.contains('selected')) {
              seatBtn.classList.remove('selected');
              selectedSeats = selectedSeats.filter(id => id !== seatId);
            } else {
              seatBtn.classList.add('selected');
              selectedSeats.push(seatId);
            }
            updateSeatsSummary();
          });
        }
        seatsList.appendChild(seatBtn);
      }

      rowDiv.appendChild(seatsList);

      const labelRight = document.createElement('span');
      labelRight.className = 'row-label';
      labelRight.textContent = rowLabel;
      rowDiv.appendChild(labelRight);

      seatsGrid.appendChild(rowDiv);
    });

    function updateSeatsSummary() {
      const count = selectedSeats.length;
      if (ticketCount) ticketCount.textContent = count;

      if (count > 0) {
        if (selectedSeatsList) {
          selectedSeatsList.textContent = selectedSeats.join(', ');
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
    }
  }

});

document.addEventListener('DOMContentLoaded', () => {

  /* 1. INYECTAR MODAL DE AUTENTICACIÓN DINÁMICAMENTE SI NO EXISTE EN EL DOM */
  function ensureAuthModalExists() {
    if (!document.getElementById('authModal')) {
      const modalHTML = `
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
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
  }

  ensureAuthModalExists();

  /* 2. CONTROL DEL MODAL Y RUTAS SEGÚN EL ORIGEN DEL CLIC */
  const authModal = document.getElementById('authModal');
  const closeAuthModal = document.getElementById('closeAuthModal');
  const loginForm = document.getElementById('loginForm');
  const btnContinuePay = document.getElementById('btnContinuePay');
  const userAccountBtns = document.querySelectorAll('.icon-btn[aria-label="Mi cuenta"], #openAuthModalHeader');

  let openedFromSeatFlow = false; // Flag para rastrear la procedencia

  // Actualiza estilo del botón del usuario si ya está logueado
  function updateUserIconState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    userAccountBtns.forEach(btn => {
      if (isLoggedIn) {
        btn.style.color = 'var(--yellow-accent)';
      } else {
        btn.style.color = '#ffffff';
      }
    });
  }

  updateUserIconState();

  // Abrir modal desde el ÍCONO DE USUARIO en el Header
  userAccountBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

      if (isLoggedIn) {
        // Si ya está logueado, ir directamente a su perfil
        window.location.href = 'perfil.html';
      } else {
        // Abrir modal indicando que NO viene del flujo de pago
        openedFromSeatFlow = false;
        authModal.classList.add('active');
      }
    });
  });

  // Abrir modal desde "Continuar al pago" en asientos.html
  if (btnContinuePay) {
    btnContinuePay.addEventListener('click', (e) => {
      e.preventDefault();
      if (!btnContinuePay.classList.contains('btn-disabled')) {
        openedFromSeatFlow = true; // Viene del flujo de compra
        authModal.classList.add('active');
      }
    });
  }

  // Cerrar Modal
  if (closeAuthModal) {
    closeAuthModal.addEventListener('click', () => {
      authModal.classList.remove('active');
    });
  }

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) {
        authModal.classList.remove('active');
      }
    });
  }

  // Enviar Login: Comportamiento según el origen
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'true');
      updateUserIconState();

      if (openedFromSeatFlow) {
        // Si venía de seleccionar asientos -> ir a Pago
        window.location.href = 'pago.html';
      } else {
        // Si hizo clic en el ícono de usuario -> cerrar modal y permanecer en la página actual
        authModal.classList.remove('active');
      }
    });
  }

  /* 3. DIRECCIONAR BOTONES DE HORARIOS A ASIENTOS.HTML */
  const timePills = document.querySelectorAll('.time-pill');
  timePills.forEach(pill => {
    pill.addEventListener('click', () => {
      window.location.href = 'asientos.html';
    });
  });

  /* 4. FORMULARIO DE REGISTRO -> DIRIGIR A PERFIL */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = 'perfil.html';
    });
  }

  /* 5. LOGOUT / CERRAR SESIÓN EN PERFIL.HTML */
  const logoutBtn = document.querySelector('.profile-menu-item.logout a');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
    });
  }

  /* 6. LÓGICA DE SELECCIÓN DE ASIENTOS Y TOTALES EN SOLES (S/) */
  const seatsGrid = document.getElementById('seatsGrid');
  const ticketCount = document.getElementById('ticketCount');
  const selectedSeatsList = document.getElementById('selectedSeatsList');
  const totalPrice = document.getElementById('totalPrice');

  if (seatsGrid) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 14;
    const ticketUnitPrice = 85.00;
    const occupiedSeats = ['D4', 'D5', 'D6', 'D7', 'F5'];

    let selectedSeats = [];

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
        seatBtn.className = 'seat';
        seatBtn.dataset.seatId = seatId;

        if (occupiedSeats.includes(seatId)) {
          seatBtn.classList.add('occupied');
        } else {
          seatBtn.addEventListener('click', () => {
            if (seatBtn.classList.contains('selected')) {
              seatBtn.classList.remove('selected');
              selectedSeats = selectedSeats.filter(id => id !== seatId);
            } else {
              seatBtn.classList.add('selected');
              selectedSeats.push(seatId);
            }
            updateSeatsSummary();
          });
        }
        seatsList.appendChild(seatBtn);
      }

      rowDiv.appendChild(seatsList);

      const labelRight = document.createElement('span');
      labelRight.className = 'row-label';
      labelRight.textContent = rowLabel;
      rowDiv.appendChild(labelRight);

      seatsGrid.appendChild(rowDiv);
    });

    function updateSeatsSummary() {
      const count = selectedSeats.length;
      if (ticketCount) ticketCount.textContent = count;

      if (count > 0) {
        if (selectedSeatsList) {
          selectedSeatsList.textContent = selectedSeats.join(', ');
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
    }
  }

});

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. INYECCIÓN AUTOMÁTICA DE MODALES (LOGIN Y BÚSQUEDA)
     -------------------------------------------------------------------------- */
  function ensureModalsExist() {
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

            <div class="search-results-list" id="searchResultsContainer">
              <!-- Resultados dinámicos -->
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', searchHTML);
    }
  }

  ensureModalsExist();

  /* --------------------------------------------------------------------------
     2. BASE DE DATOS DE PELÍCULAS PARA EL BUSCADOR
     -------------------------------------------------------------------------- */
  const moviesCatalog = [
    {
      title: 'Álbum de Familia',
      genre: 'Drama',
      format: 'IMAX, 2D, 4DX',
      duration: '1h 34m',
      url: 'pelicula_nombredepelicula.html',
      image: 'posters/albumdefamilia.jpg'
    },
    {
      title: 'Código: Venganza',
      genre: 'Acción',
      format: 'IMAX, 2D, 4DX',
      duration: '1h 35m',
      url: 'pelicula_nombredepelicula.html',
      image: 'posters/codigovenganza.jpg'
    },
    {
      title: 'Coyote vs Acme',
      genre: 'Animación, Familiar',
      format: '2D, 3D',
      duration: '1h 41m',
      url: 'pelicula_nombredepelicula.html',
      image: 'posters/coyotevsacme.jpg'
    },
    {
      title: 'Hechizo de amor: La magia continúa',
      genre: 'Fantasía, Drama, Romance',
      format: '2D',
      duration: '2h 10m',
      url: 'pelicula_nombredepelicula.html',
      image: 'posters/hechizodeamor.jpg'
    },
    {
      title: 'La odisea',
      genre: 'Acción, Aventura, Fantasía',
      format: 'IMAX, 3D, 4DX',
      duration: '1h 44m',
      url: 'pelicula_nombredepelicula.html',
      image: 'posters/laodisea.jpg'
    },
    {
      title: 'Flor Pucarina',
      genre: 'Documental, Musical',
      format: '2D, 3D',
      duration: '1h 30m',
      url: 'pelicula_nombredepelicula.html',
      image: 'posters/flordepucarina.jpg'
    }
  ];

  /* --------------------------------------------------------------------------
     3. LÓGICA Y EVENTOS DEL MODAL DE BÚSQUEDA
     -------------------------------------------------------------------------- */
  const searchModal = document.getElementById('searchModal');
  const closeSearchModal = document.getElementById('closeSearchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResultsContainer = document.getElementById('searchResultsContainer');
  const searchBtns = document.querySelectorAll('.icon-btn[aria-label="Buscar"]');

  // Función para renderizar lista de resultados
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

  // Abrir Modal de Búsqueda al presionar el ícono de la Lupa
  searchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('active');
      renderSearchResults(moviesCatalog); // Muestra todas al inicio
      setTimeout(() => searchInput.focus(), 100);
    });
  });

  // Filtrar en tiempo real conforme el usuario escribe
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

  // Cerrar Modal de Búsqueda
  if (closeSearchModal) {
    closeSearchModal.addEventListener('click', () => searchModal.classList.remove('active'));
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     4. CONTROL DEL MODAL DE USUARIO Y LOGIN
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

  if (closeAuthModal) closeAuthModal.addEventListener('click', () => authModal.classList.remove('active'));

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
     5. NAVEGACIÓN GENERAL Y REGISTRO
     -------------------------------------------------------------------------- */
  const timePills = document.querySelectorAll('.time-pill');
  timePills.forEach(pill => {
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
     6. SELECCIÓN DE ASIENTOS Y TOTALES EN SOLES (S/)
     -------------------------------------------------------------------------- */
  const seatsGrid = document.getElementById('seatsGrid');
  const ticketCount = document.getElementById('ticketCount');
  const selectedSeatsList = document.getElementById('selectedSeatsList');
  const totalPrice = document.getElementById('totalPrice');

  if (seatsGrid) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 14;
    const ticketUnitPrice = 85.00;
    const occupiedSeats = ['D4', 'D5', 'D6', 'D7', 'F5'];

    let selectedSeats = [];

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
        seatBtn.className = 'seat';
        seatBtn.dataset.seatId = seatId;

        if (occupiedSeats.includes(seatId)) {
          seatBtn.classList.add('occupied');
        } else {
          seatBtn.addEventListener('click', () => {
            if (seatBtn.classList.contains('selected')) {
              seatBtn.classList.remove('selected');
              selectedSeats = selectedSeats.filter(id => id !== seatId);
            } else {
              seatBtn.classList.add('selected');
              selectedSeats.push(seatId);
            }
            updateSeatsSummary();
          });
        }
        seatsList.appendChild(seatBtn);
      }

      rowDiv.appendChild(seatsList);

      const labelRight = document.createElement('span');
      labelRight.className = 'row-label';
      labelRight.textContent = rowLabel;
      rowDiv.appendChild(labelRight);

      seatsGrid.appendChild(rowDiv);
    });

    function updateSeatsSummary() {
      const count = selectedSeats.length;
      if (ticketCount) ticketCount.textContent = count;

      if (count > 0) {
        if (selectedSeatsList) {
          selectedSeatsList.textContent = selectedSeats.join(', ');
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
    }
  }

});
document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. INYECCIÓN AUTOMÁTICA DE COMPONENTES MÓVILES Y MODALES
     -------------------------------------------------------------------------- */
  function ensureMobileAndModalsExist() {
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

    // Inyectar Telón de Fondo (Backdrop) para el menú móvil
    if (!document.getElementById('navBackdrop')) {
      const backdropHTML = `<div class="nav-backdrop" id="navBackdrop"></div>`;
      document.body.insertAdjacentHTML('beforeend', backdropHTML);
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

  ensureMobileAndModalsExist();

  /* --------------------------------------------------------------------------
     2. LÓGICA DEL MENÚ HAMBURGUESA MÓVIL
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mainNav = document.querySelector('.main-nav');
  const navBackdrop = document.getElementById('navBackdrop');

  function toggleMobileMenu() {
    const isOpen = mainNav.classList.contains('active');
    if (isOpen) {
      mainNav.classList.remove('active');
      navBackdrop.classList.remove('active');
    } else {
      mainNav.classList.add('active');
      navBackdrop.classList.add('active');
    }
  }

  if (hamburgerBtn && mainNav && navBackdrop) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    navBackdrop.addEventListener('click', toggleMobileMenu);

    // Cerrar el menú si se presiona un enlace
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        navBackdrop.classList.remove('active');
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. BASE DE DATOS Y LÓGICA DEL BUSCADOR GLOBAL
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
      setTimeout(() => searchInput.focus(), 100);
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

  if (closeSearchModal) closeSearchModal.addEventListener('click', () => searchModal.classList.remove('active'));

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) searchModal.classList.remove('active');
    });
  }

  /* --------------------------------------------------------------------------
     4. CONTROL DEL MODAL DE USUARIO Y AUTENTICACIÓN
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

  if (closeAuthModal) closeAuthModal.addEventListener('click', () => authModal.classList.remove('active'));

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
     5. NAVEGACIÓN Y REGISTRO
     -------------------------------------------------------------------------- */
  const timePills = document.querySelectorAll('.time-pill');
  timePills.forEach(pill => {
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
     6. SELECCIÓN DE ASIENTOS CON SCROLL RESPONSIVO
     -------------------------------------------------------------------------- */
  const seatsGrid = document.getElementById('seatsGrid');
  const ticketCount = document.getElementById('ticketCount');
  const selectedSeatsList = document.getElementById('selectedSeatsList');
  const totalPrice = document.getElementById('totalPrice');

  if (seatsGrid) {
    // Envolver seatsGrid en un contenedor con overflow suave para móviles
    if (!seatsGrid.parentElement.classList.contains('seats-grid-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'seats-grid-wrapper';
      seatsGrid.parentNode.insertBefore(wrapper, seatsGrid);
      wrapper.appendChild(seatsGrid);
    }

    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 14;
    const ticketUnitPrice = 85.00;
    const occupiedSeats = ['D4', 'D5', 'D6', 'D7', 'F5'];

    let selectedSeats = [];

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
        seatBtn.className = 'seat';
        seatBtn.dataset.seatId = seatId;

        if (occupiedSeats.includes(seatId)) {
          seatBtn.classList.add('occupied');
        } else {
          seatBtn.addEventListener('click', () => {
            if (seatBtn.classList.contains('selected')) {
              seatBtn.classList.remove('selected');
              selectedSeats = selectedSeats.filter(id => id !== seatId);
            } else {
              seatBtn.classList.add('selected');
              selectedSeats.push(seatId);
            }
            updateSeatsSummary();
          });
        }
        seatsList.appendChild(seatBtn);
      }

      rowDiv.appendChild(seatsList);

      const labelRight = document.createElement('span');
      labelRight.className = 'row-label';
      labelRight.textContent = rowLabel;
      rowDiv.appendChild(labelRight);

      seatsGrid.appendChild(rowDiv);
    });

    function updateSeatsSummary() {
      const count = selectedSeats.length;
      if (ticketCount) ticketCount.textContent = count;

      if (count > 0) {
        if (selectedSeatsList) {
          selectedSeatsList.textContent = selectedSeats.join(', ');
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
    }
  }

});