
const carBrands = [
  {
    "brand": "Maruti Suzuki",
    "models": [
      "E Vitara",
      "Fronx",
      "Victoris",
      "Swift",
      "Baleno",
      "Grand Vitara",
      "Dzire",
      "Brezza",
      "Wagon R",
      "Ertiga",
      "Alto K10",
      "Celerio",
      "XL6",
      "S-Presso",
      "Ignis",
      "Jimny",
      "Invicto",
      "Eeco",
      "Ciaz",
      "2026 Brezza",
      "Grand Vitara Phantom Blaq Edition",
      "Wagon R Flex Fuel"
    ]
  },
  {
    "brand": "Hyundai",
    "models": [
      "Venue",
      "Creta",
      "Exter",
      "Grand i10 Nios",
      "Verna",
      "i20",
      "Aura",
      "Alcazar",
      "Tucson",
      "Venue N Line",
      "i20 N Line",
      "Creta N Line",
      "Creta Electric",
      "Ioniq 5",
      "Palisade",
      "Ioniq 9",
      "2026 Verna",
      "Tucson Facelift",
      "Staria",
      "Stargazer",
      "Ioniq 5 Facelift",
      "New Santa Fe",
      "Ioniq 6"
    ]
  },
  {
    "brand": "Tata",
    "models": [
      "Sierra",
      "Nexon",
      "Punch",
      "Harrier",
      "Tiago",
      "Safari",
      "Altroz",
      "Curvv",
      "Nexon EV",
      "Harrier EV",
      "Punch EV",
      "Tiago EV",
      "Curvv EV",
      "Tigor",
      "Tiago NRG",
      "Tigor EV",
      "Punch Facelift",
      "Sierra EV",
      "Safari EV",
      "Avinya",
      "Altroz EV"
    ]
  },
  {
    "brand": "Kia",
    "models": [
      "Seltos",
      "Sonet",
      "Carens",
      "Carens Clavis",
      "Syros",
      "Carnival",
      "Carens Clavis EV",
      "EV6",
      "EV9",
      "EV3",
      "Tasman",
      "Syros EV",
      "Sorento",
      "EV5"
    ]
  },
  {
    "brand": "Mahindra",
    "models": [
      "XUV 7XO",
      "XUV 3XO EV",
      "Scorpio N",
      "XUV 3XO",
      "Thar Roxx",
      "Thar",
      "BE 6",
      "Scorpio",
      "Bolero",
      "XEV 9S",
      "XEV 9e",
      "Bolero Neo",
      "Bolero Neo Plus",
      "XUV400",
      "Marazzo",
      "Bolero 2026",
      "Thar.e",
      "Scorpio N Facelift",
      "Vision S Sub Compact SUV",
      "Vision X Compact SUV",
      "Global Pik Up",
      "BE.07",
      "Vision S Compact SUV",
      "BE.09",
      "Vision X Sub Compact SUV",
      "Vision T",
      "Vision SXT"
    ]
  },
  {
    "brand": "Toyota",
    "models": [
      "Urban Cruiser EV",
      "Urban Cruiser Hyryder",
      "Urban Cruiser Taisor",
      "Fortuner",
      "Innova Hycross",
      "Glanza",
      "Hilux",
      "Innova Crysta",
      "Vellfire",
      "Fortuner Legender",
      "Rumion",
      "Land Cruiser",
      "Camry",
      "Urban Cruiser Hyryder 7 Seater",
      "BZ4X",
      "New Land Cruiser FJ"
    ]
  },
  {
    "brand": "Honda",
    "models": [
      "Elevate",
      "Amaze",
      "City",
      "City Hybrid eHEV",
      "Amaze 2nd Gen",
      "BR-V",
      "WR-V",
      "Super One",
      "0 Alpha",
      "CR-V Hybrid"
    ]
  },
  {
    "brand": "Volkswagen",
    "models": [
      "Virtus",
      "Taigun",
      "Golf GTI",
      "Tiguan R-Line",
      "Tera SUV",
      "Taigun Facelift",
      "ID.4",
      "Tayron"
    ]
  },
  {
    "brand": "Skoda",
    "models": [
      "Kylaq",
      "Slavia",
      "Kushaq",
      "Kodiaq",
      "Octavia RS",
      "Kushaq Facelift",
      "Octavia Facelift",
      "Enyaq",
      "Slavia Facelift",
      "New Superb",
      "Elroq"
    ]
  },
  {
    "brand": "BMW",
    "models": [
      "X1",
      "X3",
      "X4 M40i",
      "X5",
      "X7",
      "2 Series Gran Coupe",
      "3 Series LWB",
      "5 Series",
      "7 Series",
      "Z4",
      "M2",
      "M4",
      "M5",
      "M8",
      "M340i",
      "XM",
      "i4",
      "i5",
      "i7",
      "iX",
      "iX1",
      "iX1 LWB",
      "iX3"
    ]
  },
  {
    "brand": "Mercedes",
    "models": [
      "G-Class",
      "E-Class",
      "A-Class Limousine",
      "GLA",
      "C-Class",
      "GLC",
      "GLS",
      "Maybach S-Class",
      "GLE",
      "AMG CLE",
      "S-Class",
      "Maybach GLS",
      "AMG GLA35",
      "CLE Cabriolet",
      "AMG G-Class",
      "AMG GLC43 Coupe",
      "AMG GT 63",
      "G580 with EQ Technology",
      "EQS",
      "AMG C 43",
      "Maybach SL 680",
      "AMG GLE Coupe",
      "EQB",
      "AMG SL55 Roadster",
      "AMG E53 Cabriolet",
      "EQA",
      "AMG A45 S",
      "EQS SUV",
      "AMG GT 63 S E Performance",
      "AMG C 63 S E Performance",
      "AMG GT 63 S 4Matic Plus",
      "AMG EQS",
      "EQE SUV",
      "Maybach EQS SUV",
      "AMG S 63 E Performance",
      "CLA 2026",
      "GLC EV"
    ]
  },
  {
    "brand": "Audi",
    "models": [
      "Q3",
      "A4",
      "A6",
      "S5 Sportback",
      "Q7",
      "Q5",
      "Q3 Sportback",
      "Q8",
      "RS Q8 Performance",
      "A8 L",
      "RS5",
      "e-tron GT",
      "e-tron Sportback",
      "e-tron",
      "Q8 e-tron",
      "Q8 Sportback e-tron",
      "Q6 e-tron",
      "New Q5 third-gen"
    ]
  },
  {
    "brand": "Renault",
    "models": [
      "Triber",
      "Kiger",
      "Kwid",
      "New Duster",
      "Boreal (Bigster)",
      "Kwid EV"
    ]
  },
  {
    "brand": "Nissan",
    "models": [
      "Gravite",
      "Magnite",
      "X-Trail",
      "Tekton",
      "Qashqai"
    ]
  },
  {
    "brand": "Jeep",
    "models": [
      "Compass",
      "Meridian",
      "Wrangler",
      "Grand Cherokee",
      "Avenger"
    ]
  },
  {
    "brand": "Citroen",
    "models": [
      "C3",
      "Aircross X",
      "Basalt X",
      "C5 Aircross",
      "eC3",
      "New C5 Aircross",
      "eC3 Facelift",
      "Basalt EV",
      "C3 Facelift",
      "Aircross X Facelift"
    ]
  },
  {
    "brand": "MG",
    "models": [
      "Hector",
      "Hector Plus",
      "Windsor EV",
      "Cyberster",
      "Comet EV",
      "Astor",
      "M9",
      "ZS EV",
      "Gloster",
      "Hector Plus Sharp Pro 1.5 Turbo Petrol 6 STR",
      "Majestor",
      "Astor Facelift"
    ]
  },
  {
    "brand": "Land Rover",
    "models": [
      "Defender",
      "Range Rover Velar",
      "Range Rover",
      "Range Rover Sport",
      "Range Rover Evoque",
      "Discovery Sport",
      "Discovery"
    ]
  },
  {
    "brand": "BYD",
    "models": [
      "Atto 3",
      "Seal",
      "Sealion 7",
      "eMax 7",
      "Atto 2"
    ]
  },
  {
    "brand": "Vinfast",
    "models": [
      "VF 6",
      "VF 7",
      "Limo Green",
      "VF 9",
      "VF 3",
      "VF e34",
      "VF 8"
    ]
  },
  {
    "brand": "Volvo",
    "models": [
      "XC90",
      "EX30",
      "XC60",
      "EX40",
      "EC40",
      "EX90"
    ]
  },
  {
    "brand": "Porsche",
    "models": [
      "911",
      "Cayenne",
      "Macan",
      "Panamera",
      "Taycan",
      "Cayenne EV",
      "Cayenne Coupe",
      "Macan Turbo EV"
    ]
  },
  {
    "brand": "Lexus",
    "models": [
      "ES",
      "LX",
      "NX",
      "LM",
      "RX"
    ]
  },
  {
    "brand": "Mini",
    "models": [
      "Cooper",
      "Cooper S Convertible",
      "Countryman",
      "Cooper SE",
      "Countryman Electric"
    ]
  },
  {
    "brand": "Force Motors",
    "models": [
      "Gurkha",
      "Trax Cruiser"
    ]
  },
  {
    "brand": "Lamborghini",
    "models": [
      "Revuelto",
      "Urus SE",
      "Temerario"
    ]
  },
  {
    "brand": "Rolls-Royce",
    "models": [
      "Phantom",
      "Cullinan",
      "Spectre"
    ]
  },
  {
    "brand": "Ferrari",
    "models": [
      "Purosangue SUV",
      "296 GTB",
      "Roma",
      "F8 Tributo",
      "Portofino",
      "296 GTS"
    ]
  },
  {
    "brand": "Jaguar",
    "models": [
      "F-Pace"
    ]
  },
  {
    "brand": "Maserati",
    "models": [
      "MC20",
      "Ghibli",
      "Levante",
      "Grecale",
      "MCPura",
      "Quattroporte",
      "GranTurismo"
    ]
  },
  {
    "brand": "Tesla",
    "models": [
      "Model Y",
      "Model 3",
      "Model S"
    ]
  },
  {
    "brand": "Isuzu",
    "models": [
      "V-Cross",
      "MU-X"
    ]
  },
  {
    "brand": "Aston Martin",
    "models": [
      "Vanquish",
      "DB11",
      "DBX",
      "Vantage",
      "DB12"
    ]
  },
  {
    "brand": "McLaren",
    "models": [
      "750S",
      "720S",
      "GT"
    ]
  },
  {
    "brand": "Bentley",
    "models": [
      "Bentayga"
    ]
  },
  {
    "brand": "Lotus",
    "models": [
      "Emeya",
      "Eletre",
      "Emira"
    ]
  }
]

function sortModel(brand) {
  for (const car of carBrands) {
    if (car.brand === brand) {
      return car.models;
    }
  }
}

const sortedBrand = (query) => {
  const brands = carBrands.map(({ brand }) => brand)
  return brands
  // let sorted = []
  // brands.forEach((name, i) => {
  //   let brandSpriteArray = []
  //   brandSpriteArray.push(name.toLocaleUpperCase().split('').slice(0, 3))
  //   const findJoined = brandSpriteArray.map((brand) => {
  //     return [brand.join(''), i]
  //   })
  //   for (const find of findJoined) {
  //     if (find[0] === query) {
  //       sorted.push(brands[find[1]])
  //     }
  //   }
  // })
  // return sorted
}


export { sortModel, sortedBrand }

