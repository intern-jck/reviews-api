<<<<<<< HEAD
Start MongoDB
sudo systemctl start mongod

Verify
sudo systemctl status mongod

Starts after reboot
sudo systemctl enable mongod

Stop
sudo systemctl stop mongod

Restart
sudo systemctl restart mongod

Use Shell
mongosh

for redoing database

for redoing database

Drop collection
db.reviews.drop()
Create new one
db.createCollection('reviews')
Set index
db.reviews.createIndex({'product_id': 1}, {unique: true})
db.reviews.createIndex({'reviews_id': 1}, {unique: true})
Find last document
db.reviews.find().sort({_id: -1}).limit(1)
db.reviews.find({'product_id': '2'})
=======
# reviews-api
>>>>>>> 28cbed3f8a5b8fa07055e98625e7d14aa16fd36f
