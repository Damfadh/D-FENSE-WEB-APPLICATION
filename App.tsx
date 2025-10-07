import { useState } from "react";
import { DFenseLanding } from "./components/DFenseLanding";
import { UserInfoForm, UserInfo } from "./components/UserInfoForm";
import { MetabolicQuestionnaire } from "./components/MetabolicQuestionnaire";
import { RiskResults } from "./components/RiskResults";
import { ThreeDayProgram } from "./components/ThreeDayProgram";
import { 
  PageTransition, 
  SlideTransition, 
  ScaleTransition, 
  FlipTransition, 
  BounceTransition,
  RotateTransition,
  FadeTransition
} from "./components/PageTransition";

type AppState = 'landing' | 'userinfo' | 'questionnaire' | 'results' | 'program';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<{
    score: number;
    geneticScore: number;
    lifestyleScore: number;
    answers: Record<number, string>;
  } | null>(null);

  const handleStartAssessment = () => {
    setCurrentState('userinfo');
  };

  const handleSignIn = () => {
    // In web version, we directly start assessment
    handleStartAssessment();
  };

  const handleSignUp = () => {
    // In web version, we directly start assessment
    handleStartAssessment();
  };

  const handleUserInfoComplete = (info: UserInfo) => {
    setUserInfo(info);
    setCurrentState('questionnaire');
  };

  const handleCompleteAssessment = (lifestyleScore: number, answers: Record<number, string>) => {
    // Calculate genetic score from user's SNP profile
    let geneticScore = 0;
    if (userInfo) {
      const snpScores = {
        rs9939609: 16,  // FTO - Obesitas
        rs7903146: 12,  // TCF7L2 - Diabetes
        rs1801282: 10,  // PPARG - Metabolisme lemak
        rs662799: 8,    // APOA5 - Trigliserida
        rs5219: 7,      // KCNJ11 - Resistensi insulin
        rs2943641: 7    // IRS1 - Resistensi insulin
      };
      
      Object.entries(userInfo.geneticProfile).forEach(([snp, isPresent]) => {
        if (isPresent) {
          geneticScore += snpScores[snp as keyof typeof snpScores];
        }
      });
    }

    // Total score is a weighted combination: 60% genetic + 40% lifestyle
    // Genetic max: 60 points, Lifestyle max: 46 points (from validated questionnaire)
    // We normalize lifestyle to be out of 40 points for the final score
    const normalizedLifestyleScore = (lifestyleScore / 46) * 40;
    const totalScore = geneticScore + normalizedLifestyleScore;

    setAssessmentResults({ 
      score: Math.round(totalScore),
      geneticScore, 
      lifestyleScore,
      answers 
    });
    setCurrentState('results');
  };

  const handleRestartAssessment = () => {
    setAssessmentResults(null);
    setCurrentState('questionnaire');
  };

  const handleBackToLanding = () => {
    setCurrentState('landing');
  };

  const handleStartProgram = () => {
    setCurrentState('program');
  };

  const handleBackToResults = () => {
    setCurrentState('results');
  };

  // Get risk level based on score
  const getRiskLevel = (): 'low' | 'medium' | 'high' => {
    if (!assessmentResults) return 'low';
    if (assessmentResults.score <= 20) return 'low';
    if (assessmentResults.score <= 39) return 'medium';
    return 'high';
  };

  return (
    <div className="min-h-screen">
      {/* Landing Page */}
      {currentState === 'landing' && (
        <FadeTransition pageKey="landing">
          <DFenseLanding 
            onStartAssessment={handleStartAssessment}
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
          />
        </FadeTransition>
      )}

      {/* Assessment Flow */}
      {currentState === 'userinfo' && (
        <SlideTransition pageKey="userinfo" direction="left">
          <UserInfoForm
            onComplete={handleUserInfoComplete}
            onBack={handleBackToLanding}
          />
        </SlideTransition>
      )}
      
      {currentState === 'questionnaire' && (
        <ScaleTransition pageKey="questionnaire">
          <MetabolicQuestionnaire 
            onComplete={handleCompleteAssessment}
            onBack={handleBackToLanding}
            userInfo={userInfo}
          />
        </ScaleTransition>
      )}
      
      {currentState === 'results' && assessmentResults && userInfo && (
        <FlipTransition pageKey="results">
          <RiskResults 
            score={assessmentResults.score}
            geneticScore={assessmentResults.geneticScore}
            lifestyleScore={assessmentResults.lifestyleScore}
            answers={assessmentResults.answers}
            userInfo={userInfo}
            onRestart={handleRestartAssessment}
            onBack={handleBackToLanding}
            onStartProgram={handleStartProgram}
          />
        </FlipTransition>
      )}

      {currentState === 'program' && (
        <BounceTransition pageKey="program">
          <ThreeDayProgram
            riskLevel={getRiskLevel()}
            onBack={handleBackToResults}
          />
        </BounceTransition>
      )}
    </div>
  );
}