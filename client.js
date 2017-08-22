//===================================================//
//                     constants                     //
//===================================================//

Array.prototype.move = (a, b) => {
  let itemToPlace = this.splice(a, 1)[0];
  console.log(itemToPlace);
};

const mutationRate = 0.2;
const populationSize = 50;
const generations = 2;
const mortalityRate = 0.1;
const orderLength = data.length;

//===================================================//
//                   angular app                     //
//===================================================//

let app = angular.module('app', []);

app.controller('controller', function() {
  let vm = this;

  // create test population
  vm.test = new Population(data);
  vm.test.sortPopulation();
  console.log(vm.test);

  // run evolution cycle
  vm.test.evolve();

}); // end angular controller

//===================================================//
//                     classes                       //
//===================================================//

class Utility {
  // generate random number
  static randomNumber(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  }; // end randomNumber

  // move item in array from one position to another
  static move(arr, i, j) {
    arr.splice(j, 0, arr.splice(i, 1)[0]);
    return arr;
  }; // end move

  // convert an array of objects into an array of strings
  // so they behave well with move function
  static arrToStrings(objArr) {
    let arrToReturn = [];
    for (var i = 0; i < objArr.length; i++) {
      arrToReturn.push(JSON.stringify(objArr[i]));
    }
    return arrToReturn;
  }; // end arrToStrings

} // end Utility class


//population class
class Population {
  // population constructor - recieves a list of objects
  constructor(list) {
    this.pop = this.createPopulation(list);
    this.numberToDie = Math.floor(populationSize * mortalityRate); // this is the number of order objects that are repopulated each generation
  }; //end constructor

  // creates population of Order objects
  createPopulation(list) {
    let arr = [];
    for (var i = 0; i < populationSize; i++) {
      arr.push(new Order(list));
    }
    return arr;
  }; // end createPopulation

  // sorts population by their scores in ascending order
  sortPopulation() {
    this.pop.sort((a, b) => {
      return a.score - b.score;
    });
  }; // end sortPopulation

  // pairs off the top Order objects in this.pop and mates them to repopulate
  crossover() {
    //repopulate
    //local var to track first parent
    let firstParent = 0;
    //while loop to go every other until those killed are replaced
    for (i = 0; i < this.numberToDie; i++) {
      //random number between 1 and order.length*
      const elementsToRemove = Utility.randomNumber(orderLength, 1);
      console.log('elementsToRemove', elementsToRemove);
      let newOrder = this.pop[firstParent].order;
      console.log('new order 1', newOrder);
      //ushift that many from the front of order*
      for (var i = elementsToRemove - 1; i >= 0; i--) {
        newOrder.shift();
      }
      console.log('new order 2', newOrder);
      //loop through pop[firstorder+1]
      for (var i = 0; i < orderLength; i++) {
        //  check if this.order includes each item
        if (!this.pop[firstParent].order.includes(this.pop[firstParent + 1].order[i])) {
          console.log('not included');
          //  if not, push into new order
          newOrder.push(this.pop[firstParent+1].order[i]);
        }
      }
      console.log('new order 3', newOrder);
      //  push new order into pop
      let order = new Order();
      order.order = newOrder;
      order.score = order.calcScore();
      this.pop.push(order);
      firstParent += 2;
    }; //end while loop
  }; //end crossover

  // kills off Order objects with the highest scores in population (goal is lower score)
  death() {
    for (var i = 0; i < this.numberToDie; i++) {
      this.pop.pop();
    }
    // return this.pop;
  }; // end death function

  // runs a single generation cycle
  generationCycle() {
    //death, crossover, mutate, calc scores, sort
    this.death();
    this.crossover();
    for (var i = 0; i < this.pop.length; i++) {
      //mutate
      // for (var j = 0; j < this.pop[i].order.length; j++) {
        this.pop[i].mutate();
        //calcScore
        this.pop[i].calcScore();
      // }
    }
    this.sortPopulation();
  }; // end generationCycle

  // runs generationCycle a constant number of times and returns the final results
  evolve() {
    for (var i = 0; i < generations; i++) {
      this.generationCycle();
    }
    return this;
  }

} //end population class


// Order class
class Order {
  // order constructor
  constructor(list) {
    if (list) {
      this.order = Utility.arrToStrings(this.generateOrder(list)); //     as strings
      // this.order = this.generateOrder(list); //                        as objects
      this.score = this.calcScore();
    }
    this.mutationRate = mutationRate;
  }; // end constructor

  // generates a random order. only used for initial population
  generateOrder(list) {
    let arrToReturn = [];
    //create array to store indeces of list
    let indexArr = [];
    for (var i = 0; i < list.length; i++) {
      indexArr.push(i);
    };
    //loop through list (while indecese.length > 0)
    while (indexArr.length > 0) {
      // select random index
      let selectedIndex = Utility.randomNumber(indexArr.length - 1, 0);
      // push number at that index into arrToReturn from list
      arrToReturn.push(list[indexArr[selectedIndex]]);
      //splice from indexArr
      indexArr.splice(selectedIndex, 1);
    }
    return arrToReturn;
  } //end generate order

  //calc score - lower the better
  calcScore() {
    let total = 0;
    for (var i = 0; i < this.order.length; i++) {
      if (i < this.order.length - 1) {
        total += Math.abs(JSON.parse(this.order[i]).score - JSON.parse(this.order[i + 1]).score); // as strings
        // total += Math.abs(this.order[i].score - this.order[i + 1].score); //                      as objects
      }; //end check if last in order
    } //end loop through order
    return total / this.order.length;
  } //end calc score

  //mutation
  mutate() {
    let threshold = Utility.randomNumber(100, 0);
    if (threshold < this.mutationRate * 100) {
      let x = Utility.randomNumber(this.order.length - 1, 0);
      let y = Utility.randomNumber(this.order.length - 1, 0);
      Utility.move(this.order, x, y);
    } //end if theshold was meant
  } //end mutation

} //end class
