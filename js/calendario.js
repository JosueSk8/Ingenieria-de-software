document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('http://localhost:3000/eventos');
  const eventos = await res.json();

  const dias = document.querySelectorAll('.calendar-days .day');

  function formatoFecha(dia) {
    const mes = '06';
    const anio = '2025';
    return `${anio}-${mes}-${dia.toString().padStart(2, '0')}`;
  }

  // Crear modal para mostrar eventos
  const modal = document.createElement('div');
  modal.id = 'modalEventos';
  modal.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: #1d1d2a;
    padding: 25px;
    border-radius: 12px;
    width: 300px;
    max-height: 70vh;
    overflow-y: auto;
    color: #ffcb05;
    box-shadow: 0 0 15px #ffcb05cc;
    font-family: 'Raleway', sans-serif;
    text-align: center;
  `;

  const titulo = document.createElement('h3');
  titulo.textContent = 'Eventos del día';
  titulo.style.marginBottom = '15px';

  const listaEventos = document.createElement('ul');
  listaEventos.style.listStyle = 'none';
  listaEventos.style.padding = '0';
  listaEventos.style.marginBottom = '20px';

  const btnCerrar = document.createElement('button');
  btnCerrar.textContent = 'Cerrar';
  btnCerrar.style.cssText = `
    background: #ffcb05;
    color: #1d1d2a;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    transition: background-color 0.3s;
  `;
  btnCerrar.onmouseenter = () => btnCerrar.style.backgroundColor = '#e6b703';
  btnCerrar.onmouseleave = () => btnCerrar.style.backgroundColor = '#ffcb05';

  btnCerrar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modalContent.appendChild(titulo);
  modalContent.appendChild(listaEventos);
  modalContent.appendChild(btnCerrar);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Agregar clase amarilla a días con eventos
  dias.forEach(diaElem => {
    const diaNum = diaElem.textContent.trim();
    const fechaDia = formatoFecha(diaNum);
    const eventosDelDia = eventos.filter(ev => ev.fechaInicio <= fechaDia && ev.fechaFin >= fechaDia);

    if (eventosDelDia.length > 0) {
      diaElem.classList.add('event-day');
      diaElem.style.cursor = 'pointer';
    }
  });

  // Evento para mostrar modal al hacer click en un día
  dias.forEach(diaElem => {
    diaElem.addEventListener('click', () => {
      const diaNum = diaElem.textContent.trim();
      const fechaClick = formatoFecha(diaNum);

      const eventosDelDia = eventos.filter(ev => ev.fechaInicio <= fechaClick && ev.fechaFin >= fechaClick);

      listaEventos.innerHTML = '';

      if (eventosDelDia.length === 0) {
        listaEventos.innerHTML = '<li>No hay eventos para este día.</li>';
      } else {
        eventosDelDia.forEach(ev => {
          const li = document.createElement('li');
          li.textContent = `${ev.nombre} (${ev.horaInicio})`;
          li.style.padding = '8px 0';
          li.style.borderBottom = '1px solid #444';
          listaEventos.appendChild(li);
        });
      }

      modal.style.display = 'flex';
    });
  });
});
