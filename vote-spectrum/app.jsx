const { useState, useMemo, useEffect, useReducer, useCallback } = React;

const rechartsAvailable = typeof window !== 'undefined' && typeof window.Recharts === 'object' && window.Recharts !== null;

const createChartFallback = (message) => {
  const FallbackComponent = () => (
    <div className="h-full w-full flex items-center justify-center text-sm text-gray-500 text-center px-4 py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
      {message}
    </div>
  );
  return FallbackComponent;
};

const fallbackResponsiveContainer = ({ children }) => <div className="w-full h-full">{children}</div>;
const FallbackScatterChart = createChartFallback('Interactive scatter plot unavailable. Please refresh to retry.');
const FallbackBarChart = createChartFallback('Interactive alignment chart unavailable. Please refresh to retry.');

const RechartsLib = rechartsAvailable ? window.Recharts : {};
const {
  ResponsiveContainer = fallbackResponsiveContainer,
  BarChart = FallbackBarChart,
  Bar = () => null,
  XAxis = () => null,
  YAxis = () => null,
  CartesianGrid = () => null,
  Tooltip = () => null,
  Legend = () => null,
  Cell = () => null,
  ScatterChart = FallbackScatterChart,
  Scatter = () => null,
  ZAxis = () => null
} = RechartsLib;

const UI_COPY = {
  en: {
    language: {
      toggle: 'Français',
      name: 'English'
    },
    welcome: {
      title: 'Canadian Vote Spectrum',
      tagline: 'Discover where you stand on the Canadian political spectrum',
      intro:
        'This comprehensive voting advice instrument will help you understand your political positioning across multiple dimensions including economic policy, social values, climate priorities, and more.',
      expectationTitle: 'What to expect:',
      expectationItems: [
        '36 federal policy questions including current events & controversial issues',
        'Up to 12 province-specific questions',
        'Mark questions as very important for personalized weighting',
        'Educational facts about Canadian politics',
        'Progress milestones to keep you motivated',
        'Priority weighting exercise across 12 issue areas',
        '3 knowledge check questions',
        'Detailed breakdown showing WHY you matched with each party',
        'Consistency analysis of your responses',
        'Personalized results with party alignment & 2D positioning'
      ],
      timeEstimateLabel: 'Time estimate:',
      timeEstimateValue: '15-20 minutes',
      privacyLabel: 'Privacy:',
      privacyDescription: 'Your responses are private and never tracked.',
      privacyOptional: 'At the end, you can optionally contribute anonymized data for research.',
      startButton: 'Get Started'
    },
    province: {
      heading: 'Where do you live?',
      description: 'Choose your province to unlock questions tailored to your local political landscape.',
      cardDescription: 'Includes federal issues and provincial questions curated for {province} voters.'
    },
    pastVote: {
      heading: 'How did you vote federally in 2021?',
      description: 'This helps us understand your baseline perspective. You can skip if you prefer.',
      options: {
        'Conservative Party': 'Conservative Party',
        'Liberal Party': 'Liberal Party',
        'New Democratic Party': 'New Democratic Party',
        'Green Party': 'Green Party',
        "Bloc Québécois": 'Bloc Québécois',
        "People's Party": "People's Party",
        Independent: 'Independent',
        'Did not vote': 'Did not vote',
        'Prefer not to say': 'Prefer not to say'
      },
      continue: 'Continue to questionnaire',
      skip: 'Skip question'
    },
    questions: {
      loading: 'Loading questions...',
      restart: 'Restart',
      progress: 'Question {current} of {total}',
      complete: '{progress}% Complete',
      markImportantActive: 'Very Important to Me',
      markImportant: 'Mark as Important',
      position: 'Position',
      positionValue: 'Position: {value}',
      nav: {
        back: 'Back',
        skip: 'Skip',
        next: 'Next'
      },
      didYouKnowTitle: 'Did you know?',
      provincialTag: 'PROVINCIAL'
    },
    scale: {
      labels: [
        { value: 0, label: 'Strongly Disagree', short: 'SD' },
        { value: 25, label: 'Disagree', short: 'D' },
        { value: 50, label: 'Neutral', short: 'N' },
        { value: 75, label: 'Agree', short: 'A' },
        { value: 100, label: 'Strongly Agree', short: 'SA' }
      ],
      thresholds: [
        { max: 10, label: 'Strongly Disagree' },
        { max: 35, label: 'Disagree' },
        { max: 65, label: 'Neutral' },
        { max: 90, label: 'Agree' },
        { label: 'Strongly Agree' }
      ]
    },
    facts: [
      'Canada has had 23 Prime Ministers since Confederation in 1867.',
      'The longest-serving PM was William Lyon Mackenzie King (21 years).',
      "Canada's Senate has 105 appointed members who serve until age 75.",
      'The Bloc Quebecois only runs candidates in Quebec ridings.',
      "Canada uses a first-past-the-post electoral system.",
      'Federal elections must be held at least every 5 years.',
      'The Governor General formally appoints the Prime Minister.',
      "Quebec has 78 federal seats, the second-most after Ontario's 121.",
      "A party needs 172 seats to form a majority government in Canada's 343-seat House of Commons.",
      'Canada held a referendum on electoral reform in British Columbia in 2018 - it was defeated.',
      'The Clarity Act (2000) sets conditions for Quebec separation referendums.',
      "Supply management has protected Canadian dairy farmers since the 1970s.",
      "Canada's current voting system was established in 1867 and has never changed.",
      'The notwithstanding clause has been used over 50 times by provincial governments.',
      'About 75% of Canadians live within 100 miles of the US border.',
      "Canada-US trade exceeds $900 billion annually, making it the world's largest bilateral trade relationship.",
      'The US accounts for about 75% of Canada\'s total exports.',
      'CRTC regulations require Canadian radio stations to play at least 35% Canadian content.'
    ],
    milestones: {
      25: "25% Complete! You're doing great!",
      50: 'Halfway there! Keep up the momentum!',
      75: '75% Done! Almost at the finish line!'
    },
    importance: {
      heading: 'Issue Priorities',
      description:
        'Distribute 100 points across the 12 issue areas to show where you want your vote to focus. The more points you assign, the more weight that issue carries in your results.',
      totalAssigned: 'Total Assigned',
      tip: 'Tip: Try spreading points across your top 5 priorities.',
      back: 'Back to questions',
      continue: 'Continue to knowledge check',
      issueDescriptions: {
        cost_of_living: 'Inflation, affordability, and everyday expenses.',
        housing: 'Housing supply, affordability, and homelessness.',
        healthcare: 'Access to care, wait times, and health outcomes.',
        climate_environment: 'Climate targets, carbon pricing, and conservation.',
        energy_resources: 'Oil, gas, electricity, and resource development.',
        economy_taxes: 'Jobs, growth, trade, and taxation.',
        immigration: 'Immigration levels, settlement, and integration.',
        indigenous_reconciliation: 'Treaties, land back, and Indigenous rights.',
        civil_liberties_public_safety: 'Charter rights, policing, and security.',
        foreign_policy_defence: 'Defence spending, alliances, and global affairs.',
        education_childcare: 'Schools, post-secondary, childcare, and skills.',
        ethics_governance: 'Transparency, corruption, and democratic reforms.'
      }
    },
    knowledge: {
      loading: 'Loading knowledge check...',
      heading: 'Knowledge Check',
      progress: 'Question {current} of {total}',
      badge: 'Civic Literacy',
      instructions: 'Select the option you believe is correct.',
      helpText: 'These questions help us calibrate the confidence rating in your results.'
    },
    consent: {
      heading: 'Optional: Share anonymized results',
      description:
        'Help Northern Variables improve the Vote Spectrum by sharing your anonymized responses. We never store identifying information.',
      whatWeCollect: 'What we collect:',
      items: [
        'Province and high-level demographic info (if provided)',
        'Your answers to survey questions',
        'Importance weights and knowledge check results',
        'Calculated alignment with each party'
      ],
      checkboxLabel: 'I agree to anonymously share my results to improve the Vote Spectrum analysis.',
      submit: 'Submit & see results',
      skip: 'Skip and see results'
    },
    results: {
      heading: 'Your Vote Spectrum Results',
      summary: 'Based on {count} questions, importance weighting, and knowledge calibration.',
      pastVote: 'Past vote: {value}',
      pastVoteUndisclosed: 'Past vote undisclosed',
      province: 'Province: {province}',
      provinceMissing: 'Not provided',
      federalAlignmentTitle: 'Top federal party alignments',
      confidenceTitle: 'Confidence assessment',
      confidenceDescription:
        'We gauge confidence based on how consistently you responded and your knowledge check results.',
      confidenceLevels: {
        high: 'high',
        medium: 'medium',
        low: 'low',
        suffix: 'confidence'
      },
      reflectTitle: 'Things to reflect on',
      chartTitle: 'Economic vs Social Spectrum',
      chartFallback:
        'Interactive charts are unavailable because the visualization library could not be loaded. Refresh the page to try again.',
      provincialAlignmentTitle: 'Provincial alignments',
      provincialInsufficient: 'Insufficient data for provincial alignment.',
      provincialUnavailable: 'Provincial comparison available after selecting your province.',
      issueSummaryTitle: 'Issue weighting summary',
      nextStepsTitle: 'What to do next',
      nextStepsShare:
        'Share these insights with your community or explore detailed platform comparisons on our Substack.',
      nextStepsAdjust:
        'Want to revisit your answers? You can restart and adjust any question to see how alignments change.',
      restart: 'Restart survey',
      thanks: 'Thank you! Your anonymized contribution is helping refine the Vote Spectrum model.',
      consider: 'Consider sharing your anonymized data next time to improve our analysis.',
      confidenceLabel: '{level} confidence',
      scatter: {
        parties: 'Parties',
        you: 'You',
        x: 'Economic',
        y: 'Social'
      },
      axisLabels: {
        economic_model: 'Economic model',
        social_values: 'Social values',
        climate_resources: 'Climate & resources',
        immigration: 'Immigration',
        civil_liberties: 'Civil liberties',
        foreign_defence: 'Foreign policy & defence',
        reconciliation: 'Indigenous reconciliation',
        populism: 'Populism'
      },
      consistency: {
        "You strongly support both higher taxes for social programs and balanced budgets - these may be in tension.":
          'You strongly support both higher taxes for social programs and balanced budgets - these may be in tension.',
        'You strongly agree US influence is a problem but strongly oppose regulating US political content - how would you address the concern?':
          'You strongly agree US influence is a problem but strongly oppose regulating US political content - how would you address the concern?'
      }
    },
    footer: {
      rights: '{year} Northern Variables. All rights reserved.',
      readMore: 'Read more political analysis at',
      linkText: 'Northern Variables on Substack'
    },
    loading: {
      errorTitle: 'Unable to load Vote Spectrum',
      errorDescription: 'Please refresh the page or try again later.',
      retry: 'Retry',
      loading: 'Loading Vote Spectrum experience...'
    },
    provinces: {
      Alberta: 'Alberta',
      'British Columbia': 'British Columbia',
      Manitoba: 'Manitoba',
      'New Brunswick': 'New Brunswick',
      'Newfoundland and Labrador': 'Newfoundland and Labrador',
      'Nova Scotia': 'Nova Scotia',
      Ontario: 'Ontario',
      'Prince Edward Island': 'Prince Edward Island',
      Quebec: 'Quebec',
      Saskatchewan: 'Saskatchewan'
    },
    pastVoteOptions: {
      'Conservative Party': 'Conservative Party',
      'Liberal Party': 'Liberal Party',
      'New Democratic Party': 'New Democratic Party',
      'Green Party': 'Green Party',
      "Bloc Québécois": 'Bloc Québécois',
      "People's Party": "People's Party",
      Independent: 'Independent',
      'Did not vote': 'Did not vote',
      'Prefer not to say': 'Prefer not to say'
    }
  },
  fr: {
    language: {
      toggle: 'English',
      name: 'Français'
    },
    welcome: {
      title: 'Spectre du vote canadien',
      tagline: 'Découvrez votre position sur le spectre politique canadien',
      intro:
        'Cet outil complet de recommandation électorale vous aide à situer vos positions politiques sur plusieurs dimensions, dont l’économie, les valeurs sociales, les priorités climatiques et plus encore.',
      expectationTitle: 'À quoi s’attendre :',
      expectationItems: [
        '36 questions fédérales sur l’actualité et les enjeux controversés',
        'Jusqu’à 12 questions spécifiques à votre province',
        'Marquez les questions très importantes pour pondérer vos résultats',
        'Faits éducatifs sur la politique canadienne',
        'Jalons de progression pour rester motivé',
        'Exercice de pondération des priorités sur 12 enjeux',
        '3 questions de vérification des connaissances',
        'Analyse détaillée expliquant POURQUOI chaque parti vous correspond',
        'Analyse de cohérence de vos réponses',
        'Résultats personnalisés avec affinité partisane et positionnement 2D'
      ],
      timeEstimateLabel: 'Durée estimée :',
      timeEstimateValue: '15 à 20 minutes',
      privacyLabel: 'Confidentialité :',
      privacyDescription: 'Vos réponses demeurent privées et ne sont jamais suivies.',
      privacyOptional: 'À la fin, vous pouvez choisir de partager des données anonymisées pour la recherche.',
      startButton: 'Commencer'
    },
    province: {
      heading: 'Dans quelle province habitez-vous?',
      description: 'Choisissez votre province pour débloquer des questions adaptées à votre réalité politique locale.',
      cardDescription: 'Comprend des enjeux fédéraux et des questions provinciales conçues pour les électeurs de {province}.'
    },
    pastVote: {
      heading: 'Pour qui avez-vous voté fédéralement en 2021?',
      description: 'Cela nous aide à comprendre votre point de départ. Vous pouvez passer cette étape si vous préférez.',
      options: {
        'Conservative Party': 'Parti conservateur du Canada',
        'Liberal Party': 'Parti libéral du Canada',
        'New Democratic Party': 'Nouveau Parti démocratique',
        'Green Party': 'Parti vert du Canada',
        "Bloc Québécois": 'Bloc québécois',
        "People's Party": 'Parti populaire du Canada',
        Independent: 'Candidat indépendant',
        'Did not vote': 'N’a pas voté',
        'Prefer not to say': 'Préfère ne pas répondre'
      },
      continue: 'Continuer vers le questionnaire',
      skip: 'Passer la question'
    },
    questions: {
      loading: 'Chargement des questions...',
      restart: 'Recommencer',
      progress: 'Question {current} sur {total}',
      complete: '{progress}% complété',
      markImportantActive: 'Très important pour moi',
      markImportant: 'Marquer comme important',
      position: 'Position',
      positionValue: 'Position : {value}',
      nav: {
        back: 'Précédent',
        skip: 'Sauter',
        next: 'Suivant'
      },
      didYouKnowTitle: 'Le saviez-vous?',
      provincialTag: 'PROVINCIAL'
    },
    scale: {
      labels: [
        { value: 0, label: 'Fortement en désaccord', short: 'FD' },
        { value: 25, label: 'En désaccord', short: 'D' },
        { value: 50, label: 'Neutre', short: 'N' },
        { value: 75, label: 'D’accord', short: 'A' },
        { value: 100, label: 'Fortement d’accord', short: 'FA' }
      ],
      thresholds: [
        { max: 10, label: 'Fortement en désaccord' },
        { max: 35, label: 'En désaccord' },
        { max: 65, label: 'Neutre' },
        { max: 90, label: 'D’accord' },
        { label: 'Fortement d’accord' }
      ]
    },
    facts: [
      'Le Canada a eu 23 premiers ministres depuis la Confédération en 1867.',
      'Le premier ministre ayant servi le plus longtemps est William Lyon Mackenzie King (21 ans).',
      "Le Sénat canadien compte 105 membres nommés qui siègent jusqu’à 75 ans.",
      'Le Bloc québécois ne présente des candidats que dans les circonscriptions du Québec.',
      "Le Canada utilise un système électoral uninominal majoritaire à un tour.",
      'Une élection fédérale doit être tenue au moins tous les cinq ans.',
      'Le gouverneur général nomme officiellement le premier ministre.',
      "Le Québec compte 78 sièges fédéraux, le deuxième total après les 121 de l’Ontario.",
      "Il faut 172 sièges sur 343 à la Chambre des communes pour former un gouvernement majoritaire.",
      'La Colombie-Britannique a tenu un référendum sur la réforme électorale en 2018; la proposition a été rejetée.',
      'La Loi sur la clarté (2000) établit les conditions pour un référendum sur la souveraineté du Québec.',
      "La gestion de l’offre protège les producteurs laitiers canadiens depuis les années 1970.",
      "Le système de vote fédéral en vigueur date de 1867 et n’a jamais été changé.",
      'La clause dérogatoire a été utilisée plus de 50 fois par des gouvernements provinciaux.',
      'Environ 75 % des Canadiens vivent à moins de 160 km de la frontière américaine.',
      "Les échanges commerciaux Canada–États-Unis dépassent 900 milliards de dollars par année, ce qui en fait la plus importante relation bilatérale au monde.",
      'Les États-Unis représentent environ 75 % des exportations totales du Canada.',
      'Le CRTC exige que les stations de radio canadiennes diffusent au moins 35 % de contenu canadien.'
    ],
    milestones: {
      25: '25 % complété! Vous êtes sur la bonne lancée!',
      50: 'À mi-parcours! Gardez le rythme!',
      75: '75 % complété! Le fil d’arrivée est tout près!'
    },
    importance: {
      heading: 'Priorités par enjeu',
      description:
        'Répartissez 100 points entre les 12 domaines pour indiquer où vous souhaitez concentrer votre vote. Plus un enjeu reçoit de points, plus il influence vos résultats.',
      totalAssigned: 'Points attribués',
      tip: 'Astuce : répartissez vos points entre vos 5 priorités principales.',
      back: 'Retour aux questions',
      continue: 'Poursuivre vers la vérification des connaissances',
      issueDescriptions: {
        cost_of_living: 'Inflation, coût de la vie et dépenses quotidiennes.',
        housing: 'Offre de logements, abordabilité et itinérance.',
        healthcare: 'Accès aux soins, délais d’attente et résultats de santé.',
        climate_environment: 'Cibles climatiques, tarification du carbone et protection de l’environnement.',
        energy_resources: 'Pétrole, gaz, électricité et développement des ressources.',
        economy_taxes: 'Emplois, croissance, commerce et fiscalité.',
        immigration: 'Niveaux d’immigration, établissement et intégration.',
        indigenous_reconciliation: 'Traités, restitution des terres et droits autochtones.',
        civil_liberties_public_safety: 'Droits garantis par la Charte, sécurité publique et maintien de l’ordre.',
        foreign_policy_defence: 'Dépenses militaires, alliances et affaires internationales.',
        education_childcare: 'Écoles, études postsecondaires, services de garde et compétences.',
        ethics_governance: 'Transparence, intégrité et réformes démocratiques.'
      }
    },
    knowledge: {
      loading: 'Chargement de la vérification des connaissances...',
      heading: 'Vérification des connaissances',
      progress: 'Question {current} sur {total}',
      badge: 'Culture civique',
      instructions: 'Choisissez l’option que vous jugez correcte.',
      helpText: 'Ces questions servent à calibrer le niveau de confiance de vos résultats.'
    },
    consent: {
      heading: 'Optionnel : partager vos résultats anonymisés',
      description:
        'Aidez Northern Variables à améliorer le Spectre du vote en partageant vos réponses anonymisées. Nous ne conservons aucune information identifiante.',
      whatWeCollect: 'Ce que nous recueillons :',
      items: [
        'Province et renseignements démographiques généraux (si fournis)',
        'Vos réponses au questionnaire',
        'Les pondérations d’importance et les résultats de la vérification des connaissances',
        'Le calcul d’affinité avec chaque parti'
      ],
      checkboxLabel: 'J’accepte de partager anonymement mes résultats pour améliorer l’analyse du Spectre du vote.',
      submit: 'Soumettre et voir les résultats',
      skip: 'Passer et voir les résultats'
    },
    results: {
      heading: 'Vos résultats du Spectre du vote',
      summary: 'Fondés sur {count} questions, la pondération des priorités et la vérification des connaissances.',
      pastVote: 'Vote précédent : {value}',
      pastVoteUndisclosed: 'Vote précédent non divulgué',
      province: 'Province : {province}',
      provinceMissing: 'Non indiqué',
      federalAlignmentTitle: 'Meilleures affinités fédérales',
      confidenceTitle: 'Évaluation de la confiance',
      confidenceDescription:
        'Nous évaluons la confiance selon la cohérence de vos réponses et vos résultats à la vérification des connaissances.',
      confidenceLevels: {
        high: 'élevée',
        medium: 'moyenne',
        low: 'faible',
        suffix: 'confiance'
      },
      confidenceLabel: 'Confiance {level}',
      reflectTitle: 'Points à considérer',
      chartTitle: 'Spectre économique et social',
      chartFallback:
        'Le graphique interactif est indisponible pour le moment. Rafraîchissez la page pour réessayer.',
      provincialAlignmentTitle: 'Affinités provinciales',
      provincialInsufficient: 'Données insuffisantes pour calculer les affinités provinciales.',
      provincialUnavailable: 'La comparaison provinciale sera disponible après avoir indiqué votre province.',
      issueSummaryTitle: 'Résumé de pondération des enjeux',
      nextStepsTitle: 'Prochaines étapes',
      nextStepsShare:
        'Partagez ces résultats avec votre entourage ou consultez nos analyses détaillées sur Substack.',
      nextStepsAdjust:
        'Envie de revoir vos réponses? Redémarrez le questionnaire et voyez l’effet sur vos affinités.',
      restart: 'Recommencer le questionnaire',
      thanks: 'Merci! Votre contribution anonymisée aide à améliorer le modèle du Spectre du vote.',
      consider: 'Pensez à partager vos données anonymisées la prochaine fois pour bonifier notre analyse.',
      scatter: {
        parties: 'Partis',
        you: 'Vous',
        x: 'Économie',
        y: 'Valeurs sociales'
      },
      axisLabels: {
        economic_model: 'Modèle économique',
        social_values: 'Valeurs sociales',
        climate_resources: 'Climat et ressources',
        immigration: 'Immigration',
        civil_liberties: 'Libertés civiles',
        foreign_defence: 'Affaires étrangères et défense',
        reconciliation: 'Réconciliation autochtone',
        populism: 'Populisme'
      },
      consistency: {
        "You strongly support both higher taxes for social programs and balanced budgets - these may be in tension.":
          'Vous appuyez fortement des taxes plus élevées pour financer les programmes sociaux tout en voulant des budgets équilibrés — deux objectifs souvent difficiles à concilier.',
        'You strongly agree US influence is a problem but strongly oppose regulating US political content - how would you address the concern?':
          'Vous jugez très préoccupante l’influence américaine tout en refusant de réglementer le contenu politique américain — comment régleriez-vous cette contradiction?'
      }
    },
    footer: {
      rights: '{year} Northern Variables. Tous droits réservés.',
      readMore: 'Lisez d’autres analyses politiques sur',
      linkText: 'Northern Variables sur Substack'
    },
    loading: {
      errorTitle: 'Impossible de charger Spectre du vote',
      errorDescription: 'Rafraîchissez la page ou réessayez plus tard.',
      retry: 'Réessayer',
      loading: 'Chargement de l’expérience Spectre du vote...'
    },
    provinces: {
      Alberta: 'Alberta',
      'British Columbia': 'Colombie-Britannique',
      Manitoba: 'Manitoba',
      'New Brunswick': 'Nouveau-Brunswick',
      'Newfoundland and Labrador': 'Terre-Neuve-et-Labrador',
      'Nova Scotia': 'Nouvelle-Écosse',
      Ontario: 'Ontario',
      'Prince Edward Island': "Île-du-Prince-Édouard",
      Quebec: 'Québec',
      Saskatchewan: 'Saskatchewan'
    },
    pastVoteOptions: {
      'Conservative Party': 'Parti conservateur du Canada',
      'Liberal Party': 'Parti libéral du Canada',
      'New Democratic Party': 'Nouveau Parti démocratique',
      'Green Party': 'Parti vert du Canada',
      "Bloc Québécois": 'Bloc québécois',
      "People's Party": 'Parti populaire du Canada',
      Independent: 'Candidat indépendant',
      'Did not vote': 'N’a pas voté',
      'Prefer not to say': 'Préfère ne pas répondre'
    }
  }
};

const PROVINCE_ORDER = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Nova Scotia',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan'
];

const PAST_VOTE_OPTIONS = [
  'Conservative Party',
  'Liberal Party',
  'New Democratic Party',
  'Green Party',
  "Bloc Québécois",
  "People's Party",
  'Independent',
  'Did not vote',
  'Prefer not to say'
];

const MILESTONES = [
  { value: 25, upperBound: 30, translationKey: 25 },
  { value: 50, upperBound: 55, translationKey: 50 },
  { value: 75, upperBound: 80, translationKey: 75 }
];

const getByPath = (source, path) =>
  path.split('.').reduce((accumulator, segment) => {
    if (accumulator === undefined || accumulator === null) {
      return undefined;
    }
    return accumulator[segment];
  }, source);

const createI18n = (language) => {
  const fallback = UI_COPY.en;
  const dictionary = UI_COPY[language] || fallback;

  const lookup = (path, defaultValue) => {
    const value = getByPath(dictionary, path);
    if (value !== undefined) {
      return value;
    }
    const fallbackValue = getByPath(fallback, path);
    return fallbackValue !== undefined ? fallbackValue : defaultValue;
  };

  const interpolate = (template, replacements) =>
    template.replace(/\{(\w+)\}/g, (_, token) =>
      Object.prototype.hasOwnProperty.call(replacements, token) ? replacements[token] : `{${token}}`
    );

  const t = (path, replacements = {}) => {
    const template = lookup(path, path);
    if (typeof template !== 'string') {
      return template;
    }
    return interpolate(template, replacements);
  };

  const list = (path) => {
    const value = lookup(path, []);
    return Array.isArray(value) ? value : [];
  };

  const map = (path) => {
    const value = lookup(path, {});
    return typeof value === 'object' && value !== null ? value : {};
  };

  return { language, t, list, map, lookup };
};

const getQuestionText = (question, i18n, translations) => {
  if (!question) {
    return '';
  }
  if (i18n.language === 'fr') {
    const localized = translations?.questions?.[question.qid];
    if (localized) {
      return localized;
    }
  }
  return question.text;
};

const getIssueBucketLabel = (issueId, i18n, translations, fallbackLabel) => {
  if (i18n.language === 'fr') {
    const localized = translations?.issueBuckets?.[issueId]?.label || translations?.issueBuckets?.[issueId];
    if (localized) {
      return localized;
    }
  }
  if (fallbackLabel) {
    return fallbackLabel;
  }
  return issueId.replace(/_/g, ' ');
};

const getIssueBucketDescription = (issueId, i18n, translations) => {
  if (i18n.language === 'fr') {
    const localized = translations?.issueBuckets?.[issueId]?.description;
    if (localized) {
      return localized;
    }
  }
  return i18n.lookup(`importance.issueDescriptions.${issueId}`, '');
};

const getScaleLabels = (i18n) => i18n.list('scale.labels');

const getLabelForValue = (value, i18n) => {
  const thresholds = i18n.lookup('scale.thresholds', UI_COPY.en.scale.thresholds);
  for (const threshold of thresholds) {
    if (threshold.max === undefined || value <= threshold.max) {
      return threshold.label;
    }
  }
  return thresholds[thresholds.length - 1]?.label || '';
};

const getKnowledgeLocalization = (question, i18n, translations) => {
  if (!question) {
    return { text: '', options: [] };
  }
  if (i18n.language === 'fr') {
    const localized = translations?.knowledge?.[question.qid];
    if (localized) {
      return {
        text: localized.text || question.text,
        options: Array.isArray(localized.options) ? localized.options : question.options
      };
    }
  }
  return { text: question.text, options: question.options };
};

const getPastVoteLabel = (value, i18n) => i18n.lookup(`pastVoteOptions.${value}`, value);

const getProvinceLabel = (value, i18n) => i18n.lookup(`provinces.${value}`, value);

const translatePartyName = (code, parties, translations, i18n) => {
  const party = parties[code];
  if (!party) {
    return code;
  }
  if (i18n.language === 'fr') {
    const localized = translations?.parties?.[code];
    if (localized) {
      return localized;
    }
  }
  return party.name;
};

const translateProvincialPartyName = (province, code, provincialParties, translations, i18n) => {
  const party = provincialParties[province]?.[code];
  if (!party) {
    return code;
  }
  if (i18n.language === 'fr') {
    const localized = translations?.provincialParties?.[province]?.[code];
    if (localized) {
      return localized;
    }
  }
  return party.name;
};

const translateConsistencyIssue = (issue, i18n, translations) => {
  if (i18n.language === 'fr') {
    const localized = translations?.consistencyIssues?.[issue];
    if (localized) {
      return localized;
    }
    const fallback = i18n.lookup(`results.consistency.${issue}`, issue);
    if (fallback !== issue) {
      return fallback;
    }
  }
  return issue;
};

const getAxisLabel = (axis, i18n) => i18n.lookup(`results.axisLabels.${axis}`, axis.replace(/_/g, ' '));

const ACTIONS = {
  SET_SCREEN: 'SET_SCREEN',
  SET_PROVINCE: 'SET_PROVINCE',
  SET_PAST_VOTE: 'SET_PAST_VOTE',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
  TOGGLE_IMPORTANCE: 'TOGGLE_IMPORTANCE',
  SET_IMPORTANCE: 'SET_IMPORTANCE',
  SET_KNOWLEDGE_ANSWER: 'SET_KNOWLEDGE_ANSWER',
  SET_CONSENT: 'SET_CONSENT',
  MARK_MILESTONE: 'MARK_MILESTONE',
  SHOW_MILESTONE: 'SHOW_MILESTONE',
  HIDE_MILESTONE: 'HIDE_MILESTONE',
  SET_DATA_SUBMITTED: 'SET_DATA_SUBMITTED',
  RESET: 'RESET'
};

const initialState = {
  screen: 'welcome',
  province: '',
  responses: {},
  questionImportance: {},
  importance: {},
  knowledgeAnswers: {},
  pastVote2021: null,
  currentQuestionIndex: 0,
  milestoneFlags: {
    25: false,
    50: false,
    75: false
  },
  showMilestone: false,
  milestoneKey: null,
  consentToShare: false,
  dataSubmitted: false
};

function voteCompassReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SCREEN:
      return { ...state, screen: action.payload };
    case ACTIONS.SET_PROVINCE:
      return { ...state, province: action.payload };
    case ACTIONS.SET_PAST_VOTE:
      return { ...state, pastVote2021: action.payload };
    case ACTIONS.SET_CURRENT_QUESTION:
      return { ...state, currentQuestionIndex: action.payload };
    case ACTIONS.UPDATE_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.qid]: action.payload.value
        }
      };
    case ACTIONS.TOGGLE_IMPORTANCE:
      return {
        ...state,
        questionImportance: {
          ...state.questionImportance,
          [action.payload.qid]: action.payload.value
        }
      };
    case ACTIONS.SET_IMPORTANCE:
      return { ...state, importance: action.payload };
    case ACTIONS.SET_KNOWLEDGE_ANSWER:
      return {
        ...state,
        knowledgeAnswers: {
          ...state.knowledgeAnswers,
          [action.payload.qid]: action.payload.value
        }
      };
    case ACTIONS.SET_CONSENT:
      return { ...state, consentToShare: action.payload };
    case ACTIONS.MARK_MILESTONE:
      return {
        ...state,
        milestoneFlags: {
          ...state.milestoneFlags,
          [action.payload]: true
        }
      };
    case ACTIONS.SHOW_MILESTONE:
      return {
        ...state,
        showMilestone: true,
        milestoneKey: action.payload
      };
    case ACTIONS.HIDE_MILESTONE:
      return { ...state, showMilestone: false, milestoneKey: null };
    case ACTIONS.SET_DATA_SUBMITTED:
      return { ...state, dataSubmitted: action.payload };
    case ACTIONS.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

const getConsentWebhookUrl = () => '';

const WelcomeScreen = ({ onStart, i18n }) => {
  const { t, list } = i18n;
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('welcome.title')}</h1>
          <p className="text-lg text-gray-600">{t('welcome.tagline')}</p>
        </div>

        <div className="space-y-4 mb-8 text-gray-700">
          <p>{t('welcome.intro')}</p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="font-semibold mb-2">{t('welcome.expectationTitle')}</p>
            <ul className="space-y-1 text-sm">
              {list('welcome.expectationItems').map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            <strong>{t('welcome.timeEstimateLabel')}</strong> {t('welcome.timeEstimateValue')}{' '}
            <strong className="ml-2">{t('welcome.privacyLabel')}</strong> {t('welcome.privacyDescription')} {t('welcome.privacyOptional')}
          </p>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-lg"
        >
          {t('welcome.startButton')}
        </button>
      </div>
    </div>
  );
};

const ProvinceScreen = ({ onSelectProvince, i18n }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{i18n.t('province.heading')}</h2>
        <p className="text-gray-600">{i18n.t('province.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROVINCE_ORDER.map((province) => {
          const label = i18n.lookup(`provinces.${province}`, province);
          return (
            <button
              key={province}
              onClick={() => onSelectProvince(province)}
              className="p-6 border-2 border-transparent hover:border-red-500 rounded-xl bg-gray-50 hover:bg-red-50 transition-all duration-200 text-left shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-600 mt-2">{i18n.t('province.cardDescription', { province: label })}</p>
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const PastVoteScreen = ({ pastVote2021, onSelectPastVote, onContinue, i18n }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{i18n.t('pastVote.heading')}</h2>
        <p className="text-gray-600">{i18n.t('pastVote.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {PAST_VOTE_OPTIONS.map((option) => {
          const label = i18n.lookup(`pastVoteOptions.${option}`, option);
          return (
            <button
              key={option}
              onClick={() => onSelectPastVote(option)}
              className={`px-5 py-4 rounded-xl border-2 transition-all duration-200 text-left shadow-sm ${
                pastVote2021 === option
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-red-400 bg-gray-50'
              }`}
            >
              <span className="text-sm font-semibold">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onContinue}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow"
        >
          {i18n.t('pastVote.continue')}
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-white border border-gray-300 hover:border-red-400 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
        >
          {i18n.t('pastVote.skip')}
        </button>
      </div>
    </div>
  </div>
);


const QuestionsScreen = ({
  province,
  questions,
  currentQuestionIndex,
  responses,
  questionImportance,
  showMilestone,
  milestoneKey,
  onToggleImportance,
  onResponseChange,
  onSkip,
  onNext,
  onPrevious,
  onRestart,
  i18n,
  translations,
  issueBucketLabels
}) => {
  const currentQuestion = questions[currentQuestionIndex];

  const progress = useMemo(() => {
    if (!questions.length) {
      return 0;
    }
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  }, [currentQuestionIndex, questions.length]);

  const currentValue = currentQuestion ? responses[currentQuestion.qid] ?? 50 : 50;
  const isImportant = currentQuestion ? Boolean(questionImportance[currentQuestion.qid]) : false;
  const facts = i18n.list('facts');
  const randomFact = facts.length ? facts[currentQuestionIndex % facts.length] : '';
  const questionText = getQuestionText(currentQuestion, i18n, translations);
  const issueLabel = currentQuestion
    ? getIssueBucketLabel(currentQuestion.issue_bucket, i18n, translations, issueBucketLabels[currentQuestion.issue_bucket])
    : '';
  const provinceLabel = province ? getProvinceLabel(province, i18n) : '';

  if (!questions.length || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-xl text-gray-900 mb-4">{i18n.t('questions.loading')}</p>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            {i18n.t('questions.restart')}
          </button>
        </div>
      </div>
    );
  }

  const scaleLabels = getScaleLabels(i18n);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{i18n.t('questions.progress', { current: currentQuestionIndex + 1, total: questions.length })}</span>
            <span>{i18n.t('questions.complete', { progress: Math.round(progress) })}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 relative" style={{ height: '900px' }}>
          <div className="h-[800px] overflow-y-auto">
            <div className="mb-8 h-[16rem]">
              <div className="flex gap-2 mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {issueLabel.toUpperCase()}
                </span>
                {currentQuestion.jurisdiction === 'provincial' && (
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                    {provinceLabel} {i18n.t('questions.provincialTag')}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 h-[10rem] flex items-start overflow-y-auto">
                {questionText}
              </h3>

              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => onToggleImportance(currentQuestion.qid, !isImportant)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                    isImportant
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-800'
                      : 'border-gray-300 text-gray-600 hover:border-yellow-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isImportant ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {isImportant ? i18n.t('questions.markImportantActive') : i18n.t('questions.markImportant')}
                </button>
              </div>
            </div>

            <div className="space-y-6 h-[420px]">
              <div className="text-center">
                <div className="inline-block px-6 py-3 bg-red-600 text-white rounded-full text-xl font-bold mb-2">
                  {getLabelForValue(currentValue, i18n)}
                </div>
                <div className="text-sm text-gray-500">{i18n.t('questions.positionValue', { value: currentValue })}</div>
              </div>

              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={currentValue}
                  onChange={(event) => onResponseChange(currentQuestion.qid, Number(event.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-red-600 via-gray-300 to-blue-600 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: 'linear-gradient(to right, #DC2626 0%, #EF4444 20%, #D1D5DB 40%, #D1D5DB 60%, #3B82F6 80%, #2563EB 100%)'
                  }}
                />
                <style>{`
                  .slider::-webkit-slider-thumb {
                    appearance: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: white;
                    border: 4px solid #DC2626;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  }
                  .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                  }
                  .slider::-webkit-slider-thumb:active {
                    transform: scale(1.05);
                  }
                  .slider::-moz-range-thumb {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: white;
                    border: 4px solid #DC2626;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  }
                  .slider::-moz-range-thumb:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                  }
                  .slider::-moz-range-thumb:active {
                    transform: scale(1.05);
                  }
                `}</style>
              </div>

              <div className="flex justify-between text-xs text-gray-600 px-2">
                {scaleLabels.map(({ value, label }) => (
                  <span key={value ?? label} className="font-semibold text-center">
                    {String(label)
                      .split(' ')
                      .map((word, index) => (
                        <React.Fragment key={`${value ?? label}-${word}-${index}`}>
                          {index > 0 && <br />}
                          {word}
                        </React.Fragment>
                      ))}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onPrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {i18n.t('questions.nav.back')}
                </button>
                <button
                  onClick={onSkip}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-blue-400"
                >
                  {i18n.t('questions.nav.skip')}
                </button>
                <button
                  onClick={onNext}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  {i18n.t('questions.nav.next')}
                </button>
              </div>

              {(randomFact || i18n.t('questions.didYouKnowTitle')) && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">{i18n.t('questions.didYouKnowTitle')}</h4>
                  {randomFact && <p className="text-sm text-blue-700">{randomFact}</p>}
                </div>
              )}
            </div>
          </div>

          {showMilestone && milestoneKey !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-900 bg-opacity-10 rounded-2xl animate-fade-in">
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-6 py-3 rounded-xl text-lg font-semibold shadow-lg">
                {i18n.t(`milestones.${milestoneKey}`)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImportanceScreen = ({ importance, issueBuckets, onSetImportance, onContinue, onBack, i18n, translations }) => {
  const totalAssigned = useMemo(() => Object.values(importance).reduce((sum, value) => sum + value, 0), [importance]);

  const handleSliderChange = (bucket, value) => {
    onSetImportance({
      ...importance,
      [bucket]: Number(value)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="md:w-2/5">
            <div className="sticky top-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{i18n.t('importance.heading')}</h2>
              <p className="text-gray-600 mb-6">{i18n.t('importance.description')}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <p className="text-sm text-blue-800 font-semibold mb-2">{i18n.t('importance.totalAssigned')}</p>
                <div className="text-3xl font-bold text-blue-900">{totalAssigned} / 100</div>
                <p className="text-xs text-blue-700 mt-2">{i18n.t('importance.tip')}</p>
              </div>
            </div>
          </div>

          <div className="md:w-3/5 space-y-6">
            {issueBuckets.map((bucket) => {
              const value = importance[bucket.id] ?? 0;
              const fallbackLabel = bucket.name ?? bucket.label ?? bucket.id;
              const label = getIssueBucketLabel(bucket.id, i18n, translations, fallbackLabel);
              const description = getIssueBucketDescription(bucket.id, i18n, translations);
              return (
                <div key={bucket.id} className="bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                      {description && <p className="text-xs text-gray-600">{description}</p>}
                    </div>
                    <div className="text-2xl font-bold text-red-600">{value}</div>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={value}
                    onChange={(event) => handleSliderChange(bucket.id, event.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />

                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0</span>
                    <span>10</span>
                    <span>20</span>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onBack}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-red-400"
              >
                {i18n.t('importance.back')}
              </button>
              <button
                onClick={onContinue}
                className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700"
              >
                {i18n.t('importance.continue')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const KnowledgeScreen = ({ knowledgeQuiz, knowledgeAnswers, onUpdateAnswer, onComplete, i18n, translations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = knowledgeQuiz[currentIndex];
  const localized = getKnowledgeLocalization(currentQuestion, i18n, translations);

  const handleAnswer = (answerIndex) => {
    onUpdateAnswer(currentQuestion.qid, answerIndex);
    if (currentIndex < knowledgeQuiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  if (!knowledgeQuiz.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <p className="text-xl text-gray-900 mb-4">{i18n.t('knowledge.loading')}</p>
        </div>
      </div>
    );
  }

  const currentAnswer = knowledgeAnswers[currentQuestion.qid];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{i18n.t('knowledge.heading')}</h2>
            <p className="text-gray-600">{i18n.t('knowledge.progress', { current: currentIndex + 1, total: knowledgeQuiz.length })}</p>
          </div>
          <div className="text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-full">{i18n.t('knowledge.badge')}</div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">{localized.text}</h3>
          <p className="text-sm text-gray-600">{i18n.t('knowledge.instructions')}</p>
        </div>

        <div className="space-y-3">
          {localized.options.map((option, optionIndex) => {
            const isSelected = currentAnswer === optionIndex;
            const isCorrect = optionIndex === currentQuestion.correct;
            return (
              <button
                key={`${currentQuestion.qid}-${optionIndex}`}
                onClick={() => handleAnswer(optionIndex)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-blue-400 bg-white'
                }`}
              >
                <span className="text-sm font-semibold">{option}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>{i18n.t('knowledge.helpText')}</p>
        </div>
      </div>
    </div>
  );
};

const ConsentScreen = ({ consentToShare, onToggleConsent, onSubmit, onSkip, i18n }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{i18n.t('consent.heading')}</h2>
        <p className="text-gray-600">{i18n.t('consent.description')}</p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{i18n.t('consent.whatWeCollect')}</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          {i18n.list('consent.items').map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <input
          id="consent-checkbox"
          type="checkbox"
          checked={consentToShare}
          onChange={(event) => onToggleConsent(event.target.checked)}
          className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
        />
        <label htmlFor="consent-checkbox" className="text-sm text-gray-700">
          {i18n.t('consent.checkboxLabel')}
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSubmit}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
        >
          {i18n.t('consent.submit')}
        </button>
        <button
          onClick={onSkip}
          className="flex-1 bg-white border border-gray-300 hover:border-red-400 text-gray-700 font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
        >
          {i18n.t('consent.skip')}
        </button>
      </div>
    </div>
  </div>
);

const ResultsScreen = ({
  results,
  responses,
  questions,
  province,
  parties,
  provincialParties,
  pastVote2021,
  dataSubmitted,
  onRestart,
  i18n,
  translations
}) => {
  const axes = useMemo(() =>
    Object.keys(parties.CPC).filter((key) => key !== 'name' && key !== 'color')
  , [parties]);

  const partyAlignment = Object.entries(results.partyDistances)
    .map(([code, data]) => ({
      party: translatePartyName(code, parties, translations, i18n),
      alignment: Math.round(data.alignment)
    }))
    .sort((a, b) => b.alignment - a.alignment)
    .slice(0, 5);

  const provincialAlignment = Object.entries(results.provincialPartyDistances || {})
    .map(([code, data]) => ({
      party: translateProvincialPartyName(province, code, provincialParties, translations, i18n),
      alignment: Math.round(data.alignment)
    }))
    .sort((a, b) => b.alignment - a.alignment)
    .slice(0, 5);

  const scatterData = Object.entries(parties).map(([code, party]) => ({
    party: translatePartyName(code, parties, translations, i18n),
    x: party.economic_model * 100,
    y: party.social_values * 100,
    fill: party.color,
    code
  }));

  const userPoint = {
    x: (results.axisScores.economic_model ?? 0) * 100,
    y: (results.axisScores.social_values ?? 0) * 100
  };

  const pastVoteText = pastVote2021
    ? i18n.t('results.pastVote', { value: getPastVoteLabel(pastVote2021, i18n) })
    : i18n.t('results.pastVoteUndisclosed');
  const provinceText = i18n.t('results.province', {
    province: province ? getProvinceLabel(province, i18n) : i18n.t('results.provinceMissing')
  });
  const confidenceLevel = i18n.t(`results.confidenceLevels.${results.confidence}`);
  const confidenceText = i18n.t('results.confidenceLabel', { level: confidenceLevel });
  const consistencyMessages = results.consistencyIssues.map((issue) =>
    translateConsistencyIssue(issue, i18n, translations)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{i18n.t('results.heading')}</h2>
              <p className="text-gray-600">{i18n.t('results.summary', { count: questions.length })}</p>
            </div>
            <div className="text-sm text-right text-gray-500">
              {pastVoteText}
              <br />
              {provinceText}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{i18n.t('results.federalAlignmentTitle')}</h3>
              <div className="space-y-3">
                {partyAlignment.map((item, index) => (
                  <div key={item.party} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm font-semibold text-gray-900">
                        <span>{item.party}</span>
                        <span>{item.alignment}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${item.alignment}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{i18n.t('results.confidenceTitle')}</h3>
              <p className="text-sm text-gray-600 mb-3">{i18n.t('results.confidenceDescription')}</p>
              <div className="text-2xl font-bold text-red-600 capitalize">{confidenceText}</div>
              {consistencyMessages.length > 0 && (
                <div className="mt-4 bg-white border border-yellow-300 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-yellow-800 mb-2">{i18n.t('results.reflectTitle')}</h4>
                  <ul className="list-disc pl-5 text-xs text-yellow-700 space-y-1">
                    {consistencyMessages.map((issue, index) => (
                      <li key={`${issue}-${index}`}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{i18n.t('results.chartTitle')}</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={i18n.t('results.scatter.x')}
                    unit="%"
                    domain={[-100, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={i18n.t('results.scatter.y')}
                    unit="%"
                    domain={[-100, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <ZAxis type="number" range={[60, 160]} />
                  <Tooltip formatter={(value) => `${Math.round(value)}%`} />
                  <Legend />
                  <Scatter name={i18n.t('results.scatter.parties')} data={scatterData}>
                    {scatterData.map((entry) => (
                      <Cell key={entry.code} fill={entry.fill} />
                    ))}
                  </Scatter>
                  <Scatter name={i18n.t('results.scatter.you')} data={[userPoint]} fill="#111827">
                    <Cell fill="#111827" />
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            {!rechartsAvailable && (
              <p className="mt-4 text-xs text-gray-500">{i18n.t('results.chartFallback')}</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{i18n.t('results.provincialAlignmentTitle')}</h3>
            {province ? (
              <div className="space-y-3">
                {provincialAlignment.length ? (
                  provincialAlignment.map((item, index) => (
                    <div key={item.party} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm font-semibold text-gray-900">
                          <span>{item.party}</span>
                          <span>{item.alignment}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.alignment}%` }} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">{i18n.t('results.provincialInsufficient')}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">{i18n.t('results.provincialUnavailable')}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{i18n.t('results.issueSummaryTitle')}</h3>
              <div className="space-y-3">
                {Object.entries(results.axisScores).map(([axis, score]) => (
                  <div key={axis} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between text-sm font-semibold text-gray-900">
                      <span>{getAxisLabel(axis, i18n)}</span>
                      <span>{Math.round(score * 100) / 100}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(Math.abs(score) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{i18n.t('results.nextStepsTitle')}</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>{i18n.t('results.nextStepsShare')}</p>
                <p>{i18n.t('results.nextStepsAdjust')}</p>
                <button
                  onClick={onRestart}
                  className="w-full px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:border-red-400"
                >
                  {i18n.t('results.restart')}
                </button>
                {dataSubmitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-4">
                    {i18n.t('results.thanks')}
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg p-4">
                    {i18n.t('results.consider')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VoteCompass = ({
  allQuestions,
  knowledgeQuiz,
  issueBuckets,
  parties,
  provincialParties,
  translations = {}
}) => {
  const [state, dispatch] = useReducer(voteCompassReducer, initialState);
  const [language, setLanguage] = useState('en');
  const i18n = useMemo(() => createI18n(language), [language]);
  const {
    screen,
    province,
    responses,
    questionImportance,
    importance,
    knowledgeAnswers,
    pastVote2021,
    currentQuestionIndex,
    milestoneFlags,
    showMilestone,
    milestoneKey,
    consentToShare,
    dataSubmitted
  } = state;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'fr' ? 'fr-CA' : 'en-CA';
    }
  }, [language]);

  const activeTranslations = translations[language] || {};

  const issueBucketLabels = useMemo(() => {
    const labels = {};
    issueBuckets.forEach((bucket) => {
      labels[bucket.id] = bucket.label ?? bucket.name ?? bucket.id;
    });
    return labels;
  }, [issueBuckets]);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((question) => {
      if (question.jurisdiction === 'federal') {
        return true;
      }

      if (question.jurisdiction === 'provincial' && Array.isArray(question.province_gate)) {
        return question.province_gate.includes(province);
      }

      return false;
    });
  }, [province, allQuestions]);

  useEffect(() => {
    if (filteredQuestions.length > 0 && currentQuestionIndex >= filteredQuestions.length) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: 0 });
    }
  }, [filteredQuestions.length, currentQuestionIndex]);

  useEffect(() => {
    if (screen !== 'questions' || !filteredQuestions.length) {
      return undefined;
    }

    const progress = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
    const milestone = MILESTONES.find((item) => {
      const hasReached = progress >= item.value && progress < item.upperBound;
      const hasSeen = Boolean(milestoneFlags[item.value]);
      return hasReached && !hasSeen;
    });

    if (!milestone) {
      return undefined;
    }

    dispatch({ type: ACTIONS.MARK_MILESTONE, payload: milestone.value });
    dispatch({ type: ACTIONS.SHOW_MILESTONE, payload: milestone.translationKey });

    return undefined;
  }, [currentQuestionIndex, screen, filteredQuestions.length, milestoneFlags, dispatch]);

  useEffect(() => {
    if (!showMilestone) {
      return undefined;
    }

    const timeout = setTimeout(() => {
      dispatch({ type: ACTIONS.HIDE_MILESTONE });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showMilestone, dispatch]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: currentQuestionIndex + 1 });
    } else {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'importance' });
    }
  }, [currentQuestionIndex, filteredQuestions.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: currentQuestionIndex - 1 });
    }
  }, [currentQuestionIndex]);

  const restartToProvinceSelection = useCallback(() => {
    dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: 0 });
    dispatch({ type: ACTIONS.SET_SCREEN, payload: 'province' });
  }, []);

  const calculateResults = useCallback(() => {
    const axisScores = {};
    const axisWeights = {};
    const federalAxisScores = {};
    const federalAxisWeights = {};
    const provincialAxisScores = {};
    const provincialAxisWeights = {};

    const axes = Object.keys(parties.CPC).filter((key) => key !== 'name' && key !== 'color');
    axes.forEach((axis) => {
      axisScores[axis] = 0;
      axisWeights[axis] = 0;
      federalAxisScores[axis] = 0;
      federalAxisWeights[axis] = 0;
      provincialAxisScores[axis] = 0;
      provincialAxisWeights[axis] = 0;
    });

    filteredQuestions.forEach((question) => {
      const response = responses[question.qid];
      if (response === undefined || response === null) {
        return;
      }

      const value = (response - 50) / 50;
      const importanceMultiplier = questionImportance[question.qid] ? 1.5 : 1.0;

      question.axis_map.forEach((mapping) => {
        const contribution = value * mapping.weight * mapping.polarity * importanceMultiplier;
        axisScores[mapping.axis_id] += contribution;
        axisWeights[mapping.axis_id] += Math.abs(mapping.weight) * importanceMultiplier;

        if (question.jurisdiction === 'federal') {
          federalAxisScores[mapping.axis_id] += contribution;
          federalAxisWeights[mapping.axis_id] += Math.abs(mapping.weight) * importanceMultiplier;
        } else if (question.jurisdiction === 'provincial') {
          provincialAxisScores[mapping.axis_id] += contribution;
          provincialAxisWeights[mapping.axis_id] += Math.abs(mapping.weight) * importanceMultiplier;
        }
      });
    });

    axes.forEach((axis) => {
      if (axisWeights[axis] > 0) {
        axisScores[axis] = axisScores[axis] / axisWeights[axis];
      }
      if (federalAxisWeights[axis] > 0) {
        federalAxisScores[axis] = federalAxisScores[axis] / federalAxisWeights[axis];
      }
      if (provincialAxisWeights[axis] > 0) {
        provincialAxisScores[axis] = provincialAxisScores[axis] / provincialAxisWeights[axis];
      }
    });

    const partyDistances = {};
    Object.entries(parties).forEach(([code, party]) => {
      let sumSquares = 0;
      let count = 0;

      Object.keys(federalAxisScores).forEach((axis) => {
        if (party[axis] === undefined) {
          return;
        }

        const diff = federalAxisScores[axis] - party[axis];
        sumSquares += diff * diff;
        count += 1;
      });

      const distance = count > 0 ? Math.sqrt(sumSquares / count) : 0;
      partyDistances[code] = {
        distance,
        alignment: Math.max(0, (1 - distance / 2) * 100)
      };
    });

    const provincialPartyDistances = {};
    const provincial = provincialParties[province] || {};
    Object.entries(provincial).forEach(([code, party]) => {
      let sumSquares = 0;
      let count = 0;

      Object.keys(provincialAxisScores).forEach((axis) => {
        if (party[axis] === undefined) {
          return;
        }

        const diff = provincialAxisScores[axis] - party[axis];
        sumSquares += diff * diff;
        count += 1;
      });

      if (count === 0) {
        return;
      }

      const distance = Math.sqrt(sumSquares / count);
      provincialPartyDistances[code] = {
        distance,
        alignment: Math.max(0, (1 - distance / 2) * 100)
      };
    });

    const totalQuestions = filteredQuestions.length;
    const neutralCount = Object.values(responses).filter((value) => value === 50).length;
    const knowledgeCorrect = Object.entries(knowledgeAnswers).filter(([qid, answer]) => {
      const quizQuestion = knowledgeQuiz.find((item) => item.qid === qid);
      return quizQuestion && answer === quizQuestion.correct;
    }).length;
    const knowledgeRate = knowledgeQuiz.length > 0 ? knowledgeCorrect / knowledgeQuiz.length : 1;

    let confidence = 'high';
    if (totalQuestions === 0) {
      confidence = 'low';
    } else if (neutralCount / totalQuestions > 0.5 || knowledgeRate < 0.375) {
      confidence = 'low';
    } else if (neutralCount / totalQuestions > 0.3 || knowledgeRate < 0.6) {
      confidence = 'medium';
    }

    const consistencyIssues = [];
    if (responses['ECON_PROGRESSIVE_TAX'] !== undefined && responses['ECON_BALANCED_BUDGETS'] !== undefined) {
      if (responses['ECON_PROGRESSIVE_TAX'] <= 20 && responses['ECON_BALANCED_BUDGETS'] >= 80) {
        consistencyIssues.push("You strongly support both higher taxes for social programs and balanced budgets - these may be in tension.");
      }
    }
    if (responses['CONT_US_POLITICAL_INFLUENCE'] !== undefined && responses['CONT_US_MEDIA_REGULATION'] !== undefined) {
      if (responses['CONT_US_POLITICAL_INFLUENCE'] >= 80 && responses['CONT_US_MEDIA_REGULATION'] <= 20) {
        consistencyIssues.push("You strongly agree US influence is a problem but strongly oppose regulating US political content - how would you address the concern?");
      }
    }

    return {
      axisScores,
      partyDistances,
      provincialPartyDistances,
      confidence,
      consistencyIssues
    };
  }, [province, filteredQuestions, responses, questionImportance, knowledgeAnswers, knowledgeQuiz, parties, provincialParties]);

  const results = useMemo(() => calculateResults(), [calculateResults]);

  const submitAnonymizedData = useCallback(async () => {
    if (!consentToShare) {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' });
      return;
    }

    const webhookUrl = getConsentWebhookUrl();
    if (!webhookUrl) {
      dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' });
      return;
    }

    const { axisScores, partyDistances } = calculateResults();
    const payload = {
      timestamp: new Date().toISOString(),
      province,
      responses,
      questionImportance,
      importanceWeights: importance,
      knowledgeAnswers,
      pastVote2021,
      axisScores,
      topThreeParties: Object.entries(partyDistances)
        .sort(([, a], [, b]) => b.alignment - a.alignment)
        .slice(0, 3)
        .map(([code, data]) => ({ party: code, alignment: data.alignment }))
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        dispatch({ type: ACTIONS.SET_DATA_SUBMITTED, payload: true });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }

    dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' });
  }, [consentToShare, calculateResults, province, responses, questionImportance, importance, knowledgeAnswers, pastVote2021]);

  const toggleText = i18n.lookup('language.toggle', language === 'en' ? 'Français' : 'English');

  return (
    <div className="font-sans min-h-screen flex flex-col">
      <div className="fixed top-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'))}
          className="px-4 py-2 rounded-full bg-white/90 border border-gray-300 shadow hover:bg-white transition-colors text-sm font-semibold"
        >
          {toggleText}
        </button>
      </div>
      <div className="flex-1">
        {screen === 'welcome' && (
          <WelcomeScreen i18n={i18n} onStart={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'province' })} />
        )}
        {screen === 'province' && (
          <ProvinceScreen
            i18n={i18n}
            onSelectProvince={(selectedProvince) => {
              dispatch({ type: ACTIONS.SET_PROVINCE, payload: selectedProvince });
              dispatch({ type: ACTIONS.SET_SCREEN, payload: 'past-vote' });
            }}
          />
        )}
        {screen === 'past-vote' && (
          <PastVoteScreen
            i18n={i18n}
            pastVote2021={pastVote2021}
            onSelectPastVote={(selection) => dispatch({ type: ACTIONS.SET_PAST_VOTE, payload: selection })}
            onContinue={() => {
              dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: 0 });
              dispatch({ type: ACTIONS.SET_SCREEN, payload: 'questions' });
            }}
          />
        )}
        {screen === 'questions' && (
          <QuestionsScreen
            province={province}
            questions={filteredQuestions}
            currentQuestionIndex={currentQuestionIndex}
            responses={responses}
            questionImportance={questionImportance}
            showMilestone={showMilestone}
            milestoneKey={milestoneKey}
            onToggleImportance={(qid, value) => dispatch({ type: ACTIONS.TOGGLE_IMPORTANCE, payload: { qid, value } })}
            onResponseChange={(qid, value) => dispatch({ type: ACTIONS.UPDATE_RESPONSE, payload: { qid, value } })}
            onSkip={goToNextQuestion}
            onNext={goToNextQuestion}
            onPrevious={goToPreviousQuestion}
            onRestart={restartToProvinceSelection}
            i18n={i18n}
            translations={activeTranslations}
            issueBucketLabels={issueBucketLabels}
          />
        )}
        {screen === 'importance' && (
          <ImportanceScreen
            importance={importance}
            issueBuckets={issueBuckets}
            onSetImportance={(nextImportance) => dispatch({ type: ACTIONS.SET_IMPORTANCE, payload: nextImportance })}
            onContinue={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'knowledge' })}
            onBack={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'questions' })}
            i18n={i18n}
            translations={activeTranslations}
          />
        )}
        {screen === 'knowledge' && (
          <KnowledgeScreen
            knowledgeQuiz={knowledgeQuiz}
            knowledgeAnswers={knowledgeAnswers}
            onUpdateAnswer={(qid, value) => dispatch({ type: ACTIONS.SET_KNOWLEDGE_ANSWER, payload: { qid, value } })}
            onComplete={() => dispatch({ type: ACTIONS.SET_SCREEN, payload: 'consent' })}
            i18n={i18n}
            translations={activeTranslations}
          />
        )}
        {screen === 'consent' && (
          <ConsentScreen
            consentToShare={consentToShare}
            onToggleConsent={(value) => dispatch({ type: ACTIONS.SET_CONSENT, payload: value })}
            onSubmit={submitAnonymizedData}
            onSkip={() => {
              dispatch({ type: ACTIONS.SET_CONSENT, payload: false });
              dispatch({ type: ACTIONS.SET_SCREEN, payload: 'results' });
            }}
            i18n={i18n}
          />
        )}
        {screen === 'results' && (
          <ResultsScreen
            results={results}
            responses={responses}
            questions={filteredQuestions}
            province={province}
            parties={parties}
            provincialParties={provincialParties}
            pastVote2021={pastVote2021}
            dataSubmitted={dataSubmitted}
            onRestart={() => dispatch({ type: ACTIONS.RESET })}
            i18n={i18n}
            translations={activeTranslations}
          />
        )}
      </div>

      <footer className="bg-gray-900 text-white py-6 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm mb-2">{new Date().getFullYear()} Northern Variables. All rights reserved.</p>
          <p className="text-sm text-gray-400">
            Read more political analysis at{' '}
            <a
              href="https://axorc.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              Northern Variables on Substack
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

const VoteSpectrumApp = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [baseResponse, translationResponse] = await Promise.all([
          fetch('./vote-spectrum-data.json'),
          fetch('./vote-spectrum/translations-fr.json').catch(() => null)
        ]);

        if (!baseResponse.ok) {
          throw new Error('Failed to load data');
        }

        const baseJson = await baseResponse.json();
        const translations = {};

        if (translationResponse && translationResponse.ok) {
          try {
            translations.fr = await translationResponse.json();
          } catch (translationError) {
            console.warn('Unable to parse French translations', translationError);
          }
        }

        setData({ ...baseJson, translations });
      } catch (err) {
        console.error('Error loading Vote Spectrum data', err);
        setError(err);
      }
    };

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Unable to load Vote Spectrum</h1>
          <p className="text-gray-300">Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-300">Loading Vote Spectrum experience...</p>
        </div>
      </div>
    );
  }

  return (
    <VoteCompass
      allQuestions={data.allQuestions}
      knowledgeQuiz={data.knowledgeQuiz}
      issueBuckets={data.issueBuckets}
      parties={data.parties}
      provincialParties={data.provincialParties}
      translations={data.translations || {}}
    />
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<VoteSpectrumApp />);
