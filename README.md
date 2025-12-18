# 🎄 Tombola - Marché de Noël 🎁

Une application web interactive pour organiser une tombola avec tirage aléatoire équitable basé sur les tickets achetés.

## ✨ Fonctionnalités

- **Import CSV** : Chargez les participants directement depuis un export Lydia
- **Gestion des lots** : Ajoutez facilement vos lots de tombola avec descriptions et emojis
- **Tirage aléatoire équitable** : Plus un participant achète de tickets, plus il a de chances de gagner
- **Animation attractive** : Animation de tirage qui rend l'expérience visuelle et amusante
- **Résultats en temps réel** : Voir tous les résultats à mesure que vous tirez
- **Export des résultats** : Téléchargez les résultats en CSV
- **Annulation** : Annulez le dernier tirage si nécessaire

## 🚀 Installation

### Prérequis
- Node.js (v14+)
- npm ou yarn

### Setup

```bash
# Aller dans le dossier Tombola
cd Tombola

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible à `http://localhost:5173`

## 📝 Format du fichier CSV (Lydia)

Votre fichier CSV doit contenir au minimum ces colonnes :
- **Nom** (ou "Name") : Nom du participant
- **Montant** (ou "Amount") : Montant payé en euros

Exemple :
```csv
Nom,Montant
Jean Dupont,5
Marie Martin,10
Pierre Bernard,5
```

**Note** : Le montant sera converti en nombre de tickets (1€ = 1 ticket)

## 🎁 Format des lots

Vous pouvez ajouter des lots de la façon suivante :
- **Icône** : Un emoji représentant le lot (ex: 🎮, 🍫, 📚)
- **Nom** : Nom du lot (ex: "Jeu vidéo", "Boîte de chocolats")
- **Description/Valeur** : Détails supplémentaires (ex: "PlayStation 5", "Lindor")

## 🎲 Utilisation

1. **Importer les participants** : Téléchargez votre fichier CSV
2. **Ajouter les lots** : Entrez vos lots à gagner
3. **Faire les tirages** : Cliquez sur "Faire un tirage" pour chaque lot
4. **Voir les résultats** : Consultez la liste des gagnants en temps réel
5. **Exporter** : Téléchargez les résultats en CSV

## 🔧 Commandes disponibles

```bash
# Développement
npm run dev

# Build pour production
npm run build

# Déployer sur GitHub Pages
npm run deploy
```

## 🎯 Comment ça marche ?

1. **Pool de tickets** : Chaque participant est ajouté au pool autant de fois qu'il a de tickets
   - Participant avec 1€ payé = 1 ticket dans le pool
   - Participant avec 10€ payés = 10 tickets dans le pool

2. **Tirage** : Un ticket est tiré aléatoirement dans le pool
   - Le participant associé à ce ticket gagne le lot
   - Les chances sont proportionnelles au nombre de tickets achetés

3. **Animation** : L'application anime le tirage pour plus d'impact visuel

## 🎨 Personnalisation

Tous les styles sont dans le dossier `src/styles/` :
- `globals.css` : Styles globaux
- `file-uploader.css` : Styles de l'importateur
- `prize-manager.css` : Styles du gestionnaire de lots
- `drawing-interface.css` : Styles de l'interface de tirage

## 🐛 Troubleshooting

**Le fichier CSV n'est pas reconnu**
- Vérifiez que votre fichier contient les colonnes "Nom" et "Montant"
- Assurez-vous que le fichier est en format CSV (séparé par des virgules)

**L'application ne démarre pas**
- Assurez-vous que Node.js est installé : `node --version`
- Supprimez `node_modules` et reinstallez : `npm install`

## 📦 Stack technique

- **React 18** : Framework UI
- **Vite** : Build tool et dev server
- **PapaParse** : Parser CSV
- **CSS3** : Styling et animations

## 📄 License

Créé pour le Marché de Noël 🎄

---

Amusez-vous bien avec votre tombola! 🎲✨
