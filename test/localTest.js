document.addEventListener("DOMContentLoaded", () => {
    // Get the form container element
    const formContainer = document.getElementById('form-container');
    const merCalculator = new MerCalculator.MerCalculator();

    TRANSLATIONS_NL = {
        Method: 'Methode',
        'Age and Activity': 'Leeftijd en Activiteit',
        Weight: 'Gewicht',
        Age: 'Leeftijd',
        '<8 weeks': '<8 weken',
        '8-52 weeks': '8-52 weken',
        '1-2 years': '1-2 jaar',
        '3-7 years': '3-7 jaar',
        '>7 years (senior)': '>7 jaar (senior)',
        'Expected Mature Weight': 'Verwacht volwassen gewicht',
        Activity: 'Activiteit',
        'Low Activity': 'Weinig beweging (<1 uur/dag)',
        'Moderate Activity (low impact)': 'Gemiddelde beweging (1-3 uur/dag, lage intensiteit)',
        'Moderate Activity(high impact)': 'Gemiddelde beweging (1-3 uur/dag, hoge intensiteit)',
        'High activity (working dogs)': 'Veel beweging (3-6 uur/dat zoals werkhonden)',
        'High activity under extreme conditions': 'Extreem veel beweging (racehonden, sledehonden)',
        'Recommended calories': 'Aanbevolen calorieën per dag',
    };
    // Create the dog energy form
    if(formContainer != null)
        merCalculator.createDogEnergyForm(formContainer, TRANSLATIONS_NL, "");
});