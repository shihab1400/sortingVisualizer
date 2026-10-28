# Sorting Visualizer

Watch sorting algorithms work, one comparison and swap at a time.

Each bar is a number, and its height is the value. Pick an algorithm and watch the bars move into order. Purple bars are unsorted and green bars are in their final place. Every step plays a tone, and taller bars play higher notes.

Built with plain **HTML, CSS and JavaScript**, with no frameworks or libraries.

## Features

- 5 sorting algorithms: Bubble, Selection, Insertion, Merge and Quick Sort
- **Speed slider** to slow the animation down or speed it up
- **Bars slider** to sort anything from 15 to 60 bars
- **Unsort** button to shuffle and run again
- **Sound** for every step, made with the Web Audio API (no audio files), with a mute button

## Algorithms

| Algorithm      | Best       | Average    | Worst      | How it works                                                                      |
| -------------- | ---------- | ---------- | ---------- | --------------------------------------------------------------------------------- |
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | Swaps neighbours that are out of order, so the biggest values "bubble" to the end |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | Finds the smallest remaining value and moves it into place                        |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | Slides each new value back until it fits among the sorted ones                    |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | Splits the array in half, sorts each half, then merges them back together         |
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | Picks a pivot, puts smaller values to its left, then sorts each side              |

## How it works

A normal sorting loop finishes in a fraction of a millisecond, too fast to see. To animate it, each algorithm has to pause between steps:

- **Bubble, Selection and Insertion Sort** are written as step functions. Each `setInterval` tick runs one comparison or swap, and the loop variables are kept outside the function.
- **Merge and Quick Sort** are recursive, so they're hard to pause halfway through. They sort a copy of the array first and record every change as a "step". Then the steps are replayed on the bars, one per tick.

## Run it locally

No build step and nothing to install. Just open `index.html` in a browser.

## Project structure

```
index.html   page layout, sliders and buttons
styles.css   styling
favicon.svg  tab icon
index.js     bar generation, sorting algorithms and animation
```
