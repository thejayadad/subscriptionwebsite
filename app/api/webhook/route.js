import { Webhook } from "svix";
import { headers } from "next/headers";
import { createOrUpdateUser } from "@/lib/actions/create-user";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


// webhook code
export async function POST(req) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  
    if (!WEBHOOK_SECRET) {
      throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }
  
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");
  
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occurred -- no svix headers", { status: 400 });
    }
  
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;
  
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }
  
    const eventType = evt?.type;
  
    console.log("Received event type:", eventType);
    console.log("Received data:", evt?.data);
  
    if (eventType === "user.created" || eventType === "user.updated") {
      const { id, first_name, last_name, image_url, email_addresses, username } = evt?.data;
  
      try {
        await prisma.user.upsert({
            where: {
                id:id,
                name: first_name,
                image: image_url,
                email: email_addresses[0].email_addresses
            }
        })
  
        console.log("User created or updated:", user);
  
        return new Response("User is created or updated", { status: 200 });
      } catch (err) {
        console.error("Error creating or updating user:", err);
        return new Response("Error occurred", { status: 500 });
      }
    }
  }
  

  