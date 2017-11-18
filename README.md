# Proxies, Queues, Cache Fluency With Redis

Understanding the basic building blocks that form complex infrastructure is an important precedent to being able to construct and deploy it.

Building Infrastructure

In this I have combined redis with server-side web technologies to demonstrate concepts related to caches and queues.

Following features has been implemented:
- Created two routes, /get and /set.
- When /set is visited, a new key is set, with the value: "this message will self-destruct in 10 seconds".
- Used the expire command to make sure this key will expire in 10 seconds.
- When /get is visited, the key is fetched and its value is sent back to the client.
- A new route, /recent, which will display the most recently visited sites is created.
- Implemented two routes, /upload, and /meow
  - /upload - To upload new images : curl -F "image=@./img/morning.jpg" localhost:3000/upload
  - /meow - To fetch images./meow will display the most recent image to the client and remove the image from the queue. Note, this is more like a stack
- Implemented a new route catfact/:num which will retrieve the nth cat fact from the catfacts.txt. The catfact route will create a key, e.g., catfact:13, whenever a catfact is retrieved. This key expires in 10 seconds. Next, the key is retrieved from redis if it is available, otherwise, retrieved from disk. With the value of the key, the time in ms to retrieve the key is also returned.
- Implemented a new route, "toggleCacheFeature", which will turn on and off the catfact caching feature.
