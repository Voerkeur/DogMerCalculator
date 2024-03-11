# Dog MER Calculator

The Dog MER Calculator is a software library designed to calculate the daily energy requirements (MER - Maintenance Energy Requirements) for dogs. It provides a set of functions and a user interface for estimating the calorie intake needed by dogs based on various factors such as weight, age and activity level

The calculations used in this library are based on the [Nutritional Guidelines of the FEDIAF (European Pet Food Industry Federation)](https://europeanpetfood.org/wp-content/uploads/2022/03/Updated-Nutritional-Guidelines.pdf). These guidelines serve as a reference for determining the appropriate energy requirements for dogs. This library offers the functions and forms to calculate the energy requirements of dog base on the 2 methods of chapter 7.2.3.1, namely activty or age. There is also a combined method implemented that calculates the energy requirement based on a weighted average of the two.

## Features

- Calculate the maintenance energy requirements for dogs based it's weight and age.
- Calculate the daily energy requirements for a dog based on its weight and activity level.
- Calculate the daily energy requirements for a dog based on weight, age and activity level by using a weighted average.
- User-friendly form interface for inputting dog information and receiving recommended calorie intake (styling not included).
- Customizable translations for different languages and regions.

## Installation

```shell
npm install dog-mer-calculator
```

## Usage

```javascript
const { MerCalculator } = require('dog-mer-calculator');

// Create an instance of the calculator
const calculator = new MerCalculator();

// Example 1: Calculate the energy requirements for a dog based on weight and age (in months)
const mer = calculator.calculateDogEnergyByAge(10, 60);
console.log('MER:', mer);

// Example 2: Calculate the energy requirements for a dog
const der = calculator.calculateDogEnergyByActivity(10, 'moderateLow');
console.log('DER:', dogEnergy);

// Example 3: Display the form for interactive calorie calculation
const formElement = document.getElementById('calorie-form');
calculator.createDogEnergyForm(formElement);
```

For detailed API documentation, please refer to the TypeScript type definitions of /lib/types/MerCalculator.d.ts.

## Live Example

You can see a live implementation (in Dutch) of the calculator on  [Voerkeur.nl](https://voerkeur.nl/hondenvoer/hoeveel-voer-heeft-je-hond-nodig/#calories-form)

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or feature requests, please open an issue on the [GitHub repository](https://github.com/Voerkeur/DogMerCalculator).

## License

This project is licensed under the MIT License.

---

Please note that the calculations provided by this library are estimates and should not replace professional veterinary advice. Always consult with a veterinarian for accurate dietary recommendations for your dog.
