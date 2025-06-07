export const createVaccines = async () => {
  const vaccines = [
    {
      name: "Vacsera 8 (8-in-1) 1st Dose",
      requiredAge: "6 weeks",
      description:
        "prevents: Diphtheria, Tetanus, Pertussis, Polio, Hepatitis B, Haemophilus infl uenzae type B (Hib), Pneumococcus, and Rotavirus diseases",
      price: 490,
      provider: "6841a670d5ec36a1b132f937",
    },
    {
      name: "Vacsera 8 (8-in-1) 2nd Dose",
      requiredAge: "10 weeks",
      description:
        "prevents: Diphtheria, Tetanus, Pertussis, Polio, Hepatitis B, Haemophilus infl uenzae type B (Hib), Pneumococcus, and Rotavirus diseases",
      price: 490,
      provider: "6841a670d5ec36a1b132f937",
    },
    {
      name: "Vacsera 8 (8-in-1) 3rd Dose",
      requiredAge: "14 weeks",
      description:
        "prevents: Diphtheria, Tetanus, Pertussis, Polio, Hepatitis B, Haemophilus infl uenzae type B (Hib), Pneumococcus, and Rotavirus diseases",
      price: 490,
      provider: "6841a670d5ec36a1b132f937",
    },
    {
      name: "Vacsera 8 (8-in-1) 4th Dose",
      requiredAge: "1 year and 6 months",
      description:
        "prevents: Diphtheria, Tetanus, Pertussis, Polio, Hepatitis B, Haemophilus infl uenzae type B (Hib), Pneumococcus, and Rotavirus diseases",
      price: 490,
      provider: "6841a670d5ec36a1b132f937",
    },
    {
      name: "MMR (Measles, Mumps, Rubella) 1st Dose",
      requiredAge: "1 year",
      description: "prevents: Measles, Mumps, and Rubella diseases",
      price: 130,
      provider: "6841a740d5ec36a1b132f957",
    },
    {
      name: "MMR (Measles, Mumps, Rubella) 2nd Dose",
      requiredAge: "1 year and 6 months",
      description: "prevents: Measles, Mumps, and Rubella diseases",
      price: 130,
      provider: "6841a740d5ec36a1b132f957",
    },
    {
      name: "Rotarix 1st Dose",
      requiredAge: "3 months",
      description: "prevents: Rotavirus (Gastroenteritis) diseases",
      price: 450,
      provider: "6841a741d5ec36a1b132f95c",
    },
    {
      name: "Rotarix 2nd Dose",
      requiredAge: "6 months",
      description: "prevents: Rotavirus (Gastroenteritis) diseases",
      price: 450,
      provider: "6841a741d5ec36a1b132f95c",
    },
    {
      name: "RotaTeq 1st Dose",
      requiredAge: "6 weeks",
      description: "prevents: Rotavirus (Gastroenteritis) diseases",
      price: 441,
      provider: "6841a741d5ec36a1b132f95c",
    },
    {
      name: "RotaTeq 2nd Dose",
      requiredAge: "3 months",
      description: "prevents: Rotavirus (Gastroenteritis) diseases",
      price: 441,
      provider: "6841a741d5ec36a1b132f95c",
    },
    {
      name: "RotaTeq 3rd Dose",
      requiredAge: "8 months",
      description: "prevents: Rotavirus (Gastroenteritis) diseases",
      price: 441,
      provider: "6841a741d5ec36a1b132f95c",
    },
    {
      name: "Pneumococcal Conjugate Vaccine (PCV) 1st Dose",
      requiredAge: "2 months",
      description: "prevents: Pneumonia, Meningitis, and Otitis Media diseases",
      price: 490,
      provider: "6841a742d5ec36a1b132f961",
    },
    {
      name: "Pneumococcal Conjugate Vaccine (PCV) 2nd Dose",
      requiredAge: "4 months",
      description: "prevents: Pneumonia, Meningitis, and Otitis Media diseases",
      price: 490,
      provider: "6841a742d5ec36a1b132f961",
    },
    {
      name: "Pneumococcal Conjugate Vaccine (PCV) 3rd Dose",
      requiredAge: "6 months",
      description: "prevents: Pneumonia, Meningitis, and Otitis Media diseases",
      price: 490,
      provider: "6841a742d5ec36a1b132f961",
    },
    {
      name: "Pneumococcal Conjugate Vaccine (PCV) 4th Dose",
      requiredAge: "1 year and 3 months",
      description: "prevents: Pneumonia, Meningitis, and Otitis Media diseases",
      price: 490,
      provider: "6841a742d5ec36a1b132f961",
    },
    {
      name: "Varicella (Chickenpox) 1st Dose",
      requiredAge: "1 year",
      description: "prevents: Chickenpox diseases",
      price: 546,
      provider: "6841a744d5ec36a1b132f966",
    },
    {
      name: "Varicella (Chickenpox) 2nd Dose",
      requiredAge: "2 years",
      description: "prevents: Chickenpox diseases",
      price: 546,
      provider: "6841a744d5ec36a1b132f966",
    },
    {
      name: "Hepatitis A Vaccine 1st Dose",
      requiredAge: "1 year",
      description: "prevents: Hepatitis A diseases",
      price: 404,
      provider: "6841a745d5ec36a1b132f96b",
    },
    {
      name: "Hepatitis A Vaccine 2nd Dose",
      requiredAge: "1 year and 9 months",
      description: "prevents: Hepatitis A diseases",
      price: 404,
      provider: "6841a745d5ec36a1b132f96b",
    },
    {
      name: "Meningococcal ACWY 1st Dose",
      requiredAge: "9 months",
      description: "prevents: Meningococcal Meningitis diseases",
      price: 689,
      provider: "6841a746d5ec36a1b132f970",
    },
    {
      name: "Seasonal Influenza (Infl uvac) 1st Dose",
      requiredAge: "6 months",
      description: "prevents: Influenza diseases",
      price: 180,
      provider: "6841a747d5ec36a1b132f975",
    },
    {
      name: "Seasonal Influenza (Infl uvac) 2nd Dose",
      requiredAge: "1 year and 3 months",
      description: "prevents: Influenza diseases",
      price: 180,
      provider: "6841a747d5ec36a1b132f975",
    },
    {
      name: "Seasonal Influenza (Infl uvac) 3rd Dose",
      requiredAge: "2 years",
      description: "prevents: Influenza diseases",
      price: 180,
      provider: "6841a747d5ec36a1b132f975",
    },
    {
      name: "Seasonal Influenza (Infl uvac) 4th Dose",
      requiredAge: "3 years",
      description: "prevents: Influenza diseases",
      price: 180,
      provider: "6841a747d5ec36a1b132f975",
    },
    {
      name: "Seasonal Influenza (Infl uvac) 5th Dose",
      requiredAge: "4 years",
      description: "prevents: Influenza diseases",
      price: 180,
      provider: "6841a747d5ec36a1b132f975",
    },
    {
      name: "HPV(Cervarix / Gardasil) 1st Dose",
      requiredAge: "9 years",
      description: "prevents: Human Papillomavirus (Cervical Cancer) diseases",
      price: 700,
      provider: "6841a748d5ec36a1b132f97a",
    },
    {
      name: "HPV(Cervarix / Gardasil) 2nd Dose",
      requiredAge: "9 years and 3 months",
      description: "prevents: Human Papillomavirus (Cervical Cancer) diseases",
      price: 700,
      provider: "6841a748d5ec36a1b132f97a",
    },
  ];
  const apiEndpoint = "http://localhost:8000/api/vaccines/admin";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDU1YTQyMjhhNTdiNTZkYzExYjdkZiIsImlhdCI6MTc0OTI5MTA4NiwiZXhwIjoxNzQ5MzAxODg2fQ.V-gl-xaSHXdCcdV6YLqIyTEqTLkz3__Hw5faAyO1jOM";

  try {
    for (let i = 0; i < vaccines.length; i++) {
      const vaccine = vaccines[i];
      console.log(
        `Posting vaccine ${i + 1}/${vaccines.length}: ${vaccine.name}`
      );

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vaccine),
      });

      // Check if the response is successful
      if (response.status === 201) {
        console.log(`✅ Successfully posted vaccine: ${vaccine.name}`);
      } else {
        console.log(`❌ Failed to post vaccine: ${vaccine.name}`);
      }

      // Add a small delay between requests to avoid overwhelming the server
      if (i < vaccines.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms delay
      }

      if (i === vaccines.length - 1) {
        console.log("🎉 Vaccines creation script is finished");
      }
    }
  } catch (error) {
    console.error("❌ Fatal error:", error);
  }
};

createVaccines();
