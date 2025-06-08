import fs from "fs";
import path from "path";

export const createProducts = async () => {
  const products = [
    {
      name: "Children’s Immunity Booster Pack",
      price: 610,
      description: [
        "Immunity Syrup (El-Hawag Black Seed Syrup) - 100 EGP",
        "Natural Wildflower Honey (El-Shifa) - 150 EGP",
        "Propolis Drops (Apiherb) - 120 EGP",
        "Herbal Cough Syrup (Elcaptain Thyme Syrup) - 90 EGP",
        "Chamomile Herbal Tea (Abu Auf) - 60 EGP",
        "Dried Ginger for Kids (Herbal Island) - 90 EGP",
      ],
      requiredAge:
        "Kids aged 2-10 to strengthen immunity and fight colds naturally.",
      quantity: 1000,
      image: "D:/Vaccines-Reminder-Images/Children's Immunity Booster Pack.jpg",
      features: [
        "100% natural support for your child’s immune system",
        "Rich in vitamin C and zinc to help fight colds and boost daily defenses",
        "Safe and sugar-free",
      ],
    },
    {
      name: "Women’s Complete Wellness Pack",
      price: 810,
      description: [
        "Royal Jelly Capsules (HealthAid) - 250 EGP",
        "Raw Sidr Honey (Yemeni Sidr - Nature’s Gold) - 270 EGP",
        "Flaxseed Powder (Imtenan) - 90 EGP",
        "Dried Hibiscus (Abu Auf) - 60 EGP",
        "Chamomile Herbal Tea (Herbal Island) - 60 EGP",
        "Moringa Powder (Imtenan) - 80 EGP",
      ],
      requiredAge:
        "Women looking to enhance energy, hormone balance, and immunity.",
      quantity: 1000,
      image: "D:/Vaccines-Reminder-Images/Women's Complete Wellness Pack.jpg",
      features: [
        "A natural blend for women’s energy, hormone balance, and beauty support",
        "Packed with essential vitamins and herbs",
        "No additives",
      ],
    },
    {
      name: "Sleep and Relaxation Kit for Kids",
      price: 440,
      description: [
        "Chamomile and Lemon Balm Syrup (Elcaptain) - 120 EGP",
        "Lavender Herbal Tea (Imtenan) - 70 EGP",
        "Honey with Chamomile (El-Hawag) - 110 EGP",
        "Aromatic Sleep Spray (Nature’s Care) - 90 EGP",
        "Warm Herbal Bath Mix (Local Blend - Herbal Island) - 50 EGP",
      ],
      requiredAge: "Kids who experience trouble sleeping or anxiety.",
      quantity: 1000,
      image:
        "D:/Vaccines-Reminder-Images/Sleep and Relaxation Kit for Kids.jpg",
      features: [
        "Helps kids relax and sleep better with calming herbs like chamomile and lavender",
        "Gentle, safe, and 100% natural",
      ],
    },
    {
      name: "Energy and Immunity for Working Women",
      price: 820,
      description: [
        "Ginseng Capsules (Vitapharm) - 200 EGP",
        "Raw Black Seed Honey (Imtenan) - 250 EGP",
        "Green Tea with Mint (Abu Auf) - 60 EGP",
        "Maca Root Powder (Organic Traditions) - 150 EGP",
        "Lemon & Ginger Infusion (Twinings) - 60 EGP",
        "Beetroot Powder (Imtenan) - 100 EGP",
      ],
      requiredAge:
        "Active women who need daily energy, focus, and natural immunity.",
      quantity: 1000,
      image:
        "D:/Vaccines-Reminder-Images/Energy and Immunity for Working Women.jpg",
      features: [
        "Boosts energy and immunity without caffeine",
        "Made with ginseng, B12, and natural antioxidants to power your busy day",
      ],
    },
    {
      name: "Daily Care Pack for Toddlers",
      price: 520,
      description: [
        "Organic Date Syrup (Herbal Island) - 90 EGP",
        "Multivitamin Syrup (Apiherb) - 150 EGP",
        "Fennel & Anise Digestive Tea (Elcaptain) - 60 EGP",
        "Thyme & Honey Cough Mix (Elcaptain) - 90 EGP",
        "Lemon & Ginger Infusion (Twinings) - 60 EGP",
        "Natural Carob Molasses (Imtenan) - 130 EGP",
      ],
      requiredAge:
        "Toddlers aged 1-5 for growth, digestion, and daily nutritional support.",
      quantity: 1000,
      image: "D:/Vaccines-Reminder-Images/Daily Care Pack for Toddlers.jpg",
      features: [
        "Daily nutrition for toddlers with vitamin D, calcium, and omega-3",
        "Supports growth, brain, and bone health",
        "All naturally",
      ],
    },
  ];
  const apiEndpoint = "http://localhost:8000/api/products/admin/add";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDU1YTQyMjhhNTdiNTZkYzExYjdkZiIsImlhdCI6MTc0OTEyMjk3MiwiZXhwIjoxNzQ5MTMzNzcyfQ.cnD01m-Rlz5O_BQYWGT3WY8cFy6PuQGCJFybhBRNXr4";

  try {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      console.log(
        `Posting product ${i + 1}/${products.length}: ${product.name}`
      );

      // Create FormData instance
      const formData = new FormData();

      // Add product data as individual fields or as JSON
      formData.append("name", product.name);
      formData.append("price", product.price.toString());
      for (let i = 0; i < product.description.length; i++) {
        formData.append("description", product.description[i]);
      }

      formData.append("requiredAge", product.requiredAge);
      formData.append("quantity", product.quantity.toString());
      for (let i = 0; i < product.features.length; i++) {
        formData.append("features", product.features[i]);
      }

      // Read and append the image file
      if (product.image && fs.existsSync(product.image)) {
        console.log(`📸 Reading image: ${product.image}`);

        // Read the file as a buffer
        const imageBuffer = fs.readFileSync(product.image);

        // Get file extension for proper MIME type
        const ext = path.extname(product.image).toLowerCase();
        let mimeType;
        switch (ext) {
          case ".jpg":
          case ".jpeg":
            mimeType = "image/jpeg";
            break;
          case ".png":
            mimeType = "image/png";
            break;
          case ".gif":
            mimeType = "image/gif";
            break;
          case ".webp":
            mimeType = "image/webp";
            break;
          default:
            mimeType = "image/jpeg"; // default
        }

        // Create a Blob from the buffer
        const imageBlob = new Blob([imageBuffer], { type: mimeType });

        // Append the image with filename
        const filename = path.basename(product.image);
        formData.append("image", imageBlob, filename);

        console.log(`✅ Image added to form data: ${filename} (${mimeType})`);
      } else {
        console.warn(`⚠️ Image file not found: ${product.image}`);
      }

      // Make the request with FormData
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          // Don't set Content-Type header - let fetch set it automatically for FormData
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // Check if the response is successful
      if (response.status === 201) {
        console.log(`✅ Successfully posted product: ${product.name}`);
      } else {
        console.log(`❌ Failed to post product: ${product.name}`);
      }

      // Add a small delay between requests to avoid overwhelming the server
      if (i < products.length - 1) {
        console.log(`⏳ Waiting 1 second before next request...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (i === products.length - 1) {
        console.log("🎉 Products creation script is finished");
      }
    }
  } catch (error) {
    console.error("❌ Fatal error:", error);
  }
};
