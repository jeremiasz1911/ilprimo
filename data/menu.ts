export interface MenuItem {
  id: string;
  slug: string;
  category: string;
  name: string;
  price: string;
  shortDescription: string;
  longDescription: string;
  ingredients: string[];
  allergens: string[];
  image: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  isGlutenFree: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

/** Lokalne zdjęcia restauracji IL PRIMO */
export const localImages = {
  logo: "/images/logo.png",
  hero: "/images/glowne.jpg",
  about: "/images/onas.jpg",
  danie1: "/images/danie1.jpg",
  danie2: "/images/danie2.jpg",
} as const;

/**
 * Tymczasowe zdjęcia stockowe z Unsplash (darmowa licencja Unsplash).
 * Do podmiany na własne fotografie potraw z restauracji.
 */
const temp = {
  caprese:
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80",
  antipasto:
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
  bolognese:
    "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&q=80",
  lasagne:
    "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&q=80",
  risotto:
    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
  pesto:
    "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&q=80",
  vongole:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  pappardelle:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  ravioli:
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80",
  tiramisu:
    "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  pannaCotta:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
  cannoli:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80",
  espresso:
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  cappuccino:
    "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
  latte:
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80",
  spritz:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
  negroni:
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
  prosecco:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
  redWine:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
  whiteWine:
    "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=800&q=80",
  sanPellegrino:
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
  acquaPanna:
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
  lemonade:
    "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80",
  orangeJuice:
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80",
  cola:
    "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&q=80",
  grappa:
    "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=800&q=80",
} as const;

export const menuCategories: MenuCategory[] = [
  {
    id: "przystawki",
    name: "PRZYSTAWKI",
    items: [
      {
        id: "bruschetta-classica",
        slug: "bruschetta-classica",
        category: "PRZYSTAWKI",
        name: "Bruschetta Classica",
        price: "24 zł",
        shortDescription:
          "Chrupiące grzanki z pomidorami, bazylią i oliwą z oliwek extra vergine.",
        longDescription:
          "Tradycyjna włoska bruschetta przygotowywana ze świeżo pieczonego chleba, dojrzałych pomidorów, świeżej bazylii i najlepszej oliwy z oliwek extra vergine. Idealna jako lekki początek posiłku w prawdziwie śródziemnomorskim stylu.",
        ingredients: [
          "grzanki",
          "pomidory",
          "bazylia",
          "czosnek",
          "oliwa z oliwek extra vergine",
        ],
        allergens: ["gluten"],
        image: localImages.danie1,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: false,
      },
      {
        id: "carpaccio-di-manzo",
        slug: "carpaccio-di-manzo",
        category: "PRZYSTAWKI",
        name: "Carpaccio di Manzo",
        price: "38 zł",
        shortDescription:
          "Cienkie plastry wołowiny z rukolą, parmezanem i kremem balsamicznym.",
        longDescription:
          "Delikatne, cienko krojone plastry wołowiny podawane z rukolą, wiórkami parmezanu i kremem balsamicznym. Klasyczna przystawka o wyrafinowanym smaku i eleganckiej prezentacji.",
        ingredients: [
          "wołowina",
          "rukola",
          "parmezan",
          "oliwa z oliwek",
          "sos balsamiczny",
        ],
        allergens: ["mleko"],
        image: localImages.danie2,
        isVegetarian: false,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "caprese",
        slug: "caprese",
        category: "PRZYSTAWKI",
        name: "Caprese",
        price: "28 zł",
        shortDescription:
          "Mozzarella di bufala, świeże pomidory, bazylia i oliwa z oliwek.",
        longDescription:
          "Kultowa sałatka caprese z kremową mozzarellą di bufala, soczystymi pomidorami i świeżą bazylią. Prosta, lecz doskonała kompozycja smaków południowych Włoch.",
        ingredients: [
          "mozzarella di bufala",
          "pomidory",
          "bazylia",
          "oliwa z oliwek",
        ],
        allergens: ["mleko"],
        image: temp.caprese,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "antipasto-misto",
        slug: "antipasto-misto",
        category: "PRZYSTAWKI",
        name: "Antipasto Misto",
        price: "42 zł",
        shortDescription:
          "Wybór włoskich wędlin, serów, marynowanych warzyw i oliwek.",
        longDescription:
          "Obfita deska antipasto z dojrzałymi włoskimi wędlinami, wyselekcjonowanymi serami, marynowanymi warzywami i oliwkami. Doskonała do dzielenia się na początku wspólnego posiłku.",
        ingredients: [
          "wędliny",
          "sery",
          "oliwki",
          "marynowane warzywa",
          "oliwa z oliwek",
        ],
        allergens: ["mleko", "siarczyny"],
        image: temp.antipasto,
        isVegetarian: false,
        isSpicy: false,
        isGlutenFree: true,
      },
    ],
  },
  {
    id: "makarony",
    name: "MAKARONY",
    items: [
      {
        id: "spaghetti-carbonara",
        slug: "spaghetti-carbonara",
        category: "MAKARONY",
        name: "Spaghetti Carbonara",
        price: "36 zł",
        shortDescription:
          "Klasyczne spaghetti z guanciale, żółtkiem jajka i pecorino romano.",
        longDescription:
          "Tradycyjna carbonara przygotowana na bazie makaronu spaghetti, jajek, sera pecorino romano, pieprzu i dojrzewającego guanciale. Kremowy sos bez śmietany — zgodnie z rzymską recepturą.",
        ingredients: [
          "spaghetti",
          "guanciale",
          "żółtka jajek",
          "pecorino romano",
          "pieprz",
        ],
        allergens: ["gluten", "jajka", "mleko"],
        image: localImages.danie1,
        isVegetarian: false,
        isSpicy: false,
        isGlutenFree: false,
      },
      {
        id: "penne-arrabbiata",
        slug: "penne-arrabbiata",
        category: "MAKARONY",
        name: "Penne all'Arrabbiata",
        price: "32 zł",
        shortDescription:
          "Penne w ostrym sosie pomidorowym z czosnkiem i pietruszką.",
        longDescription:
          "Penne w aromatycznym, lekko ostrym sosie pomidorowym z czosnkiem, chili i świeżą pietruszką. Wyraziste danie dla miłośników klasycznych, mocnych włoskich smaków.",
        ingredients: [
          "penne",
          "pomidory",
          "czosnek",
          "chili",
          "pietruszka",
          "oliwa z oliwek",
        ],
        allergens: ["gluten"],
        image: localImages.danie2,
        isVegetarian: true,
        isSpicy: true,
        isGlutenFree: false,
      },
      {
        id: "tagliatelle-al-ragu",
        slug: "tagliatelle-al-ragu",
        category: "MAKARONY",
        name: "Tagliatelle al Ragù",
        price: "38 zł",
        shortDescription:
          "Domowy sos mięsny bolognese na świeżych tagliatelle.",
        longDescription:
          "Świeże tagliatelle podane z powolnym ragù bolognese przygotowanym z wołowiny, pomidorów i warzyw. Danie o głębokim, dojrzałym smaku i domowej charakterze.",
        ingredients: [
          "tagliatelle",
          "wołowina",
          "pomidory",
          "marchewka",
          "seler",
          "cebula",
          "parmezan",
        ],
        allergens: ["gluten", "mleko"],
        image: temp.bolognese,
        isVegetarian: false,
        isSpicy: false,
        isGlutenFree: false,
      },
      {
        id: "lasagne-della-casa",
        slug: "lasagne-della-casa",
        category: "MAKARONY",
        name: "Lasagne della Casa",
        price: "40 zł",
        shortDescription:
          "Tradycyjna lasagne z mięsem, beszamelem i parmezanem.",
        longDescription:
          "Domowa lasagne z warstwami makaronu, mięsnego sosu, beszamelu i parmezanu, zapiekana do złotego koloru. Syte, klasyczne danie kuchni włoskiej.",
        ingredients: [
          "makaron lasagne",
          "mięso mielone",
          "beszamel",
          "parmezan",
          "pomidory",
        ],
        allergens: ["gluten", "mleko", "jajka"],
        image: temp.lasagne,
        isVegetarian: false,
        isSpicy: false,
        isGlutenFree: false,
      },
      {
        id: "risotto-ai-funghi",
        slug: "risotto-ai-funghi",
        category: "MAKARONY",
        name: "Risotto ai Funghi",
        price: "42 zł",
        shortDescription:
          "Kremowe risotto z mieszanką leśnych grzybów i parmezanem.",
        longDescription:
          "Kremowe risotto gotowane na bulionie z mieszanką leśnych grzybów, masłem i parmezanem. Delikatne, aromatyczne danie o jedwabistej konsystencji.",
        ingredients: [
          "ryż arborio",
          "grzyby leśne",
          "parmezan",
          "masło",
          "bulion warzywny",
          "cebula",
        ],
        allergens: ["mleko"],
        image: temp.risotto,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "gnocchi-al-pesto",
        slug: "gnocchi-al-pesto",
        category: "MAKARONY",
        name: "Gnocchi al Pesto",
        price: "34 zł",
        shortDescription:
          "Domowe gnocchi z sosem pesto genovese i piniowymi orzechami.",
        longDescription:
          "Miękkie, domowe gnocchi podane z aromatycznym pesto genovese z bazylii, parmezanu, orzechów piniowych i oliwy. Lekkie, świeże i pełne ziół.",
        ingredients: [
          "gnocchi",
          "bazylia",
          "parmezan",
          "orzechy piniowe",
          "oliwa z oliwek",
          "czosnek",
        ],
        allergens: ["gluten", "mleko", "orzechy"],
        image: temp.pesto,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: false,
      },
      {
        id: "spaghetti-alle-vongole",
        slug: "spaghetti-alle-vongole",
        category: "MAKARONY",
        name: "Spaghetti alle Vongole",
        price: "44 zł",
        shortDescription:
          "Spaghetti z małżami w białym winie, czosnku i pietruszce.",
        longDescription:
          "Klasyczne spaghetti alle vongole z małżami duszonimi w białym winie z czosnkiem, oliwą i pietruszką. Danie morskie o czystym, eleganckim smaku.",
        ingredients: [
          "spaghetti",
          "małże",
          "białe wino",
          "czosnek",
          "pietruszka",
          "oliwa z oliwek",
        ],
        allergens: ["gluten", "skorupiaki", "siarczyny"],
        image: temp.vongole,
        isVegetarian: false,
        isSpicy: false,
        isGlutenFree: false,
      },
      {
        id: "pappardelle-al-cinghiale",
        slug: "pappardelle-al-cinghiale",
        category: "MAKARONY",
        name: "Pappardelle al Cinghiale",
        price: "46 zł",
        shortDescription:
          "Szerokie pappardelle z sosem z dzika i czerwonego wina.",
        longDescription:
          "Szerokie pappardelle z długo duszonym sosem z mięsa dzika, czerwonego wina i ziół. Wyraziste, rustykalne danie inspirowane kuchnią toskańską.",
        ingredients: [
          "pappardelle",
          "mięso dzika",
          "czerwone wino",
          "pomidory",
          "cebula",
          "zioła prowansalskie",
        ],
        allergens: ["gluten"],
        image: temp.pappardelle,
        isVegetarian: false,
        isSpicy: false,
        isGlutenFree: false,
      },
      {
        id: "ravioli-ricotta-spinaci",
        slug: "ravioli-ricotta-spinaci",
        category: "MAKARONY",
        name: "Ravioli di Ricotta e Spinaci",
        price: "38 zł",
        shortDescription:
          "Domowe ravioli z ricottą i szpinakiem w maślanym sosie szałwiowym.",
        longDescription:
          "Ręcznie robione ravioli z delikatnym farszem z ricotty i szpinaku, podane w maślanym sosie z liśćmi szałwii. Subtelne, eleganckie danie o kremowej konsystencji.",
        ingredients: [
          "ravioli",
          "ricotta",
          "szpinak",
          "masło",
          "szałwia",
          "parmezan",
        ],
        allergens: ["gluten", "mleko", "jajka"],
        image: temp.ravioli,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: false,
      },
    ],
  },
  {
    id: "desery",
    name: "DESERY",
    items: [
      {
        id: "tiramisu",
        slug: "tiramisu",
        category: "DESERY",
        name: "Tiramisù",
        price: "22 zł",
        shortDescription: "Klasyczny deser z mascarpone, espresso i kakao.",
        longDescription:
          "Tradycyjne tiramisù z warstwami biszkoptów nasączonych espresso, kremu mascarpone i kakao. Kultowy włoski deser o aksamitnej, wyrafinowanej strukturze.",
        ingredients: [
          "mascarpone",
          "biszkopty savoiardi",
          "espresso",
          "kakao",
          "jajka",
        ],
        allergens: ["gluten", "mleko", "jajka"],
        image: temp.tiramisu,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: false,
      },
      {
        id: "panna-cotta",
        slug: "panna-cotta",
        category: "DESERY",
        name: "Panna Cotta",
        price: "20 zł",
        shortDescription:
          "Delikatna panna cotta z sosem z owoców leśnych.",
        longDescription:
          "Jedwabista panna cotta o lekkiej konsystencji, podana z aromatycznym sosem z owoców leśnych. Subtelny deser, który idealnie kończy posiłek.",
        ingredients: [
          "śmietanka",
          "cukier",
          "żelatyna",
          "wanilia",
          "owoce leśne",
        ],
        allergens: ["mleko"],
        image: temp.pannaCotta,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "cannoli-siciliani",
        slug: "cannoli-siciliani",
        category: "DESERY",
        name: "Cannoli Siciliani",
        price: "24 zł",
        shortDescription:
          "Chrupiące rurki z ricottą, kandyzowanymi owocami i pistacjami.",
        longDescription:
          "Sycylijskie cannoli ze chrupiącymi rurkami wypełnionymi słodką ricottą, kandyzowanymi owocami i pistacjami. Deser o wyrazistej teksturze i słonecznym charakterze.",
        ingredients: [
          "rurka cannoli",
          "ricotta",
          "kandyzowane owoce",
          "pistacje",
          "cukier puder",
        ],
        allergens: ["gluten", "mleko", "orzechy"],
        image: temp.cannoli,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: false,
      },
    ],
  },
  {
    id: "napoje",
    name: "NAPOJE",
    items: [
      {
        id: "espresso",
        slug: "espresso",
        category: "NAPOJE",
        name: "Espresso",
        price: "10 zł",
        shortDescription: "Włoska kawa espresso.",
        longDescription:
          "Klasyczne włoskie espresso zaparzone ze starannie wyselekcjonowanych ziaren. Intensywne, aromatyczne i idealne jako zakończenie posiłku.",
        ingredients: ["ziarna kawy arabica"],
        allergens: [],
        image: temp.espresso,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "cappuccino",
        slug: "cappuccino",
        category: "NAPOJE",
        name: "Cappuccino",
        price: "14 zł",
        shortDescription: "Espresso z mlekiem i pianką.",
        longDescription:
          "Cappuccino przygotowane na bazie espresso z dodatkiem spienionego mleka i delikatnej pianki. Kremowe, zrównoważone i idealne na poranek lub popołudnie.",
        ingredients: ["espresso", "mleko"],
        allergens: ["mleko"],
        image: temp.cappuccino,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "latte-macchiato",
        slug: "latte-macchiato",
        category: "NAPOJE",
        name: "Latte Macchiato",
        price: "14 zł",
        shortDescription: "Mleko z espresso i delikatną pianką.",
        longDescription:
          "Latte macchiato z warstwą spienionego mleka i espresso. Łagodny napój kawowy o kremowej konsystencji i eleganckiej prezentacji.",
        ingredients: ["mleko", "espresso"],
        allergens: ["mleko"],
        image: temp.latte,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "aperol-spritz",
        slug: "aperol-spritz",
        category: "NAPOJE",
        name: "Aperol Spritz",
        price: "24 zł",
        shortDescription:
          "Aperol, prosecco i woda gazowana z pomarańczą.",
        longDescription:
          "Kultowy aperitivo z Aperolu, prosecco i wodą gazowaną, podany z plasterkiem pomarańczy. Orzeźwiający, lekko gorzki napój idealny przed posiłkiem.",
        ingredients: ["Aperol", "prosecco", "woda gazowana", "pomarańcza"],
        allergens: ["siarczyny"],
        image: temp.spritz,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "negroni",
        slug: "negroni",
        category: "NAPOJE",
        name: "Negroni",
        price: "28 zł",
        shortDescription: "Gin, Campari i słodki wermut.",
        longDescription:
          "Klasyczny Negroni na bazie ginu, Campari i słodkiego wermutu. Wyrazisty, elegancki koktajl o charakterystycznym, lekko gorzkim profilu smakowym.",
        ingredients: ["gin", "Campari", "wermut słodki", "kostka lodu"],
        allergens: [],
        image: temp.negroni,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "prosecco",
        slug: "prosecco",
        category: "NAPOJE",
        name: "Prosecco",
        price: "18 zł",
        shortDescription: "Kieliszek włoskiego prosecco.",
        longDescription:
          "Lekkie, musujące prosecco z północnych Włoch. Świeże, owocowe i doskonałe jako aperitivo lub towarzysz lekkich dań.",
        ingredients: ["wino musujące prosecco"],
        allergens: ["siarczyny"],
        image: temp.prosecco,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "chianti-classico",
        slug: "chianti-classico",
        category: "NAPOJE",
        name: "Chianti Classico",
        price: "22 zł",
        shortDescription: "Kieliszek czerwonego wina z Toskanii.",
        longDescription:
          "Chianti Classico — eleganckie czerwone wino z Toskanii o wyrazistej strukturze i nutach czerwonych owoców. Idealne do dań mięsnych i makaronów.",
        ingredients: ["wino czerwone Chianti Classico"],
        allergens: ["siarczyny"],
        image: temp.redWine,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "pinot-grigio",
        slug: "pinot-grigio",
        category: "NAPOJE",
        name: "Pinot Grigio",
        price: "20 zł",
        shortDescription: "Kieliszek białego wina z północnych Włoch.",
        longDescription:
          "Pinot Grigio — świeże, lekkie białe wino o delikatnym, owocowym profilu. Doskonale komponuje się z rybami, owocami morza i lekkimi przystawkami.",
        ingredients: ["wino białe Pinot Grigio"],
        allergens: ["siarczyny"],
        image: temp.whiteWine,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "san-pellegrino",
        slug: "san-pellegrino",
        category: "NAPOJE",
        name: "San Pellegrino",
        price: "10 zł",
        shortDescription: "Włoska woda mineralna gazowana 0,5 l.",
        longDescription:
          "Orzeźwiająca włoska woda mineralna gazowana San Pellegrino. Idealna do oczyszczenia podniebienia i towarzyszenia włoskim daniom.",
        ingredients: ["woda mineralna gazowana"],
        allergens: [],
        image: temp.sanPellegrino,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "acqua-panna",
        slug: "acqua-panna",
        category: "NAPOJE",
        name: "Acqua Panna",
        price: "10 zł",
        shortDescription: "Włoska woda mineralna niegazowana 0,5 l.",
        longDescription:
          "Delikatna, niegazowana woda mineralna Acqua Panna z toskańskich źródeł. Subtelna i elegancka, doskonała do wody stołowej.",
        ingredients: ["woda mineralna niegazowana"],
        allergens: [],
        image: temp.acquaPanna,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "limonata",
        slug: "limonata",
        category: "NAPOJE",
        name: "Limonata",
        price: "12 zł",
        shortDescription: "Domowa lemoniada z cytryną i miętą.",
        longDescription:
          "Domowa lemoniada przygotowana ze świeżych cytryn i mięty. Naturalnie orzeźwiająca, idealna w ciepłe dni.",
        ingredients: ["cytryna", "woda", "cukier", "mięta"],
        allergens: [],
        image: temp.lemonade,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "coca-cola",
        slug: "coca-cola",
        category: "NAPOJE",
        name: "Coca-Cola",
        price: "10 zł",
        shortDescription: "Coca-Cola 0,33 l.",
        longDescription:
          "Klasyczna Coca-Cola podawana schłodzona w butelce 0,33 l.",
        ingredients: ["woda gazowana", "cukier", "naturalne aromaty"],
        allergens: [],
        image: temp.cola,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "sok-pomaranczowy",
        slug: "sok-pomaranczowy",
        category: "NAPOJE",
        name: "Sok pomarańczowy",
        price: "12 zł",
        shortDescription: "Świeżo wyciskany sok pomarańczowy.",
        longDescription:
          "Świeżo wyciskany sok z dojrzałych pomarańczy, podawany natychmiast po przygotowaniu. Naturalnie słodki i pełen witaminy C.",
        ingredients: ["pomarańcze"],
        allergens: [],
        image: temp.orangeJuice,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
      {
        id: "grappa",
        slug: "grappa",
        category: "NAPOJE",
        name: "Grappa",
        price: "18 zł",
        shortDescription: "Tradycyjna włoska grappa 40 ml.",
        longDescription:
          "Tradycyjna włoska grappa destylowana z winogron. Mocny, aromatyczny trawieniec idealny po deserze lub espresso.",
        ingredients: ["grappa"],
        allergens: [],
        image: temp.grappa,
        isVegetarian: true,
        isSpicy: false,
        isGlutenFree: true,
      },
    ],
  },
];

export function getAllMenuItems(): MenuItem[] {
  return menuCategories.flatMap((category) => category.items);
}

export function getMenuItemBySlug(slug: string): MenuItem | undefined {
  return getAllMenuItems().find((item) => item.slug === slug);
}

export function getAllMenuSlugs(): string[] {
  return getAllMenuItems().map((item) => item.slug);
}
