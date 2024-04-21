'use server'
import prisma from "../prisma"

export const createOrUpdateUser = async (id, first_name, image_url, email_addresses) => {
    try {
          // Try to find the user by clerkId
          let user = await prisma.user.findFirst({
            where: {
                clerkId: id
            }
        });

        // If user exists, update the user
        if (user) {
            user = await prisma.user.update({
                where: {
                    clerkId: id
                },
                data: {
                    name: first_name,
                    email: email_addresses[0].email_addresses,
                    image: image_url
                }
            });
        } else {
            // If user doesn't exist, create a new user
            user = await prisma.user.create({
                data: {
                    clerkId: id,
                    name: first_name,
                    email: email_addresses[0].email_addresses,
                    image: image_url
                }
            });
        }

        return user;
    } catch (error) {
        
    }
}