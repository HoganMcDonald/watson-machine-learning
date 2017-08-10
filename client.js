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
  vm.test = new Population(data);
  vm.test.sortPopulation();
  console.log(vm.test);
  let a = vm.test.pop[0].score;

  // console.log(vm.test);
  vm.test.evolve();
  let b = vm.test.pop[0].score;
  console.log(a, b);

});

//===================================================//
//                     classes                       //
//===================================================//

class Utility {
  //calc random number
  static randomNumber(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  static move(arr, i, j) {
    arr.splice(j, 0, arr.splice(i, 1)[0]);
    return arr;
  };

  static arrToStrings(objArr) {
    let arrToReturn = [];
    for (var i = 0; i < objArr.length; i++) {
      arrToReturn.push(JSON.stringify(objArr[i]));
    }
    return arrToReturn;
  };

}

//population class

class Population {
  constructor(list) {
    this.pop = this.createPopulation(list);
    this.numberToDie = Math.floor(populationSize * mortalityRate);
  }; //end constructor

  createPopulation(list) {
    let arr = [];
    for (var i = 0; i < populationSize; i++) {
      arr.push(new Order(list));
    }
    return arr;
  };

  sortPopulation() {
    this.pop.sort((a, b) => {
      return a.score - b.score;
    });
  };

  // pairs off the top order objects in this.pop and mates them
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

  death() {
    for (var i = 0; i < this.numberToDie; i++) {
      this.pop.pop();
    }
    // return this.pop;
  };

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
  };

  evolve() {
    for (var i = 0; i < generations; i++) {
      this.generationCycle();
    }
    return this;
  }

} //end population class

//sort by score
//crossover
//mortalitty



class Order {
  constructor(list) {
    if (list) {
      this.order = Utility.arrToStrings(this.generateOrder(list)); //     as strings
      // this.order = this.generateOrder(list); //                        as objects
      this.score = this.calcScore();
    }
    this.mutationRate = mutationRate;
  };

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
