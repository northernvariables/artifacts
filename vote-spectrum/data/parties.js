export const parties = {
  CPC: { name: "Conservative", color: "#1A4D9C", logo: "./assets/party-logos/CPC.svg", economic_model: 0.7, social_values: 0.5, climate_resources: 0.6, immigration: 0.2, civil_liberties: 0.3, foreign_defence: 0.5, reconciliation: 0.2, populism: 0.3 },
  LPC: { name: "Liberal", color: "#D71920", logo: "./assets/party-logos/LPC.svg", economic_model: -0.2, social_values: -0.4, climate_resources: -0.4, immigration: -0.4, civil_liberties: -0.1, foreign_defence: 0.1, reconciliation: -0.3, populism: -0.2 },
  NDP: { name: "NDP", color: "#F37021", logo: "./assets/party-logos/NDP.svg", economic_model: -0.7, social_values: -0.6, climate_resources: -0.6, immigration: -0.5, civil_liberties: -0.2, foreign_defence: -0.2, reconciliation: -0.6, populism: -0.1 },
  GPC: { name: "Green", color: "#3D9B35", logo: "./assets/party-logos/GPC.svg", economic_model: -0.5, social_values: -0.5, climate_resources: -0.8, immigration: -0.4, civil_liberties: -0.2, foreign_defence: -0.1, reconciliation: -0.6, populism: -0.2 },
  BQ: { name: "Bloc", color: "#33B2CC", logo: "./assets/party-logos/BQ.svg", economic_model: -0.1, social_values: -0.2, climate_resources: -0.2, immigration: -0.1, civil_liberties: 0, foreign_defence: 0, reconciliation: -0.3, populism: -0.1 },
  PPC: { name: "PPC", color: "#4B3D8F", logo: "./assets/party-logos/PPC.svg", economic_model: 0.8, social_values: 0.8, climate_resources: 0.9, immigration: 0.8, civil_liberties: 0.4, foreign_defence: 0.2, reconciliation: 0.4, populism: 0.8 }
};

export const provincialParties = {
  BC: {
    BCNDP: { name: "BC NDP", color: "#F37021", logo: "./assets/party-logos/BCNDP.svg", economic_model: -0.7, social_values: -0.5, climate_resources: -0.6, immigration: -0.4, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 },
    BCCONS: { name: "BC Conservative", color: "#1A4D9C", logo: "./assets/party-logos/BCCONS.svg", economic_model: 0.7, social_values: 0.6, climate_resources: 0.6, immigration: 0.3, civil_liberties: 0.3, foreign_defence: 0, reconciliation: 0.2, populism: 0.4 },
    BCGREEN: { name: "BC Green", color: "#3D9B35", logo: "./assets/party-logos/BCGREEN.svg", economic_model: -0.5, social_values: -0.5, climate_resources: -0.8, immigration: -0.3, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.2 },
    BCUNITED: { name: "BC United", color: "#0066CC", logo: "./assets/party-logos/BCUNITED.svg", economic_model: 0.3, social_values: 0.1, climate_resources: 0.2, immigration: -0.1, civil_liberties: 0, foreign_defence: 0, reconciliation: -0.1, populism: 0 }
  },
  AB: {
    UCP: { name: "United Conservative", color: "#1A4D9C", logo: "./assets/party-logos/UCP.svg", economic_model: 0.8, social_values: 0.6, climate_resources: 0.7, immigration: 0.3, civil_liberties: 0.3, foreign_defence: 0, reconciliation: 0.2, populism: 0.4 },
    ABNDP: { name: "Alberta NDP", color: "#F37021", logo: "./assets/party-logos/ABNDP.svg", economic_model: -0.6, social_values: -0.5, climate_resources: -0.5, immigration: -0.4, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 }
  },
  SK: {
    SKPARTY: { name: "Saskatchewan Party", color: "#00843D", logo: "./assets/party-logos/SKPARTY.svg", economic_model: 0.6, social_values: 0.4, climate_resources: 0.5, immigration: 0.2, civil_liberties: 0.2, foreign_defence: 0, reconciliation: 0.1, populism: 0.2 },
    SKNDP: { name: "Saskatchewan NDP", color: "#F37021", logo: "./assets/party-logos/SKNDP.svg", economic_model: -0.6, social_values: -0.5, climate_resources: -0.5, immigration: -0.3, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 }
  },
  MB: {
    MBPC: { name: "Manitoba PC", color: "#1A4D9C", logo: "./assets/party-logos/MBPC.svg", economic_model: 0.6, social_values: 0.4, climate_resources: 0.4, immigration: 0.1, civil_liberties: 0.2, foreign_defence: 0, reconciliation: 0.1, populism: 0.2 },
    MBNDP: { name: "Manitoba NDP", color: "#F37021", logo: "./assets/party-logos/MBNDP.svg", economic_model: -0.6, social_values: -0.5, climate_resources: -0.5, immigration: -0.4, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 },
    MBLIB: { name: "Manitoba Liberal", color: "#D71920", logo: "./assets/party-logos/MBLIB.svg", economic_model: -0.2, social_values: -0.3, climate_resources: -0.3, immigration: -0.3, civil_liberties: -0.1, foreign_defence: 0, reconciliation: -0.3, populism: -0.2 }
  },
  ON: {
    ONPC: { name: "Ontario PC", color: "#1A4D9C", logo: "./assets/party-logos/ONPC.svg", economic_model: 0.6, social_values: 0.3, climate_resources: 0.4, immigration: 0.1, civil_liberties: 0.2, foreign_defence: 0, reconciliation: 0.1, populism: 0.3 },
    ONLIB: { name: "Ontario Liberal", color: "#D71920", logo: "./assets/party-logos/ONLIB.svg", economic_model: -0.2, social_values: -0.4, climate_resources: -0.3, immigration: -0.3, civil_liberties: -0.1, foreign_defence: 0, reconciliation: -0.3, populism: -0.2 },
    ONNDP: { name: "Ontario NDP", color: "#F37021", logo: "./assets/party-logos/ONNDP.svg", economic_model: -0.7, social_values: -0.6, climate_resources: -0.6, immigration: -0.4, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 },
    ONGREEN: { name: "Ontario Green", color: "#3D9B35", logo: "./assets/party-logos/ONGREEN.svg", economic_model: -0.5, social_values: -0.5, climate_resources: -0.8, immigration: -0.3, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.2 }
  },
  QC: {
    CAQ: { name: "CAQ", color: "#00AADD", logo: "./assets/party-logos/CAQ.svg", economic_model: 0.3, social_values: 0.3, climate_resources: 0.1, immigration: 0.3, civil_liberties: 0.2, foreign_defence: 0, reconciliation: 0, populism: 0.3 },
    PLQ: { name: "PLQ", color: "#D71920", logo: "./assets/party-logos/PLQ.svg", economic_model: -0.1, social_values: -0.3, climate_resources: -0.2, immigration: -0.3, civil_liberties: -0.1, foreign_defence: 0, reconciliation: -0.2, populism: -0.2 },
    PQ: { name: "PQ", color: "#004B87", logo: "./assets/party-logos/PQ.svg", economic_model: -0.3, social_values: -0.1, climate_resources: -0.3, immigration: 0, civil_liberties: 0, foreign_defence: 0, reconciliation: -0.2, populism: 0.1 },
    QS: { name: "Quebec Solidaire", color: "#FF5607", logo: "./assets/party-logos/QS.svg", economic_model: -0.8, social_values: -0.7, climate_resources: -0.7, immigration: -0.5, civil_liberties: -0.3, foreign_defence: 0, reconciliation: -0.6, populism: -0.2 },
    PCQ: { name: "Conservative Party", color: "#1A4D9C", logo: "./assets/party-logos/PCQ.svg", economic_model: 0.7, social_values: 0.7, climate_resources: 0.6, immigration: 0.5, civil_liberties: 0.4, foreign_defence: 0, reconciliation: 0.2, populism: 0.6 }
  },
  NB: {
    NBPC: { name: "NB PC", color: "#1A4D9C", logo: "./assets/party-logos/NBPC.svg", economic_model: 0.5, social_values: 0.3, climate_resources: 0.3, immigration: 0.1, civil_liberties: 0.2, foreign_defence: 0, reconciliation: 0, populism: 0.2 },
    NBLIB: { name: "NB Liberal", color: "#D71920", logo: "./assets/party-logos/NBLIB.svg", economic_model: -0.2, social_values: -0.3, climate_resources: -0.3, immigration: -0.2, civil_liberties: -0.1, foreign_defence: 0, reconciliation: -0.2, populism: -0.1 },
    NBGREEN: { name: "NB Green", color: "#3D9B35", logo: "./assets/party-logos/NBGREEN.svg", economic_model: -0.4, social_values: -0.4, climate_resources: -0.7, immigration: -0.3, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.4, populism: -0.2 },
    NBNDP: { name: "NB NDP", color: "#F37021", logo: "./assets/party-logos/NBNDP.svg", economic_model: -0.6, social_values: -0.5, climate_resources: -0.6, immigration: -0.4, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 }
  },
  NS: {
    NSPC: { name: "NS PC", color: "#1A4D9C", logo: "./assets/party-logos/NSPC.svg", economic_model: 0.5, social_values: 0.3, climate_resources: 0.3, immigration: 0.1, civil_liberties: 0.2, foreign_defence: 0, reconciliation: 0, populism: 0.2 },
    NSLIB: { name: "NS Liberal", color: "#D71920", logo: "./assets/party-logos/NSLIB.svg", economic_model: -0.2, social_values: -0.3, climate_resources: -0.3, immigration: -0.2, civil_liberties: -0.1, foreign_defence: 0, reconciliation: -0.2, populism: -0.1 },
    NSNDP: { name: "NS NDP", color: "#F37021", logo: "./assets/party-logos/NSNDP.svg", economic_model: -0.6, social_values: -0.5, climate_resources: -0.5, immigration: -0.4, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 },
    NSGREEN: { name: "NS Green", color: "#3D9B35", logo: "./assets/party-logos/NSGREEN.svg", economic_model: -0.4, social_values: -0.4, climate_resources: -0.7, immigration: -0.3, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.4, populism: -0.2 }
  },
  PE: {
    PEPC: { name: "PEI PC", color: "#1A4D9C", logo: "./assets/party-logos/PEPC.svg", economic_model: 0.5, social_values: 0.3, climate_resources: 0.2, immigration: 0.1, civil_liberties: 0.2, foreign_defence: 0, reconciliation: 0, populism: 0.2 },
    PELIB: { name: "PEI Liberal", color: "#D71920", logo: "./assets/party-logos/PELIB.svg", economic_model: -0.2, social_values: -0.3, climate_resources: -0.3, immigration: -0.2, civil_liberties: -0.1, foreign_defence: 0, reconciliation: -0.2, populism: -0.1 },
    PEGREEN: { name: "PEI Green", color: "#3D9B35", logo: "./assets/party-logos/PEGREEN.svg", economic_model: -0.4, social_values: -0.4, climate_resources: -0.7, immigration: -0.3, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.4, populism: -0.2 },
    PENDP: { name: "PEI NDP", color: "#F37021", logo: "./assets/party-logos/PENDP.svg", economic_model: -0.6, social_values: -0.5, climate_resources: -0.5, immigration: -0.4, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 }
  },
  NL: {
    NLPC: { name: "NL PC", color: "#1A4D9C", logo: "./assets/party-logos/NLPC.svg", economic_model: 0.5, social_values: 0.3, climate_resources: 0.4, immigration: 0.1, civil_liberties: 0.2, foreign_defence: 0, reconciliation: 0, populism: 0.2 },
    NLLIB: { name: "NL Liberal", color: "#D71920", logo: "./assets/party-logos/NLLIB.svg", economic_model: -0.2, social_values: -0.3, climate_resources: -0.2, immigration: -0.2, civil_liberties: -0.1, foreign_defence: 0, reconciliation: -0.2, populism: -0.1 },
    NLNDP: { name: "NL NDP", color: "#F37021", logo: "./assets/party-logos/NLNDP.svg", economic_model: -0.6, social_values: -0.5, climate_resources: -0.5, immigration: -0.4, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 }
  },
  YT: {
    YTYUKON: { name: "Yukon Party", color: "#005CA9", logo: "./assets/party-logos/YTYUKON.svg", economic_model: 0.4, social_values: 0.2, climate_resources: 0.3, immigration: 0, civil_liberties: 0.1, foreign_defence: 0, reconciliation: 0, populism: 0.1 },
    YTLIB: { name: "Yukon Liberal", color: "#D71920", logo: "./assets/party-logos/YTLIB.svg", economic_model: -0.2, social_values: -0.3, climate_resources: -0.3, immigration: -0.2, civil_liberties: -0.1, foreign_defence: 0, reconciliation: -0.3, populism: -0.1 },
    YTNDP: { name: "Yukon NDP", color: "#F37021", logo: "./assets/party-logos/YTNDP.svg", economic_model: -0.6, social_values: -0.5, climate_resources: -0.5, immigration: -0.3, civil_liberties: -0.2, foreign_defence: 0, reconciliation: -0.5, populism: -0.1 }
  },
  NT: {
  },
  NU: {
  }
};
