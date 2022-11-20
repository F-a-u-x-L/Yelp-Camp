const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error : "));
db.once("open", () => {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'jBAf6XoqQpHZSLbk2ZYcXswEpQGhiyR3JQWZMYmAyKc',
                collections: 1114848,
            },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 250; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6292f4927e381a73599991ba',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            geometry:{
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora eum eius vitae molestias! Quod adipisci laboriosam id vel! Dolor temporibus amet tempora assumenda doloribus rerum possimus accusamus voluptate molestias provident?',
            images: [
                {
                  url: 'https://res.cloudinary.com/dsyxdskg2/image/upload/v1653893656/YelpCamp/qrtomtxxhfbvnuqjnm8s.jpg',
                  filename: 'YelpCamp/qrtomtxxhfbvnuqjnm8s'
                },
                {
                  url: 'https://res.cloudinary.com/dsyxdskg2/image/upload/v1653893658/YelpCamp/k4atb9we6iyqaubtbu9o.jpg',
                  filename: 'YelpCamp/k4atb9we6iyqaubtbu9o'
                },
                {
                  url: 'https://res.cloudinary.com/dsyxdskg2/image/upload/v1653893663/YelpCamp/lbeiwh7wvt634lioungg.jpg',
                  filename: 'YelpCamp/lbeiwh7wvt634lioungg'
                }
              ]
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});