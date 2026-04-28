// Treatment steps for known plant diseases
export const TREATMENT_MAP: Record<string, string[]> = {
  "Apple___Apple_scab": [
    "Remove fallen leaves and infected fruit from the ground immediately.",
    "Apply fungicide (captan or myclobutanil) during early spring.",
    "Prune trees to improve air circulation between branches.",
    "Plant scab-resistant apple varieties in future seasons.",
    "Monitor weekly and reapply fungicide after heavy rain.",
  ],
  "Apple___Black_rot": [
    "Prune out dead or diseased branches and dispose of them.",
    "Remove mummified fruit from the tree and ground.",
    "Apply captan or thiophanate-methyl fungicide at petal fall.",
    "Maintain proper tree spacing for air flow.",
    "Fertilize and water appropriately to maintain tree vigor.",
  ],
  "Apple___Cedar_apple_rust": [
    "Remove nearby juniper/cedar trees if possible (alternate host).",
    "Apply myclobutanil fungicide starting at pink bud stage.",
    "Plant rust-resistant apple varieties.",
    "Remove galls from cedar trees within a 2-mile radius.",
    "Continue fungicide applications every 7-10 days through bloom.",
  ],
  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": [
    "Rotate crops — avoid planting corn after corn.",
    "Use resistant hybrid varieties.",
    "Apply strobilurin or triazole fungicide at VT/R1 growth stage.",
    "Reduce plant density to improve air circulation.",
    "Till crop residue to reduce inoculum for next season.",
  ],
  "Corn_(maize)___Common_rust_": [
    "Plant resistant corn hybrids suited to your region.",
    "Apply foliar fungicide (triazole-based) if infection exceeds 1% leaf area before tasseling.",
    "Scout fields regularly during warm, humid weather.",
    "Avoid excessive nitrogen fertilization.",
    "Harvest promptly to minimize further yield loss.",
  ],
  "Corn_(maize)___Northern_Leaf_Blight": [
    "Use resistant corn hybrids with Ht genes.",
    "Apply strobilurin fungicide at early tassel stage if disease pressure is high.",
    "Practice crop rotation with non-host crops.",
    "Till under corn residue after harvest.",
    "Monitor fields weekly during humid conditions.",
  ],
  "Grape___Black_rot": [
    "Remove mummified berries and infected leaves immediately.",
    "Apply mancozeb or myclobutanil from bud break through veraison.",
    "Prune vines to improve sunlight penetration and air flow.",
    "Maintain a clean vineyard floor — remove all fallen debris.",
    "Space fungicide applications 10-14 days apart during wet periods.",
  ],
  "Grape___Esca_(Black_Measles)": [
    "Prune infected wood and protect wounds with fungicide paste.",
    "Apply sodium arsenite trunk treatments where legally permitted.",
    "Avoid large pruning wounds — use double pruning method.",
    "Remove severely infected vines and replant with certified stock.",
    "Maintain vine vigor through balanced fertilization.",
  ],
  "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": [
    "Apply copper-based fungicide at first sign of infection.",
    "Improve canopy management — remove excess foliage.",
    "Ensure good drainage to reduce humidity around vines.",
    "Remove and destroy infected leaves.",
    "Apply preventive fungicide sprays during wet weather.",
  ],
  "Potato___Early_blight": [
    "Apply chlorothalonil or mancozeb fungicide at first symptom.",
    "Practice 2-3 year crop rotation away from solanaceous crops.",
    "Remove and destroy infected plant debris after harvest.",
    "Maintain adequate plant nutrition — especially potassium.",
    "Water at the base of plants to keep foliage dry.",
  ],
  "Potato___Late_blight": [
    "Apply metalaxyl or chlorothalonil fungicide IMMEDIATELY.",
    "Remove and destroy all infected plants — do not compost.",
    "Avoid overhead irrigation — water at soil level only.",
    "Plant certified disease-free seed potatoes.",
    "Monitor weather — apply preventive fungicide before wet periods.",
  ],
  "Tomato___Bacterial_spot": [
    "Apply copper-based bactericide at first symptom.",
    "Use certified disease-free seeds and transplants.",
    "Avoid working with plants when they are wet.",
    "Practice 2-3 year crop rotation away from peppers and tomatoes.",
    "Remove severely infected plants to prevent spread.",
  ],
  "Tomato___Early_blight": [
    "Apply chlorothalonil or copper fungicide at first lower-leaf symptoms.",
    "Mulch around plants to prevent soil splash onto leaves.",
    "Stake or cage plants to improve air circulation.",
    "Water at the base — avoid wetting foliage.",
    "Remove infected lower leaves and destroy them.",
  ],
  "Tomato___Late_blight": [
    "Apply mancozeb or chlorothalonil fungicide IMMEDIATELY — this is urgent.",
    "Remove and bag all infected plant material for disposal.",
    "Do NOT compost infected material — the pathogen survives.",
    "Improve spacing and ventilation between plants.",
    "Consider removing entire plant if >30% of foliage is affected.",
  ],
  "Tomato___Leaf_Mold": [
    "Improve greenhouse ventilation and reduce humidity below 85%.",
    "Apply chlorothalonil or mancozeb fungicide.",
    "Space plants wider to improve air circulation.",
    "Avoid overhead watering — use drip irrigation.",
    "Remove and destroy infected leaves promptly.",
  ],
  "Tomato___Septoria_leaf_spot": [
    "Apply chlorothalonil or copper fungicide at first sign.",
    "Remove infected lower leaves immediately.",
    "Mulch to prevent rain splashing soil onto lower leaves.",
    "Practice 2-year crop rotation away from tomatoes.",
    "Stake plants for better air flow and less ground contact.",
  ],
  "Tomato___Spider_mites Two-spotted_spider_mite": [
    "Spray plants with strong water jet to dislodge mites.",
    "Apply neem oil or insecticidal soap — cover undersides of leaves.",
    "Introduce predatory mites (Phytoseiulus persimilis) as biological control.",
    "Increase humidity around plants — mites thrive in dry conditions.",
    "Remove severely infested leaves and dispose of them.",
  ],
  "Tomato___Target_Spot": [
    "Apply chlorothalonil or azoxystrobin fungicide.",
    "Remove lower infected leaves to slow disease progression.",
    "Improve air circulation through pruning and proper spacing.",
    "Avoid overhead irrigation.",
    "Practice crop rotation with non-solanaceous crops.",
  ],
  "Tomato___Tomato_Yellow_Leaf_Curl_Virus": [
    "Remove and destroy infected plants IMMEDIATELY — this virus spreads fast.",
    "Control whitefly populations with insecticidal soap or neem oil.",
    "Use reflective mulch to repel whiteflies.",
    "Plant TYLCV-resistant tomato varieties.",
    "Install fine mesh screens in greenhouses to exclude whiteflies.",
  ],
  "Tomato___Tomato_mosaic_virus": [
    "Remove and destroy infected plants — do not touch healthy plants after.",
    "Wash hands and tools with milk solution (20%) between plants.",
    "Do not smoke near plants — tobacco mosaic virus is related.",
    "Plant resistant varieties (look for 'TMV' resistance label).",
    "Disinfect all tools, stakes, and cages between seasons.",
  ],
  "Strawberry___Leaf_scorch": [
    "Remove and destroy all infected leaves.",
    "Apply copper-based fungicide during early spring.",
    "Avoid overhead irrigation — use drip systems.",
    "Ensure proper plant spacing for air circulation.",
    "Renovate strawberry beds annually to reduce disease pressure.",
  ],
  "Peach___Bacterial_spot": [
    "Apply copper spray during dormant season.",
    "Use oxytetracycline during growing season at petal fall.",
    "Plant resistant peach varieties.",
    "Avoid overhead irrigation.",
    "Prune to improve air circulation within the canopy.",
  ],
  "Pepper,_bell___Bacterial_spot": [
    "Apply copper-based bactericide weekly during wet conditions.",
    "Use certified disease-free seeds.",
    "Practice 3-year crop rotation.",
    "Avoid working with plants when foliage is wet.",
    "Remove and destroy severely infected plants.",
  ],
};

export function computeSeverity(confidence: number, disease: string): string {
  const lower = disease.toLowerCase();

  const criticalKeywords = ["late blight", "mosaic virus", "crown gall", "fire blight", "bacterial wilt"];
  if (criticalKeywords.some(k => lower.includes(k))) {
    return confidence >= 0.7 ? "critical" : "high";
  }

  if (lower.includes("healthy")) return "low";

  if (confidence >= 0.85) return "high";
  if (confidence >= 0.65) return "medium";
  return "low";
}

export const DEFAULT_TREATMENT = [
  "Isolate the affected plant from healthy crops immediately.",
  "Remove and safely dispose of all visibly infected plant parts.",
  "Apply a broad-spectrum fungicide or bactericide appropriate for your crop.",
  "Monitor surrounding plants daily for 2 weeks.",
  "Consult a local agronomist for region-specific treatment advice.",
];
