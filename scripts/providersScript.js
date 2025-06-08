export const createProviders = async () => {
  const providers = [
    {
      name: "Cleopatra Hospital",
      phone: "+201012345678",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "As-Salam International Hospital",
      phone: "+201012345670",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "El Gouna Hospital",
      phone: "+201012345671",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "Dar Al Fouad Hospital",
      phone: "+201012345672",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "Saudi German Hospital",
      phone: "+201012345673",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "Al Mokhtabar Labs & Hospitals",
      phone: "+201012345674",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "Misr International Hospital",
      phone: "+201012345675",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "Cairo Specialized Hospital",
      phone: "+201012345676",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "Andalusia Hospitals Egypt",
      phone: "+201012345677",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
    {
      name: "Wadi El Neel Hospital",
      phone: "+201012345679",
      governorate: "Cairo",
      city: "New Cairo",
      district: "1st Settlement",
      workHours: "8:00 AM - 10:00 PM",
    },
  ];
  const apiEndpoint = "http://localhost:8000/api/provider/admin/add";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDU1YTQyMjhhNTdiNTZkYzExYjdkZiIsImlhdCI6MTc0OTEyMjk3MiwiZXhwIjoxNzQ5MTMzNzcyfQ.cnD01m-Rlz5O_BQYWGT3WY8cFy6PuQGCJFybhBRNXr4";

  try {
    for (let i = 0; i < providers.length; i++) {
      const provider = providers[i];
      console.log(
        `Posting provider ${i + 1}/${providers.length}: ${provider.name}`
      );

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(provider),
      });

      // Check if the response is successful
      if (response.status === 201) {
        console.log(`✅ Successfully posted provider: ${provider.name}`);
      } else {
        console.log(`❌ Failed to post provider: ${provider.name}`);
      }

      // Add a small delay between requests to avoid overwhelming the server
      if (i < providers.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms delay
      }

      if (i === providers.length - 1) {
        console.log("🎉 Providers creation script is finished");
      }
    }
  } catch (error) {
    console.error("❌ Fatal error:", error);
  }
};

createProviders();
