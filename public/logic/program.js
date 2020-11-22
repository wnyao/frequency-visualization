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
  this.display = new Display();
  this.display.drawChart({});

  this.registerFileInput();
  this.registerSelectInput();
}

Program.prototype.registerSelectInput = function () {
  const chartTypeInput = document.getElementById("chartType");
  chartTypeInput.addEventListener("change", (e) => {
    const { value } = e.currentTarget;
    this.display.drawChart(this.occurrence, value, this.file);
  });
};

Program.prototype.registerFileInput = function () {
  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener(
    "change",
    async (e) => {
      // reset ui
      this.display.reset();

      const { files } = e.currentTarget;
      if (!files || !files.length) {
        alert("No file has uploaded.");
        return;
      }

      this.file = files[0] || {};
      const reader = new FileReader();
      reader.onload = async (e) => {
        let { result } = e.currentTarget;
        console.log("result: ", result);
        console.log("this.file: ", this.file);

        // rtf handler
        if (this.file.type.includes("rtf")) {
          const doc = new RTFJS.Document(result);
          const htmlElement = await doc.render();
          result = htmlElement[0].innerText;
        }

        // docs handler
        if (this.file.type.includes("wordprocessingml")) {
          result = (await mammoth.extractRawText({ arrayBuffer: result }))
            .value;
        }

        // pdf handler
        if (this.file.type.includes("pdf")) {
          const sentences = await this.readPDF(result);
          result = sentences.join(" ");
        }

        if (typeof result !== "string") return;
        const occurrence = this.getOccurrence(result);
        this.occurrence = occurrence;
        this.display.drawData(result, this.file);
        this.display.drawChart(occurrence, this.chartType || "line", this.file);
      };

      reader.onprogress = (e) => {
        const { loaded, total } = e;
        if (!loaded || !total) return;
        const percent = Math.round((loaded / total) * 100);
        this.display.drawProgress(percent);
      };

      reader.readAsArrayBuffer(this.file);
    },
    false
  );
};

Program.prototype.readPDF = async function (result) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

  // REFER: https://mozilla.github.io/pdf.js/examples/index.html#interactive-examples
  const pdf = await pdfjsLib.getDocument(result).promise;
  const { numPages } = pdf;

  // get sentences
  let sentences = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const { items } = await page.getTextContent();
    sentences = sentences.concat(items.map((x) => x.str));
  }

  return sentences;
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

// Display -------------------------------------------------------------------

function Display() {}

Display.prototype.reset = function () {
  const chartTypeInput = document.getElementById("chartType");
  chartTypeInput.value = "line";

  const ul = document.getElementsByClassName("statsParent")[0];
  ul.innerHTML = "";

  const progress = document.getElementsByClassName("progress")[0];
  progress.style.display = "none";

  const bar = document.getElementsByClassName("bar")[0];
  bar.style.width = `0%`;

  const label = document.getElementsByClassName("label")[0];
  label.innerHTML = `0%`;
};

Display.prototype.drawData = function (result, file) {
  const data = {
    Filename: file.name,
    Size: `${file.size} bytes`,
    "Word Count": `${result.split(" ").length} word count`,
    "Letter Count": `${result.length} letter count`,
  };

  const stats = document.getElementsByClassName("stats")[0];
  stats.style.display = "flex";

  const ul = document.getElementsByClassName("statsParent")[0];
  for (let i in data) {
    const li = document.createElement("li");
    li.innerHTML = data[i];
    li.className = "smallText";
    ul.appendChild(li);
  }
};

Display.prototype.drawProgress = function (percent) {
  const progress = document.getElementsByClassName("progress")[0];
  progress.style.display = "block";

  const bar = document.getElementsByClassName("bar")[0];
  bar.style.width = `${percent}%`;

  const label = document.getElementsByClassName("label")[0];
  label.innerHTML = `${percent}%`;
};

Display.prototype.drawChart = async function (occurrence, type, file) {
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

  // remove old canvas
  const oldCanvas = document.getElementsByClassName("canvas")[0];
  oldCanvas && oldCanvas.remove();

  // create canvas
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  canvas.className = "canvas";

  // append canvas
  const chart = document.getElementsByClassName("chart")[0];
  chart.appendChild(canvas);

  new Chart(ctx, {
    type: type || "line",
    plugins: [ChartDataLabels],
    data: {
      labels: data.map((x) => x.key),
      datasets: [
        {
          borderWidth: 2,
          data:
            type !== "bubble"
              ? data.map((x) => x.value)
              : data.map((x) => ({
                  x: x.value,
                  y: x.value,
                  r: Math.abs(x.value) / 2,
                })),
          backgroundColor: "rgba(31, 128, 119, 0.5)",
          borderColor: "#1f8077",
        },
      ],
    },
    // Configuration options go here
    options: {
      maintainAspectRatio: true,
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
        text: `Frequency of Letters ${file ? `in ${file.name}` : ""}`,
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
            return value ? `Total of ${value} letter "${key}"` : "Not found";
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
          formatter: function (value, context) {
            return type !== "bubble"
              ? value
              : context.chart.data.labels[context.dataIndex];
          },
        },
      },
    },
  });
};

const main = () => {
  new Program();
};

main();
