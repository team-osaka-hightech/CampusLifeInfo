async function loadTimetable() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/your-username/your-repository/main/timetable.json');
    const data = await response.json();

    const tbody = document.querySelector('#timetable tbody');
    
    // ここで時間割データをHTMLに変換しています
    // ただし、具体的な形式はデータと要件によって異なる可能性があります
    for (const id of Object.keys(data).sort()) {
      const row = document.createElement('tr');
      const period = document.createElement('td');
      period.textContent = id.slice(-2);
      row.appendChild(period);
      for (let grade = 1; grade <= 3; grade++) {
        const cell = document.createElement('td');
        if (id.includes(grade.toString())) {
          cell.textContent = data[id].subject;
        }
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
  } catch (error) {
    console.error('Error loading timetable:', error);
  }
}

loadTimetable();
