export const createPregnancyTips = async () => {
  const pregnancyTips = [
    {
      title: "Eat a balanced and nutritious diet.",
      content:
        "Focus on fruits, vegetables, whole grains, lean protein, and healthy fats.",
    },
    {
      title: "Take your prenatal vitamins daily.",
      content: "Especially folic acid, iron, and calcium.",
    },
    {
      title: "Stay hydrated.",
      content: "Drink plenty of water throughout the day.",
    },
    {
      title: "Get regular, moderate exercise.",
      content:
        "Walking, swimming, or prenatal yoga are great options — unless your doctor advises otherwise.",
    },
    {
      title: "Avoid smoking, alcohol, and caffeine.",
      content: "These can harm your baby’s development.",
    },
    {
      title: "Get enough sleep and rest.",
      content:
        "Aim for at least 7-8 hours of sleep each night and take naps if needed.",
    },
    {
      title: "Attend all prenatal appointments.",
      content:
        "Regular check-ups help monitor your baby’s growth and catch any issues early.",
    },
    {
      title: "Manage stress.",
      content:
        "Practice relaxation techniques like deep breathing, meditation, or listening to music.",
    },
    {
      title: "Educate yourself.",
      content:
        "Read about pregnancy, childbirth, and baby care to feel more prepared.",
    },
    {
      title: "Listen to your body.",
      content:
        "If something doesn’t feel right, don’t ignore it — always talk to your doctor.",
    },
  ];
  const apiEndpoint = "http://localhost:8000/api/tips/pregnancy-tip";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDU1YTQyMjhhNTdiNTZkYzExYjdkZiIsImlhdCI6MTc0OTEyMjk3MiwiZXhwIjoxNzQ5MTMzNzcyfQ.cnD01m-Rlz5O_BQYWGT3WY8cFy6PuQGCJFybhBRNXr4";

  try {
    for (let i = 0; i < pregnancyTips.length; i++) {
      const tip = pregnancyTips[i];
      console.log(
        `Posting pregnancy tip ${i + 1}/${pregnancyTips.length}: ${tip.title}`
      );

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tip),
      });

      // Check if the response is successful
      if (response.status === 201) {
        console.log(`✅ Successfully posted tip: ${tip.title}`);
      } else {
        console.log(`❌ Failed to post tip: ${tip.title}`);
      }

      // Add a small delay between requests to avoid overwhelming the server
      if (i < pregnancyTips.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000ms delay
      }

      if (i === pregnancyTips.length - 1) {
        console.log("🎉 Pregnancy tips creation script is finished");
      }
    }
  } catch (error) {
    console.error("❌ Fatal error:", error);
  }
};
