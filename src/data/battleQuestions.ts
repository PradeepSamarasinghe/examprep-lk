import type { Lang } from "@/hooks/use-language";

export interface BattleQuestion {
  q: string;
  options: string[];
  correct: number;
  subject: string;
}

const battleQuestions: Record<Lang, BattleQuestion[]> = {
  en: [
    // ─── Combined Maths ───
    { q: "What is the derivative of sin(2x)?", options: ["2cos(2x)", "cos(2x)", "-2cos(2x)", "2sin(2x)"], correct: 0, subject: "Combined Maths" },
    { q: "∫(1/x)dx equals:", options: ["x²/2 + C", "ln|x| + C", "1/x² + C", "-1/x + C"], correct: 1, subject: "Combined Maths" },
    { q: "The value of lim(x→0) sin(x)/x is:", options: ["0", "1", "∞", "Does not exist"], correct: 1, subject: "Combined Maths" },
    { q: "If f(x) = e^(3x), then f'(x) =", options: ["e^(3x)", "3e^(3x)", "3xe^(3x)", "e^(3x)/3"], correct: 1, subject: "Combined Maths" },
    { q: "The general solution of dy/dx = ky is:", options: ["y = kx + C", "y = Ce^(kx)", "y = ke^x", "y = Cx^k"], correct: 1, subject: "Combined Maths" },
    { q: "d/dx [tan(x)] equals:", options: ["sec(x)", "sec²(x)", "cot(x)", "cos²(x)"], correct: 1, subject: "Combined Maths" },
    { q: "∫cos²(x)dx can be solved using:", options: ["Substitution only", "Half-angle formula", "By parts only", "Partial fractions"], correct: 1, subject: "Combined Maths" },
    { q: "The matrix [[1,2],[3,4]] has determinant:", options: ["-2", "2", "-10", "10"], correct: 0, subject: "Combined Maths" },

    // ─── Physics ───
    { q: "The SI unit of electric flux is:", options: ["V·m", "N·m²/C", "C/m²", "V/m"], correct: 1, subject: "Physics" },
    { q: "A body in SHM has maximum velocity at:", options: ["Extreme position", "Mean position", "Between mean & extreme", "Depends on amplitude"], correct: 1, subject: "Physics" },
    { q: "The unit of Planck's constant is:", options: ["J·s", "J/s", "kg·m/s", "N·m"], correct: 0, subject: "Physics" },
    { q: "Which quantity is conserved in an elastic collision?", options: ["Momentum only", "Kinetic energy only", "Both momentum and kinetic energy", "Neither"], correct: 2, subject: "Physics" },
    { q: "The focal length of a concave mirror is:", options: ["Positive", "Negative", "Zero", "Depends on object distance"], correct: 1, subject: "Physics" },
    { q: "Ohm's law states that V equals:", options: ["IR", "I/R", "R/I", "I²R"], correct: 0, subject: "Physics" },
    { q: "The speed of light in vacuum is approximately:", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1, subject: "Physics" },
    { q: "In a transformer, if N₂ > N₁, it is a:", options: ["Step-up transformer", "Step-down transformer", "Isolation transformer", "Auto transformer"], correct: 0, subject: "Physics" },

    // ─── Chemistry ───
    { q: "Which element has the highest electronegativity?", options: ["Oxygen", "Chlorine", "Fluorine", "Nitrogen"], correct: 2, subject: "Chemistry" },
    { q: "The pH of a neutral solution at 25°C is:", options: ["0", "7", "14", "1"], correct: 1, subject: "Chemistry" },
    { q: "Avogadro's number is approximately:", options: ["6.022×10²³", "6.022×10²⁰", "3.14×10²³", "6.626×10⁻³⁴"], correct: 0, subject: "Chemistry" },
    { q: "Which is an example of a Lewis acid?", options: ["NH₃", "BF₃", "H₂O", "OH⁻"], correct: 1, subject: "Chemistry" },
    { q: "The oxidation state of Mn in KMnO₄ is:", options: ["+4", "+5", "+6", "+7"], correct: 3, subject: "Chemistry" },
    { q: "Which gas law relates pressure and volume at constant temperature?", options: ["Charles's law", "Boyle's law", "Gay-Lussac's law", "Avogadro's law"], correct: 1, subject: "Chemistry" },
    { q: "The hybridization of carbon in methane is:", options: ["sp", "sp²", "sp³", "sp³d"], correct: 2, subject: "Chemistry" },
    { q: "The bond angle in water (H₂O) is approximately:", options: ["180°", "120°", "109.5°", "104.5°"], correct: 3, subject: "Chemistry" },

    // ─── Biology ───
    { q: "The powerhouse of the cell is:", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], correct: 2, subject: "Biology" },
    { q: "DNA replication is described as:", options: ["Conservative", "Semi-conservative", "Dispersive", "Non-conservative"], correct: 1, subject: "Biology" },
    { q: "Photosynthesis occurs in:", options: ["Mitochondria", "Chloroplasts", "Nucleus", "Ribosomes"], correct: 1, subject: "Biology" },
    { q: "The basic unit of classification is:", options: ["Genus", "Species", "Family", "Order"], correct: 1, subject: "Biology" },
    { q: "Which blood group is the universal donor?", options: ["A", "B", "AB", "O"], correct: 3, subject: "Biology" },
    { q: "The enzyme that breaks down starch is:", options: ["Lipase", "Protease", "Amylase", "Nuclease"], correct: 2, subject: "Biology" },
    { q: "Mendel's law of segregation applies to:", options: ["Linked genes", "Alleles of a gene", "Multiple chromosomes", "Codominant genes"], correct: 1, subject: "Biology" },
    { q: "The number of chromosomes in a human somatic cell is:", options: ["23", "44", "46", "48"], correct: 2, subject: "Biology" },
  ],

  si: [
    // ─── සංයුක්ත ගණිතය ───
    { q: "sin(2x) හි අවකලනය කුමක්ද?", options: ["2cos(2x)", "cos(2x)", "-2cos(2x)", "2sin(2x)"], correct: 0, subject: "Combined Maths" },
    { q: "∫(1/x)dx සමාන වන්නේ:", options: ["x²/2 + C", "ln|x| + C", "1/x² + C", "-1/x + C"], correct: 1, subject: "Combined Maths" },
    { q: "lim(x→0) sin(x)/x හි අගය:", options: ["0", "1", "∞", "පවතින්නේ නැත"], correct: 1, subject: "Combined Maths" },
    { q: "f(x) = e^(3x) නම්, f'(x) =", options: ["e^(3x)", "3e^(3x)", "3xe^(3x)", "e^(3x)/3"], correct: 1, subject: "Combined Maths" },
    { q: "dy/dx = ky හි සාමාන්‍ය විසඳුම:", options: ["y = kx + C", "y = Ce^(kx)", "y = ke^x", "y = Cx^k"], correct: 1, subject: "Combined Maths" },
    { q: "d/dx [tan(x)] සමාන වන්නේ:", options: ["sec(x)", "sec²(x)", "cot(x)", "cos²(x)"], correct: 1, subject: "Combined Maths" },
    { q: "∫cos²(x)dx විසඳිය හැක්කේ:", options: ["ආදේශය පමණි", "අර්ධ කෝණ සූත්‍රය", "කොටස් මගින් පමණි", "අර්ධ භාග"], correct: 1, subject: "Combined Maths" },
    { q: "[[1,2],[3,4]] න්‍යාසයේ නිර්ණායකය:", options: ["-2", "2", "-10", "10"], correct: 0, subject: "Combined Maths" },

    // ─── භෞතික විද්‍යාව ───
    { q: "විද්‍යුත් ෆ්ලක්ස් හි SI ඒකකය:", options: ["V·m", "N·m²/C", "C/m²", "V/m"], correct: 1, subject: "Physics" },
    { q: "සරල අනුවර්තී චලිතයේ දී ශරීරයකට උපරිම ප්‍රවේගය ඇත්තේ:", options: ["අන්ත ස්ථානයේ දී", "මධ්‍ය ස්ථානයේ දී", "මධ්‍ය සහ අන්ත අතර", "විස්තාරය මත රඳා පවතී"], correct: 1, subject: "Physics" },
    { q: "ප්ලෑන්ක් නියතයේ ඒකකය:", options: ["J·s", "J/s", "kg·m/s", "N·m"], correct: 0, subject: "Physics" },
    { q: "ප්‍රත්‍යාස්ථ ගැටීමක දී සංරක්ෂිත ප්‍රමාණය කුමක්ද?", options: ["ගම්‍යතාව පමණි", "චාලක ශක්තිය පමණි", "ගම්‍යතාව සහ චාලක ශක්තිය දෙකම", "කිසිවක් නොවේ"], correct: 2, subject: "Physics" },
    { q: "අවතල දර්පණයක නාභීය දුර:", options: ["ධන", "සෘණ", "ශුන්‍ය", "වස්තු දුර මත රඳා පවතී"], correct: 1, subject: "Physics" },
    { q: "ඕම් නියමයට අනුව V සමාන වන්නේ:", options: ["IR", "I/R", "R/I", "I²R"], correct: 0, subject: "Physics" },
    { q: "රික්තයේ ආලෝකයේ වේගය ආසන්න වශයෙන්:", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1, subject: "Physics" },
    { q: "පරිණාමකයක N₂ > N₁ නම්, එය:", options: ["පියවර-ඉහළ පරිණාමකයකි", "පියවර-පහළ පරිණාමකයකි", "හුදකලා පරිණාමකයකි", "ස්වයං පරිණාමකයකි"], correct: 0, subject: "Physics" },

    // ─── රසායන විද්‍යාව ───
    { q: "ඉහළම විද්‍යුත් ඍණතාවය ඇති මූලද්‍රව්‍යය කුමක්ද?", options: ["ඔක්සිජන්", "ක්ලෝරීන්", "ෆ්ලෝරීන්", "නයිට්‍රජන්"], correct: 2, subject: "Chemistry" },
    { q: "25°C දී උදාසීන ද්‍රාවණයක pH අගය:", options: ["0", "7", "14", "1"], correct: 1, subject: "Chemistry" },
    { q: "ඇවොගාඩ්‍රෝ සංඛ්‍යාව ආසන්න වශයෙන්:", options: ["6.022×10²³", "6.022×10²⁰", "3.14×10²³", "6.626×10⁻³⁴"], correct: 0, subject: "Chemistry" },
    { q: "ලුවිස් අම්ලයකට උදාහරණයක් වන්නේ:", options: ["NH₃", "BF₃", "H₂O", "OH⁻"], correct: 1, subject: "Chemistry" },
    { q: "KMnO₄ හි Mn හි ඔක්සිකරණ අවස්ථාව:", options: ["+4", "+5", "+6", "+7"], correct: 3, subject: "Chemistry" },
    { q: "නියත උෂ්ණත්වයේ දී පීඩනය සහ පරිමාව සම්බන්ධ කරන වායු නියමය:", options: ["චාල්ස් නියමය", "බොයිල් නියමය", "ගේ-ලුසැක් නියමය", "ඇවොගාඩ්‍රෝ නියමය"], correct: 1, subject: "Chemistry" },
    { q: "මීතේන් හි කාබන් හි සංකරණය:", options: ["sp", "sp²", "sp³", "sp³d"], correct: 2, subject: "Chemistry" },
    { q: "ජලයේ (H₂O) බන්ධන කෝණය ආසන්න වශයෙන්:", options: ["180°", "120°", "109.5°", "104.5°"], correct: 3, subject: "Chemistry" },

    // ─── ජීව විද්‍යාව ───
    { q: "සෛලයේ බලාගාරය ලෙස හඳුන්වන්නේ:", options: ["න්‍යෂ්ටිය", "රයිබොසෝම", "මයිටොකොන්ඩ්‍රියා", "ගෝල්ජි ආයතනය"], correct: 2, subject: "Biology" },
    { q: "DNA ප්‍රතිනිර්මාණය විස්තර කරන්නේ:", options: ["සංරක්ෂණාත්මක", "අර්ධ-සංරක්ෂණාත්මක", "විසරණාත්මක", "අසංරක්ෂණාත්මක"], correct: 1, subject: "Biology" },
    { q: "ප්‍රභාසංශ්ලේෂණය සිදුවන්නේ:", options: ["මයිටොකොන්ඩ්‍රියාවල", "හරිතලවකවල", "න්‍යෂ්ටියේ", "රයිබොසෝමවල"], correct: 1, subject: "Biology" },
    { q: "වර්ගීකරණයේ මූලික ඒකකය:", options: ["ගණය", "විශේෂය", "පවුල", "ගෝත්‍රය"], correct: 1, subject: "Biology" },
    { q: "විශ්ව දායකයා වන රුධිර කාණ්ඩය:", options: ["A", "B", "AB", "O"], correct: 3, subject: "Biology" },
    { q: "පිෂ්ඨය බිඳ දමන එන්සයිමය:", options: ["ලිපේස්", "ප්‍රෝටිේස්", "ඇමයිලේස්", "නියුක්ලිේස්"], correct: 2, subject: "Biology" },
    { q: "මෙන්ඩල්ගේ පෘථක්කරණ නියමය අදාළ වන්නේ:", options: ["සබැඳි ජාන", "ජානයක ඇලීල", "බහු වර්ණදේහ", "සහ-ප්‍රමුඛ ජාන"], correct: 1, subject: "Biology" },
    { q: "මිනිස් ශරීර සෛලයක වර්ණදේහ සංඛ්‍යාව:", options: ["23", "44", "46", "48"], correct: 2, subject: "Biology" },
  ],

  ta: [
    // ─── கூட்டுக் கணிதம் ───
    { q: "sin(2x) இன் வகையீடு என்ன?", options: ["2cos(2x)", "cos(2x)", "-2cos(2x)", "2sin(2x)"], correct: 0, subject: "Combined Maths" },
    { q: "∫(1/x)dx சமம்:", options: ["x²/2 + C", "ln|x| + C", "1/x² + C", "-1/x + C"], correct: 1, subject: "Combined Maths" },
    { q: "lim(x→0) sin(x)/x இன் மதிப்பு:", options: ["0", "1", "∞", "இல்லை"], correct: 1, subject: "Combined Maths" },
    { q: "f(x) = e^(3x) எனில், f'(x) =", options: ["e^(3x)", "3e^(3x)", "3xe^(3x)", "e^(3x)/3"], correct: 1, subject: "Combined Maths" },
    { q: "dy/dx = ky இன் பொதுத் தீர்வு:", options: ["y = kx + C", "y = Ce^(kx)", "y = ke^x", "y = Cx^k"], correct: 1, subject: "Combined Maths" },
    { q: "d/dx [tan(x)] சமம்:", options: ["sec(x)", "sec²(x)", "cot(x)", "cos²(x)"], correct: 1, subject: "Combined Maths" },
    { q: "∫cos²(x)dx தீர்க்க பயன்படுவது:", options: ["பதிலீடு மட்டும்", "அரைக்கோண சூத்திரம்", "பகுதிகளால் மட்டும்", "பகுதிப் பின்னங்கள்"], correct: 1, subject: "Combined Maths" },
    { q: "[[1,2],[3,4]] அணியின் அணிக்கோவை:", options: ["-2", "2", "-10", "10"], correct: 0, subject: "Combined Maths" },

    // ─── இயற்பியல் ───
    { q: "மின்புலப் பாய்வின் SI அலகு:", options: ["V·m", "N·m²/C", "C/m²", "V/m"], correct: 1, subject: "Physics" },
    { q: "சீரான இசைவு இயக்கத்தில் ஒரு பொருளின் அதிகபட்ச திசைவேகம் எங்கே?", options: ["உச்ச நிலையில்", "சராசரி நிலையில்", "சராசரி & உச்சத்திற்கு இடையில்", "வீச்சைப் பொறுத்தது"], correct: 1, subject: "Physics" },
    { q: "பிளாங்க் மாறிலியின் அலகு:", options: ["J·s", "J/s", "kg·m/s", "N·m"], correct: 0, subject: "Physics" },
    { q: "மீள் மோதலில் எந்த அளவு பாதுகாக்கப்படுகிறது?", options: ["உந்தம் மட்டும்", "இயக்க ஆற்றல் மட்டும்", "உந்தம் மற்றும் இயக்க ஆற்றல் இரண்டும்", "எதுவும் இல்லை"], correct: 2, subject: "Physics" },
    { q: "குழிக்கண்ணாடியின் குவியத்தூரம்:", options: ["நேர்மறை", "எதிர்மறை", "பூஜ்ஜியம்", "பொருள் தூரத்தைப் பொறுத்தது"], correct: 1, subject: "Physics" },
    { q: "ஓம் விதிப்படி V சமம்:", options: ["IR", "I/R", "R/I", "I²R"], correct: 0, subject: "Physics" },
    { q: "வெற்றிடத்தில் ஒளியின் வேகம் தோராயமாக:", options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], correct: 1, subject: "Physics" },
    { q: "மின்மாற்றியில் N₂ > N₁ எனில், அது:", options: ["படி-உயர் மின்மாற்றி", "படி-இறக்க மின்மாற்றி", "தனிமை மின்மாற்றி", "தன்னியக்க மின்மாற்றி"], correct: 0, subject: "Physics" },

    // ─── வேதியியல் ───
    { q: "மிக அதிக மின்னெதிர்த்தன்மை கொண்ட தனிமம் எது?", options: ["ஆக்சிஜன்", "குளோரின்", "புளோரின்", "நைட்ரஜன்"], correct: 2, subject: "Chemistry" },
    { q: "25°C இல் நடுநிலைக் கரைசலின் pH மதிப்பு:", options: ["0", "7", "14", "1"], correct: 1, subject: "Chemistry" },
    { q: "அவகாட்ரோ எண் தோராயமாக:", options: ["6.022×10²³", "6.022×10²⁰", "3.14×10²³", "6.626×10⁻³⁴"], correct: 0, subject: "Chemistry" },
    { q: "லூயிஸ் அமிலத்திற்கு உதாரணம்:", options: ["NH₃", "BF₃", "H₂O", "OH⁻"], correct: 1, subject: "Chemistry" },
    { q: "KMnO₄ இல் Mn இன் ஆக்சிஜனேற்ற நிலை:", options: ["+4", "+5", "+6", "+7"], correct: 3, subject: "Chemistry" },
    { q: "நிலையான வெப்பநிலையில் அழுத்தம் மற்றும் பருமனை தொடர்புபடுத்தும் வாயு விதி:", options: ["சார்லஸ் விதி", "பாயில் விதி", "கே-லூசாக் விதி", "அவகாட்ரோ விதி"], correct: 1, subject: "Chemistry" },
    { q: "மீத்தேனில் கார்பனின் கலப்பினமாக்கம்:", options: ["sp", "sp²", "sp³", "sp³d"], correct: 2, subject: "Chemistry" },
    { q: "நீரின் (H₂O) பிணைப்புக் கோணம் தோராயமாக:", options: ["180°", "120°", "109.5°", "104.5°"], correct: 3, subject: "Chemistry" },

    // ─── உயிரியல் ───
    { q: "செல்லின் ஆற்றல் நிலையம்:", options: ["உட்கரு", "ரைபோசோம்", "மைட்டோகாண்ட்ரியா", "கோல்கி உறுப்பு"], correct: 2, subject: "Biology" },
    { q: "DNA பிரதியெடுப்பு விவரிக்கப்படுவது:", options: ["பாதுகாப்பான", "அரை-பாதுகாப்பான", "சிதறலான", "பாதுகாப்பற்ற"], correct: 1, subject: "Biology" },
    { q: "ஒளிச்சேர்க்கை நடைபெறுவது:", options: ["மைட்டோகாண்ட்ரியாவில்", "பசுங்கணிகங்களில்", "உட்கருவில்", "ரைபோசோம்களில்"], correct: 1, subject: "Biology" },
    { q: "வகைப்பாட்டின் அடிப்படை அலகு:", options: ["பேரினம்", "சிற்றினம்", "குடும்பம்", "வரிசை"], correct: 1, subject: "Biology" },
    { q: "உலகளாவிய இரத்த தானி குழு:", options: ["A", "B", "AB", "O"], correct: 3, subject: "Biology" },
    { q: "மாவுச்சத்தை உடைக்கும் நொதி:", options: ["லிபேஸ்", "புரோட்டியேஸ்", "அமைலேஸ்", "நியூக்லியேஸ்"], correct: 2, subject: "Biology" },
    { q: "மெண்டலின் பிரிப்பு விதி பொருந்துவது:", options: ["இணைந்த மரபணுக்கள்", "ஒரு மரபணுவின் அல்லீல்கள்", "பல குரோமோசோம்கள்", "இணை-ஓங்குதன்மை மரபணுக்கள்"], correct: 1, subject: "Biology" },
    { q: "மனித உடல் செல்லில் குரோமோசோம்களின் எண்ணிக்கை:", options: ["23", "44", "46", "48"], correct: 2, subject: "Biology" },
  ],
};

/** Pick `count` random questions from the bank for the given language */
export function getRandomQuestions(lang: Lang, count = 5): BattleQuestion[] {
  const pool = battleQuestions[lang] || battleQuestions.en;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default battleQuestions;
