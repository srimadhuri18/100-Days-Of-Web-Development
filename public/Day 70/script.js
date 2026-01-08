let dataChart;

// Color schemes
const chartColors = {
    vibrant: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
    pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA'],
    mono: ['#6C757D', '#ADB5BD', '#CED4DA'],
    earth: ['#795548', '#A1887F', '#BCAAA4']
};

// Datasets
const datasets = {
    sales: {
        labels: ['Jan','Feb','Mar','Apr'],
        data: [450,620,750,430],
        description: 'Monthly sales data'
    },
    expenses: {
        labels: ['Rent','Salaries','Marketing'],
        data: [12000,45000,8500],
        description: 'Company expenses'
    },
    population: {
        labels: ['New York','LA','Chicago'],
        data: [8398748,3990456,2705994],
        description: 'City population'
    },
    performance: {
        labels: ['Alex','Jamie','Taylor'],
        data: [85,92,78],
        description: 'Team performance'
    },
    custom: {
        labels: [],
        data: [],
        description: 'Custom data'
    },
    uploaded: {
        labels: [],
        data: [],
        description: 'Uploaded CSV dataset'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    setupEventListeners();
    updateDataTable();
});

// ---------------- CHART ----------------

function initializeChart() {
    const ctx = document.getElementById('data-chart').getContext('2d');
    let chartType = document.getElementById('chart-type').value;
    const datasetKey = document.getElementById('dataset').value;
    const scheme = document.getElementById('color-scheme').value;

    const currentData = datasets[datasetKey];

    // 🔽 ADD THIS BLOCK HERE
    const MAX_VISIBLE = 200;

    const labels =
        currentData.labels.length > MAX_VISIBLE
            ? currentData.labels.slice(0, MAX_VISIBLE)
            : currentData.labels;

    const data =
        currentData.data.length > MAX_VISIBLE
            ? currentData.data.slice(0, MAX_VISIBLE)
            : currentData.data;
    // 🔼 END ADDITION

    if (dataChart) dataChart.destroy();

    dataChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,        // 👈 USE THESE
            datasets: [{
                label: 'Values',
                data: data,        // 👈 USE THESE
                backgroundColor: chartColors[scheme],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


// ---------------- EVENTS ----------------

function setupEventListeners() {
    document.getElementById('update-chart').addEventListener('click', () => {
        initializeChart();
        updateDataTable();
    });

    document.getElementById('export-chart').addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = document.getElementById('data-chart').toDataURL();
        link.click();
    });

    document.getElementById('random-data').addEventListener('click', () => {
        const key = document.getElementById('dataset').value;
        datasets[key].data = datasets[key].data.map(
            () => Math.floor(Math.random() * 1000)
        );
        initializeChart();
        updateDataTable();
    });

    document.getElementById('apply-custom-data').addEventListener('click', () => {
        const labels = document.getElementById('custom-labels').value.split(',').map(s => s.trim());
        const values = document.getElementById('custom-values').value.split(',').map(Number);

        datasets.custom.labels = labels;
        datasets.custom.data = values;

        document.getElementById('dataset').value = 'custom';
        initializeChart();
        updateDataTable();
    });

    document.getElementById('file-upload').addEventListener('change', handleUpload);
}

// ---------------- CSV UPLOAD ----------------

function handleUpload(e) {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.csv')) {
        alert('Only CSV files allowed');
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        const rows = reader.result.trim().split('\n');

        if (rows.length > 4000) {
            alert('Max 4000 rows allowed');
            return;
        }

        const labels = [];
        const values = [];

        // Detect header row
        let startIndex = 0;
        const firstRowCols = rows[0].split(',');

        if (isNaN(firstRowCols[1])) {
            // Header detected → skip it
            startIndex = 1;
        }

        for (let i = startIndex; i < rows.length; i++) {
            const cols = rows[i].split(',');

            if (cols.length < 2) {
                alert('Each row must have at least 2 columns');
                return;
            }

            const col1 = cols[0].trim();
            const col2 = cols[1].trim();

            const num2 = Number(col2);

            if (isNaN(num2)) {
                alert('Second column must be numeric');
                return;
            }

            // If first column is numeric, still allow it
            labels.push(col1);
            values.push(num2);
        }

        if (labels.length === 0) {
            alert('No valid data rows found');
            return;
        }

        datasets.uploaded.labels = labels;
        datasets.uploaded.data = values;

        const datasetSelect = document.getElementById('dataset');
        if (![...datasetSelect.options].some(o => o.value === 'uploaded')) {
            datasetSelect.add(new Option('Uploaded Dataset', 'uploaded'));
        }

        datasetSelect.value = 'uploaded';

        initializeChart();
        updateDataTable();
    };

    reader.readAsText(file);
}


function updateDataTable() {
    const tbody = document.querySelector('#data-table tbody');
    const key = document.getElementById('dataset').value;
    const data = datasets[key];

    tbody.innerHTML = '';

    data.labels.forEach((label, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${label}</td>
            <td>${data.data[i]}</td>
            <td>-</td>
        `;
        tbody.appendChild(row);
    });
}
