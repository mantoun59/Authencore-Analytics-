import { useTranslation } from 'react-i18next';
import { CommunicationStylesResults, CommunicationDimension } from './useCommunicationStylesScoring';
import communicationTranslations from '../i18n/translations/communicationStyles.json';

export const useCommunicationStylesTranslation = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  
  // Fallback to English if current language not available
  const getTranslations = () => {
    return communicationTranslations[currentLang as keyof typeof communicationTranslations] || 
           communicationTranslations.en;
  };

  const t = getTranslations();

  const translateDimensionName = (dimension: string): string => {
    const dimensionKey = dimension as keyof typeof t.dimensions;
    return t.dimensions[dimensionKey]?.name || dimension;
  };

  const translateDimensionDescription = (dimension: string, level?: string): string => {
    const dimensionKey = dimension as keyof typeof t.dimensions;
    const dimTranslation = t.dimensions[dimensionKey];
    
    if (!dimTranslation) return '';
    
    if (level && dimTranslation.levels[level as keyof typeof dimTranslation.levels]) {
      return dimTranslation.levels[level as keyof typeof dimTranslation.levels];
    }
    
    return dimTranslation.description;
  };

  const translateProfileName = (profileType: string): string => {
    const profileKey = profileType as keyof typeof t.profiles;
    return t.profiles[profileKey]?.name || profileType;
  };

  const translateProfileDescription = (profileType: string): string => {
    const profileKey = profileType as keyof typeof t.profiles;
    return t.profiles[profileKey]?.description || '';
  };

  const translateProfileTrait = (profileType: string, trait: 'primary' | 'secondary' | 'strength' | 'challenge' | 'workStyle'): string => {
    const profileKey = profileType as keyof typeof t.profiles;
    const profile = t.profiles[profileKey];
    return profile?.traits[trait] || '';
  };

  const translateContextName = (context: string): string => {
    const contextKey = context as keyof typeof t.contexts;
    return t.contexts[contextKey] || context;
  };

  const translateUI = (key: string): string => {
    const uiKey = key as keyof typeof t.ui;
    return t.ui[uiKey] || key;
  };

  // Enhanced translation function for complete results object
  const translateResults = (results: CommunicationStylesResults): CommunicationStylesResults => {
    const translatedDimensions: Record<string, CommunicationDimension> = {};
    
    Object.entries(results.dimensions).forEach(([key, dimension]) => {
      translatedDimensions[key] = {
        ...dimension,
        description: translateDimensionDescription(key, dimension.level)
      };
    });

    return {
      ...results,
      dimensions: translatedDimensions as any,
      profile: {
        ...results.profile,
        primary: translateProfileTrait(results.profile.type, 'primary'),
        secondary: translateProfileTrait(results.profile.type, 'secondary'),
        strength: translateProfileTrait(results.profile.type, 'strength'),
        challenge: translateProfileTrait(results.profile.type, 'challenge'),
        workStyle: translateProfileTrait(results.profile.type, 'workStyle')
      }
    };
  };

  // Generate localized development recommendations
  const generateLocalizedRecommendations = (dimensionKey: string, level: string) => {
    const recommendations = {
      en: {
        assertiveness: {
          Low: [
            "Practice expressing your opinions in low-stakes situations",
            "Use 'I' statements to communicate your perspective",
            "Set small goals for speaking up in meetings",
            "Prepare key points before important conversations"
          ],
          Moderate: [
            "Continue building confidence in challenging situations",
            "Practice direct feedback delivery",
            "Work on maintaining assertiveness under pressure",
            "Seek opportunities to lead discussions"
          ]
        },
        expressiveness: {
          Low: [
            "Practice sharing personal examples in professional contexts",
            "Use more descriptive language to engage others",
            "Work on varying your tone and energy level",
            "Practice active listening and reflecting emotions"
          ],
          Moderate: [
            "Continue developing emotional intelligence",
            "Practice reading and responding to others' emotions",
            "Work on adapting expressiveness to different audiences",
            "Develop storytelling skills for greater impact"
          ]
        }
      },
      es: {
        assertiveness: {
          Low: [
            "Practica expresar tus opiniones en situaciones de bajo riesgo",
            "Usa declaraciones en primera persona para comunicar tu perspectiva",
            "Establece pequeñas metas para hablar en reuniones",
            "Prepara puntos clave antes de conversaciones importantes"
          ],
          Moderate: [
            "Continúa construyendo confianza en situaciones desafiantes",
            "Practica dar retroalimentación directa",
            "Trabaja en mantener la asertividad bajo presión",
            "Busca oportunidades para liderar discusiones"
          ]
        },
        expressiveness: {
          Low: [
            "Practica compartir ejemplos personales en contextos profesionales",
            "Usa un lenguaje más descriptivo para involucrar a otros",
            "Trabaja en variar tu tono y nivel de energía",
            "Practica la escucha activa y reflejar emociones"
          ],
          Moderate: [
            "Continúa desarrollando inteligencia emocional",
            "Practica leer y responder a las emociones de otros",
            "Trabaja en adaptar la expresividad a diferentes audiencias",
            "Desarrolla habilidades de narración para mayor impacto"
          ]
        }
      },
      fr: {
        assertiveness: {
          Low: [
            "Pratiquez l'expression de vos opinions dans des situations à faible enjeu",
            "Utilisez des déclarations 'je' pour communiquer votre perspective",
            "Fixez-vous de petits objectifs pour prendre la parole en réunion",
            "Préparez les points clés avant les conversations importantes"
          ],
          Moderate: [
            "Continuez à développer la confiance dans les situations difficiles",
            "Pratiquez la livraison de feedback direct",
            "Travaillez à maintenir l'assertivité sous pression",
            "Cherchez des opportunités de diriger des discussions"
          ]
        },
        expressiveness: {
          Low: [
            "Pratiquez le partage d'exemples personnels dans des contextes professionnels",
            "Utilisez un langage plus descriptif pour engager les autres",
            "Travaillez à varier votre ton et niveau d'énergie",
            "Pratiquez l'écoute active et refléter les émotions"
          ],
          Moderate: [
            "Continuez à développer l'intelligence émotionnelle",
            "Pratiquez la lecture et la réponse aux émotions des autres",
            "Travaillez à adapter l'expressivité à différents publics",
            "Développez les compétences de narration pour plus d'impact"
          ]
        }
      },
      de: {
        assertiveness: {
          Low: [
            "Üben Sie das Äußern Ihrer Meinungen in risikoarmen Situationen",
            "Verwenden Sie 'Ich'-Aussagen zur Kommunikation Ihrer Perspektive",
            "Setzen Sie sich kleine Ziele für das Sprechen in Besprechungen",
            "Bereiten Sie Schlüsselpunkte vor wichtigen Gesprächen vor"
          ],
          Moderate: [
            "Bauen Sie weiterhin Vertrauen in herausfordernden Situationen auf",
            "Üben Sie direkte Feedback-Übermittlung",
            "Arbeiten Sie daran, Durchsetzungsfähigkeit unter Druck zu bewahren",
            "Suchen Sie Gelegenheiten, Diskussionen zu leiten"
          ]
        },
        expressiveness: {
          Low: [
            "Üben Sie das Teilen persönlicher Beispiele in beruflichen Kontexten",
            "Verwenden Sie beschreibende Sprache, um andere zu involvieren",
            "Arbeiten Sie daran, Ihren Ton und Energielevel zu variieren",
            "Üben Sie aktives Zuhören und Emotionen zu reflektieren"
          ],
          Moderate: [
            "Entwickeln Sie weiterhin emotionale Intelligenz",
            "Üben Sie das Lesen und Reagieren auf die Emotionen anderer",
            "Arbeiten Sie daran, Ausdrucksfähigkeit an verschiedene Zielgruppen anzupassen",
            "Entwickeln Sie Erzählfähigkeiten für größere Wirkung"
          ]
        }
      }
    };

    const langRecs = recommendations[currentLang as keyof typeof recommendations] || recommendations.en;
    const dimRecs = langRecs[dimensionKey as keyof typeof langRecs];
    
    if (dimRecs && dimRecs[level as keyof typeof dimRecs]) {
      return dimRecs[level as keyof typeof dimRecs];
    }
    
    return recommendations.en[dimensionKey as keyof typeof recommendations.en]?.[level as keyof typeof recommendations.en.assertiveness] || [];
  };

  return {
    translateDimensionName,
    translateDimensionDescription,
    translateProfileName,
    translateProfileDescription,
    translateProfileTrait,
    translateContextName,
    translateUI,
    translateResults,
    generateLocalizedRecommendations,
    currentLanguage: currentLang,
    availableLanguages: Object.keys(communicationTranslations)
  };
};