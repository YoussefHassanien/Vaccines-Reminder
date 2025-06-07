import { createPregnancyTips } from "./pregnancyTipsScript.js";
import { createProviders } from "./providersScript.js";
import { createProducts } from "./productsScript.js";

const startScripts = async () => {
  try {
    console.log("🚀 Starting all scripts");
    await createPregnancyTips();
    await createProducts();
    await createProviders();
    console.log("🎉 All scripts completed successfully!");
  } catch (error) {}
};

startScripts();
