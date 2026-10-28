var btnBubbleSort = document.querySelector(".bubble-sort");
var btnSelectionSort = document.querySelector(".selection-sort");
var btnInsertionSort = document.querySelector(".insertion-sort");
var btnMergeSort = document.querySelector(".merge-sort");
var btnQuickSort = document.querySelector(".quick-sort");
var btnUnsort = document.querySelector(".btn-unsort");
var btnSound = document.querySelector(".btn-sound");
var myInterval;
var heightArray = [];
var c = 0;
var rnHeight;
var unsortColor = "linear-gradient(to top, #6366f1, #a855f7)";
var sortColor = "linear-gradient(to top, #10b981, #22d3ee)";
var intervalTime;
var barCount = 50;
var speedSlider = document.getElementById("speed-controller");
var barContainer = document.querySelector(".bar-container");
var barSlider = document.getElementById("bar-controller");
var bars;

intervalTime = 100 - speedSlider.value;

speedSlider.oninput = function () {
   intervalTime = 100 - this.value;
};

barCount = barSlider.value;
barSlider.oninput = function () {
   barCount = this.value;
   barContainer.innerHTML = "";
   heightArray = [];
   c = 0;
   controlBar();
};

controlBar();
function controlBar() {
   for (var i = 0; i < barCount; i++) {
      barContainer.innerHTML += `<div class="bars"></div>`;
   }
   bars = document.querySelectorAll(".bars");
   unsort();
}

// Sounds are generated with the Web Audio API, so there are no audio files.
// Browsers only allow audio after the user interacts with the page, so the
// AudioContext is created on the first click.
var audioCtx;
var soundOn = true;

document.addEventListener("click", () => {
   if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
   }
   if (audioCtx.state === "suspended") audioCtx.resume();
});

btnSound.addEventListener("click", () => {
   soundOn = !soundOn;
   btnSound.textContent = soundOn ? "Sound: On" : "Sound: Off";
});

function playNote(frequency, delay) {
   if (!soundOn || !audioCtx) return;
   var start = audioCtx.currentTime + delay;
   var osc = audioCtx.createOscillator();
   var gain = audioCtx.createGain();
   osc.type = "triangle";
   osc.frequency.value = frequency;
   gain.gain.setValueAtTime(0.08, start);
   gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);
   osc.connect(gain).connect(audioCtx.destination);
   osc.start(start);
   osc.stop(start + 0.1);
}

// Taller bars play higher notes (bar heights range from 5 to 40)
function playTone(height) {
   playNote(200 + height * 25, 0);
}

// A short rising C-E-G-C chime when a sort finishes
function playFinish() {
   [523, 659, 784, 1047].forEach((frequency, k) => {
      playNote(frequency, k * 0.08);
   });
}

function unsort() {
   bars.forEach((bar) => {
      rnHeight = Math.floor(Math.random() * 35) + 5;
      heightArray[c++] = rnHeight;
      bar.style.height = `${rnHeight}rem`;
      bar.style.background = unsortColor;
   });
}

btnUnsort.addEventListener("click", () => {
   c = 0;
   unsort();
   btnEnable();
});

btnBubbleSort.addEventListener("click", () => {
   btnDisable();
   myInterval = setInterval(bubbleSort, intervalTime);
});

var i = 0;
var j = 0;
var temp;
function bubbleSort() {
   playTone(heightArray[j]);
   if (heightArray[j] > heightArray[j + 1]) {
      temp = heightArray[j];
      heightArray[j] = heightArray[j + 1];
      heightArray[j + 1] = temp;
      bars[j].style.height = `${heightArray[j]}rem`;
      bars[j + 1].style.height = `${heightArray[j + 1]}rem`;
   }
   j++;
   if (j == heightArray.length - i - 1) {
      bars[j].style.background = sortColor;
      i++;
      j = 0;
   }
   if (i == heightArray.length - 1) {
      bars[0].style.background = sortColor;
      clearInterval(myInterval);
      playFinish();
      i = 0;
      j = 0;
      btnUnsort.disabled = false;
   }
}

btnSelectionSort.addEventListener("click", () => {
   btnDisable();
   myInterval = setInterval(selectionSort, intervalTime);
});

var ii = 0;
var jj = ii + 1;
var min = ii;
var t;
function selectionSort() {
   playTone(heightArray[jj]);
   if (heightArray[min] > heightArray[jj]) {
      min = jj;
   }
   jj++;
   if (jj === heightArray.length) {
      t = heightArray[ii];
      heightArray[ii] = heightArray[min];
      heightArray[min] = t;
      bars[ii].style.height = `${heightArray[ii]}rem`;
      bars[min].style.height = `${heightArray[min]}rem`;
      bars[ii].style.background = sortColor;
      ii++;
      min = ii;
      jj = ii + 1;
   }
   if (ii === heightArray.length - 1) {
      bars[ii].style.background = sortColor;
      clearInterval(myInterval);
      playFinish();
      ii = 0;
      jj = ii + 1;
      min = ii;
      btnUnsort.disabled = false;
   }
}

btnInsertionSort.addEventListener("click", () => {
   btnDisable();
   myInterval = setInterval(insertionSort, intervalTime);
});

var ttt;
var iii = 1;
var jjj = iii;
function insertionSort() {
   playTone(heightArray[jjj]);
   if (heightArray[jjj - 1] > heightArray[jjj]) {
      ttt = heightArray[jjj - 1];
      heightArray[jjj - 1] = heightArray[jjj];
      heightArray[jjj] = ttt;
      bars[jjj].style.height = `${heightArray[jjj]}rem`;
      bars[jjj - 1].style.height = `${heightArray[jjj - 1]}rem`;
      jjj--;
   } else {
      iii++;
      jjj = iii;
   }
   bars[jjj - 1].style.background = sortColor;
   if (iii == heightArray.length) {
      bars[iii - 1].style.background = sortColor;
      clearInterval(myInterval);
      playFinish();
      iii = 1;
      jjj = iii;
      btnUnsort.disabled = false;
   }
}

// Merge Sort and Quick Sort are recursive, so they can't be split into
// one step per tick like the sorts above. Instead they run on a copy of
// the array first and record every change as a step, then playSteps()
// replays those steps on the bars, one per tick.
var steps = [];
var stepIndex = 0;

function playSteps() {
   if (stepIndex < steps.length) {
      playTone(steps[stepIndex][0].value);
      steps[stepIndex++].forEach((change) => {
         heightArray[change.index] = change.value;
         bars[change.index].style.height = `${change.value}rem`;
         if (change.sorted) {
            bars[change.index].style.background = sortColor;
         }
      });
   }
   if (stepIndex === steps.length) {
      bars.forEach((bar) => {
         bar.style.background = sortColor;
      });
      clearInterval(myInterval);
      playFinish();
      steps = [];
      stepIndex = 0;
      btnUnsort.disabled = false;
   }
}

btnMergeSort.addEventListener("click", () => {
   btnDisable();
   steps = [];
   stepIndex = 0;
   mergeSort(heightArray.slice(), 0, heightArray.length - 1);
   myInterval = setInterval(playSteps, intervalTime);
});

function mergeSort(arr, lo, hi) {
   if (lo >= hi) return;
   var mid = Math.floor((lo + hi) / 2);
   mergeSort(arr, lo, mid);
   mergeSort(arr, mid + 1, hi);

   var merged = [];
   var a = lo;
   var b = mid + 1;
   while (a <= mid && b <= hi) {
      merged.push(arr[a] <= arr[b] ? arr[a++] : arr[b++]);
   }
   while (a <= mid) merged.push(arr[a++]);
   while (b <= hi) merged.push(arr[b++]);

   // Bars only reach their final place during the last, full-array merge
   var isFinalMerge = lo === 0 && hi === arr.length - 1;
   for (var k = 0; k < merged.length; k++) {
      arr[lo + k] = merged[k];
      steps.push([{ index: lo + k, value: merged[k], sorted: isFinalMerge }]);
   }
}

btnQuickSort.addEventListener("click", () => {
   btnDisable();
   steps = [];
   stepIndex = 0;
   quickSort(heightArray.slice(), 0, heightArray.length - 1);
   myInterval = setInterval(playSteps, intervalTime);
});

function quickSort(arr, lo, hi) {
   if (lo > hi) return;
   if (lo === hi) {
      steps.push([{ index: lo, value: arr[lo], sorted: true }]);
      return;
   }

   // Lomuto partition: the last bar is the pivot
   var pivot = arr[hi];
   var p = lo;
   for (var k = lo; k < hi; k++) {
      if (arr[k] < pivot) {
         if (k !== p) swapStep(arr, k, p);
         p++;
      }
   }
   if (p !== hi) swapStep(arr, p, hi);
   steps.push([{ index: p, value: arr[p], sorted: true }]);

   quickSort(arr, lo, p - 1);
   quickSort(arr, p + 1, hi);
}

function swapStep(arr, a, b) {
   var temp = arr[a];
   arr[a] = arr[b];
   arr[b] = temp;
   steps.push([
      { index: a, value: arr[a] },
      { index: b, value: arr[b] },
   ]);
}

function btnDisable() {
   btnBubbleSort.disabled = true;
   btnSelectionSort.disabled = true;
   btnInsertionSort.disabled = true;
   btnMergeSort.disabled = true;
   btnQuickSort.disabled = true;
   btnUnsort.disabled = true;
   speedSlider.disabled = true;
   barSlider.disabled = true;
}

function btnEnable() {
   btnBubbleSort.disabled = false;
   btnSelectionSort.disabled = false;
   btnInsertionSort.disabled = false;
   btnMergeSort.disabled = false;
   btnQuickSort.disabled = false;
   speedSlider.disabled = false;
   barSlider.disabled = false;
}
