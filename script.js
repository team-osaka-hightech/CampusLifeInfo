let displayMode = '1week';

async function loadTimetable() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/team-osaka-hightech/CampusLifeInfo/main/2023s_timetable.json');
    const data = await response.json();

    const container = document.getElementById('timetable-container');
    
    const dates = [...new Set(Object.keys(data).map(id => id.slice(0, 8)))];
    for (const date of dates.sort()) {
      const dateHeader = document.createElement('div');
      dateHeader.classList.add('date-header');
      dateHeader.textContent = `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6, 8)}`;
      container.appendChild(dateHeader);

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      const headRow = document.createElement('tr');

      ['時限', '1年生', '2年生', '3年生'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headRow.appendChild(th);
      });

      thead.appendChild(headRow);
      table.appendChild(thead);
      table.appendChild(tbody);
      container.appendChild(table);

      for (let period = 1; period <= 4; period++) {
        const row = document.createElement('tr');
        const periodCell = document.createElement('td');
        periodCell.textContent = `${period}限`;
        row.appendChild(periodCell);

        for (let grade = 1; grade <= 3; grade++) {
          const id = `${date}${grade}${period}`;
          const cell = document.createElement('td');
          if (data[id]) {
            cell.innerHTML = `
              <strong>${data[id].subject}</strong><br>
              ${data[id].teacher ? data[id].teacher : ''}${data[id].teacher && data[id].room ? ', ' : ''}${data[id].room ? data[id].room : ''}
            `;
          }
          row.appendChild(cell);
        }
        tbody.appendChild(row);
      }
    }
  } catch (error) {
    console.error('Error loading timetable:', error);
  }

  setDisplayMode(displayMode);  // 初期表示設定
}

function setDisplayMode(mode) {
  displayMode = mode;
  const container = document.getElementById('timetable-container');
  const tables = container.querySelectorAll('table');
  const today = new Date();
  const startOfWeek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
  const endOfWeek = startOfWeek + 6;

  tables.forEach(table => {
    const dateHeader = table.previousSibling;
    const dateMatch = dateHeader.textContent.match(/(\d{4})\/(\d{2})\/(\d{2})/);
    const tableDate = new Date(dateMatch[1], dateMatch[2] - 1, dateMatch[3]);

    switch (mode) {
      case '1week':
        if (tableDate >= new Date(today.getFullYear(), today.getMonth(), startOfWeek) &&
            tableDate <= new Date(today.getFullYear(), today.getMonth(), endOfWeek)) {
          table.style.display = '';
          dateHeader.style.display = '';
        } else {
          table.style.display = 'none';
          dateHeader.style.display = 'none';
        }
        break;
      case '2week':
        if (tableDate >= new Date(today.getFullYear(), today.getMonth(), startOfWeek) &&
            tableDate <= new Date(today.getFullYear(), today.getMonth(), endOfWeek + 7)) {
          table.style.display = '';
          dateHeader.style.display = '';
        } else {
          table.style.display = 'none';
          dateHeader.style.display = 'none';
        }
        break;
      case 'all':
        table.style.display = '';
        dateHeader.style.display = '';
        break;
      }
  });
}

loadTimetable();
