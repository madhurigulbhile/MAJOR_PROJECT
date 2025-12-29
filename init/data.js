const sampleListings = [
  {
  "state": "Jharkhand",
  "generated_for": "tourism_project",
  "spots": [
    {
      "id": 1,
      "name": "Netarhat",
      "district": "Latehar",
      "short_description": "A hill station famous for spectacular sunrise/sunset points, rolling hills and quiet forests.",
      "best_time_to_visit": "October to March",
      "how_to_reach": "By road from Ranchi (~160 km) or Daltonganj; nearest major railhead: Daltonganj",
      "image_pages": [
        "https://en.m.wikipedia.org/wiki/File:Netarhat,_Jharkhand.jpg",
        "https://travelsetu.com/guide/netarhat-sunrise-point-tourism"
      ],
      "_notes": "Great for nature photography and short treks."
    },
    {
      "id": 2,
      "name": "Patratu Valley & Patratu Dam",
      "district": "Ramgarh / Patratu",
      "short_description": "A scenic valley and reservoir with winding roads, gardens and viewpoints — popular for picnics and drives.",
      "best_time_to_visit": "September to March",
      "how_to_reach": "Accessible by road from Ramgarh and Ranchi; nearest railhead: Ramgarh Cantt / Barkakana",
      "image_pages": [
        "https://ramgarh.nic.in/tourist-place/patratu-dam/"
      ],
      "_notes": "Good for sunset drives and short hikes."
    },
    {
      "id": 3,
      "name": "Betla National Park",
      "district": "Latehar / Palamu",
      "short_description": "One of Jharkhand's best wildlife areas (Palamu Tiger Reserve) with safaris, waterfalls and tribal culture nearby.",
      "best_time_to_visit": "November to February",
      "how_to_reach": "Nearest railhead: Daltonganj; road access to park gates; park-run safari options available.",
      "image_pages": [
        "https://www.india-tours.com/wildlife/betla-national-park",
        "https://en.wikipedia.org/wiki/Betla_National_Park"
      ],
      "_notes": "Book safaris in advance during peak season."
    },
    {
      "id": 4,
      "name": "Hundru Falls",
      "district": "Ranchi",
      "short_description": "A dramatic waterfall on the Subarnarekha River — one of the state's most famous falls (approx. 98 m drop).",
      "best_time_to_visit": "September to February (post-monsoon best)",
      "how_to_reach": "By road from Ranchi (~45 km); local buses and taxis available.",
      "image_pages": [
        "https://en.wikipedia.org/wiki/Hundru_Falls",
        "https://www.tripadvisor.com/Attraction_Review-g662320-d3207695-Reviews-Hundru_Falls-Ranchi_Ranchi_District_Jharkhand.html"
      ],
      "_notes": "Be careful during monsoon — strong currents."
    },
    {
      "id": 5,
      "name": "Baidyanath (Baba Baidyanath Jyotirlinga), Deoghar",
      "district": "Deoghar",
      "short_description": "Famous Shiva temple complex and one of the twelve Jyotirlingas — major pilgrimage site (Shravan month is peak).",
      "best_time_to_visit": "October to March; peak pilgrimage in July–August (Shravan)",
      "how_to_reach": "Deoghar has a railhead and small airport; road connections from major cities.",
      "image_pages": [
        "https://en.wikipedia.org/wiki/Baidyanath_Temple",
        "https://babadham.org"
      ],
      "_notes": "Expect heavy crowds during the Shravan month."
    },
    {
      "id": 6,
      "name": "Hazaribagh National Park",
      "district": "Hazaribagh",
      "short_description": "A well-known ecological park and picnic spot with woodlands, wildlife sightings and short trails.",
      "best_time_to_visit": "October to March",
      "how_to_reach": "By road from Hazaribagh town; nearest railhead: Hazaribagh Road / Koderma (depending on route).",
      "image_pages": [
        "https://tourism.jharkhand.gov.in/destinationDetails/116",
        "https://www.tripadvisor.com/Attraction_Review-g20153748-d4138789-Reviews-Hazaribagh_National_Park-Pokharia_Hazaribagh_District_Jharkhand.html"
      ],
      "_notes": "Good for short wildlife and nature excursions."
    },
    {
      "id": 7,
      "name": "Parasnath Hill (Shikharji)",
      "district": "Giridih / Parasnath area",
      "short_description": "Highest hill in Jharkhand and most sacred Jain pilgrimage site (Shikharji) — many temples along the trek routes.",
      "best_time_to_visit": "October to March",
      "how_to_reach": "Nearest railhead: Parasnath (Haslang) or Jharkhand railheads; trek routes lead up the hill.",
      "image_pages": [
        "https://www.tourmyindia.com/pilgrimage/shikharji-temple-jharkhand.html"
      ],
      "_notes": "Pilgrimage routes can be multi-day; respect local customs."
    },
    {
      "id": 8,
      "name": "Jonha (Gautamdhara) Falls",
      "district": "Ranchi",
      "short_description": "A hanging-valley waterfall near Ranchi; reachable by descent (over steps) and popular for day trips.",
      "best_time_to_visit": "September to February",
      "how_to_reach": "Short drive from Ranchi; local tourism site has visitor info.",
      "image_pages": [
        "https://en.wikipedia.org/wiki/Jonha_Falls",
        "https://ranchi.nic.in/tourist-place/jonha-fall/"
      ],
      "_notes": "There are several viewpoints; best after rains."
    },
    {
      "id": 9,
      "name": "Palamu Fort (Old & New Palamu Forts)",
      "district": "Palamu / Daltonganj area",
      "short_description": "16th-century historic forts near Betla region — ruins with scenic surroundings and historical significance.",
      "best_time_to_visit": "October to March",
      "how_to_reach": "Reach Betla/Daltonganj by rail or road; forts are a short local drive from town/park.",
      "image_pages": [
        "https://en.wikipedia.org/wiki/Palamu_fort",
        "https://jharkhand-tourism.com/palamu/"
      ],
      "_notes": "Combine with a visit to Betla National Park."
    },
    {
      "id": 10,
      "name": "McCluskieganj",
      "district": "Ranchi",
      "short_description": "A small hilly township known as 'Mini-London' for its Anglo-Indian-era houses, quiet hills and waterfalls nearby.",
      "best_time_to_visit": "October to March",
      "how_to_reach": "Around 60 km from Ranchi; reachable by road (NH routes) and local transport.",
      "image_pages": [
        "https://en.wikipedia.org/wiki/McCluskieganj",
        "https://homegrown.co.in/homegrown-explore/mccluskieganj-the-story-of-an-anglo-indian-paradise-that-once-was"
      ],
      "_notes": "Good for heritage walks, pre-wedding shoots and relaxed stays."
    }
  ]
}
]

module.exports = { data: sampleListings };