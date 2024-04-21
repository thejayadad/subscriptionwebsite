'use server'
import prisma from "../prisma"


  // createOrUpdateUser function
  export const createOrUpdateUser = async (
    id,
    first_name,
    last_name,
    image_url,
    email_addresses,
    username
  ) => {
    try {
      console.log("Searching for user with clerkId:", id);
      let user = await prisma.user.findFirst({
        where: {
          clerkId: id,
        },
      });
  
      if (user) {
        console.log("User found. Updating user details.");
        user = await prisma.user.update({
          where: {
            clerkId: id,
          },
          data: {
            name: `${first_name} ${last_name}`,
            email: email_addresses[0]?.email,
            image: image_url,
            username: username,
          },
        });
      } else {
        console.log("User not found. Creating new user.");
        user = await prisma.user.create({
          data: {
            clerkId: id,
            name: `${first_name} ${last_name}`,
            email: email_addresses[0]?.email,
            image: image_url,
            username: username,
          },
        });
      }
  
      console.log("User details after operation:", user);
      return user;
    } catch (error) {
      console.error("Error in createOrUpdateUser:", error);
      throw error;
    }
  };