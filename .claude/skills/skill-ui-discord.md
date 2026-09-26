# Skill : UI Discord

> Guide de design exact pour reproduire l'interface sombre de Discord dans Nicecord.

## Palette de couleurs (mode sombre)

### Couleurs principales
| Usage | Hex | RGB |
|-------|-----|-----|
| **Primary 500** (boutons, accents) | `#5865F2` | 88, 101, 242 |
| **Primary 600** (hover boutons) | `#4755EB` | 71, 85, 235 |
| **Background Default** | `#313338` | 49, 51, 56 |
| **Background Secondary** | `#2B2D31` | 43, 45, 49 |
| **Background Tertiary** | `#25262A` | 37, 38, 42 |
| **Background Accent** | `#1E1F22` | 30, 31, 34 |
| **Interactive Hover** | `#383A40` | 56, 58, 64 |
| **Interactive Active** | `#2A2B2F` | 42, 43, 47 |
| **Border / Divider** | `#2B2D31` | 43, 45, 49 |
| **Chat Background** | `#313338` | 49, 51, 56 |

### Couleurs de statut
| Status | Hex |
|--------|-----|
| Online | `#57F089` (vert) |
| Idle / Away | `#FFAF58` (orange) |
| Do Not Disturb | `#F0595E` (rouge) |
| Offline / Invisible | `#6A6D74` (gris) |

### Couleurs de texte
| Usage | Hex |
|-------|-----|
| **Text Primary** | `#FFFFFF` |
| **Text Secondary** (`#B5BAC1` sur Discord) | `#B5BAC1` |
| **Text Tertiary** (`#8E9297`) | `#8E9297` |
| **Text Link** | `#00AFF0` (bleu) |
| **Text Mentioned** | `#1E90FF` |
| **Text Warning** | `#FFA500` |

## Typographie

### Family
- **Principale** : `Whitney` → fallback système `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Code / Monospace** : `"Cascadia Code", "Fira Code", Consolas, monospace`

### Tailles et poids
| Élément | Taille | Line-height | Poids |
|---------|--------|-------------|-------|
| Logo / Titre d'app | 22px | 1 | 700 |
| Pseudo utilisateur | 16px | 1.2 | 500 |
| Nom de canal/channel list | 14px | 1.2 | 400 |
| Messages | 16px (body) | 1.5 | 400 |
| Timestamp | 12px | 1.2 | 400 |
| Sidebar item | 14px | 1.2 | 500 |
| Tooltip | 12px | 1.2 | 600 |

## Structure en 3 colonnes (layout Discord)

```
┌──────────────┬─────────────────────────┬──────────────────────────┐
│   Guild      │   Channel + Chat          │   User / Info Panel      │
│   Sidebar    │   Area                    │   (ou call/voice)        │
│              │                           │                          │
│  width:      │  width:                   │  width:                  │
│  72px (icon) │  min: 240px               │  316px (collapsed)       │
│  → 240px     │  → calc-fill              │  → 360px                 │
│  (hover)     │                           │                          │
└──────────────┴─────────────────────────┴──────────────────────────┘
```

### Colonne 1 — Guild Sidebar (guildes)
- Icônes en ligne (24×24 px) avec badge compteur de notifications.
- Active = `#5865F2` avec fond `#383A40`.
- Inactiver = `#8E9297`.

### Colonne 2 — Channel List + Chat
#### Header salon
- Hauteur : 48px
- Fond : `#2B2D31`
- Contient : nom du salon (icône), boutons (voice, apps, users).
- Breadcrumb : `Server > Category > Channel`

#### Message list (chat area)
- Padding : 20px horizontal, 16px vertical
- Scrollbar : `thin`, thumb `#2A2B2F`, hover `#383A40`
- Chaque message : avatar (40×40), nom + tag, contenu, timestamp
- Spacing entre messages : 16px (avec même auteur) → 4px (sibling)

#### Input bar (bas de la colonne 2)
- Hauteur : 88px
- Fond : `#313338` (ou transparence sur hover `#383A40`)
- Placeholder text : `#646870`
- Border radius : 18px (pill)
- Boutons d'attachement : gap 8px à gauche

### Colonne 3 — User Panel (right click / membres)
- Width : 316 → 360px
- Fond : `#2B2D31`
- Header : `#1E1F22`
- Liste membres : pseudo + statut en couleur
- Bouton "Disconnect" rouge `#F0595E`

## Composants clés à reproduire

### Bouton primaire
```html
<button class="bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition-colors px-4 py-2">
  Label
</button>
```
Tailwind : `bg-[#5865F2] hover:bg-[#4755EB]`

### Bouton secondaire
```html
<button class="hover-bg Secondary hover:text-primary-500 ...">
```

### Badge de notification
```
bg-[#F0595E] — 20px pill, blanc, px-2
```

### Message avatar ring
- 5px ring gris clair `#79797C` (hors ligne)
- 5px ring couleur de statut (online/idle/dnd)

### Scrollbar Discord
```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #2A2B2F; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #383A40; }
```

## Références visuelles
- App Screenshot Discord : `#313338` fonds, `#2B2D31` sidebars inactives
- L'ombre portée entre colonnes est absente (flat design)
- Les coins sont légèrement arrondis (4–8px globalement, 18px pour inputs)

---

*Conformité : WCAG 2.1 AA minimum — contraste texte/fond ≥ 4.5:1*
