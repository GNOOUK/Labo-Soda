// ==========================================
// 1. DONNÉES EXPÉRIMENTALES
// Remplace les valeurs par tes mesures réelles
// ==========================================

const boissons = [
  {
    nom: "Coca-Cola",
    avant: 2.5,
    apres24h: 2.7
  },
  {
    nom: "Coca Zero",
    avant: 2.8,
    apres24h: 3.1
  },
  {
    nom: "Perrier",
    avant: 5.5,
    apres24h: 5.4
  },
  {
    nom: "Fanta",
    avant: 3.2,
    apres24h: 3.4
  },

  {
    nom : "Jus d'orange - Aldi",
    avant : 3.7,
    apres24h : 4
  },

  {
    nom : "Eau du robinet",
    avant : 7.9,
    apres24h : 8
  },

  {
    nom : "Eau gazeuse - Auchan",
    avant : 5.5,
    apres24h : 5.9
  },
  
];

// ==========================================
// 2. AFFICHAGE DU TABLEAU
// ==========================================

const tableau = document.getElementById("resultsBody");

function afficherTableau() {
  if (!tableau) return;

  tableau.innerHTML = "";

  boissons.forEach(boisson => {
    const evolution = boisson.apres24h - boisson.avant;

    const ligne = document.createElement("tr");

    [
      boisson.nom,
      boisson.avant.toLocaleString("fr-FR"),
      boisson.apres24h.toLocaleString("fr-FR"),
      (evolution > 0 ? "+" : "") +
        evolution.toLocaleString("fr-FR", {
          maximumFractionDigits: 2
        })
    ].forEach(texte => {
      const cellule = document.createElement("td");
      cellule.textContent = texte;
      ligne.appendChild(cellule);
    });

    tableau.appendChild(ligne);
  });
}

// ==========================================
// 3. GRAPHIQUE COMPARATIF
// ==========================================

const graphique = document.getElementById("chart");

function afficherGraphique() {
  if (!graphique) return;

  graphique.innerHTML = "";

  // Légende
  const legende = document.createElement("div");
  legende.style.cssText =
    "display:flex;gap:18px;flex-wrap:wrap;margin-bottom:20px;font-size:11px;color:#b0c0c9";

  legende.innerHTML = `
    <span><i style="display:inline-block;width:9px;height:9px;background:#48c4dc;border-radius:3px;margin-right:6px"></i>Avant ouverture</span>
    <span><i style="display:inline-block;width:9px;height:9px;background:#ff9d5c;border-radius:3px;margin-right:6px"></i>Après 24 h</span>
  `;

  graphique.appendChild(legende);

  boissons.forEach(boisson => {
    const groupe = document.createElement("div");
    groupe.style.cssText = "margin-bottom:22px";

    const nom = document.createElement("div");
    nom.textContent = boisson.nom;
    nom.style.cssText =
      "font-size:12px;font-weight:600;margin-bottom:8px;color:#edf5f8";

    groupe.appendChild(nom);

    [
      {
        label: "Avant",
        valeur: boisson.avant,
        couleur: "#48c4dc"
      },
      {
        label: "Après 24 h",
        valeur: boisson.apres24h,
        couleur: "#ff9d5c"
      }
    ].forEach(mesure => {
      const ligne = document.createElement("div");
      ligne.style.cssText =
        "display:grid;grid-template-columns:65px 1fr 32px;gap:8px;align-items:center;margin:7px 0";

      const etiquette = document.createElement("span");
      etiquette.textContent = mesure.label;
      etiquette.style.cssText = "font-size:10px;color:#9aabb7";

      const fond = document.createElement("div");
      fond.style.cssText =
        "height:13px;background:#263542;border-radius:8px;overflow:hidden";

      const barre = document.createElement("div");
      barre.style.cssText =
        `height:100%;width:${Math.max(0, Math.min(14, mesure.valeur)) / 14 * 100}%;background:${mesure.couleur};border-radius:8px`;

      fond.appendChild(barre);

      const valeur = document.createElement("span");
      valeur.textContent = mesure.valeur.toLocaleString("fr-FR");
      valeur.style.cssText =
        "font-size:11px;font-weight:700;color:#edf5f8;text-align:right";

      ligne.append(etiquette, fond, valeur);
      groupe.appendChild(ligne);
    });

    graphique.appendChild(groupe);
  });

  const axe = document.createElement("div");
  axe.style.cssText =
    "display:flex;justify-content:space-between;color:#9aabb7;font-size:10px;border-top:1px solid #263542;padding-top:8px";

  axe.innerHTML = "<span>0</span><span>2</span><span>4</span><span>6</span><span>8</span><span>10</span><span>12</span><span>14</span>";

  graphique.appendChild(axe);
}

// ==========================================
// 4. CONCLUSION AUTOMATIQUE
// ==========================================

function genererConclusion() {
  if (boissons.length === 0) {
    return "Aucune donnée n'est disponible pour le moment.";
  }

  const acideAvant = boissons.reduce((a, b) =>
    b.avant < a.avant ? b : a
  );

  const acideApres = boissons.reduce((a, b) =>
    b.apres24h < a.apres24h ? b : a
  );

  const variations = boissons.map(b => ({
    nom: b.nom,
    difference: b.apres24h - b.avant
  }));

  const hausse = variations.filter(v => v.difference > 0);
  const baisse = variations.filter(v => v.difference < 0);
  const stable = variations.filter(v => v.difference === 0);

  let texte =
    "Les mesures indiquent que les boissons étudiées présentent " +
    "des valeurs de pH différentes. ";

  texte +=
    `Avant ouverture, la valeur de pH la plus faible est celle de ` +
    `${acideAvant.nom} (${acideAvant.avant}). `;

  texte +=
    `Après 24 heures, la valeur la plus faible est celle de ` +
    `${acideApres.nom} (${acideApres.apres24h}). `;

  if (hausse.length > 0) {
    texte +=
      "Le pH a augmenté pour : " +
      hausse.map(v => v.nom).join(", ") + ". ";
  }

  if (baisse.length > 0) {
    texte +=
      "Le pH a diminué pour : " +
      baisse.map(v => v.nom).join(", ") + ". ";
  }

  if (stable.length > 0) {
    texte +=
      "Le pH est resté identique pour : " +
      stable.map(v => v.nom).join(", ") + ". ";
  }

  texte +=
    "Ces résultats doivent être interprétés avec prudence. " +
    "Le dégazage peut modifier le pH de certaines boissons gazeuses, " +
    "mais il faut se baser sur les mesures réelles pour vérifier " +
    "si cette hypothèse est compatible avec les observations. " +
    "La température, le matériel et les conditions de mesure " +
    "peuvent également influencer les résultats.";

  return texte;
}

// ==========================================
// 5. AFFICHAGE DE LA CONCLUSION
// ==========================================

// Ajoute cette zone à la section conclusion de index.html.
// Elle sera remplie automatiquement par le script.

const zoneConclusion = document.getElementById("conclusionAuto");

if (zoneConclusion) {
  zoneConclusion.textContent = genererConclusion();
}

// ==========================================
// 6. MENU POUR MOBILE
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const ouvert = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(ouvert));
  });

  nav.querySelectorAll("a").forEach(lien => {
    lien.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ==========================================
// 7. LANCEMENT
// ==========================================

afficherTableau();
afficherGraphique();
