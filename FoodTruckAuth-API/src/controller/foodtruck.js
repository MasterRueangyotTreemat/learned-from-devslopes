import mongoose from 'mongoose';
import { Router } from 'express';
import FoodTruck from '../model/foodtruck';
import Review from '../model/review';

import { authenticate } from '../middleware/authMiddleware';


export default({config,db}) => {
    const api = Router();

    //CRUD - Create Read Update Delete
    // '/v1/foodtruck/add' - Create
    api.post('/add', authenticate, (req,res) => {
        const newFoodTruck = new FoodTruck();// FoodTruck is mongoose model
        newFoodTruck.name = req.body.name;
        newFoodTruck.foodtype = req.body.foodtype;
        newFoodTruck.avgcost = req.body.avgcost;
        newFoodTruck.geometry.coordinates = req.body.geometry.coordinates;



        newFoodTruck.save( err => {
            if(err){
                res.send(err);
            }
            res.json({message: 'FoodTruck saved successfully'});
        });
    });

    // '/v1/foodtruck' - Read
    api.get('/', authenticate, (req,res) => {
        FoodTruck.find({}, (err, foodtruck) => {
            if(err){
                res.send(err);
            }
            res.json(foodtruck);
        });
    });

    // '/v1/foodtruck/:id' - Read

    api.get('/:id', (req,res) => {
        FoodTruck.findById(req.params.id, (err, foodtruck) => {
            if(err){
                res.send(err);
            }
            res.json(foodtruck);
        });
    });

    // '/v1/foodtruck/:id' - Upadate
    api.put('/:id', (req,res) => {
        FoodTruck.findById(req.params.id, (err, foodtruck) => {
            if(err){
                res.send(err);
            }
            foodtruck.name = req.body.name;
            foodtruck.save(err => {
                if(err){
                    res.send(err);
                }
                res.json({message:'FoodTruck info updated'})
            });
        });
    });

    // '/v1/foodtruck/:id' - Delete
    api.delete('/:id',(req,res) => {
        FoodTruck.remove({
            _id:req.params.id
        }, (err,foodtruck) => {
            if(err){
                res.send(err);
            }
            res.json({message:'FoodTruck successfully Removed'});
        });
    });

    // add review for a specific foodtruck id
    // '/v1/foodtruck/reviews/add/:id'
    
    api.post('/reviews/add/:id', (req,res) => {
        FoodTruck.findById(req.params.id, ( err, foodtruck) => {
            if(err){
                res.send(err);
            }
            const newReview = new  Review();

            newReview.title = req.body.title;
            newReview.text = req.body.text;
            newReview.foodtruck = foodtruck._id;
            newReview.save((err, review) => {
                if(err){
                    res.send(err);
                }
                foodtruck.reviews.push(newReview);
                foodtruck.save(err => {
                    if(err){
                        res.send(err);
                    }
                    res.json({message: 'Food Truck review saved!'});
                });
            });
        });
    });

    //get reviews for a specific food fruck id
    // '/v1/foodtruck/reviews/:id'
    api.get('/reviews/:id', (req,res) => {
        Review.find({foodtruck: req.params.id}, (err, reviews) => {
            if(err){
                res.send(err);
            }
            res.json(reviews);
        });
    });



    return api;
}