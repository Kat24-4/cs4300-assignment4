# Katherine Tse Assignment 4 - Reaction Diffusion 

## Explanation

After implementing the algorithm, I added controls for diffusion of A, diffusion of B, feed rate, and kill rate. I did some research to figure out what the ideal ranges for each of these values is and made sure to ensure that users could not go outside of them. After that, I also added a folder where you can see some recommended feed and kill values to use that will create different patterns. I included values for “spots, stripes, and coral patterns”, “mitosis cell divisions pattern”, and “fingerprint coral pattern”. The option I tried to explore was orientation and trying to get two sides of the screen to populate differently. I found that changing how I seeded the algorithm to start created really interesting shapes that you could then mess around with by changing the various controls from above. Additionally, I tried to seed the program starting at the center of the screen to really visually show the split from the left and the right. On some screens, the seeding creates a line down the center of the screen that creates a visual division between the left and right halves. I am not sure why it is not consistent across all computers however. 

## How to Run the Repo

This repo utilizes http-server to generate a local server to run the website on. 

You should be able to just run `npm install` and then run `http-server .` to run the server. 
