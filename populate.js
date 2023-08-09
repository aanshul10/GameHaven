import mongoose from 'mongoose';

//To populate  databse with products

const users = [
   {
    username: 'Admin', // or any name you want for the admin
    email: 'admin@g.com',
    password: 'admin123',
    isAdmin: true,
   },
]
   const products = [ 
     {
        //_id: mongoose.Types.ObjectId(),
        name: 'The Legend of Zelda: Breath of the Wild',
        slug: 'the-legend-of-zelda-breath-of-the-wild',
        description: 'Open world action-adventure game developed and published by Nintendo for the Nintendo Switch.',
        price: 59.99,
        imageUrl: 'images/image-1.jpg',
        //testing out of stock
        stockCount: 10,
        category: 'Action-adventure',
        console: 'Nintendo Switch'
    },
    {
        //_id: mongoose.Types.ObjectId(),
        name: 'Call of Duty: Modern Warfare',
        slug: 'call-of-duty-modern-warfare',
        description: 'First-person shooter video game developed by Infinity Ward and published by Activision.',
        price: 59.99,
        imageUrl: 'images/image-2.jpg',
        stockCount: 20,
        category: 'First-person shooter',
        console: 'PlayStation 4'
    },
    {
        //_id: mongoose.Types.ObjectId(),
        name: 'FIFA 21',
        slug: 'fifa21',
        description: 'Football simulation video game published by Electronic Arts as part of the FIFA series.',
        price: 49.99,
        imageUrl: 'images/image-3.jpg',
        stockCount: 30,
        category: 'Sports',
        console: 'Xbox One'
    },
   
    {
        //_id: mongoose.Types.ObjectId(),
        name: 'Final Fantasy VII Remake',
        slug: 'final-fantasy-vii-remake',
        description: 'Action role-playing game developed and published by Square Enix.',
        price: 59.99,
        imageUrl: 'images/image-4.jpg',
        stockCount: 15,
        category: 'Role-playing',
        console: 'PlayStation 4'
    },
    {
        //_id: mongoose.Types.ObjectId(),
        name: 'Animal Crossing: New Horizons',
        slug:  'animal-crossing-new-horizons',
        description: 'Social simulation video game developed and published by Nintendo.',
        price: 59.99,
        imageUrl: 'images/image-5.jpg',
        stockCount: 25,
        category: 'Simulation',
        console: 'Nintendo Switch'
    },
    
    {
        name: 'Super Mario Odyssey',
        slug: 'super-mario-odyssey',
        description: 'Platform game developed and published by Nintendo for the Nintendo Switch.',
        price: 49.99,
        imageUrl: 'images/image-6.jpg',
        stockCount: 18,
        category: 'Platform',
        console: 'Nintendo Switch'
      },
      {
        name: 'God of War',
        slug: 'god-of-war',
        description: 'Action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment.',
        price: 59.99,
        imageUrl: 'images/image-7.jpg',
        stockCount: 22,
        category: 'Action-adventure',
        console: 'PlayStation 4'
      },
      {
        name: 'Halo: The Master Chief Collection',
        slug: 'halo-the-master-chief-collection',
        description: 'Compilation of first-person shooter video games in the Halo series for the Xbox One and later on PC.',
        price: 39.99,
        imageUrl: 'images/image-8.jpg',
        stockCount: 15,
        category: 'First-person shooter',
        console: 'Xbox One'
      },
      {
        name: 'Red Dead Redemption 2',
        slug: 'red-dead-redemption-2',
        description: 'Western-themed action-adventure game developed and published by Rockstar Games.',
        price: 59.99,
        imageUrl: 'images/image-9.jpg',
        stockCount: 12,
        category: 'Action-adventure',
        console: 'PlayStation 4'
      },
      {
        name: 'Grand Theft Auto V',
        slug: 'grand-theft-auto-v',
        description: 'Action-adventure game developed by Rockstar North and published by Rockstar Games.',
        price: 29.99,
        imageUrl: 'images/image-10.jpg',
        stockCount: 30,
        category: 'Action-adventure',
        console: 'PlayStation 4'
      },
      {
        name: 'The Elder Scrolls V: Skyrim',
        slug: 'the-elder-scrolls-v-skyrim',
        description: 'Open world action role-playing video game developed by Bethesda Game Studios.',
        price: 19.99,
        imageUrl: 'images/image-11.jpg',
        stockCount: 25,
        category: 'Role-playing',
        console: 'Nintendo Switch'
      },
      {
        name: 'The Last of Us Part II',
        slug: 'the-last-of-us-part-ii',
        description: 'Action-adventure game developed by Naughty Dog and published by Sony Interactive Entertainment.',
        price: 59.99,
        imageUrl: 'images/image-12.jpg',
        stockCount: 15,
        category: 'Action-adventure',
        console: 'PlayStation 4'
      },
   ];

export {users, products};
