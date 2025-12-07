const ExercisePrelistDefault = [
    {id: 1,name: "Pushups", category: "Chest", secondarycategory: "Triceps", countsByWeight: false, notes : "No much decription. "},
    {id: 2,name: "Air Squats", category: "Quads",secondarycategory: "Hams", countsByWeight: false, notes: "Its a good place to add notes for exercises. "},
    {id: 3,name: "Barbell Front Squats", category: "Quads",secondarycategory: "Hams", countsByWeight: true, notes: "Its a good place to add notes for exercises. "},
    {id: 4,name: "Arnold Dumbbell Press", category: "Shoulder", countsByWeight: true, notes: " "},
    {id: 5,name: "Behind the Neck Barbell Press", category: "Shoulder", countsByWeight: true, notes: " "},
    {id: 7,name: "Lateral Dumbbell Raise", category: "Shoulder", countsByWeight: true, notes: " "},
    {id: 8,name: "Log Press", category: "Shoulder", countsByWeight: true, notes: " "},
    {id: 9,name: "One-Arm Standing Dumbbell Press", category: "Shoulder", countsByWeight: true, notes: " "},
    {id: 10,name: "Overhead Press", category: "Shoulder", countsByWeight: true, notes: " "},
    {id: 11,name: "Push Press", category: "Shoulder", countsByWeight: true, notes: " "},
    {id: 13,name: "Cable Overhead Triceps Extension", category: "Triceps", countsByWeight: true, notes: " "},
    {id: 15,name: "Lying Triceps Extension", category: "Triceps", countsByWeight: true, notes: " "},
    {id: 16,name: "Dips", category: "Triceps", countsByWeight: false, notes: " "},
    {id: 17,name: "Barbell Curl", category: "Biceps", countsByWeight: true, notes: " "},
    {id: 18,name: "Cable Curl", category: "Biceps", countsByWeight: true, notes: " "},
    {id: 19,name: "Dumbbell Curl", category: "Biceps", countsByWeight: true, notes: " "},
    {id: 20,name: "Cable Crossover", category: "Chest", countsByWeight: true, notes: " "},
    {id: 21,name: "Flat Barbell Bench Press", category: "Chest", countsByWeight: true, notes: " "},
    {id: 22,name: "Decline Barbell Bench Press", category: "Chest", countsByWeight: true, notes: " "},
    {id: 23,name: "Flat Dumbbell Bench Press", category: "Chest", countsByWeight: true, notes: " "},
    {id: 24,name: "Incline Barbell Bench Press", category: "Chest", countsByWeight: true, notes: " "},
    {id: 25,name: "Pull Ups", category: "Back", countsByWeight: false, notes: " "},
    {id: 26,name: "weighted Pull Up", category: "Back", countsByWeight: true, notes: " "},
    {id: 27,name: "Chin Up", category: "Back", countsByWeight: false, notes: " "},
    {id: 28,name: "weighted Chin Up", category: "Back", countsByWeight: true, notes: " "},
    {id: 29,name: "Deadlift", category: "Back", countsByWeight: true, notes: " "},
    {id: 30,name: "Good Morning", category: "Back", countsByWeight: true, notes: " "},
    {id: 31,name: "Lat Pulldown", category: "Back", countsByWeight: true, notes: " "},
    {id: 32,name: "Plank", category: "Core", countsByWeight: false, specialRepFlag: "sec", notes: " "},
    {id: 33,name: "Run", category: "Cardio", countsByWeight: false, specialRepFlag: "m", notes: "Distance measured in meters."},
]
const CategoriesofExercisePrelistDefault = [
    {id: 1, name: "Chest", color: "red"}, 
    {id: 2, name: "Quads", color: "blue"},
    {id: 3, name: "Back", color: "green"},
    {id: 4, name: "Hams", color: "yellow"},
    {id: 5, name: "Triceps", color: "orange"},
    {id: 6, name: "Cardio", color: "purple"},
    {id: 7, name: "Core", color: "brown"},
]

const RoutinesDefault = [
    {id: 1, name: 'Bodyweight', days: [    {id: 1, name: "Push", routine: 'Bodyweight', workouts: [
        {id:1, name: "Dips", exerciseSets: [{id:1, weight: undefined, reps: 8}, {id:2, weight: undefined, reps: 8}, {id:3, weight: undefined, reps: 8}]},
        {id:2, name: "Pushups", exerciseSets: [{id:1, weight: undefined, reps: 25 }, {id:2, weight: undefined, reps: 25 } , {id:3, weight: undefined, reps: 25 }]},
    ]},
    {id: 2, name: "Pull", routine: 'Bodyweight', workouts: [
        {id:1, name: "Chin Up", exerciseSets: [{id:1, weight: undefined, reps: 8 }, {id:2, weight: undefined, reps: 8 } , {id:3, weight: undefined, reps: 8 }]},
        {id:2, name: "Pull Ups", exerciseSets: [{id:1, weight: undefined, reps: 8}, {id:2, weight: undefined, reps: 8}, {id:3, weight: undefined, reps: 8}]},
    ]},
    {id: 3, name: "Leg", routine: 'Bodyweight', workouts: [
        {id:1, name: "Air Squats", exerciseSets: [{id:1, weight: undefined, reps: 35 }, {id:2, weight: undefined, reps: 35 } , {id:3, weight: undefined, reps: 30 } ,
            {id:4, weight: undefined, reps: 30}, {id:5, weight: undefined, reps: 25}, {id:6, weight: undefined, reps: 25}
        ]},
    ]},]},

    {id: 2, name: 'Dumbbells', days: [
        {id: 1, name: "Random", routine: 'Bodyweight', workouts: [
        {id:1, name: "Barbell Curl", exerciseSets: [{id:1, weight: 10, reps: 8}, {id:2, weight: 10, reps: 8}, {id:3, weight: 10, reps: 8}]},
        {id:2, name: "Dumbbell Curl", exerciseSets: [{id:1, weight: undefined, reps: 25 }, {id:2, weight: undefined, reps: 25 } , {id:3, weight: 8, reps: 25 }]},
    ]}]},
]


export {ExercisePrelistDefault , CategoriesofExercisePrelistDefault, RoutinesDefault}