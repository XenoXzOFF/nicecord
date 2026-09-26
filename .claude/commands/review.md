---
name: /code-review
description: "Revue de code automatisée avec l'agent architecte"
---

# Commande : /code-review

## Description
Analyse le diff git courant et génère un rapport de review couvrant :
- Corrections de bugs
- Simplifications / duplications
- Performance
- Accessibilité (WCAG)
- Conformité design Discord

## Utilisation
```
/code-review
```

Invoque l'agent `architect-supervisor` en mode revue.
