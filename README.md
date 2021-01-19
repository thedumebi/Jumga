# Jumga
Flutterwave Dev Challenge
This Jumga app is done using MERN stack (MongoDb, Express, React and Node).

Frontend
The Frontend of the project was built with Javascript on React with React Bootstrap for styling.

Backend
The Backend of the project was built with Javascript on Node(Express) with MongoDB as the database.

Description
Jumga is an e-commerce market place for vendors, customers and dispatch riders that offers services in different countries.
Feautues at this point include:
Secure User Registration and Authentication using Passport
Shop Creation
Shop management (Adding items to shops by vendors)
Product sales
Payment integration with Flutterwave
Purchase History
Product view with images
Dispatch riders assignment
Favorite products so you can get them later

Project Flow
Three sets of people can sign up on Jumga - Vendors, Clients (read as customers) and Dispatch riders. Depending on the role signed up or logged in as, different features are available. For vendors, they can create shops pending payment approval, add items to those shops, purchase or favorite items from other shops that are not theirs. For clients, they can buy/favorite items and for dispatch they can also buy just as clients but they also have shops they are assigned to to make deliveries for.

Shop Creation
Only vendors can create shops and the vendor provides some information and then payment is made. The payment carries the information about the shop and carries a flag of "pending". Once payment is verified, the status changes to "verified" and the shop is created. Once the shop is created, a dispatch rider is assigned to the shop.

Shop and Item Management
Only the Vendor that created the shop can make changes to it. For now, the vendor can create more shops pending approval and then in each shop, the vendor can add items with images, price and available quantity etc.

Product Sales
Any type of user can buy items/ add to favorites but for vendors, they cannot buy items that are theirs. When a user inputs the number of an item to buy and clicks buy, the details of the transaction are passed to the flutterwave payment checkout modal where the user can then input their details and then once transaction is verified, value is given to the user ie added to the user's bought items, the number of items bought is deducted from the available quantity and revenue is given to the dispatch rider and the shop. The delivery amounts and commissions are precalclated and the values are saved in each transaction receipt.

Three sets of people can perform operations (Vendors, Clients (read customers) and Dispatch). 
When a shop is registered, the assignDispatch function is called and an available dispatch rider is assigned to the shop. 
I made use of the flutterwave v3 /payment endpoint instead of the /card endpoint because I do not want to collect card details in any instance.
Similarly, when a user wants to buy an item, the payment end point is also called and then once transaction is verified, value is given to the customer.













Disclaimer: I am fairly new at programming and especially new with fullstack development (two months) so there might be better ways to do somethings I did 
and as time passes I’d update some things. Cheers.
