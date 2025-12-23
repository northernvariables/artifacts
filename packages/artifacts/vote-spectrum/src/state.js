export const initialState = {
  screen: 'welcome',
  province: '',
  responses: {},
  questionImportance: {},
  importance: {},
  knowledgeAnswers: {},
  pastVote2021: '',
  currentQuestionIndex: 0,
  milestoneFlags: {
    25: false,
    50: false,
    75: false
  },
  showMilestone: false,
  milestoneMessage: '',
  consentToShare: false,
  dataSubmitted: false
};

export const ACTIONS = {
  SET_SCREEN: 'SET_SCREEN',
  SET_PROVINCE: 'SET_PROVINCE',
  SET_PAST_VOTE: 'SET_PAST_VOTE',
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
  SET_RESPONSES: 'SET_RESPONSES',
  TOGGLE_IMPORTANCE: 'TOGGLE_IMPORTANCE',
  SET_IMPORTANCE: 'SET_IMPORTANCE',
  SET_KNOWLEDGE_ANSWER: 'SET_KNOWLEDGE_ANSWER',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SHOW_MILESTONE: 'SHOW_MILESTONE',
  HIDE_MILESTONE: 'HIDE_MILESTONE',
  MARK_MILESTONE: 'MARK_MILESTONE',
  SET_CONSENT: 'SET_CONSENT',
  SET_DATA_SUBMITTED: 'SET_DATA_SUBMITTED',
  RESET: 'RESET'
};

export const voteCompassReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SCREEN:
      return { ...state, screen: action.payload };
    case ACTIONS.SET_PROVINCE:
      return { ...state, province: action.payload };
    case ACTIONS.SET_PAST_VOTE:
      return { ...state, pastVote2021: action.payload };
    case ACTIONS.UPDATE_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.qid]: action.payload.value
        }
      };
    case ACTIONS.SET_RESPONSES:
      return { ...state, responses: action.payload };
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
    case ACTIONS.SET_CURRENT_QUESTION:
      return { ...state, currentQuestionIndex: action.payload };
    case ACTIONS.SHOW_MILESTONE:
      return {
        ...state,
        showMilestone: true,
        milestoneMessage: action.payload
      };
    case ACTIONS.HIDE_MILESTONE:
      return { ...state, showMilestone: false };
    case ACTIONS.MARK_MILESTONE:
      return {
        ...state,
        milestoneFlags: {
          ...state.milestoneFlags,
          [action.payload]: true
        }
      };
    case ACTIONS.SET_CONSENT:
      return { ...state, consentToShare: action.payload };
    case ACTIONS.SET_DATA_SUBMITTED:
      return { ...state, dataSubmitted: action.payload };
    case ACTIONS.RESET:
      return {
        ...initialState,
        screen: 'welcome'
      };
    default:
      return state;
  }
};
