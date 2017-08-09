# watson-machine-learning
An implimentation of a genetic algorithm for capture-app.

The goal of this project was to create an algorithm that would take the Watson data from [capture-app](https://github.com/HoganMcDonald/capture-app) and generate a suggested order for snippets.

## context
Capture collects text snippets and stores them in lists. Those snippets are fed through the [IBM Watson](https://www.ibm.com/watson/developercloud/doc/tone-analyzer/index.html) tone analyzer api which returns scores between 0 and 1 for each of the five major emotions; joy, anger, sadness, disgust, and fear. I wanted to write an object oriented algorithm that would suggest an order to put speech sections in.
