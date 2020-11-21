// Utils -------------------------------------------------------------------

function Utilities() {}

Utilities.prototype.getAlphabets = function (fromLetter, toLetter) {
  if (!fromLetter || !toLetter) return [];
  let i = fromLetter.charCodeAt(0);
  let j = toLetter.charCodeAt(0);
  let alphabets = [];

  for (; i <= j; ++i) alphabets.push(String.fromCharCode(i));
  return alphabets;
};

Utilities.prototype.count = function (content, letter) {
  if (!content || !letter) return;
  let count = 0;
  for (let i = 0; i < content.length; i++) {
    if (content[i] === letter) count++;
  }

  return count;
};

// Programs -------------------------------------------------------------------

function Program() {
  this.registerFileInput();
  this.registerSelectInput();
}

Program.prototype.registerSelectInput = function () {
  const chartTypeInput = document.getElementById("chartType");
  chartTypeInput.addEventListener("change", (e) => {
    const { value } = e.currentTarget;
    this.chartType = value;
    this.drawChart(this.occurrence || {});
  });
};

Program.prototype.registerFileInput = function () {
  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", (e) => {
    const { files } = e.currentTarget;
    if (!files || !files.length) {
      alert("No file has uploaded.");
      this.file = {};
      return;
    }

    // store file
    const file = files[0] || {};

    // read file
    const reader = new FileReader();
    reader.onload = (e) => {
      const { result } = e.currentTarget;
      const occurrence = this.getOccurrence(result);

      this.occurrence = occurrence;
      this.fillData(file, result);
      this.drawChart(occurrence);
    };
    reader.readAsText(file, "UTF-8");
  });
};

Program.prototype.getOccurrence = function (string) {
  if (!string || !string.length) return;

  const utils = new Utilities();
  const letters = utils.getAlphabets("a", "z");
  if (!letters || !letters.length) return;

  let occurrence = {};
  letters.forEach((x) => (occurrence[x] = utils.count(string, x)));
  return occurrence;
};

Program.prototype.fillData = function (file, result) {
  this.wordCount = result.length;
  this.file = {
    filename: file.name,
    size: file.size,
    type: file.type,
  };

  const wordCount = document.getElementsByClassName("wordCount")[0];
  wordCount.innerHTML = `${result.length} letters in total`;
};

Program.prototype.drawChart = async function (occurrence) {
  if (!occurrence) return;

  // parsed data
  const data = Object.keys(occurrence).map((x) => {
    return {
      key: x,
      value: occurrence[x],
      color:
        "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
    };
  });

  // create chart
  const ctx = document.getElementById("canvas").getContext("2d");
  new Chart(ctx, {
    type: this.chartType || "line",
    plugins: [ChartDataLabels],
    data: {
      labels: data.map((x) => x.key),
      datasets: [
        {
          borderWidth: 2,
          data: data.map((x) => x.value),
          backgroundColor: "rgba(73, 227, 212, 0.5)",
          borderColor: "#1f8077",
        },
      ],
    },
    // Configuration options go here
    options: {
      layout: {
        padding: {
          left: 50,
          right: 50,
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Frequency of Letters ${
          this.file ? `in ${this.file.filename}` : ""
        }`,
      },
      element: {
        point: {
          backgroundColor: data.map((x) => x.color),
          borderColor: data.map((x) => x.color),
        },
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, chart) {
            const { key, value } = data[tooltipItem.index];
            return value ? `${value} total of letter "${key}"` : "Not found";
          },
          labelColor: function (tooltipItem, chart) {
            const { color } = data[tooltipItem.index];
            return {
              borderColor: color,
              backgroundColor: color,
            };
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      plugins: {
        datalabels: {
          color: data.map((x) => x.color),
          backgroundColor: "white",
          borderRadius: 10,
          anchor: "end",
          align: "end",
          font: {
            weight: "bold",
            size: "14",
          },
        },
      },
    },
  });
};

const main = () => {
  const program = new Program();
  program.drawChart({});
};

main();
