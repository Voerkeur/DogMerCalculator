export type MerTranslations = {
    Method: string,
    Weight: string,
    Age: string,
    '<8 weeks': string,
    '8-52 weeks': string,
    '1-2 years': string,
    '3-7 years': string,
    '>7 years (senior)': string,
    'Expected Mature Weight': string,
    Activity: string,
    'Age and Activity': string,
    'Number of Kittens': string,
    'Recommended calories': string,
    'Low Activity': string,
    'Moderate Activity (low impact)': string,
    'Moderate Activity(high impact)': string,
    'High activity (working dogs)': string,
    'High activity under extreme conditions': string,

}

export class MerCalculator {
    /**
     * Calculates the daily maintenance energy requirements (MER) for a dog based on age, covering newborn puppies to adult dogs.
     * @param {number} weight - The weight of the dog in kilograms.
     * @param {number} ageInMonths - The age of the dog in months.
     * @param {number} expectedMatureWeight - The expected mature weight of the dog in kilograms (required for puppies between 8 weeks and 1 year).
     * @returns {number} - The daily MER of the dog in kcal.
     */
    public calculateDogEnergyByAge(weight: number, ageInMonths: number, expectedMatureWeight: number = 0): number {
        let energyRequirement = 0;
        const weightFactor = weight ** 0.75; // Common factor in all calculations

        // For newborn puppies (< 8 weeks)
        if (ageInMonths < 2) {
            energyRequirement = (weight * 1000) * 25 / 100; // Convert weight to grams and calculate
        }
        // For puppies from 8 weeks to 1 year
        else if (ageInMonths >= 2 && ageInMonths < 12) {
            const ratio = weight / expectedMatureWeight;
            energyRequirement = (254.1 - 135.0 * ratio) * weightFactor;
        }
        // For adult dogs (>= 1 year)
        else {
            const ageInYears = ageInMonths / 12;
            if (ageInYears >= 1 && ageInYears <= 2) {
                energyRequirement = weightFactor * 130;
            } else if (ageInYears > 2 && ageInYears <= 7) {
                energyRequirement = weightFactor * 110;
            } else if (ageInYears > 7) {
                energyRequirement = weightFactor * 95;
            }
        }

        return energyRequirement;
    }

    /**
     * Calculates the daily energy requirements (DER) for an adult dog based on activity level
     * @param {number} weight - The weight of the dog in kilograms
     * @param {string} activityLevel - The activity level of the dog (low, moderateLow, moderateHigh, high, extreme)
     * @returns {number} - The daily DER of the dog in kcal
     */
    public calculateDogEnergyByActivity(weight: number, activityLevel: string): number {
        let energyRequirement = 0;
        const weightFactor = weight ** 0.75; // Common factor in all calculations

        switch (activityLevel) {
            case 'low':
                energyRequirement = weightFactor * 95;
                break;
            case 'moderateLow':
                energyRequirement = weightFactor * 110;
                break;
            case 'moderateHigh':
                energyRequirement = weightFactor * 125;
                break;
            case 'high':
                energyRequirement = weightFactor * 150; // Assuming average for high activity
                break;
            case 'extreme':
                energyRequirement = weightFactor * 1050; // Assuming average for extreme conditions
                break;
            default:
                break;
        }

        return energyRequirement;
    }

    /**
     * Creates and displays a form for calculating the daily energy requirements of a dog.
     * The form allows the user to input the dog's weight, age, activity level, and any peculiarities (e.g., neutered, gestating, lactating).
     * Based on the input values, the function calculates and displays the recommended daily energy requirements for the dog.
     *
     * @param {HTMLElement} element - The HTML element where the form will be displayed.
     * @param {Object} translations - (Optional) An object containing translated text for form labels and messages.
     *                                If not provided, English translations will be used.
     * @param {string|undefined}    - The HTML to display at the footer of the form, default to creditation link
     * @returns {Object} - An object containing references to the form elements for further manipulation, such as retrieving user inputs or updating the displayed recommendations.
     */
    public createDogEnergyForm(element:HTMLElement, translations:MerTranslations|undefined=undefined,
        footerHtml:string|undefined = 'Dog MER Calculator by <a href="https://voerkeur.nl/software/dog-mer-calculator/en/" target="_blank" class="dog-mer-credits">Voerkeur.nl</a>') {
        if(translations === undefined) {
            translations = this.TRANSLATIONS_EN;
        }
        const weightDefault = 15;
        const methodOptions = [
            { value: 'age', label: translations['Age'] },
            { value: 'activity', label: translations['Activity'] },
            { value: 'combined', label: translations['Age and Activity'], default: true}
        ]
        const ageOptions = [
          { value: '1', label: translations['<8 weeks'] },
          { value: '3', label: translations['8-52 weeks'] },
          { value: '16', label: translations['1-2 years'] },
          { value: '50', label: translations['3-7 years'], default: true },
          { value: '100', label: translations['>7 years (senior)'] },
        ]
        const activityOptions = [
          { value: 'low', label: translations['Low Activity'] },
          { value: 'moderateLow', label: translations['Moderate Activity (low impact)'], default: true },
          { value: 'moderateHigh', label: translations['Moderate Activity(high impact)'] },
          { value: 'high', label: translations['High activity (working dogs)'] },
          { value: 'extreme', label: translations['High activity under extreme conditions'] },
        ]
        
        const updateVisbility = () => {
            const age = parseFloat(ageSelect.value);
            expectedMatureWeightDiv.hidden = !(age > 2 && age < 12);
            activityDiv.hidden = age < 12 || methodSelect.value == 'age';
            ageDiv.hidden = methodSelect.value == 'activity';
        }
        // Function to calculate and update the recommended calories
        const updateRecommendedCalories = () => {
          const weight = parseFloat(weightInput.value);
          const ageInMonths = ageSelect.value ? parseFloat(ageSelect.value) : 0;
          const activity = activitySelect.value;
          const expectedMatureWeight = expectedMatureWeightInput.value ? parseFloat(expectedMatureWeightInput.value) : 0;
          recommendedCaloriesSpan.textContent = "?";
          if(methodSelect.value == 'age') {
            const recommendedCalories = this.calculateDogEnergyByAge(weight, ageInMonths, expectedMatureWeight);
            recommendedCaloriesSpan.textContent = recommendedCalories.toFixed(0);
          }
          else if(methodSelect.value == 'activity') {
            const recommendedCalories = this.calculateDogEnergyByActivity(weight, activity);
            recommendedCaloriesSpan.textContent = recommendedCalories.toFixed(0);
          }
          else if(methodSelect.value == 'combined') {
            const ageCalories = this.calculateDogEnergyByAge(weight, ageInMonths, expectedMatureWeight);
            const activityCalories = this.calculateDogEnergyByActivity(weight, activity);
            const recommendedCalories = (ageCalories + activityCalories + activityCalories) / 3;
            recommendedCaloriesSpan.textContent = recommendedCalories.toFixed(0);
          }
        }

        const methodDiv = document.createElement('div');
        const methodLabel = document.createElement('label');
        methodLabel.textContent = translations['Method'] + ': ';
        const methodSelect = document.createElement('select');
        methodOptions.forEach((option) => {
            const methodOption = document.createElement('option');
            methodOption.value = option.value;
            methodOption.textContent = option.label;
            if(option.default) {
                methodOption.selected = true;
            }
            methodSelect.appendChild(methodOption);
        });
        methodSelect.addEventListener('change', updateRecommendedCalories);
        methodSelect.addEventListener('change', updateVisbility);
        methodDiv.appendChild(methodLabel);
        methodDiv.appendChild(methodSelect);
        element.appendChild(methodDiv);
      
        // Create the weight input field
        const weightDiv = document.createElement('div');
        const weightLabel = document.createElement('label');
        weightLabel.textContent = translations['Weight'] + ': ';
        const weightInput = document.createElement('input');
        weightInput.type = 'number';
        weightInput.value = weightDefault+"";
        weightInput.min = "0";
        weightInput.addEventListener('input', updateRecommendedCalories);
        weightDiv.appendChild(weightLabel);
        weightDiv.appendChild(weightInput);
        element.appendChild(weightDiv);
      
        // Create the age select field
        const ageDiv = document.createElement('div');
        const ageLabel = document.createElement('label');
        ageLabel.textContent = translations['Age'] + ': ';
        const ageSelect = document.createElement('select');
        ageOptions.forEach((option) => {
          const ageOption = document.createElement('option');
          ageOption.value = option.value;
          ageOption.textContent = option.label;
          if(option.default) {
            ageOption.selected = true;
          }
          ageSelect.appendChild(ageOption);
        });
        ageSelect.addEventListener('change', updateRecommendedCalories);
        ageSelect.addEventListener('change', updateVisbility);
        ageDiv.appendChild(ageLabel);
        ageDiv.appendChild(ageSelect);
        element.appendChild(ageDiv);

        const expectedMatureWeightDiv = document.createElement('div');
        const expectedMatureWeightLabel = document.createElement('label');
        expectedMatureWeightLabel.textContent = translations['Expected Mature Weight'] + ': ';
        const expectedMatureWeightInput = document.createElement('input');
        expectedMatureWeightInput.type = 'number';
        expectedMatureWeightInput.value = weightDefault+"";
        expectedMatureWeightInput.min = "0";
        expectedMatureWeightInput.addEventListener('input', updateRecommendedCalories);
        expectedMatureWeightDiv.appendChild(expectedMatureWeightLabel);
        expectedMatureWeightDiv.appendChild(expectedMatureWeightInput);
        expectedMatureWeightDiv.hidden = true;
        element.appendChild(expectedMatureWeightDiv);
      
        // Create the activity select field
        const activityDiv = document.createElement('div');
        const activityLabel = document.createElement('label');
        activityLabel.textContent = translations['Activity'] + ': ';
        const activitySelect = document.createElement('select');
        activityOptions.forEach((option) => {
          const activityOption = document.createElement('option');
          activityOption.value = option.value;
          activityOption.textContent = option.label;
          if(option.default) {
            activityOption.selected = true;
          }
          activitySelect.appendChild(activityOption);
        });
        activitySelect.addEventListener('change', updateRecommendedCalories);
        activityDiv.appendChild(activityLabel);
        activityDiv.appendChild(activitySelect);
        activityDiv.appendChild(activitySelect);
        element.appendChild(activityDiv);
    
        
        // Create the recommended calories display
        const recommendedCaloriesDiv = document.createElement('div');
        const recommendedCaloriesText = document.createElement('span');
        recommendedCaloriesText.textContent = translations['Recommended calories'] + ': ';
        const recommendedCaloriesSpan = document.createElement('span');
        recommendedCaloriesDiv.appendChild(recommendedCaloriesText);
        recommendedCaloriesDiv.appendChild(recommendedCaloriesSpan);
        recommendedCaloriesDiv.append(" Kcal");
        element.appendChild(recommendedCaloriesDiv);

        if(footerHtml) {
            const footerHtmlDiv = document.createElement('div');
            footerHtmlDiv.innerHTML = footerHtml;
            element.appendChild(footerHtmlDiv);
        }


        
        // Initialize the recommended calories
        methodSelect.dispatchEvent(new Event('change'))
        updateRecommendedCalories();
        return {
            method: methodSelect,
            expectedMatureWeight: expectedMatureWeightInput,
            weight: weightInput,
            age: ageSelect,
            activity: activitySelect,
            recommendedCalories: recommendedCaloriesSpan
        }
    }
        
    public TRANSLATIONS_EN : MerTranslations = {
        Method: 'Method',
        'Age and Activity': 'Age and Activity',
        Weight: 'Weight',
        Age: 'Age',
        '<8 weeks': '<8 weeks',
        '8-52 weeks': '8-52 weeks',
        '1-2 years': '1-2 years',
        '3-7 years': '3-7 years',
        '>7 years (senior)': '>7 years (senior)',
        'Expected Mature Weight': 'Expected Mature Weight',
        Activity: 'Activity',
        'Number of Kittens': 'Number of Kittens',
        'Recommended calories': 'Recommended calories',
        'Low Activity': 'Low Activity (<1 hour/day)',
        'Moderate Activity (low impact)': 'Moderate Activity (1-3 hour/day, low impact)',
        'Moderate Activity(high impact)': 'Moderate Activity(1-3 hour/day, high impact)',
        'High activity (working dogs)': 'High activity (3-6 hours/day working dogs)',
        'High activity under extreme conditions': 'High activity under extreme conditions',
    };
      
}